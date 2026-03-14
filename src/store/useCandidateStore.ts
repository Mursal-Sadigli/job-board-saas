import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Candidate, CandidateStatus } from "@/types/ats";

export type TalentCandidate = Candidate & { role?: string; tags?: string[] };

interface CandidateFilters {
  status: CandidateStatus[];
  experience: string;
  minScore: number;
  location: string;
}

interface CandidateState {
  candidates: TalentCandidate[];
  searchQuery: string;
  filters: CandidateFilters;
  
  // Actions
  setCandidates: (candidates: TalentCandidate[]) => void;
  addCandidate: (candidate: TalentCandidate) => void;
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<CandidateFilters>) => void;
  resetFilters: () => void;
  deleteCandidate: (id: string) => void;
}

const MOCK_TALENT_POOL: TalentCandidate[] = [
  { id: "tp1", name: "Rüstəm Qasımov", email: "rustam@example.com", location: "Bakı, Azərbaycan", role: "DevOps Engineer", experienceYears: 8, tags: ["Kubernetes", "AWS", "Terraform"], skills: ["Kubernetes", "AWS", "Terraform"], education: ["Bakalavr"], matchingScore: 92, status: "Hired", appliedAt: "2025-01-10", appliedJobTitle: "DevOps Engineer", analysisStatus: "completed" },
  { id: "tp2", name: "Günay Əliyeva", email: "gunay@example.com", location: "Sumqayıt, Azərbaycan", role: "Frontend Lead", experienceYears: 6, tags: ["React", "Architecture", "Mentoring"], skills: ["React", "Architecture", "Mentoring"], education: ["Magistr"], matchingScore: 88, status: "Offered", appliedAt: "2025-02-15", appliedJobTitle: "Frontend Lead", analysisStatus: "completed" },
  { id: "tp3", name: "Fərid Məmmədov", email: "farid@example.com", location: "Gəncə, Azərbaycan", role: "Mobile Developer", experienceYears: 4, tags: ["Flutter", "Dart", "Firebase"], skills: ["Flutter", "Dart", "Firebase"], education: ["Bakalavr"], matchingScore: 75, status: "Interview", appliedAt: "2025-03-01", appliedJobTitle: "Mobile Developer", analysisStatus: "completed" },
  { id: "tp4", name: "Səbinə Rəhimova", email: "sabina@example.com", location: "Bakı, Azərbaycan", role: "QA Automation", experienceYears: 5, tags: ["Selenium", "Python", "Testing"], skills: ["Selenium", "Python", "Testing"], education: ["Bakalavr"], matchingScore: 85, status: "Applied", appliedAt: "2025-03-05", appliedJobTitle: "QA Automation", analysisStatus: "completed" },
];

const initialFilters: CandidateFilters = {
  status: [],
  experience: "all",
  minScore: 0,
  location: ""
};

export const useCandidateStore = create<CandidateState>()(
  persist(
    (set) => ({
      candidates: MOCK_TALENT_POOL,
      searchQuery: "",
      filters: initialFilters,

      setCandidates: (candidates) => set({ candidates }),
      
      addCandidate: (candidate) => 
        set((state) => ({ candidates: [candidate, ...state.candidates] })),
      
      updateCandidateStatus: (id, status) => 
        set((state) => ({
          candidates: state.candidates.map((c) => 
            c.id === id ? { ...c, status } : c
          )
        })),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setFilters: (newFilters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...newFilters } 
        })),

      resetFilters: () => set({ filters: initialFilters }),

      deleteCandidate: (id) => 
        set((state) => ({
          candidates: state.candidates.filter((c) => c.id !== id)
        })),
    }),
    {
      name: 'candidate-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ searchQuery: state.searchQuery, filters: state.filters }), // only persist filters and search
    }
  )
);
