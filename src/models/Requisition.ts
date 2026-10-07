import mongoose, { Schema, Document } from "mongoose";

export interface IRequisition extends Document {
  project: mongoose.Types.ObjectId;
  requestedBy: mongoose.Types.ObjectId; // Engineer
  
  items: {
    material: mongoose.Types.ObjectId;
    quantityRequested: number;
    purpose: string;
  }[];
  
  // Approval Flow
  status: "pending_approval" | "approved" | "rejected" | "partially_disbursed" | "fully_disbursed";
  approvedBy?: mongoose.Types.ObjectId; // Project Manager
  approvalDate?: Date;
  rejectionReason?: string;
  
  // Disbursement Flow
  disbursedBy?: mongoose.Types.ObjectId; // Storekeeper
  disbursementDate?: Date;
  
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RequisitionSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  
  items: [{
    material: { type: Schema.Types.ObjectId, ref: "MaterialInventory", required: true },
    quantityRequested: { type: Number, required: true },
    purpose: { type: String, required: true },
  }],
  
  status: { 
    type: String, 
    enum: ["pending_approval", "approved", "rejected", "partially_disbursed", "fully_disbursed"], 
    default: "pending_approval" 
  },
  
  approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  approvalDate: { type: Date },
  rejectionReason: { type: String },
  
  disbursedBy: { type: Schema.Types.ObjectId, ref: "User" },
  disbursementDate: { type: Date },
  
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Requisition || mongoose.model<IRequisition>("Requisition", RequisitionSchema);
