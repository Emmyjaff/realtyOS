"use client";

import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { UploadCloud, Image as ImageIcon, CheckCircle, XCircle, Loader } from "lucide-react";

export default function MediaUploader() {
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSize(file.size);
    setStatus("Compressing image...");
    setIsCompressing(true);

    try {
      // Configure for extremely high quality to mimic lossless
      const options = {
        maxSizeMB: 2, // adjust as needed
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.95, // High quality to retain detail
      };

      const compressedFile = await imageCompression(file, options);
      setCompressedSize(compressedFile.size);
      setIsCompressing(false);
      
      setStatus("Uploading to Cloudinary...");
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", compressedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setStatus("Upload successful!");
    } catch (error: any) {
      console.error(error);
      setStatus("Error: " + (error.message || "Failed to upload"));
    } finally {
      setIsCompressing(false);
      setIsUploading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <ImageIcon size={24} color="var(--color-primary)" />
        <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Media Uploader</h3>
      </div>
      
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
        Upload high-quality images. Videos must be embedded via YouTube links (coming soon).
      </p>

      <label 
        style={{
          border: "2px dashed var(--color-border-light)",
          borderRadius: "var(--radius-lg)",
          padding: "3rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          cursor: "pointer",
          backgroundColor: "rgba(255,255,255,0.02)",
          transition: "var(--transition-normal)"
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"}
      >
        {(isCompressing || isUploading) ? (
          <Loader size={48} color="var(--color-primary)" className="animate-spin" style={{ animation: "spin 2s linear infinite" }} />
        ) : (
          <UploadCloud size={48} color="var(--color-text-muted)" />
        )}
        <span style={{ fontWeight: 500 }}>
          {isCompressing ? "Compressing in browser..." : isUploading ? "Uploading..." : "Click to select image"}
        </span>
        <input 
          type="file" 
          accept="image/*" 
          style={{ display: "none" }} 
          onChange={handleImageUpload}
          disabled={isCompressing || isUploading}
        />
      </label>

      {status && (
        <div style={{
          padding: "1rem",
          borderRadius: "var(--radius-md)",
          backgroundColor: status.includes("Error") ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
          border: `1px solid ${status.includes("Error") ? "var(--color-danger)" : "var(--color-success)"}`,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          {status.includes("Error") ? <XCircle color="var(--color-danger)" size={20} /> : <CheckCircle color="var(--color-success)" size={20} />}
          <span style={{ color: status.includes("Error") ? "var(--color-danger)" : "var(--color-success)", fontWeight: 500 }}>
            {status}
          </span>
        </div>
      )}

      {(originalSize && compressedSize) && (
        <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", display: "flex", justifyContent: "space-between" }}>
          <span>Original: {formatBytes(originalSize)}</span>
          <span>Compressed: {formatBytes(compressedSize)} 
            ({Math.round((1 - compressedSize / originalSize) * 100)}% saved)
          </span>
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
