import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  tenantId?: mongoose.Types.ObjectId; // Only optional for system_admins
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: "system_admin" | "superadmin" | "branch_manager" | "agent" | "accountant" | "project_manager" | "engineer" | "storekeeper" | "hr";
  department: "sales" | "construction" | "finance" | "hr" | "legal" | "management";
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", index: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["system_admin", "superadmin", "branch_manager", "agent", "accountant", "project_manager", "engineer", "storekeeper", "hr"], 
    default: "agent" 
  },
  department: {
    type: String,
    enum: ["sales", "construction", "finance", "hr", "legal", "management"],
    default: "sales"
  },
  isArchived: { type: Boolean, default: false }, // Soft-delete to prevent orphaned data
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
