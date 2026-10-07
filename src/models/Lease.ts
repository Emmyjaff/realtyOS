import mongoose, { Schema, Document } from "mongoose";

export interface ILease extends Document {
  property: mongoose.Types.ObjectId;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  
  startDate: Date;
  endDate: Date;
  
  rentAmount: number;
  currency: string;
  paymentFrequency: "monthly" | "quarterly" | "biannual" | "yearly";
  
  status: "active" | "expired" | "terminated" | "pending";
  
  // Specific to Nigeria/Africa
  cautionFeeAmount?: number;
  serviceChargeAmount?: number;
  legalFeeAmount?: number;
  agencyFeeAmount?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const LeaseSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
  property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  tenantName: { type: String, required: true },
  tenantEmail: { type: String, required: true },
  tenantPhone: { type: String, required: true },
  
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  rentAmount: { type: Number, required: true },
  currency: { type: String, default: "NGN" },
  paymentFrequency: { 
    type: String, 
    enum: ["monthly", "quarterly", "biannual", "yearly"], 
    default: "yearly" 
  },
  
  status: { 
    type: String, 
    enum: ["active", "expired", "terminated", "pending"], 
    default: "active" 
  },
  
  cautionFeeAmount: { type: Number },
  serviceChargeAmount: { type: Number },
  legalFeeAmount: { type: Number },
  agencyFeeAmount: { type: Number },

}, { timestamps: true });

export default mongoose.models.Lease || mongoose.model<ILease>("Lease", LeaseSchema);
