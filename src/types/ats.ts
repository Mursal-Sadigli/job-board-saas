export type CandidateStatus = "Applied" | "Screening" | "Interview" | "Offered" | "Hired" | "Rejected";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  location: string;
  currentRole?: string;
  experienceYears: number;
  skills: string[];
  education: string[];
  resumeUrl?: string;
  matchingScore: number;
  analysisStatus: "pending" | "completed" | "failed";
  appliedAt: string;
  status: CandidateStatus;
  appliedJobId?: string;
  appliedJobTitle?: string;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: CandidateStatus;
  appliedAt: string;
  rating: number; // 1-5
  notes?: string;
}
