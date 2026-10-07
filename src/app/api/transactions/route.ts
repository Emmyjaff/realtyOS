import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Transaction from "@/models/Transaction";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const transactions = await Transaction.find()
      .populate("relatedProperty", "title")
      .populate("relatedLead", "firstName lastName")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.reference || !data.amount || !data.paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transaction = await Transaction.create(data);

    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log transaction" }, { status: 500 });
  }
}
