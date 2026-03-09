"use client";

import { Building2, BarChart3, Users, Plus } from "lucide-react";

export default function EmployerPage() {
  return (
    <div className="h-full overflow-y-auto px-6 py-8 bg-[#F8F9FA]">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <Building2 size={20} className="text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                İşəgötürən Paneli
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                İş elanlarınızı və müraciətlərinizi idarə edin (Şəhər və ya Rayon üzrə)
              </p>
            </div>
          </div>
          <button className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]">
            <Plus size={16} />
            İş Elanı Paylaş
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Aktiv İşlər", value: "0", icon: <Building2 size={18} />, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
          { label: "Cəmi Müraciətlər", value: "0", icon: <Users size={18} />, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
          { label: "Baxış Sayı", value: "0", icon: <BarChart3 size={18} />, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center shadow-sm`}>
                <span className={stat.iconColor}>{stat.icon}</span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <Building2 size={28} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Hələ heç bir iş elanı yoxdur
        </h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
          Müraciətləri almağa başlamaq üçün ilk iş elanınızı paylaşın
        </p>
        <button className="h-10 px-6 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-all">
          Yeni elan yarat
        </button>
      </div>
    </div>
  );
}
