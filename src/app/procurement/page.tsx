"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, ClipboardList, CheckCircle, XCircle, Truck } from "lucide-react";

export default function ProcurementPage() {
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requisitions")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRequisitions(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    if (status.includes("pending")) return "var(--color-warning)";
    if (status.includes("approved")) return "var(--color-primary)";
    if (status.includes("disbursed")) return "var(--color-success)";
    if (status.includes("rejected")) return "var(--color-danger)";
    return "var(--color-text-muted)";
  };

  return (
    <DashboardLayout>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>Procurement & Requisitions</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Review material requests, approve budgets, and track store disbursements.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={20} /> Material Request
        </button>
      </header>

      <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-hover)", color: "var(--color-text-muted)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Project / Site</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Requested By</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Items</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Status</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>Loading...</td></tr>
            ) : requisitions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "4rem" }}>
                  <ClipboardList size={48} color="var(--color-border)" style={{ marginBottom: "1rem" }} />
                  <p style={{ color: "var(--color-text-muted)" }}>No material requisitions found.</p>
                </td>
              </tr>
            ) : (
              requisitions.map((req: any) => (
                <tr key={req._id} style={{ borderTop: "1px solid var(--color-border-light)" }}>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>{req.project?.name || "Unknown"}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>{req.requestedBy?.firstName} {req.requestedBy?.lastName}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                    {req.items.length} item(s) requested
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span className="status-pulse" style={{ 
                      color: getStatusColor(req.status),
                      backgroundColor: `${getStatusColor(req.status)}20`,
                      padding: "0.25rem 0.75rem",
                      borderRadius: "99px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase"
                    }}>
                      {req.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", display: "flex", gap: "0.5rem" }}>
                    {req.status === "pending_approval" && (
                      <>
                        <button style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)", border: "none", padding: "0.5rem", borderRadius: "4px", cursor: "pointer" }} title="Approve">
                          <CheckCircle size={18} />
                        </button>
                        <button style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", border: "none", padding: "0.5rem", borderRadius: "4px", cursor: "pointer" }} title="Reject">
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    {req.status === "approved" && (
                      <button style={{ background: "rgba(6, 182, 212, 0.1)", color: "var(--color-accent)", border: "none", padding: "0.5rem", borderRadius: "4px", cursor: "pointer" }} title="Disburse from Store">
                        <Truck size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
