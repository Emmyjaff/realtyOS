import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Tenant from "@/models/Tenant";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.cookies.get("auth_token")?.value;
    const user = token ? await verifyToken(token) : null;
    
    // Strict compliance check: ONLY system_admins (You and your core team) can access this
    if (!user || user.role !== "system_admin") {
      return NextResponse.json({ error: "Forbidden. System Admins only." }, { status: 403 });
    }

    // Fetch Global SaaS Metrics
    const totalTenants = await Tenant.countDocuments();
    const activeTenants = await Tenant.countDocuments({ subscriptionStatus: "active" });
    const totalUsers = await User.countDocuments({ role: { $ne: "system_admin" } });
    
    // Fetch recent tenants for the dashboard
    const recentTenants = await Tenant.find().sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({ 
      success: true, 
      data: {
        metrics: {
          totalTenants,
          activeTenants,
          totalUsers,
          serverHealth: "99.9% Uptime",
        },
        tenants: recentTenants
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch platform metrics" }, { status: 500 });
  }
}
