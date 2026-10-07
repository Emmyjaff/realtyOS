"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, MoreHorizontal, Phone, Mail, X, LayoutGrid, List } from "lucide-react";

const STAGES = [
  { id: "new", label: "New Leads", color: "var(--color-primary)" },
  { id: "contacted", label: "Contacted", color: "var(--color-warning)" },
  { id: "viewing_scheduled", label: "Viewing", color: "var(--color-accent)" },
  { id: "negotiating", label: "Negotiating", color: "var(--color-danger)" },
  { id: "closed_won", label: "Closed Won", color: "var(--color-success)" },
];

export default function CRMPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  
  // VoIP & Email Modal State
  const [activeCall, setActiveCall] = useState<any | null>(null);
  const [activeEmail, setActiveEmail] = useState<any | null>(null);

  const fetchLeads = () => {
    setIsLoading(true);
    fetch("/api/leads")
      .then(res => res.json())
      .then(data => {
        if (data.success) setLeads(data.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      // Optimistic UI Update
      setLeads(leads.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
      
      await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      alert("Failed to update status.");
      fetchLeads(); // Revert on failure
    }
  };

  const getLeadsByStage = (stageId: string) => leads.filter(l => l.status === stageId);

  return (
    <DashboardLayout>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>CRM Pipeline</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Zero-Trust CRM: All calls and emails must be made through this portal.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {/* View Toggle */}
          <div style={{ display: "flex", backgroundColor: "var(--color-surface)", padding: "0.25rem", borderRadius: "var(--radius-sm)" }}>
            <button 
              onClick={() => setViewMode("kanban")} 
              style={{ padding: "0.5rem", borderRadius: "4px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                backgroundColor: viewMode === "kanban" ? "var(--color-surface-hover)" : "transparent",
                color: viewMode === "kanban" ? "white" : "var(--color-text-muted)"
              }}
            >
              <LayoutGrid size={16} /> Kanban
            </button>
            <button 
              onClick={() => setViewMode("table")} 
              style={{ padding: "0.5rem", borderRadius: "4px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                backgroundColor: viewMode === "table" ? "var(--color-surface-hover)" : "transparent",
                color: viewMode === "table" ? "white" : "var(--color-text-muted)"
              }}
            >
              <List size={16} /> Table
            </button>
          </div>
          <button className="btn-primary">
            <Plus size={20} /> Add Lead
          </button>
        </div>
      </header>

      {/* KANBAN VIEW */}
      {viewMode === "kanban" && (
        <div style={{ display: "flex", gap: "1.5rem", overflowX: "auto", paddingBottom: "1rem", minHeight: "calc(100vh - 200px)", userSelect: "none" }}>
          {STAGES.map(stage => {
            const stageLeads = getLeadsByStage(stage.id);
            return (
              <div key={stage.id} style={{ flex: "0 0 320px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-md)", borderTop: `4px solid ${stage.color}` }}>
                  <span style={{ fontWeight: 600, color: "var(--color-text-main)" }}>{stage.label}</span>
                  <span style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "0.15rem 0.5rem", borderRadius: "99px", fontSize: "0.875rem" }}>{stageLeads.length}</span>
                </div>

                {isLoading ? (
                  <div style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "1rem" }}>Loading...</div>
                ) : stageLeads.map(lead => (
                  <div key={lead._id} className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "var(--transition-fast)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h4 style={{ margin: 0, fontSize: "1.125rem", color: "var(--color-text-main)" }}>{lead.firstName} {lead.lastName}</h4>
                      <MoreHorizontal size={18} color="var(--color-text-muted)" style={{ cursor: "pointer" }} />
                    </div>
                    
                    {lead.interestedProperty && (
                      <div style={{ fontSize: "0.875rem", color: "var(--color-primary)", backgroundColor: "var(--color-primary-glow)", padding: "0.25rem 0.5rem", borderRadius: "4px", display: "inline-block" }}>
                        Interested in: {lead.interestedProperty.title}
                      </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Phone size={14} /> {lead.phone}</span>
                        <button onClick={() => setActiveCall(lead)} style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)", border: "none", padding: "0.25rem 0.5rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>CALL</button>
                      </div>
                      {lead.email && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Mail size={14} /> {lead.email}</span>
                          <button onClick={() => setActiveEmail(lead)} style={{ background: "rgba(6, 182, 212, 0.1)", color: "var(--color-accent)", border: "none", padding: "0.25rem 0.5rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>EMAIL</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <div className="glass-panel" style={{ padding: 0, overflow: "hidden", userSelect: "none" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-surface-hover)", color: "var(--color-text-muted)", fontSize: "0.875rem", textTransform: "uppercase" }}>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Client Name</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Contact (Masked)</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Interested In</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Stage</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>Loading...</td></tr>
              ) : leads.map(lead => (
                <tr key={lead._id} style={{ borderTop: "1px solid var(--color-border-light)" }}>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>{lead.firstName} {lead.lastName}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}><Phone size={14} /> {lead.phone}</div>
                    {lead.email && <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Mail size={14} /> {lead.email}</div>}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--color-primary)", fontSize: "0.875rem" }}>
                    {lead.interestedProperty ? lead.interestedProperty.title : "—"}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <select 
                      value={lead.status} 
                      onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                      style={{ padding: "0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)", color: "white", outline: "none", cursor: "pointer", fontSize: "0.75rem", textTransform: "uppercase" }}
                    >
                      {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => setActiveCall(lead)} style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)", border: "none", padding: "0.5rem", borderRadius: "4px", cursor: "pointer" }} title="VoIP Call"><Phone size={16} /></button>
                    {lead.email && <button onClick={() => setActiveEmail(lead)} style={{ background: "rgba(6, 182, 212, 0.1)", color: "var(--color-accent)", border: "none", padding: "0.5rem", borderRadius: "4px", cursor: "pointer" }} title="Send Email"><Mail size={16} /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VoIP Dialer Modal */}
      {activeCall && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(4px)" }}>
          <div className="glass-panel" style={{ width: "400px", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", position: "relative" }}>
            <button onClick={() => setActiveCall(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "white", cursor: "pointer" }}><X size={20} /></button>
            <div className="status-pulse" style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Phone size={32} color="white" />
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Calling {activeCall.firstName}</h3>
              <p style={{ color: "var(--color-text-muted)" }}>Connecting securely via WebRTC...</p>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", marginTop: "0.25rem" }}>This call is being recorded for QA.</p>
            </div>
            <button className="btn-primary" style={{ background: "var(--color-danger)", width: "100%" }} onClick={() => setActiveCall(null)}>End Call</button>
          </div>
        </div>
      )}

      {/* Email Composer Modal */}
      {activeEmail && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(4px)" }}>
          <div className="glass-panel" style={{ width: "500px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", position: "relative" }}>
            <button onClick={() => setActiveEmail(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "white", cursor: "pointer" }}><X size={20} /></button>
            <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Compose Email to {activeEmail.firstName}</h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>Sending securely via proxy. Replies will route to CRM.</p>
            
            <input type="text" placeholder="Subject" style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg)", color: "white", outline: "none" }} />
            <textarea rows={6} placeholder="Type your message here..." style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg)", color: "white", outline: "none", resize: "vertical" }} />
            
            <button className="btn-primary" onClick={() => setActiveEmail(null)}>Send Secure Email</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
