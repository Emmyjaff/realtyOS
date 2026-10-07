import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Users, Wallet, Briefcase, HardHat, ClipboardList, CheckSquare, BookOpen, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  // In a production app, this would be fetched from the authenticated user's Tenant context.
  // We mock it here to demonstrate how a Sales-only company vs a Construction company would see different menus.
  const [activeModules, setActiveModules] = React.useState(["sales_crm", "financials", "hr_directory"]); 

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, requiredModule: "all" },
    { name: "Properties", href: "/properties", icon: Home, requiredModule: "sales_crm" },
    { name: "CRM & Leads", href: "/crm", icon: Users, requiredModule: "sales_crm" },
    { name: "Lead Forms", href: "/forms", icon: ClipboardList, requiredModule: "sales_crm" },
    { name: "Transactions", href: "/transactions", icon: Wallet, requiredModule: "financials" },
    { name: "Leases & Tenants", href: "/leases", icon: Briefcase, requiredModule: "lettings_management" },
    { name: "Projects & Sites", href: "/projects", icon: HardHat, requiredModule: "construction_erp" },
    { name: "Procurement", href: "/procurement", icon: ClipboardList, requiredModule: "construction_erp" },
    { name: "Tasks", href: "/tasks", icon: CheckSquare, requiredModule: "all" },
    { name: "Agents & HR", href: "/agents", icon: Users, requiredModule: "hr_directory" },
    { name: "Documentation", href: "/docs", icon: BookOpen, requiredModule: "all" },
  ];

  const visibleLinks = links.filter(link => 
    link.requiredModule === "all" || activeModules.includes(link.requiredModule)
  );

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: "3rem" }}>
        <h1 className="text-gradient" style={{ fontSize: "1.75rem", margin: 0 }}>
          RealtyOS
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Workspace: Africa HQ
        </p>
      </div>
      
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {visibleLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              style={{ 
                display: "flex", 
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                color: isActive ? "var(--color-text-main)" : "var(--color-text-muted)",
                backgroundColor: isActive ? "var(--color-surface-hover)" : "transparent",
                fontWeight: isActive ? 500 : 400,
                transition: "var(--transition-fast)",
                textDecoration: "none"
              }}
            >
              <Icon size={20} color={isActive ? "var(--color-primary)" : "currentColor"} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Spacer to push profile to bottom */}
      <div style={{ flex: 1 }}></div>

      {/* User Profile Block */}
      <div style={{ 
        marginTop: "2rem", 
        paddingTop: "1.5rem", 
        borderTop: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "white" }}>
            T
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-main)" }}>Tobi O.</p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Agent</p>
          </div>
        </div>
        
        <button onClick={() => {
          fetch('/api/auth/logout', { method: 'POST' }).then(() => window.location.href = '/login');
        }} style={{ color: "var(--color-danger)", padding: "0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid transparent", cursor: "pointer", backgroundColor: "rgba(239, 68, 68, 0.1)" }} title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
