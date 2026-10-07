"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Link as LinkIcon, FileText } from "lucide-react";

export default function FormsDashboardPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/forms")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setForms(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const copyLink = (formId: string) => {
    const url = `${window.location.origin}/f/${formId}`;
    navigator.clipboard.writeText(url);
    alert("Public Link Copied to Clipboard!");
  };

  return (
    <DashboardLayout>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>My Lead Forms</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Create dynamic forms for your marketing campaigns. Leads go directly to your CRM.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={20} /> Create Form
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
        {isLoading ? (
          <div style={{ color: "var(--color-text-muted)" }}>Loading your forms...</div>
        ) : forms.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: "1 / -1", padding: "4rem", textAlign: "center" }}>
            <FileText size={48} color="var(--color-border)" style={{ marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>You haven't created any forms yet</h3>
            <p style={{ color: "var(--color-text-muted)" }}>Build a custom form for your next Open House or Facebook Ad.</p>
          </div>
        ) : (
          forms.map((form: any) => (
            <div key={form._id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--color-text-main)" }}>{form.title}</h3>
                <span style={{ 
                  backgroundColor: form.isActive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
                  color: form.isActive ? "var(--color-success)" : "var(--color-danger)",
                  padding: "0.25rem 0.5rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase"
                }}>
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: 0 }}>
                {form.description || "No description provided."}
              </p>

              <div style={{ backgroundColor: "var(--color-surface)", padding: "1rem", borderRadius: "var(--radius-sm)", marginTop: "auto" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  Linked Properties
                </div>
                {form.linkedProperties.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: "1rem", color: "var(--color-primary)", fontSize: "0.875rem" }}>
                    {form.linkedProperties.map((p: any) => <li key={p._id}>{p.title}</li>)}
                  </ul>
                ) : (
                  <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>General Inquiry (No property linked)</span>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button onClick={() => copyLink(form._id)} style={{ flex: 1, padding: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", backgroundColor: "var(--color-surface-hover)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "white", cursor: "pointer", transition: "var(--transition-fast)" }}>
                  <LinkIcon size={16} /> Copy Public Link
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
