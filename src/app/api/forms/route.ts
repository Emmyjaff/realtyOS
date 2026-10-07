import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Form from "@/models/Form";
import { verifyToken } from "@/lib/auth";
import xss from "xss";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.cookies.get("auth_token")?.value;
    const user = token ? await verifyToken(token) : null;
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let query: any = {};
    // If the user is an agent, they only see forms they created.
    if (user.role === "agent") {
      query.createdBy = user.userId;
    }

    const forms = await Form.find(query)
      .populate("linkedProperties", "title")
      .populate("createdBy", "firstName lastName")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: forms });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.cookies.get("auth_token")?.value;
    const user = token ? await verifyToken(token) : null;
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rawData = await req.json();

    // Heavy XSS Sanitization for form structure
    const sanitizedTitle = xss(rawData.title);
    const sanitizedDescription = xss(rawData.description || "");
    
    const sanitizedFields = rawData.fields.map((f: any) => ({
      label: xss(f.label),
      fieldType: f.fieldType, // enum validated by mongoose
      options: f.options ? f.options.map((o: string) => xss(o)) : [],
      isRequired: Boolean(f.isRequired),
    }));

    const form = await Form.create({
      tenantId: user.tenantId, // STRICT ISOLATION
      title: sanitizedTitle,
      description: sanitizedDescription,
      fields: sanitizedFields,
      defaultLeadSource: xss(rawData.defaultLeadSource || "custom_form"),
      linkedProperties: rawData.linkedProperties || [],
      createdBy: user.userId,
    });

    return NextResponse.json({ success: true, data: form }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create form" }, { status: 500 });
  }
}
