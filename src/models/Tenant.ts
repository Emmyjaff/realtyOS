import mongoose, { Schema, Document } from "mongoose";

export interface ITenant extends Document {
  companyName: string;
  subdomain: string; // e.g., 'elitehomes' -> elitehomes.realtyos.com
  subscriptionPlan: "basic" | "professional" | "enterprise";
  subscriptionStatus: "active" | "past_due" | "canceled" | "trialing";
  
  // Billing & Compliance
  adminEmail: string;
  maxUsers: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema: Schema = new Schema({
  companyName: { type: String, required: true },
  subdomain: { type: String, required: true, unique: true, lowercase: true },
  subscriptionPlan: { 
    type: String, 
    enum: ["basic", "professional", "enterprise"], 
    default: "professional" 
  },
  subscriptionStatus: {
    type: String,
    enum: ["active", "past_due", "canceled", "trialing"],
    default: "trialing"
  },
  
  adminEmail: { type: String, required: true },
  maxUsers: { type: Number, default: 10 },
  
  // Dynamic Niche Control (Feature Flags)
  activeModules: [{
    type: String,
    enum: ["sales_crm", "lettings_management", "construction_erp", "hr_directory", "financials"],
    default: ["sales_crm"]
  }]
}, { timestamps: true });

export default mongoose.models.Tenant || mongoose.model<ITenant>("Tenant", TenantSchema);
