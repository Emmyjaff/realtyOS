"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader } from "lucide-react";
import Link from "next/link";
import MediaUploader from "@/components/MediaUploader";

export default function NewPropertyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "residential",
    price: "",
    currency: "NGN",
    address: "",
    city: "",
    state: "",
    titleDocument: "None",
    isServiced: false,
    youtubeVideoUrl: "",
    bedrooms: "",
    bathrooms: "",
    sizeSqm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        sizeSqm: formData.sizeSqm ? Number(formData.sizeSqm) : undefined,
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create property");
      }

      router.push("/properties");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/properties" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h2 style={{ fontSize: "2rem", margin: 0 }}>Add New Listing</h2>
            <p style={{ color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
              Enter the property details into the system.
            </p>
          </div>
        </div>
        <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
          Save Property
        </button>
      </header>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        
        {/* Left Column - Main Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "1rem" }}>
              Basic Information
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={labelStyle}>Property Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} style={inputStyle} placeholder="e.g. Luxury 4 Bed Duplex in Lekki Phase 1" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={labelStyle}>Description</label>
              <textarea name="description" required rows={5} value={formData.description} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }} placeholder="Describe the property in detail..." />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={labelStyle}>Property Type</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} style={inputStyle}>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={labelStyle}>Title Document</label>
                <select name="titleDocument" value={formData.titleDocument} onChange={handleChange} style={inputStyle}>
                  <option value="None">None / Undisclosed</option>
                  <option value="C_of_O">Certificate of Occupancy (C of O)</option>
                  <option value="Deed_of_Assignment">Deed of Assignment</option>
                  <option value="Gazette">Gazette</option>
                  <option value="Excision">Excision</option>
                  <option value="Survey_Plan">Survey Plan</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "1rem" }}>
              Location Details
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={labelStyle}>Street Address</label>
              <input type="text" name="address" required value={formData.address} onChange={handleChange} style={inputStyle} placeholder="12 Admiralty Way" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={labelStyle}>City / Area</label>
                <input type="text" name="city" required value={formData.city} onChange={handleChange} style={inputStyle} placeholder="Lekki Phase 1" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={labelStyle}>State</label>
                <input type="text" name="state" required value={formData.state} onChange={handleChange} style={inputStyle} placeholder="Lagos" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Pricing, Specs, Media */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "1rem" }}>
              Pricing
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={labelStyle}>Currency</label>
                <select name="currency" value={formData.currency} onChange={handleChange} style={inputStyle}>
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={labelStyle}>Price</label>
                <input type="number" name="price" required value={formData.price} onChange={handleChange} style={inputStyle} placeholder="150000000" />
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "1rem" }}>
              Specifications
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={labelStyle}>Bedrooms</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} style={inputStyle} placeholder="4" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={labelStyle}>Bathrooms</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} style={inputStyle} placeholder="4.5" />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={labelStyle}>Size (Sqm)</label>
              <input type="number" name="sizeSqm" value={formData.sizeSqm} onChange={handleChange} style={inputStyle} placeholder="450" />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", marginTop: "0.5rem" }}>
              <input type="checkbox" name="isServiced" checked={formData.isServiced} onChange={handleChange} style={{ width: "1.25rem", height: "1.25rem" }} />
              <span style={labelStyle}>Fully Serviced Estate</span>
            </label>
          </div>

          <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
             <h3 style={{ fontSize: "1.25rem", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "1rem" }}>
              Media
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={labelStyle}>YouTube Video URL</label>
              <input type="url" name="youtubeVideoUrl" value={formData.youtubeVideoUrl} onChange={handleChange} style={inputStyle} placeholder="https://youtube.com/watch?v=..." />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ ...labelStyle, display: "block", marginBottom: "0.5rem" }}>Image Upload</label>
              {/* Reuse our MediaUploader component here */}
              <div style={{ transform: "scale(0.9)", transformOrigin: "top left", width: "111%" }}>
                <MediaUploader />
              </div>
            </div>
          </div>

        </div>
      </form>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </DashboardLayout>
  );
}

const inputStyle = {
  padding: "0.75rem 1rem",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-border-light)",
  backgroundColor: "var(--color-bg)",
  color: "white",
  outline: "none",
  fontFamily: "var(--font-body)",
};

const labelStyle = {
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "var(--color-text-muted)"
};
