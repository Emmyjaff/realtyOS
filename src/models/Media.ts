import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
  url: string;
  publicId: string;
  format: string;
  size: number;
  uploadedBy?: string; // Will link to User later
  createdAt: Date;
}

const MediaSchema: Schema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  format: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedBy: { type: String }, // Placeholder for user ID
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
