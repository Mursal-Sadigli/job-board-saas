export const ROUTES = {
  home: "/",
  jobBoard: "/",
  aiSearch: "/ai-search",
  cvGenerator: "/cv-generator",
  employer: {
    root: "/employer",
    ats: {
      candidates: "/employer/ats/candidates",
      applications: "/employer/ats/applications",
      interviews: "/employer/ats/interviews",
      analytics: "/employer/ats/analytics",
      talentPool: "/employer/ats/talent-pool",
    },
  },
  settings: {
    notifications: "/settings/notifications",
    resume: "/settings/resume",
    profile: "/settings/profile",
  },
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;
