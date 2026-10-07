import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "new" | "contacted" | "viewing_scheduled" | "negotiating" | "closed_won" | "closed_lost";
  budget?: number;
  currency: string;
  interestedProperty?: mongoose.Types.ObjectId;
  assignedAgent?: mongoose.Types.ObjectId;
  source: "website" | "referral" | "walk_in" | "social_media" | "other";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true }, // STRICT ISOLATION
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, index: true },
  phone: { type: String, required: true, index: true },
  status: { 
    type: String, 
    enum: ["new", "contacted", "viewing_scheduled", "negotiating", "closed_won", "closed_lost"], 
    default: "new",
    index: true
  },
  budget: { type: Number },
  currency: { type: String, default: "NGN" },
  interestedProperty: { type: Schema.Types.ObjectId, ref: "Property" },
  assignedAgent: { type: Schema.Types.ObjectId, ref: "User" },
  source: { 
    type: String, 
    enum: ["website", "referral", "walk_in", "social_media", "other"], 
    default: "other" 
  },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
