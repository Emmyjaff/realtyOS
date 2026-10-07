"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, HardHat, Calendar, MapPin } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProjects(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>Construction Projects</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Manage active development sites and budgets.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={20} /> New Project
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
        {isLoading ? (
          <div style={{ color: "var(--color-text-muted)" }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: "1 / -1", padding: "4rem", textAlign: "center" }}>
            <HardHat size={48} color="var(--color-border)" style={{ marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No active projects</h3>
            <p style={{ color: "var(--color-text-muted)" }}>Start a new property development to track it here.</p>
          </div>
        ) : (
          projects.map((project: any) => (
            <div key={project._id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", margin: 0 }}>{project.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    <MapPin size={14} /> {project.location}
                  </div>
                </div>
                <span style={{ 
                  backgroundColor: "rgba(79, 70, 229, 0.1)", 
                  color: "var(--color-primary)",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "99px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase"
                }}>
                  {project.status.replace("_", " ")}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", display: "flex", justifyContent: "space-between" }}>
                  <span>Project Manager:</span>
                  <span style={{ color: "var(--color-text-main)" }}>
                    {project.projectManager ? `${project.projectManager.firstName} ${project.projectManager.lastName}` : "Unassigned"}
                  </span>
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", display: "flex", justifyContent: "space-between" }}>
                  <span>Budget:</span>
                  <span style={{ color: "var(--color-text-main)", fontWeight: 600 }}>
                    {project.currency === "NGN" ? "₦" : "$"}{project.budget.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.875rem", marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--color-border-light)" }}>
                <Calendar size={14} />
                Started: {new Date(project.startDate).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
