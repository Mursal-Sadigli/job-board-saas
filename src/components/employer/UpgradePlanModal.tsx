import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";

export function UpgradePlanModal({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen =
    controlledOpen !== undefined ? controlledOnOpenChange : setInternalOpen;

  // Toggle state
  const [annual, setAnnual] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="max-w-5xl w-[calc(100vw-2rem)] border-border bg-[#111214] p-8 sm:p-12 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-8">
          <DialogTitle className="sr-only">Təfərrüatlı Planlar</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Plan */}
          <div className="rounded-2xl border border-slate-800 bg-[#1C1D21] p-6 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-4xl font-bold text-white">
                ${annual ? 80 * 10 : 80}
              </span>
              <span className="text-sm text-slate-400 mb-1">/ ay</span>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <button
                type="button"
                onClick={() => setAnnual(!annual)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  annual ? "bg-white" : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-[#1C1D21] transition-transform ${
                    annual ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-slate-300">
                İllik ödəniş
              </span>
            </div>

            <div className="space-y-4 flex-1 mb-8 border-t border-slate-800 pt-6 mt-[-8px]">
              <div className="flex gap-3 text-sm text-slate-300">
                <Check size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span>İş elanları yaratmaq</span>
              </div>
              <div className="flex gap-3 text-sm text-slate-300">
                <Check size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span>Müraciətləri idarə etmək</span>
              </div>
              <div className="flex gap-3 text-sm text-slate-300">
                <Check size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span>1 İş elanı paylaşmaq</span>
              </div>
            </div>

            <button className="w-full h-11 rounded-lg bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors">
              Bu plana keç
            </button>
          </div>

          {/* Growth Plan */}
          <div className="rounded-2xl border border-slate-800 bg-[#1C1D21] p-6 flex flex-col relative">
            <div className="absolute top-6 right-6 px-2.5 py-1 rounded bg-white text-black text-[10px] font-bold tracking-wide">
              Aktiv
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-4xl font-bold text-white">
                ${annual ? 200 * 10 : 200}
              </span>
              <span className="text-sm text-slate-400 mb-1">/ ay</span>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <button
                type="button"
                onClick={() => setAnnual(!annual)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  annual ? "bg-white" : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-[#1C1D21] transition-transform ${
                    annual ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-slate-300">
                İllik ödəniş
              </span>
            </div>

            <div className="space-y-4 flex-1 mb-8 border-t border-slate-800 pt-6 mt-[-8px]">
              <div className="flex gap-3 text-sm text-slate-300">
                <Check size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span>1 Önə çıxarılmış elan</span>
              </div>
              <div className="flex gap-3 text-sm text-slate-300">
                <Check size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span>İş elanları yaratmaq</span>
              </div>
              <div className="flex gap-3 text-sm text-slate-300">
                <Check size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span>Müraciətləri idarə etmək</span>
              </div>
              <div className="flex gap-3 text-sm text-slate-300">
                <Check size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span>3 İş elanı paylaşmaq</span>
              </div>
            </div>

            <button className="w-full h-11 rounded-lg bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors">
              Bu plana keç
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl border border-slate-800 bg-[#1C1D21] p-6 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-4xl font-bold text-white">
                ${annual ? 800 * 10 : 800}
              </span>
              <span className="text-sm text-slate-400 mb-1">/ ay</span>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <button
                type="button"
                onClick={() => setAnnual(!annual)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  annual ? "bg-white" : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-[#1C1D21] transition-transform ${
                    annual ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-slate-300">
                İllik ödəniş
              </span>
            </div>

            <div className="space-y-4 flex-1 mb-8 border-t border-slate-800 pt-6 mt-[-8px]">
              <div className="flex gap-3 text-sm text-slate-300">
                <Check size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span>İş elanları yaratmaq</span>
              </div>
              <div className="flex gap-3 text-sm text-slate-300">
                <Check size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span>Müraciətləri idarə etmək</span>
              </div>
              <div className="flex gap-3 text-sm text-slate-300">
                <Check size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span>15 İş elanı paylaşmaq</span>
              </div>
              <div className="flex gap-3 text-sm text-slate-300">
                <Check size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span>Limitsiz önə çıxarılmış elan</span>
              </div>
            </div>

            <button className="w-full h-11 rounded-lg bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors">
              Bu plana keç
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
