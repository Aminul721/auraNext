import { Schema, model, models, type Model } from "mongoose";

interface AdminRecord {
  email: string;
  passwordHash: string;
  role: "admin";
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<AdminRecord>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin", required: true },
    isActive: { type: Boolean, default: true, required: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

export const Admin: Model<AdminRecord> =
  (models.Admin as Model<AdminRecord> | undefined) ??
  model<AdminRecord>("Admin", adminSchema);
