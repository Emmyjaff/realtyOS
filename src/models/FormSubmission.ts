import mongoose, { Schema, Document } from "mongoose";

export interface IFormSubmission extends Document {
  formId: mongoose.Types.ObjectId;
  linkedLeadId?: mongoose.Types.ObjectId; // The CRM Lead generated from this
  
  // Dynamic Key-Value answers
  responses: {
    questionLabel: string;
    answer: string;
  }[];
  
  submittedAt: Date;
}

const FormSubmissionSchema: Schema = new Schema({
  formId: { type: Schema.Types.ObjectId, ref: "Form", required: true },
  linkedLeadId: { type: Schema.Types.ObjectId, ref: "Lead" },
  
  responses: [{
    questionLabel: { type: String, required: true },
    answer: { type: String, required: true },
  }],
  
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.FormSubmission || mongoose.model<IFormSubmission>("FormSubmission", FormSubmissionSchema);
