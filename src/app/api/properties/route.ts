import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Property from "@/models/Property";
import { verifyToken } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Parse query params for filtering
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const propertyType = searchParams.get("propertyType");
    
    // Auth & Tenant Extraction
    const token = req.cookies.get("auth_token")?.value;
    const user = token ? await verifyToken(token) : null;
    
    let query: any = {};
    if (status) query.status = status;
    if (propertyType) query.propertyType = propertyType;
    
    if (user && user.role !== "system_admin") {
      if (!user.tenantId) return NextResponse.json({ error: "No tenant assigned" }, { status: 403 });
      query.tenantId = user.tenantId;
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: properties });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Optional: Protect route logic
    const token = req.cookies.get("auth_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();

    // Basic validation
    if (!data.title || !data.price || !data.address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Force tenant isolation on creation
    const user = await verifyToken(token);
    data.tenantId = user.tenantId;

    const property = await Property.create(data);

    return NextResponse.json({ success: true, data: property }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create property" }, { status: 500 });
  }
}
