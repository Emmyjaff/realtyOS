"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, FileText, Calendar, MapPin } from "lucide-react";

export default function LeasesPage() {
  const [leases, setLeases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leases")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeases(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>Tenants & Leases</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Track active tenancies, renewals, and rent schedules.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={20} /> New Lease Agreement
        </button>
      </header>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
        {isLoading ? (
          <div style={{ color: "var(--color-text-muted)" }}>Loading leases...</div>
        ) : leases.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: "1 / -1", padding: "4rem", textAlign: "center" }}>
            <FileText size={48} color="var(--color-border)" style={{ marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No active leases</h3>
            <p style={{ color: "var(--color-text-muted)" }}>Onboard a tenant by drafting a new lease agreement.</p>
          </div>
        ) : (
          leases.map((lease: any) => (
            <div key={lease._id} className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "1.25rem", backgroundColor: "var(--color-surface-hover)", borderBottom: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Tenant</div>
                  <strong style={{ fontSize: "1.125rem" }}>{lease.tenantName}</strong>
                </div>
                <div style={{ 
                  backgroundColor: lease.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                  color: lease.status === 'active' ? 'var(--color-success)' : 'var(--color-warning)',
                  padding: "0.25rem 0.75rem",
                  borderRadius: "99px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase"
                }}>
                  {lease.status}
                </div>
              </div>
              
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                    <MapPin size={16} /> {lease.property?.title || "Property Reference Lost"}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", backgroundColor: "var(--color-surface)", padding: "1rem", borderRadius: "var(--radius-sm)" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Rent</div>
                    <strong style={{ fontSize: "1.125rem", fontFamily: "var(--font-heading)" }}>
                      {lease.currency === "NGN" ? "₦" : "$"}{lease.rentAmount.toLocaleString()}
                    </strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>/ {lease.paymentFrequency}</div>
                  </div>
                  <div>
                     <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Duration</div>
                     <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                       <Calendar size={14} color="var(--color-primary)" />
                       {new Date(lease.startDate).toLocaleDateString()}
                     </div>
                     <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", marginTop: "0.25rem", color: "var(--color-text-muted)" }}>
                       To: {new Date(lease.endDate).toLocaleDateString()}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
