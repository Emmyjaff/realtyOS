"use client";

import React from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content animate-fade-in">
        {children}
      </main>
    </div>
  );
}
