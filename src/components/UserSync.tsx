"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export default function UserSync() {
  const { isLoaded, userId, getToken } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && userId) {
        try {
          const token = await getToken();
          
          const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
          const response = await fetch(`${API_BASE}/api/users/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`Failed to sync user. Status: ${response.status}`, errorData);
            toast({
              title: "Sinxronizasiya xətası",
              description: errorData.message || "İstifadəçi məlumatları bazaya yazıla bilmədi.",
              type: "error"
            });
          } else {
            const data = await response.json();
            console.log("User sync successful:", data.id);
            // Optional: toast success for debugging locally
            if (process.env.NODE_ENV === 'development') {
               console.log("Database ID:", data.id);
            }
          }
        } catch (error: any) {
          console.error("Error during user sync:", error);
          toast({
            title: "Sistem xətası",
            description: "Backend ilə əlaqə qurmaq mümkün deyil.",
            type: "error"
          });
        }
      }
    };

    syncUser();
  }, [isLoaded, userId, getToken]);

  return null;
}
