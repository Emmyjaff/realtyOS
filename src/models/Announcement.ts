import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  targetDepartment?: "sales" | "construction" | "finance" | "hr" | "legal" | "management" | "all";
  priority: "standard" | "important" | "urgent";
  createdBy: mongoose.Types.ObjectId; // Usually HR or Management
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Can store rich text / HTML
  targetDepartment: { 
    type: String, 
    enum: ["sales", "construction", "finance", "hr", "legal", "management", "all"],
    default: "all"
  },
  priority: { 
    type: String, 
    enum: ["standard", "important", "urgent"], 
    default: "standard" 
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
