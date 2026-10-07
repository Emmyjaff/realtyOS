"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, Mail, UserPlus, Shield } from "lucide-react";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAgents(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>Agents & HR</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Manage staff, roles, and branch managers.
          </p>
        </div>
        <button className="btn-primary">
          <UserPlus size={20} /> Invite Staff
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {isLoading ? (
          <div style={{ color: "var(--color-text-muted)" }}>Loading staff...</div>
        ) : agents.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center" }}>
            <Users size={48} color="var(--color-border)" style={{ marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No staff found</h3>
            <p style={{ color: "var(--color-text-muted)" }}>Invite agents to the platform to get started.</p>
          </div>
        ) : (
          agents.map((agent: any) => (
            <div key={agent._id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "50%", 
                  backgroundColor: "var(--color-surface-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "var(--color-primary)"
                }}>
                  {agent.firstName.charAt(0)}{agent.lastName.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.125rem", margin: 0 }}>{agent.firstName} {agent.lastName}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                    <Shield size={12} />
                    <span style={{ textTransform: "capitalize" }}>{agent.role.replace("_", " ")}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                <Mail size={16} />
                {agent.email}
              </div>

              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Active Deals</span>
                  <strong style={{ fontSize: "1.25rem", fontFamily: "var(--font-heading)" }}>—</strong>
                </div>
                <button style={{ backgroundColor: "transparent", color: "var(--color-primary)", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}>
                  View Profile
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
