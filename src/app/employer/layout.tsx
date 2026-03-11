"use client";

import { useAuth } from "@clerk/nextjs";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useAuth();

  if (!isLoaded) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* 
          We removed the Top Header and the Outer Sidebar from the layout 
          to match the user's request for a clean, single-sidebar experience.
          All navigation and user profile settings are now unified inside 
          the internal sidebar of the employer page.
      */}
      <main className="flex-1 overflow-y-auto w-full h-full relative">
        {children}
      </main>
    </div>
  );
}
