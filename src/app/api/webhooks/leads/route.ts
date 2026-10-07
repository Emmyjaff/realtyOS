import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Lead from "@/models/Lead";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the external system using a static API Key (Not a user JWT)
    const apiKey = req.headers.get("x-api-key");
    const validKey = process.env.INGESTION_API_KEY;

    if (!apiKey || apiKey !== validKey) {
      return NextResponse.json({ error: "Unauthorized Ingestion Key" }, { status: 401 });
    }

    // 2. Parse the payload (e.g., from a Website Form or Facebook Webhook)
    const data = await req.json();

    if (!data.firstName || !data.phone) {
      return NextResponse.json({ error: "Missing minimum required fields (First name, Phone)" }, { status: 400 });
    }

    await connectToDatabase();

    // INTELLIGENT DE-DUPLICATION ENGINE
    let existingLead = null;
    const query: any = { $or: [{ phone: data.phone }] };
    if (data.email) query.$or.push({ email: data.email });

    existingLead = await Lead.findOne(query);

    if (existingLead) {
      // Append context to existing lead
      const timestamp = new Date().toLocaleString();
      const updateNotes = `\n\n--- [NEW INQUIRY VIA WEBHOOK: ${timestamp}] ---\nSource: ${data.source || 'website'}\n${data.notes || ''}`;
      existingLead.notes = (existingLead.notes || "") + updateNotes;
      
      // If a budget was provided and is higher, we could update it, but appending is safer
      await existingLead.save();
      
      return NextResponse.json({ success: true, message: "Duplicate lead updated securely", id: existingLead._id }, { status: 200 });
    }

    // 3. Create the Lead automatically in the 'new' column
    const lead = await Lead.create({
      firstName: data.firstName,
      lastName: data.lastName || "Unknown",
      email: data.email || null,
      phone: data.phone,
      status: "new",
      source: data.source || "website",
      budget: data.budget || null,
      notes: data.notes || "Auto-ingested from external source.",
    });

    return NextResponse.json({ success: true, message: "Lead captured successfully", id: lead._id }, { status: 201 });
  } catch (error: any) {
    console.error("Webhook Ingestion Error:", error);
    return NextResponse.json({ error: "Failed to ingest lead" }, { status: 500 });
  }
}
