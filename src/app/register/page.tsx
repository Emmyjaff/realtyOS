"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      // Automatically login or redirect to login
      router.push("/login");
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
          background: "linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg) 100%)",
          borderRight: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "4rem",
          position: "relative",
          overflow: "hidden"
        }}
        className="hide-on-mobile"
      >
        <div style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "80%",
          height: "80%",
          background: "var(--color-accent)",
          opacity: 0.15,
          filter: "blur(120px)",
          borderRadius: "50%",
          zIndex: 0
        }} />

        <div style={{ zIndex: 1 }}>
          <h1 className="text-gradient" style={{ fontSize: "2.5rem", margin: 0 }}>RealtyOS</h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: "1rem", fontSize: "1.25rem", maxWidth: "400px" }}>
            Join the platform that powers modern real estate operations.
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
        <div style={{ width: "100%", maxWidth: "450px", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Create Account</h2>
            <p style={{ color: "var(--color-text-muted)" }}>Sign up to access the operating system.</p>
          </div>

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {error && (
              <div style={{ padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-danger)", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="John"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Email Address</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                placeholder="agent@realtyos.com"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Password</label>
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                style={inputStyle}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "0.5rem" }}>
              {isLoading ? <Loader className="animate-spin" size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--color-primary)", fontWeight: 500 }}>
              Sign in
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

const inputStyle = {
  padding: "0.75rem 1rem",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-border)",
  backgroundColor: "var(--color-surface)",
  color: "white",
  outline: "none",
  fontFamily: "var(--font-body)",
};
