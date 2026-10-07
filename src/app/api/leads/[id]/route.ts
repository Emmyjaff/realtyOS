import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Lead from "@/models/Lead";
import { verifyToken } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    // Auth & Multitenancy Check
    const token = req.cookies.get("auth_token")?.value;
    const user = token ? await verifyToken(token) : null;
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rawData = await req.json();
    
    // Find the lead first to verify ownership
    const lead = await Lead.findById(params.id);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    // Enforce Tenant Boundary
    if (user.role !== "system_admin" && lead.tenantId.toString() !== user.tenantId?.toString()) {
      return NextResponse.json({ error: "Forbidden: Cross-tenant modification attempt." }, { status: 403 });
    }

    // Agent Boundary (Optional but good practice: agents can only update their own leads)
    if (user.role === "agent" && lead.assignedAgent?.toString() !== user.userId) {
       return NextResponse.json({ error: "Forbidden: You do not own this lead." }, { status: 403 });
    }

    // Only allow updating specific fields to prevent malicious overwrites (like tenantId)
    if (rawData.status) lead.status = rawData.status;
    if (rawData.budget) lead.budget = rawData.budget;
    if (rawData.notes) lead.notes = rawData.notes;

    await lead.save();

    return NextResponse.json({ success: true, data: lead });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
