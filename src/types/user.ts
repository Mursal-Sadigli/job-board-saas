export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
}

export interface CandidateProfile extends UserProfile {
  title: string;
  bio: string;
  location: string;
  phone: string;
  telegramId?: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  socialLinks: SocialLink[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'portfolio' | 'other';
  url: string;
}

export interface ResumeFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  url: string;
}

export interface NotificationSettings {
  dailyEmailEnabled: boolean;
  filterPrompt: string;
}
