"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry here
    console.error("System Error Caught by Boundary:", error);
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", color: "white", fontFamily: "var(--font-body)" }}>
      <div className="glass-panel" style={{ padding: "4rem", textAlign: "center", maxWidth: "500px", width: "100%", borderTop: "4px solid var(--color-danger)" }}>
        <AlertTriangle size={64} color="var(--color-danger)" style={{ margin: "0 auto 1.5rem auto", opacity: 0.8 }} />
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem", fontFamily: "var(--font-heading)" }}>System Fault</h2>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", lineHeight: 1.6 }}>
          An unexpected error occurred within the application core. Our system administrators have been notified.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button 
            onClick={() => reset()}
            className="btn-primary" 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <RotateCcw size={18} /> Retry Connection
          </button>
          <Link href="/" style={{ padding: "0.75rem 1.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", color: "white", textDecoration: "none", transition: "var(--transition-fast)" }}>
            Return to Dashboard
          </Link>
        </div>
        
        {/* Only visible in development or to system_admins ideally */}
        <div style={{ marginTop: "3rem", padding: "1rem", backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--color-danger)", textAlign: "left", overflowX: "auto" }}>
           <strong style={{ display: "block", marginBottom: "0.5rem" }}>Diagnostic Output:</strong>
           {error.message || "Unknown fatal error."}
        </div>
      </div>
    </div>
  );
}
