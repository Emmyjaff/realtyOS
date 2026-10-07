"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import { Building2 } from "lucide-react";

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.formId as string;
  
  const [formConfig, setFormConfig] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/f/${formId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFormConfig(data.data);
        }
      })
      .catch(console.error);
  }, [formId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => { payload[key] = value.toString(); });

    try {
      const res = await fetch(`/api/f/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formConfig) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>Loading Form...</div>;
  }

  if (isSuccess) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div className="glass-panel" style={{ padding: "4rem", textAlign: "center", maxWidth: "500px", width: "100%" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto" }}>
            <Building2 size={32} color="var(--color-success)" />
          </div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Thank You!</h2>
          <p style={{ color: "var(--color-text-muted)" }}>We have received your details. One of our specialists will be in touch shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", padding: "4rem 1rem", display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        
        {/* Form Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
           <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "var(--color-primary)", fontWeight: 600 }}>
             <Building2 size={24} /> RealtyOS Partners
           </div>
           <h1 style={{ fontSize: "2.5rem", margin: "0 0 1rem 0" }}>{formConfig.title}</h1>
           <p style={{ color: "var(--color-text-muted)", fontSize: "1.125rem" }}>{formConfig.description}</p>
        </div>

        {/* Dynamic Form Body */}
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {formConfig.fields.map((field: any, idx: number) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-main)" }}>
                {field.label} {field.isRequired && <span style={{ color: "var(--color-danger)" }}>*</span>}
              </label>
              
              {field.fieldType === "textarea" ? (
                <textarea 
                  name={field.label} 
                  required={field.isRequired} 
                  rows={4}
                  style={{ width: "100%", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)", color: "white", outline: "none", resize: "vertical" }} 
                />
              ) : field.fieldType === "dropdown" ? (
                <select 
                  name={field.label} 
                  required={field.isRequired}
                  style={{ width: "100%", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)", color: "white", outline: "none" }}
                >
                  <option value="">Select an option...</option>
                  {field.options.map((opt: string, i: number) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type={field.fieldType} 
                  name={field.label} 
                  required={field.isRequired}
                  style={{ width: "100%", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)", color: "white", outline: "none" }} 
                />
              )}
            </div>
          ))}

          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: "1rem", padding: "1rem", fontSize: "1.125rem" }}>
            {isSubmitting ? "Securing Submission..." : "Submit Registration"}
          </button>
          
          <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
            🔒 Secured by RealtyOS Zero-Trust Architecture
          </div>
        </form>
      </div>
    </div>
  );
}
