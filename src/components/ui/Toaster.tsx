"use client";

import { useToast, Toast } from "@/hooks/use-toast";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 right-0 p-4 md:p-6 z-200 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={18} />,
    error: <AlertCircle className="text-red-500" size={18} />,
    warning: <AlertTriangle className="text-amber-500" size={18} />,
    info: <Info className="text-blue-500" size={18} />,
  };

  const bgs = {
    success: "bg-emerald-500/5 border-emerald-500/10",
    error: "bg-red-500/5 border-red-500/10",
    warning: "bg-amber-500/5 border-amber-500/10",
    info: "bg-blue-500/5 border-blue-500/10",
  }[toast.type || "info"];

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-4 p-4 rounded-2xl bg-card border shadow-2xl backdrop-blur-3xl transition-all duration-300 ease-out translate-x-12 opacity-0",
        isVisible && "translate-x-0 opacity-100",
        bgs
      )}
    >
      <div className="mt-0.5 shrink-0">{icons[toast.type || "info"]}</div>
      <div className="flex-1 space-y-1">
        {toast.title && (
          <h4 className="text-sm font-black text-foreground leading-none tracking-tight">
            {toast.title}
          </h4>
        )}
        {toast.description && (
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onDismiss();
            }}
            className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-muted-foreground/40 hover:text-foreground transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
