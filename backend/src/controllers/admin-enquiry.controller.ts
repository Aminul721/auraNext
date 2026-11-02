import { isObjectIdOrHexString } from "mongoose";
import type { Request, Response } from "express";
import {
  Enquiry,
} from "../models/Enquiry.js";
import { ApiError } from "../utils/ApiError.js";
import type {
  EnquiryListQuery,
  UpdateEnquiryInput,
} from "../types/validated.js";

const safeEnquiryFields =
  "_id name email phone company service eventDate eventLocation message status source createdAt updatedAt";

function serializeEnquiry<T extends { _id: unknown }>(record: T) {
  const { _id, ...fields } = record;
  return { ...fields, id: String(_id) };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listEnquiries(
  _request: Request,
  response: Response,
): Promise<void> {
  const { page, limit, search, status } =
    response.locals.validatedQuery as EnquiryListQuery;
  const safeSearch = search ? new RegExp(escapeRegex(search), "i") : undefined;
  const filter = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(safeSearch
      ? {
          $or: [
            { name: safeSearch },
            { email: safeSearch },
            { company: safeSearch },
          ],
        }
      : {}),
  };

  const [total, enquiries] = await Promise.all([
    Enquiry.countDocuments(filter),
    Enquiry.find(filter)
      .select(safeEnquiryFields)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);
  response.json({
    success: true,
    enquiries: enquiries.map(serializeEnquiry),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function getEnquiry(
  request: Request,
  response: Response,
): Promise<void> {
  if (!isObjectIdOrHexString(request.params.id)) {
    throw new ApiError(400, "Invalid enquiry ID.");
  }
  const enquiry = await Enquiry.findOne({
    _id: request.params.id,
    deletedAt: null,
  })
    .select(safeEnquiryFields)
    .lean();
  if (!enquiry) throw new ApiError(404, "Enquiry not found.");
  response.json({
    success: true,
    enquiry: serializeEnquiry(enquiry),
  });
}

export async function updateEnquiry(
  request: Request,
  response: Response,
): Promise<void> {
  if (!isObjectIdOrHexString(request.params.id)) {
    throw new ApiError(400, "Invalid enquiry ID.");
  }
  const { status } = response.locals.validatedBody as UpdateEnquiryInput;
  const enquiry = await Enquiry.findOneAndUpdate(
    { _id: request.params.id, deletedAt: null },
    { $set: { status } },
    { new: true, runValidators: true },
  )
    .select(safeEnquiryFields)
    .lean();
  if (!enquiry) throw new ApiError(404, "Enquiry not found.");
  response.json({
    success: true,
    message: "Enquiry updated.",
    enquiry: serializeEnquiry(enquiry),
  });
}

export async function deleteEnquiry(
  request: Request,
  response: Response,
): Promise<void> {
  if (!isObjectIdOrHexString(request.params.id)) {
    throw new ApiError(400, "Invalid enquiry ID.");
  }
  const enquiry = await Enquiry.findOneAndUpdate(
    { _id: request.params.id, deletedAt: null },
    { $set: { deletedAt: new Date() } },
  );
  if (!enquiry) throw new ApiError(404, "Enquiry not found.");
  response.json({ success: true, message: "Enquiry deleted." });
}

export async function getDashboard(
  _request: Request,
  response: Response,
): Promise<void> {
  const [total, newCount, contacted, inProgress, completed, recentEnquiries] =
    await Promise.all([
      Enquiry.countDocuments({ deletedAt: null }),
      Enquiry.countDocuments({ deletedAt: null, status: "new" }),
      Enquiry.countDocuments({ deletedAt: null, status: "contacted" }),
      Enquiry.countDocuments({ deletedAt: null, status: "in_progress" }),
      Enquiry.countDocuments({ deletedAt: null, status: "completed" }),
      Enquiry.find({ deletedAt: null })
        .select("_id name email service status createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

  response.json({
    success: true,
    counts: { total, new: newCount, contacted, in_progress: inProgress, completed },
    recentEnquiries: recentEnquiries.map(serializeEnquiry),
  });
}
