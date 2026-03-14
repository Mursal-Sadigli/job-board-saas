"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserSync() {
  const { isLoaded, userId, getToken } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && userId) {
        try {
          const token = await getToken();
          
          const response = await fetch("http://localhost:5000/api/users/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to sync user with backend. Status: ${response.status}, Error: ${errorText}`);
          } else {
            const data = await response.json();
            console.log("User sync successful:", data);
          }
        } catch (error) {
          console.error("Error during user sync:", error);
        }
      }
    };

    syncUser();
  }, [isLoaded, userId, getToken]);

  return null;
}
