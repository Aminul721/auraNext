import type { Request, Response } from "express";
import { Enquiry } from "../models/Enquiry.js";
import { logger } from "../utils/logger.js";
import { sendEnquiryNotification } from "../services/email.service.js";
import type { CreateEnquiryInput } from "../validators/enquiry.validator.js";

export async function createEnquiry(
  _request: Request,
  response: Response,
): Promise<void> {
  const input = response.locals.validatedBody as CreateEnquiryInput;
  const enquiry = await Enquiry.create({
    ...input,
    source: "website",
  });

  try {
    const notification = await sendEnquiryNotification(input);
    if (notification === "accepted") {
      logger.info({ enquiryId: enquiry.id }, "Enquiry notification accepted");
    } else if (notification === "not_configured") {
      logger.info({ enquiryId: enquiry.id }, "Enquiry notification not configured");
    } else {
      logger.warn({ enquiryId: enquiry.id }, "Enquiry notification was not accepted");
    }
  } catch (error) {
    logger.error(
      {
        errorName:
          typeof error === "object" && error !== null && "name" in error
            ? String(error.name)
            : "UnknownError",
        enquiryId: enquiry.id,
      },
      "Enquiry notification failed after enquiry was saved",
    );
  }

  response.status(201).json({
    success: true,
    message: "Your enquiry has been received.",
    enquiry: {
      id: enquiry.id,
      status: enquiry.status,
      createdAt: enquiry.createdAt,
    },
  });
}
