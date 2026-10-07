import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Requisition from "@/models/Requisition";
import MaterialInventory from "@/models/MaterialInventory";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ reqId: string }> }) {
  try {
    await connectToDatabase();
    
    // We would normally verify the user is a storekeeper here
    const { reqId } = await params;
    const requisition = await Requisition.findById(reqId);
    
    if (!requisition) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (requisition.status === "fully_disbursed") {
      return NextResponse.json({ error: "Already disbursed" }, { status: 400 });
    }
    if (requisition.status !== "approved") {
      return NextResponse.json({ error: "Requisition is not approved" }, { status: 400 });
    }

    const projectId = requisition.project;

    // Loop through requested items and deduct from the specific project's inventory stock
    for (const item of requisition.items) {
      const inventory = await MaterialInventory.findById(item.material);
      if (inventory) {
        // Find the stock level for this specific project
        const stockIndex = inventory.stockLevels.findIndex((s: any) => s.project.toString() === projectId.toString());
        
        if (stockIndex > -1) {
          inventory.stockLevels[stockIndex].quantityAvailable -= item.quantityRequested;
          // Prevent negative stock natively
          if (inventory.stockLevels[stockIndex].quantityAvailable < 0) {
             inventory.stockLevels[stockIndex].quantityAvailable = 0;
          }
        } else {
          // If project didn't have this stock logged, log it as negative/zero (edge case handling)
          inventory.stockLevels.push({
            project: projectId,
            quantityAvailable: -item.quantityRequested, 
            reorderLevel: 10
          });
        }
        await inventory.save();
      }
    }

    requisition.status = "fully_disbursed";
    requisition.disbursementDate = new Date();
    await requisition.save();

    return NextResponse.json({ success: true, data: requisition });
  } catch (error: any) {
    return NextResponse.json({ error: "Disbursement failed" }, { status: 500 });
  }
}
