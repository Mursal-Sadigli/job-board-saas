interface EmailTemplateProps {
  firstName: string;
  jobs: Array<{ title: string; company: string; location: string }>;
}

export function EmailTemplate({ firstName, jobs }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ color: "#6366f1" }}>Hi {firstName} 👋</h1>
      <p>Here are today's job matches for you:</p>
      {jobs.map((j, i) => (
        <div key={i} style={{ padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 8 }}>
          <strong>{j.title}</strong>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>{j.company} • {j.location}</p>
        </div>
      ))}
    </div>
  );
}
