import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/models/Project";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const projects = await Project.find()
      .populate("projectManager", "firstName lastName email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.name || !data.location || !data.projectManager || !data.startDate || !data.budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = await Project.create(data);

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}
