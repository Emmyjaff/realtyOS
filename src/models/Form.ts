import mongoose, { Schema, Document } from "mongoose";

export interface IForm extends Document {
  title: string;
  description?: string;
  isActive: boolean;
  
  // Dynamic fields you want to collect
  fields: {
    label: string;
    fieldType: "text" | "email" | "phone" | "number" | "dropdown" | "textarea";
    options?: string[]; // If dropdown, the choices available
    isRequired: boolean;
  }[];
  
  // Routing: Where does this lead go once submitted?
  defaultLeadSource: string; // e.g., "event_marketing", "landing_page_a"
  linkedProperties: mongoose.Types.ObjectId[]; // Properties this form is marketing
  
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FormSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  
  fields: [{
    label: { type: String, required: true },
    fieldType: { 
      type: String, 
      enum: ["text", "email", "phone", "number", "dropdown", "textarea"], 
      required: true 
    },
    options: [{ type: String }],
    isRequired: { type: Boolean, default: false },
  }],
  
  defaultLeadSource: { type: String, default: "form_submission" },
  linkedProperties: [{ type: Schema.Types.ObjectId, ref: "Property" }],
  
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.models.Form || mongoose.model<IForm>("Form", FormSchema);
