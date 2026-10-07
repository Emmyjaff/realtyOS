"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to login");
      }

      router.push("/"); // Redirect to dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {/* Left Column - Branding / Image */}
      <div 
        style={{
          flex: 1,
          background: "linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%)",
          borderRight: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "4rem",
          position: "relative",
          overflow: "hidden"
        }}
        className="hide-on-mobile" // Assuming a utility class for mobile responsiveness
      >
        {/* Decorative background glow */}
        <div style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "80%",
          height: "80%",
          background: "var(--color-primary-glow)",
          filter: "blur(120px)",
          borderRadius: "50%",
          zIndex: 0
        }} />

        <div style={{ zIndex: 1 }}>
          <h1 className="text-gradient" style={{ fontSize: "2.5rem", margin: 0 }}>RealtyOS</h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: "1rem", fontSize: "1.25rem", maxWidth: "400px" }}>
            The exhaustive internal operating system for global real estate operations.
          </p>
        </div>

        <div style={{ zIndex: 1, color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          © {new Date().getFullYear()} RealtyOS. All rights reserved.
        </div>
      </div>

      {/* Right Column - Form */}
      <div 
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          backgroundColor: "var(--color-bg)"
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Welcome back</h2>
            <p style={{ color: "var(--color-text-muted)" }}>Sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {error && (
              <div style={{ padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-danger)", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "white",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                }}
                placeholder="agent@realtyos.com"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Password</label>
                <a href="#" style={{ fontSize: "0.875rem", color: "var(--color-primary)" }}>Forgot password?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "white",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                }}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "0.5rem" }}>
              {isLoading ? <Loader className="animate-spin" size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "var(--color-primary)", fontWeight: 500 }}>
              Request access
            </Link>
          </p>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
