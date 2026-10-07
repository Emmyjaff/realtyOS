"use client";

import React, { useState } from "react";
import { Search, BookOpen, ShieldCheck, Database, GitMerge, HardHat, LayoutTemplate, Lock, Zap } from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    { id: "overview", label: "System Overview", icon: BookOpen },
    { id: "multitenancy", label: "Multitenancy & SaaS", icon: Database },
    { id: "security", label: "Zero-Trust Security", icon: ShieldCheck },
    { id: "procurement", label: "Procurement Flow", icon: HardHat },
    { id: "forms", label: "Dynamic Forms", icon: LayoutTemplate },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--color-bg)", color: "white", fontFamily: "var(--font-body)" }}>
      
      {/* Docs Sidebar */}
      <div style={{ width: "280px", backgroundColor: "var(--color-surface)", borderRight: "1px solid var(--color-border)", padding: "2rem 1rem", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <h2 style={{ fontSize: "1.5rem", margin: "0 0 2rem 0", background: "linear-gradient(45deg, #10B981, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          RealtyOS Docs
        </h2>
        
        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <Search size={16} color="var(--color-text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search docs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg)", color: "white", outline: "none" }}
          />
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {sections.map(sec => (
            <button 
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", textAlign: "left",
                backgroundColor: activeSection === sec.id ? "var(--color-surface-hover)" : "transparent",
                color: activeSection === sec.id ? "white" : "var(--color-text-muted)",
                transition: "var(--transition-fast)"
              }}
            >
              <sec.icon size={18} color={activeSection === sec.id ? "var(--color-primary)" : "currentColor"} />
              {sec.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Docs Content Area */}
      <div style={{ flex: 1, padding: "4rem", overflowY: "auto" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          
          {/* OVERVIEW SECTION */}
          {activeSection === "overview" && (
            <div className="fade-in">
              <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>RealtyOS Architecture</h1>
              <p style={{ color: "var(--color-text-muted)", fontSize: "1.25rem", lineHeight: 1.6, marginBottom: "3rem" }}>
                RealtyOS is a Next.js-powered, B2B SaaS Enterprise Resource Planning (ERP) system designed exclusively for the Real Estate sector. It merges CRM, Financials, Lettings, and Construction Procurement into a single, strictly-isolated multitenant core.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "4rem" }}>
                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                  <Zap size={24} color="var(--color-accent)" style={{ marginBottom: "1rem" }} />
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>High Performance</h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: 0 }}>Connection pooling and Mongoose .lean() enable sub-50ms API responses.</p>
                </div>
                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                  <ShieldCheck size={24} color="var(--color-success)" style={{ marginBottom: "1rem" }} />
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>Zero-Trust</h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: 0 }}>API-level data masking prevents PII theft by internal agents.</p>
                </div>
                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                  <Database size={24} color="var(--color-primary)" style={{ marginBottom: "1rem" }} />
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>B2B SaaS Ready</h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: 0 }}>True multitenancy isolates rival real estate companies automatically.</p>
                </div>
              </div>
            </div>
          )}

          {/* MULTITENANCY SECTION */}
          {activeSection === "multitenancy" && (
            <div className="fade-in">
              <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Multitenancy & Data Isolation</h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: "1.125rem", marginBottom: "3rem" }}>
                RealtyOS operates on a strict Tenant Partition model. Every database query automatically appends the `tenantId` extracted from the user's JWT.
              </p>

              <div className="glass-panel" style={{ padding: "3rem", marginBottom: "3rem", backgroundColor: "var(--color-surface-hover)" }}>
                <h4 style={{ textAlign: "center", marginBottom: "2rem", color: "white" }}>Database Request Flow</h4>
                
                {/* CSS Flow Diagram */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                  
                  <div style={{ zIndex: 2, backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)", padding: "1rem", borderRadius: "8px", textAlign: "center", width: "140px" }}>
                    <Users size={24} color="var(--color-primary)" style={{ margin: "0 auto 0.5rem auto" }} />
                    <span style={{ fontSize: "0.875rem" }}>Agent Tobi<br/><small>(Elite Homes)</small></span>
                  </div>

                  <div style={{ height: "2px", backgroundColor: "var(--color-primary)", flex: 1, position: "relative" }}>
                    <div style={{ position: "absolute", top: "-20px", left: "50%", transform: "translateX(-50%)", fontSize: "0.75rem", color: "var(--color-primary)" }}>JWT (tenantId)</div>
                  </div>

                  <div style={{ zIndex: 2, backgroundColor: "var(--color-bg)", border: "1px solid var(--color-primary)", boxShadow: "0 0 15px rgba(16,185,129,0.2)", padding: "1rem", borderRadius: "8px", textAlign: "center", width: "160px" }}>
                    <Lock size={24} color="var(--color-success)" style={{ margin: "0 auto 0.5rem auto" }} />
                    <span style={{ fontSize: "0.875rem" }}>API Middleware<br/><small>Injects query.tenantId</small></span>
                  </div>

                  <div style={{ height: "2px", backgroundColor: "var(--color-primary)", flex: 1 }}></div>

                  <div style={{ zIndex: 2, backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)", padding: "1rem", borderRadius: "8px", textAlign: "center", width: "140px" }}>
                    <Database size={24} color="var(--color-accent)" style={{ margin: "0 auto 0.5rem auto" }} />
                    <span style={{ fontSize: "0.875rem" }}>MongoDB<br/><small>Elite Homes Data Only</small></span>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* PROCUREMENT FLOW SECTION */}
          {activeSection === "procurement" && (
            <div className="fade-in">
              <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Construction Procurement</h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: "1.125rem", marginBottom: "3rem" }}>
                The ERP module handles complex material logistics for property developers, preventing ghost inventory and unauthorized spending.
              </p>

              {/* Steps Diagram */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="glass-panel" style={{ display: "flex", alignItems: "center", gap: "2rem", padding: "2rem" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)", fontSize: "1.5rem", fontWeight: "bold" }}>1</div>
                  <div>
                    <h3 style={{ margin: "0 0 0.25rem 0" }}>Engineer Request</h3>
                    <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "0.875rem" }}>Site engineer creates a Requisition for 500 bags of cement.</p>
                  </div>
                </div>
                
                <div style={{ width: "2px", height: "30px", backgroundColor: "var(--color-border)", marginLeft: "50px" }}></div>

                <div className="glass-panel" style={{ display: "flex", alignItems: "center", gap: "2rem", padding: "2rem", borderColor: "var(--color-warning)" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-warning)", fontSize: "1.5rem", fontWeight: "bold" }}>2</div>
                  <div>
                    <h3 style={{ margin: "0 0 0.25rem 0" }}>Project Manager Approval</h3>
                    <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "0.875rem" }}>PM reviews the budget and approves the requisition. Status becomes 'approved'.</p>
                  </div>
                </div>

                <div style={{ width: "2px", height: "30px", backgroundColor: "var(--color-border)", marginLeft: "50px" }}></div>

                <div className="glass-panel" style={{ display: "flex", alignItems: "center", gap: "2rem", padding: "2rem", borderColor: "var(--color-success)" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-success)", fontSize: "1.5rem", fontWeight: "bold" }}>3</div>
                  <div>
                    <h3 style={{ margin: "0 0 0.25rem 0" }}>Storekeeper Disbursement</h3>
                    <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "0.875rem" }}>Materials are released. System mathematically deducts 500 bags from the specific Project's `MaterialInventory`.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* DYNAMIC FORMS SECTION */}
          {activeSection === "forms" && (
            <div className="fade-in">
              <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Intelligent Lead Generation</h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: "1.125rem", marginBottom: "3rem" }}>
                RealtyOS replaces Typeform. Agents create custom forms that feed directly into the CRM with automated deduplication.
              </p>
              
              <div className="glass-panel" style={{ padding: "2rem" }}>
                <h3 style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem", marginBottom: "1rem" }}>De-duplication Engine Flow</h3>
                
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <li style={{ display: "flex", gap: "1rem" }}>
                    <GitMerge color="var(--color-primary)" />
                    <div>
                      <strong>1. Intercept Submission</strong>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>Form POSTs data. Backend extracts email and phone.</p>
                    </div>
                  </li>
                  <li style={{ display: "flex", gap: "1rem" }}>
                    <Search color="var(--color-warning)" />
                    <div>
                      <strong>2. Database Scan</strong>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>MongoDB searches for existing lead using `$or: [{phone}, {email}]`.</p>
                    </div>
                  </li>
                  <li style={{ display: "flex", gap: "1rem" }}>
                    <ShieldCheck color="var(--color-success)" />
                    <div>
                      <strong>3. Resolution (First Agent Claims)</strong>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>If exists, abort lead creation. Append new form answers to existing lead's `notes`. Do not change the `assignedAgent`.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {/* SECURITY SECTION */}
          {activeSection === "security" && (
            <div className="fade-in">
              <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Zero-Trust Architecture</h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: "1.125rem", marginBottom: "3rem" }}>
                Designed to stop internal data theft. Agents cannot steal client lists when they resign.
              </p>

              {/* Data Masking Chart */}
              <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
                <h3 style={{ marginBottom: "1.5rem" }}>API Response Masking</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--color-danger)", borderRadius: "8px" }}>
                    <span style={{ color: "var(--color-danger)", fontWeight: 500 }}>Raw Database Data</span>
                    <span style={{ fontFamily: "monospace" }}>+234 801 234 5678</span>
                  </div>
                  
                  <div style={{ textAlign: "center" }}>
                    <ShieldCheck color="var(--color-text-muted)" size={24} />
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--color-success)", borderRadius: "8px" }}>
                    <span style={{ color: "var(--color-success)", fontWeight: 500 }}>Agent UI View (Masked)</span>
                    <span style={{ fontFamily: "monospace" }}>+234****678</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: "2rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>In-App Communications</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                  Because agents cannot see the actual phone numbers, they are forced to use the <strong>RealtyOS VoIP Dialer</strong> and <strong>Email Proxy</strong>. This ensures all client communications are logged in the CRM and prevents agents from taking clients offline to WhatsApp.
                </p>
                <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "var(--color-surface)", borderRadius: "4px", borderLeft: "4px solid var(--color-primary)" }}>
                  <strong>CSS Enforcement:</strong> The entire CRM is wrapped in `user-select: none;` preventing highlight-and-copy scraping.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
