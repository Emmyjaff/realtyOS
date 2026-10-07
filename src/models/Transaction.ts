import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  reference: string;
  type: "rent" | "sale" | "commission" | "maintenance";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: "bank_transfer" | "paystack" | "flutterwave" | "cash";
  
  relatedProperty?: mongoose.Types.ObjectId;
  relatedLead?: mongoose.Types.ObjectId;
  processedByAgent?: mongoose.Types.ObjectId;
  
  paymentDate?: Date;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
  reference: { type: String, required: true, unique: true },
  type: { type: String, enum: ["rent", "sale", "commission", "maintenance"], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "NGN" },
  status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "pending" },
  paymentMethod: { type: String, enum: ["bank_transfer", "paystack", "flutterwave", "cash"], required: true },
  
  relatedProperty: { type: Schema.Types.ObjectId, ref: "Property" },
  relatedLead: { type: Schema.Types.ObjectId, ref: "Lead" },
  relatedLease: { type: Schema.Types.ObjectId, ref: "Lease" }, // Tie rent payments to a specific lease
  processedByAgent: { type: Schema.Types.ObjectId, ref: "User" },
  
  paymentDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
