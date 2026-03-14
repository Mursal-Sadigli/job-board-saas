import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_JOBS } from "@/api/jobs";

export interface Application {
  id: string;
  name: string;
  initials: string;
  color: string;
  stage: string;
  rating: number;
  appliedAt: string;
  jobTitle: string;
  jobId: string;
  resumeUrl: string;
  isVirtual?: boolean;
}

interface ApplicationState {
  applications: Application[];
  searchQuery: string;
  stageFilter: string;
  
  // Actions
  setApplications: (apps: Application[]) => void;
  updateApplicationStage: (id: string, stage: string) => void;
  updateApplicationRating: (id: string, rating: number) => void;
  deleteApplication: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setStageFilter: (filter: string) => void;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      applications: [],
      searchQuery: "",
      stageFilter: "Bütün",

      setApplications: (applications) => set({ applications }),
      
      updateApplicationStage: (id, stage) => 
        set((state) => ({
          applications: state.applications.map((app) => 
            app.id === id ? { ...app, stage } : app
          )
        })),

      updateApplicationRating: (id, rating) => 
        set((state) => ({
          applications: state.applications.map((app) => 
            app.id === id ? { ...app, rating } : app
          )
        })),

      deleteApplication: (id) => 
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id)
        })),

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      
      setStageFilter: (stageFilter) => set({ stageFilter }),
    }),
    {
      name: 'application-storage',
      partialize: (state) => ({ searchQuery: state.searchQuery, stageFilter: state.stageFilter }),
    }
  )
);
