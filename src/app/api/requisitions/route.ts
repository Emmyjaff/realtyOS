import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Requisition from "@/models/Requisition";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const requisitions = await Requisition.find()
      .populate("project", "name")
      .populate("requestedBy", "firstName lastName")
      .populate("approvedBy", "firstName lastName")
      .populate("disbursedBy", "firstName lastName")
      .populate("items.material", "itemName unitOfMeasurement")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: requisitions });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch requisitions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.project || !data.requestedBy || !data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const requisition = await Requisition.create(data);

    return NextResponse.json({ success: true, data: requisition }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create requisition" }, { status: 500 });
  }
}
