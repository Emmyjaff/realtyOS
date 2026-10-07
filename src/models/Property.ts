import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  propertyType: "residential" | "commercial" | "land";
  status: "available" | "sold" | "rented" | "off_market";
  price: number;
  currency: string;
  
  // Location
  address: string;
  city: string;
  state: string;
  country: string;
  estateName?: string;
  
  // Details
  bedrooms?: number;
  bathrooms?: number;
  sizeSqm?: number;
  
  // Specific to Nigerian/African Market
  titleDocument: "C_of_O" | "Deed_of_Assignment" | "Gazette" | "Excision" | "Survey_Plan" | "None";
  isServiced: boolean;
  
  // Media (Linked to Media Model or just store URLs here)
  images: string[];
  youtubeVideoUrl?: string; // As requested, only YT links for video
  
  // CRM Link
  assignedAgent?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  propertyType: { type: String, enum: ["residential", "commercial", "land"], required: true },
  status: { type: String, enum: ["available", "sold", "rented", "off_market"], default: "available" },
  price: { type: Number, required: true },
  currency: { type: String, default: "NGN" },
  
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, default: "Nigeria" },
  estateName: { type: String },
  
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  sizeSqm: { type: Number },
  
  titleDocument: { 
    type: String, 
    enum: ["C_of_O", "Deed_of_Assignment", "Gazette", "Excision", "Survey_Plan", "None"], 
    default: "None" 
  },
  isServiced: { type: Boolean, default: false },
  
  images: [{ type: String }],
  youtubeVideoUrl: { type: String },
  
  assignedAgent: { type: String },
  
}, { timestamps: true });

export default mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema);
