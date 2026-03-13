import { useState, useEffect, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

let subscribers: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export const toast = (props: Omit<Toast, "id">) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { ...props, id };
  toasts = [...toasts, newToast];
  subscribers.forEach((callback) => callback(toasts));

  if (props.duration !== Infinity) {
    setTimeout(() => {
      removeToast(id);
    }, props.duration || 5000);
  }

  return id;
};

const removeToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  subscribers.forEach((callback) => callback(toasts));
};

export function useToast() {
  const [activeToasts, setActiveToasts] = useState<Toast[]>(toasts);

  useEffect(() => {
    subscribers.push(setActiveToasts);
    return () => {
      subscribers = subscribers.filter((s) => s !== setActiveToasts);
    };
  }, []);

  return {
    toasts: activeToasts,
    toast,
    dismiss: removeToast,
  };
}
