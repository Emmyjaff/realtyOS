import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Lead from "@/models/Lead";
import { verifyToken } from "@/lib/auth";
import type { NextRequest } from "next/server";

const maskEmail = (email?: string) => {
  if (!email) return "";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.substring(0, 2)}***@${domain.substring(0, 2)}***.com`;
};

const maskPhone = (phone?: string) => {
  if (!phone) return "";
  return phone.substring(0, 4) + "****" + phone.substring(phone.length - 3);
};

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Auth Check
    const token = req.cookies.get("auth_token")?.value;
    const user = token ? await verifyToken(token) : null;
    const isAgent = user?.role === "agent";
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100"); // Cap at 100 per request
    const skip = (page - 1) * limit;
    
    let query: any = {};
    if (status) query.status = status;
    
    // STRICT DATA ISOLATION (MULTITENANCY)
    if (user.role !== "system_admin") {
      if (!user.tenantId) return NextResponse.json({ error: "No tenant assigned" }, { status: 403 });
      query.tenantId = user.tenantId;
    }

    // Use lean() for massive performance boost when reading data, and apply pagination
    const leads = await Lead.find(query)
      .populate("interestedProperty", "title price")
      .populate("assignedAgent", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // lean() strips heavy Mongoose document wrappers for pure JSON speed

    // Zero-Trust Data Masking
    const processedLeads = leads.map((lead: any) => {
      if (isAgent) {
        lead.email = maskEmail(lead.email);
        lead.phone = maskPhone(lead.phone);
      }
      return lead;
    });

    return NextResponse.json({ success: true, data: processedLeads });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.firstName || !data.lastName || !data.phone) {
      return NextResponse.json({ error: "Missing required fields (First name, Last name, Phone)" }, { status: 400 });
    }

    const lead = await Lead.create(data);

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create lead" }, { status: 500 });
  }
}
