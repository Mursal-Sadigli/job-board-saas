import { create } from "zustand";

interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  settingsExpanded: boolean;
  toggleSettings: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: true,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  settingsExpanded: false,
  toggleSettings: () => set((s) => ({ settingsExpanded: !s.settingsExpanded })),
}));
