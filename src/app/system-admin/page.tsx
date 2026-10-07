"use client";

import React, { useEffect, useState } from "react";
import { Server, Users, Activity, Building, ShieldCheck } from "lucide-react";

export default function SystemAdminPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/system-admin")
      .then(res => res.json())
      .then(result => {
        if (result.success) setData(result.data);
        else setError(result.error);
      })
      .catch(() => setError("Failed to connect to System API"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>Loading Master Control...</div>;
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--color-danger)" }}>
          <ShieldCheck size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
          <h3>Access Denied</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", color: "white", padding: "2rem", fontFamily: "var(--font-body)" }}>
      
      {/* Top Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", paddingBottom: "1rem", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
           <div style={{ width: "40px", height: "40px", backgroundColor: "var(--color-primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <Server size={24} color="white" />
           </div>
           <h1 style={{ fontSize: "1.5rem", margin: 0, fontFamily: "var(--font-heading)" }}>RealtyOS Master Control</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-success)" }}>
           <Activity size={16} /> Server Status: {data.metrics.serverHealth}
        </div>
      </nav>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-muted)" }}>
            <span>Total Tenant Companies</span>
            <Building size={20} />
          </div>
          <strong style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)" }}>{data.metrics.totalTenants}</strong>
          <span style={{ fontSize: "0.875rem", color: "var(--color-success)" }}>{data.metrics.activeTenants} Active Subscriptions</span>
        </div>

        <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-muted)" }}>
            <span>Global Users (Agents)</span>
            <Users size={20} />
          </div>
          <strong style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)" }}>{data.metrics.totalUsers}</strong>
          <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Across all companies</span>
        </div>
        
        <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "rgba(79, 70, 229, 0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-primary)" }}>
            <span>Compliance Mode</span>
            <ShieldCheck size={20} />
          </div>
          <strong style={{ fontSize: "1.5rem", fontFamily: "var(--font-heading)", color: "var(--color-primary)" }}>GDPR / NDPR Active</strong>
          <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>PII (Phone/Email) is masked from this view.</span>
        </div>
      </div>

      {/* Tenants Table */}
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Active Companies</h2>
      <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface-hover)", color: "var(--color-text-muted)", fontSize: "0.875rem", textTransform: "uppercase" }}>
              <th style={{ padding: "1rem 1.5rem" }}>Company Name</th>
              <th style={{ padding: "1rem 1.5rem" }}>Subdomain</th>
              <th style={{ padding: "1rem 1.5rem" }}>Plan</th>
              <th style={{ padding: "1rem 1.5rem" }}>Status</th>
              <th style={{ padding: "1rem 1.5rem" }}>Registered</th>
            </tr>
          </thead>
          <tbody>
            {data.tenants.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>No tenants registered yet.</td></tr>
            ) : (
              data.tenants.map((tenant: any) => (
                <tr key={tenant._id} style={{ borderTop: "1px solid var(--color-border-light)" }}>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>{tenant.companyName}</td>
                  <td style={{ padding: "1rem 1.5rem", fontFamily: "var(--font-mono)", color: "var(--color-primary)" }}>{tenant.subdomain}.realtyos.com</td>
                  <td style={{ padding: "1rem 1.5rem", textTransform: "capitalize" }}>{tenant.subscriptionPlan}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ 
                      color: tenant.subscriptionStatus === "active" ? "var(--color-success)" : "var(--color-warning)",
                      backgroundColor: tenant.subscriptionStatus === "active" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                      padding: "0.25rem 0.5rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase"
                    }}>
                      {tenant.subscriptionStatus}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
