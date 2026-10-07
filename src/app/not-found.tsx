"use client";

import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", color: "white", fontFamily: "var(--font-body)" }}>
      <div className="glass-panel" style={{ padding: "4rem", textAlign: "center", maxWidth: "500px", width: "100%", borderTop: "4px solid var(--color-warning)" }}>
        <FileQuestion size={64} color="var(--color-warning)" style={{ margin: "0 auto 1.5rem auto", opacity: 0.8 }} />
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem", fontFamily: "var(--font-heading)" }}>Sector Not Found</h2>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", lineHeight: 1.6 }}>
          The module or data record you are attempting to access does not exist, or you lack the necessary permissions to view it.
        </p>
        <Link href="/" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <Home size={18} /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
