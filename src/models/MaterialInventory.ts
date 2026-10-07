import mongoose, { Schema, Document } from "mongoose";

export interface IMaterialInventory extends Document {
  itemName: string;
  skuCode: string;
  category: "cement" | "steel" | "wood" | "electrical" | "plumbing" | "finishing" | "tools" | "other";
  unitOfMeasurement: "bags" | "tons" | "pieces" | "meters" | "liters" | "boxes";
  
  // Array tracking how much of this item exists at various projects/warehouses
  stockLevels: {
    project: mongoose.Types.ObjectId;
    quantityAvailable: number;
    reorderLevel: number; // Alert when stock drops below this
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const MaterialInventorySchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
  itemName: { type: String, required: true },
  skuCode: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ["cement", "steel", "wood", "electrical", "plumbing", "finishing", "tools", "other"],
    required: true 
  },
  unitOfMeasurement: { type: String, required: true },
  
  stockLevels: [{
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    quantityAvailable: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 10 },
  }],
}, { timestamps: true });

export default mongoose.models.MaterialInventory || mongoose.model<IMaterialInventory>("MaterialInventory", MaterialInventorySchema);
