import { Schema, model, models, type Model } from "mongoose";

export const enquiryStatuses = [
  "new",
  "contacted",
  "in_progress",
  "completed",
  "spam",
] as const;

export const enquiryServices = [
  "Corporate Events",
  "Product Launches",
  "Expos & Trade Fairs",
  "VIP Weddings & Private Events",
  "STEM & Education",
  "Other",
] as const;

export interface EnquiryRecord {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: (typeof enquiryServices)[number];
  eventDate?: Date;
  eventLocation?: string;
  message: string;
  status: (typeof enquiryStatuses)[number];
  source: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<EnquiryRecord>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    phone: { type: String, trim: true, maxlength: 40 },
    company: { type: String, trim: true, maxlength: 120 },
    service: { type: String, enum: enquiryServices },
    eventDate: { type: Date },
    eventLocation: { type: String, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: enquiryStatuses,
      default: "new",
      required: true,
    },
    source: { type: String, trim: true, maxlength: 80, default: "website" },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ deletedAt: 1 });

export type EnquiryStatus = (typeof enquiryStatuses)[number];
export type EnquiryService = (typeof enquiryServices)[number];
export const Enquiry: Model<EnquiryRecord> =
  (models.Enquiry as Model<EnquiryRecord> | undefined) ??
  model<EnquiryRecord>("Enquiry", enquirySchema);
