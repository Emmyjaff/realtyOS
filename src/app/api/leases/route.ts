import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Lease from "@/models/Lease";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const leases = await Lease.find()
      .populate("property", "title address city")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: leases });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch leases" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.property || !data.tenantName || !data.rentAmount || !data.startDate || !data.endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lease = await Lease.create(data);

    return NextResponse.json({ success: true, data: lease }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create lease" }, { status: 500 });
  }
}
