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
    success: <CheckCircle2 className="text-emerald-500" size={22} />,
    error: <AlertCircle className="text-red-500" size={22} />,
    warning: <AlertTriangle className="text-amber-500" size={22} />,
    info: <Info className="text-blue-500" size={22} />,
  };

  const bgs = {
    success: "border-l-emerald-500 bg-emerald-50/90 dark:bg-emerald-500/10",
    error: "border-l-red-500 bg-red-50/90 dark:bg-red-500/10",
    warning: "border-l-amber-500 bg-amber-50/90 dark:bg-amber-500/10",
    info: "border-l-blue-500 bg-blue-50/90 dark:bg-blue-500/10",
  }[toast.type || "info"];

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-4 p-4 rounded-xl bg-card border border-l-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 ease-out translate-x-12 opacity-0",
        isVisible && "translate-x-0 opacity-100",
        bgs
      )}
    >
      <div className="mt-0.5 shrink-0">{icons[toast.type || "info"]}</div>
      <div className="flex-1 space-y-1">
        {toast.title && (
          <h4 className="text-[13px] font-black text-foreground leading-none tracking-tight">
            {toast.title}
          </h4>
        )}
        {toast.description && (
          <p className="text-xs text-muted-foreground font-bold leading-relaxed">
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
        className="shrink-0 text-muted-foreground/40 hover:text-foreground transition-colors p-1"
      >
        <X size={16} />
      </button>
    </div>
  );
}
