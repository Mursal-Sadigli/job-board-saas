interface EmailTemplateProps {
  firstName: string;
  jobs: Array<{ title: string; company: string; location: string }>;
}

export function EmailTemplate({ firstName, jobs }: EmailTemplateProps) {
  return (
    <div className="font-sans max-w-[600px] mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        Salam {firstName} 👋
      </h1>
      <p className="text-slate-600 mb-4 text-base">
        Sizin üçün gündəlik uyğun iş elanları:
      </p>
      <div className="space-y-3">
        {jobs.map((j, i) => (
          <div key={i} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
            <strong className="block text-slate-900 font-semibold">{j.title}</strong>
            <p className="mt-1 text-slate-500 text-sm">
              {j.company} • {j.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
