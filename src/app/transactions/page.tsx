"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Download, Search, FileText } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/transactions")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTransactions(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return "var(--color-success)";
      case 'pending': return "var(--color-warning)";
      case 'failed': return "var(--color-danger)";
      default: return "var(--color-text-muted)";
    }
  };

  return (
    <DashboardLayout>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>Financials & Transactions</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Monitor payments, rent collection, and agent commissions.
          </p>
        </div>
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
          backgroundColor: "transparent",
          color: "white",
          cursor: "pointer"
        }}>
          <Download size={18} /> Export CSV
        </button>
      </header>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={20} color="var(--color-text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search by reference ID, client name, or property..."
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 3rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "white",
              outline: "none",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-hover)", color: "var(--color-text-muted)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Reference</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Type</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Property / Lead</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Amount</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Method</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Status</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>Loading...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "4rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "var(--color-text-muted)" }}>
                    <FileText size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                    <p>No transactions found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx: any) => (
                <tr key={tx._id} style={{ borderTop: "1px solid var(--color-border-light)", transition: "var(--transition-fast)" }}>
                  <td style={{ padding: "1rem 1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
                    {tx.reference}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textTransform: "capitalize" }}>
                    {tx.type}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    {tx.relatedProperty ? tx.relatedProperty.title : (tx.relatedLead ? `${tx.relatedLead.firstName} ${tx.relatedLead.lastName}` : "N/A")}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 600, fontFamily: "var(--font-heading)" }}>
                    {tx.currency === "NGN" ? "₦" : "$"}{tx.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ 
                      backgroundColor: "var(--color-surface)", 
                      padding: "0.25rem 0.5rem", 
                      borderRadius: "4px", 
                      fontSize: "0.75rem",
                      border: "1px solid var(--color-border-light)"
                    }}>
                      {tx.paymentMethod.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ 
                      color: getStatusColor(tx.status),
                      backgroundColor: `${getStatusColor(tx.status)}20`,
                      padding: "0.25rem 0.75rem",
                      borderRadius: "99px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase"
                    }}>
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                    {new Date(tx.createdAt).toLocaleDateString()}
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
