import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Task";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const tasks = await Task.find()
      .populate("createdBy", "firstName lastName")
      .populate("assignedToUser", "firstName lastName")
      .populate("relatedProject", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.title || !data.description || !data.createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const task = await Task.create(data);

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create task" }, { status: 500 });
  }
}
