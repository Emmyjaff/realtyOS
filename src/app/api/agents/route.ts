import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // In a real scenario, we'd calculate performance metrics via aggregation
    const agents = await User.find({ role: { $in: ["agent", "branch_manager"] } })
      .select("-passwordHash") // Never return the hash
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: agents });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}
