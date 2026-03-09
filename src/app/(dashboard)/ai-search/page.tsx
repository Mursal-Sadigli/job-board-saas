"use client";

import { Sparkles, Bot, Search } from "lucide-react";

export default function AISearchPage() {
  return (
    <div
      className="h-full flex flex-col items-center justify-center px-6 py-10"
      style={{ background: "hsl(var(--background))" }}
    >
      <div className="flex flex-col items-center gap-5 max-w-md w-full text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(0,184,255,0.2))",
            border: "1px solid rgba(99,102,241,0.25)",
          }}
        >
          <Sparkles size={28} style={{ color: "hsl(var(--primary))" }} />
        </div>
        <div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "hsl(var(--foreground))",
            }}
          >
            AI Job Search
          </h1>
          <p className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>
            Describe what you're looking for in natural language and let AI
            find the perfect jobs for you.
          </p>
        </div>

        <div className="w-full relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "hsl(var(--foreground-subtle))" }}
          />
          <input
            className="input-base pl-10"
            placeholder="e.g. Senior React roles at startups, remote, $150k+"
          />
        </div>

        <button className="btn-primary">
          <Bot size={16} />
          Search with AI
        </button>

        <div
          className="rounded-xl px-5 py-4 w-full"
          style={{
            background: "hsl(var(--surface))",
            border: "1px solid hsl(var(--border-subtle))",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "hsl(var(--foreground-subtle))" }}
          >
            Coming Soon
          </p>
          <p
            className="text-sm"
            style={{ color: "hsl(var(--foreground-muted))" }}
          >
            AI-powered semantic job matching, personalized recommendations based on your resume, and smart salary insights.
          </p>
        </div>
      </div>
    </div>
  );
}
