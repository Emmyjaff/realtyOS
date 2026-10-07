import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  location: string;
  status: "planning" | "in_progress" | "on_hold" | "completed";
  projectManager: mongoose.Types.ObjectId;
  startDate: Date;
  estimatedEndDate: Date;
  budget: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["planning", "in_progress", "on_hold", "completed"], 
    default: "planning" 
  },
  projectManager: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  estimatedEndDate: { type: Date },
  budget: { type: Number, required: true },
  currency: { type: String, default: "NGN" },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
