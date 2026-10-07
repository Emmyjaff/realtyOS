import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "in_review" | "done";
  
  // Assignment mapping
  assignedToDepartment?: "sales" | "construction" | "finance" | "hr" | "legal" | "management";
  assignedToUser?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  
  relatedProject?: mongoose.Types.ObjectId;
  relatedProperty?: mongoose.Types.ObjectId;
  
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high", "urgent"], 
    default: "medium" 
  },
  status: { 
    type: String, 
    enum: ["todo", "in_progress", "in_review", "done"], 
    default: "todo" 
  },
  
  assignedToDepartment: { 
    type: String, 
    enum: ["sales", "construction", "finance", "hr", "legal", "management"] 
  },
  assignedToUser: { type: Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  
  relatedProject: { type: Schema.Types.ObjectId, ref: "Project" },
  relatedProperty: { type: Schema.Types.ObjectId, ref: "Property" },
  
  dueDate: { type: Date },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
