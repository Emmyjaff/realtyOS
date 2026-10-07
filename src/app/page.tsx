"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import MediaUploader from "@/components/MediaUploader";

export default function Home() {
  return (
    <DashboardLayout>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>Overview</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Welcome back. Here is what's happening today.
          </p>
        </div>
        <button className="btn-primary">
          + New Listing
        </button>
      </header>

      {/* Quick Stats Grid */}
      <section className="dashboard-grid">
        <div className="glass-panel stat-card">
          <h3>Active Listings</h3>
          <div className="value">1,248</div>
          <p style={{ color: "var(--color-success)", fontSize: "0.875rem", marginTop: "auto" }}>
            ↑ 12% from last month
          </p>
        </div>
        
        <div className="glass-panel stat-card">
          <h3>Revenue (NGN)</h3>
          <div className="value">4.2B</div>
          <p style={{ color: "var(--color-success)", fontSize: "0.875rem", marginTop: "auto" }}>
            ↑ 8.5% from last month
          </p>
        </div>

        <div className="glass-panel stat-card">
          <h3>Pending Leads</h3>
          <div className="value">342</div>
          <p style={{ color: "var(--color-warning)", fontSize: "0.875rem", marginTop: "auto" }}>
            Requires attention
          </p>
        </div>
      </section>

      {/* Media Uploader Demonstration */}
      <section style={{ marginTop: "3rem" }}>
        <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Media Gallery (Upload)</h3>
        <MediaUploader />
      </section>

      {/* Recent Activity Section */}
      <section style={{ marginTop: "3rem" }}>
        <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Recent Activity</h3>
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "1rem" }}>
            <div>
              <strong style={{ display: "block" }}>Payment Received</strong>
              <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>₦15,000,000 via Paystack for Lekki Villa</span>
            </div>
            <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>2 mins ago</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "1rem" }}>
            <div>
              <strong style={{ display: "block" }}>New Property Listed</strong>
              <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>4 Bed Duplex in Ikoyi - Media upload pending</span>
            </div>
            <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>1 hr ago</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong style={{ display: "block" }}>Lead Conversion</strong>
              <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>Agent 'Tobi' closed deal #8921</span>
            </div>
            <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>3 hrs ago</span>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
