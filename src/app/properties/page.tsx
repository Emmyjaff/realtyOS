"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Search, Filter, MapPin } from "lucide-react";
import Link from "next/link";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch properties from the API we just created
    fetch("/api/properties")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProperties(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>Properties</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Manage your real estate inventory.
          </p>
        </div>
        <Link href="/properties/new" className="btn-primary" style={{ textDecoration: "none" }}>
          <Plus size={20} /> New Listing
        </Link>
      </header>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={20} color="var(--color-text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search properties by title, location, or ID..."
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
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface)",
          color: "white"
        }}>
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-text-muted)" }}>
          Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div className="glass-panel" style={{ padding: "4rem", textAlign: "center" }}>
          <HomeIcon size={48} color="var(--color-border)" style={{ marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No properties found</h3>
          <p style={{ color: "var(--color-text-muted)" }}>Get started by adding your first listing to the inventory.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {properties.map((prop: any) => (
            <div key={prop._id} className="glass-panel" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "200px", backgroundColor: "var(--color-surface-hover)", position: "relative" }}>
                {prop.images && prop.images[0] ? (
                  <img src={prop.images[0]} alt={prop.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-border)" }}>
                    No Image Available
                  </div>
                )}
                <div style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "99px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(4px)",
                  textTransform: "capitalize",
                  color: prop.status === "available" ? "var(--color-success)" : "var(--color-warning)"
                }}>
                  {prop.status.replace("_", " ")}
                </div>
              </div>
              
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{prop.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                  <MapPin size={16} /> {prop.city}, {prop.state}
                </div>
                
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                    {prop.currency === "NGN" ? "₦" : "$"}{prop.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border-light)" }}>
                    {prop.propertyType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

// Temporary icon for empty state
const HomeIcon = ({ size, color, style }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
