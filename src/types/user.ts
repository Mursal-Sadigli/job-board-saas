export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
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
