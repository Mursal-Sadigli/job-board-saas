"use client";

import { Building2, BarChart3, Users, Plus } from "lucide-react";

export default function EmployerPage() {
  return (
    <div
      className="h-full overflow-y-auto px-6 py-6"
      style={{ background: "hsl(var(--background))" }}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={20} style={{ color: "hsl(var(--primary))" }} />
            <h1
              className="text-xl font-bold"
              style={{
                fontFamily: "var(--font-outfit)",
                color: "hsl(var(--foreground))",
              }}
            >
              Employer Dashboard
            </h1>
          </div>
          <button className="btn-primary" style={{ width: "auto", padding: "9px 18px" }}>
            <Plus size={15} />
            Post a Job
          </button>
        </div>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--foreground-muted))" }}>
          Manage your job postings and applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Active Jobs", value: "0", icon: <Building2 size={18} />, color: "hsl(var(--primary))" },
          { label: "Total Applicants", value: "0", icon: <Users size={18} />, color: "hsl(var(--accent))" },
          { label: "Views", value: "0", icon: <BarChart3 size={18} />, color: "hsl(var(--success))" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4"
            style={{
              background: "hsl(var(--surface))",
              border: "1px solid hsl(var(--border-subtle))",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: stat.color }}>{stat.icon}</span>
              <span className="text-xs font-medium" style={{ color: "hsl(var(--foreground-subtle))" }}>
                {stat.label}
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div
        className="rounded-xl p-10 text-center"
        style={{
          background: "hsl(var(--surface))",
          border: "1px solid hsl(var(--border-subtle))",
        }}
      >
        <p className="font-semibold mb-1" style={{ color: "hsl(var(--foreground))" }}>
          No job postings yet
        </p>
        <p className="text-sm" style={{ color: "hsl(var(--foreground-subtle))" }}>
          Post your first job to start receiving applications
        </p>
      </div>
    </div>
  );
}
