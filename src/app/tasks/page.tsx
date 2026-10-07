"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, CheckSquare, AlertCircle } from "lucide-react";

const TASK_STATUSES = [
  { id: "todo", label: "To Do", color: "var(--color-text-muted)" },
  { id: "in_progress", label: "In Progress", color: "var(--color-primary)" },
  { id: "in_review", label: "In Review", color: "var(--color-warning)" },
  { id: "done", label: "Done", color: "var(--color-success)" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTasks(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const getTasksByStatus = (statusId: string) => tasks.filter(t => t.status === statusId);

  return (
    <DashboardLayout>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>Cross-Department Tasks</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Assign tickets across Sales, Legal, and Construction teams.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={20} /> New Task
        </button>
      </header>

      {/* Kanban Board */}
      <div style={{ display: "flex", gap: "1.5rem", overflowX: "auto", minHeight: "calc(100vh - 200px)" }}>
        {TASK_STATUSES.map(status => {
          const columnTasks = getTasksByStatus(status.id);
          
          return (
            <div key={status.id} style={{ flex: "0 0 320px", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-md)", borderTop: `4px solid ${status.color}` }}>
                <span style={{ fontWeight: 600, color: "var(--color-text-main)" }}>{status.label}</span>
                <span style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "0.15rem 0.5rem", borderRadius: "99px", fontSize: "0.875rem" }}>
                  {columnTasks.length}
                </span>
              </div>

              {isLoading ? (
                <div style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "1rem" }}>Loading...</div>
              ) : columnTasks.map(task => (
                <div key={task._id} className="glass-panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", cursor: "pointer", transition: "var(--transition-fast)" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "none"}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-primary)", fontWeight: 600 }}>
                        {task.assignedToDepartment || "General"}
                      </span>
                      {task.priority === "urgent" && <AlertCircle size={14} color="var(--color-danger)" />}
                    </div>
                    <h4 style={{ margin: "0.5rem 0 0.25rem 0", fontSize: "1.125rem", color: "var(--color-text-main)" }}>
                      {task.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                      {task.description}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid var(--color-border-light)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                      <CheckSquare size={14} /> Assigned: {task.assignedToUser ? `${task.assignedToUser.firstName}` : "Unassigned"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
