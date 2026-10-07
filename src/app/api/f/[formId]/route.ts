import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Form from "@/models/Form";
import FormSubmission from "@/models/FormSubmission";
import Lead from "@/models/Lead";
import xss from "xss";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ formId: string }> }) {
  try {
    await connectToDatabase();
    const { formId } = await params;
    const form = await Form.findById(formId).populate("linkedProperties", "title price images");
    
    if (!form || !form.isActive) {
      return NextResponse.json({ error: "Form not found or inactive" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: form });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ formId: string }> }) {
  try {
    await connectToDatabase();
    const { formId } = await params;
    const form = await Form.findById(formId);
    
    if (!form || !form.isActive) {
      return NextResponse.json({ error: "Form not found or inactive" }, { status: 404 });
    }

    const rawData = await req.json();
    
    // 1. Sanitize all user responses against XSS attacks
    const sanitizedResponses = Object.keys(rawData).map(key => ({
      questionLabel: xss(key),
      answer: xss(rawData[key]),
    }));

    // 2. Extract core lead data (guessing based on common labels)
    let leadFirstName = "Unknown";
    let leadEmail = null;
    let leadPhone = "Unknown";
    
    sanitizedResponses.forEach(res => {
      const label = res.questionLabel.toLowerCase();
      if (label.includes("name") && leadFirstName === "Unknown") leadFirstName = res.answer;
      if (label.includes("email")) leadEmail = res.answer;
      if (label.includes("phone") || label.includes("number")) leadPhone = res.answer;
    });

    // 3. Generate a beautiful Notes string with all custom answers
    const notesString = sanitizedResponses.map(r => `**${r.questionLabel}:** ${r.answer}`).join("\n");

    // 4. INTELLIGENT DE-DUPLICATION ENGINE
    let finalLeadId;
    
    // Attempt to find existing lead by Phone or Email
    let existingLead = null;
    if (leadPhone !== "Unknown" || leadEmail) {
      const query: any = { $or: [] };
      if (leadPhone !== "Unknown") query.$or.push({ phone: leadPhone });
      if (leadEmail) query.$or.push({ email: leadEmail });
      
      if (query.$or.length > 0) {
        existingLead = await Lead.findOne(query);
      }
    }

    if (existingLead) {
      // Functional Duplicate: Lead exists. Update their profile instead of creating a new one.
      const timestamp = new Date().toLocaleString();
      const updateNotes = `\n\n--- [NEW INQUIRY: ${timestamp}] ---\nForm: ${form.title}\n${notesString}`;
      
      existingLead.notes = (existingLead.notes || "") + updateNotes;
      
      // We do NOT change the assignedAgent. First agent to capture keeps the client, maintaining company harmony.
      await existingLead.save();
      finalLeadId = existingLead._id;
    } else {
      // Brand New Lead: Create it
      const newLead = await Lead.create({
        tenantId: form.tenantId, // CRITICAL: Ensures lead goes to the right company
        firstName: leadFirstName,
        email: leadEmail,
        phone: leadPhone,
        status: "new",
        source: form.defaultLeadSource,
        assignedAgent: form.createdBy, 
        interestedProperty: form.linkedProperties.length > 0 ? form.linkedProperties[0] : undefined,
        notes: `Generated via Form: ${form.title}\n\n${notesString}`,
      });
      finalLeadId = newLead._id;
    }

    // 5. Store the raw submission for historical tracking
    await FormSubmission.create({
      formId: form._id,
      linkedLeadId: finalLeadId,
      responses: sanitizedResponses,
    });

    return NextResponse.json({ success: true, message: "Submitted securely" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 });
  }
}
