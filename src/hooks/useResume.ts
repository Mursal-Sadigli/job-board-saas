"use client";
import { useState, useEffect, useCallback } from "react";
import { ResumeFile } from "@/types/user";
import { formatFileSize } from "@/utils/formatters";
import { useAuth } from "@clerk/nextjs";
import { toast } from "@/hooks/use-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export function useResume() {
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [userStats, setUserStats] = useState<{ cvUploadCount: number, plan: string }>({
    cvUploadCount: 0,
    plan: 'FREE'
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/users/resumes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes || []);
        setUserStats({
          cvUploadCount: data.cvUploadCount || 0,
          plan: data.plan || 'FREE'
        });
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const uploadResume = async (file: File) => {
    try {
      setLoading(true);
      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(`${API_BASE}/api/users/resumes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.status === 403 && data.code === 'LIMIT_REACHED') {
        toast({ type: "error", description: data.message });
        window.location.href = '/upgrade';
        return null;
      }

      if (!res.ok) {
        toast({ type: "error", description: data.message || "Yükləmə xətası" });
        return null;
      }

      toast({ type: "success", description: "CV uğurla yükləndi" });
      fetchResumes();
      return data;
    } catch (error) {
      toast({ type: "error", description: "Xəta baş verdi" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeResume = async (id: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/users/resumes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast({ type: "success", description: "CV silindi" });
        fetchResumes(); // Refresh stats too
      } else {
        toast({ type: "error", description: "Silinmə xətası" });
      }
    } catch (error) {
      toast({ type: "error", description: "Xəta baş verdi" });
    }
  };

  const openPreview = (url: string) => setPreviewUrl(url);
  const closePreview = () => setPreviewUrl(null);

  return {
    resumes,
    userStats,
    previewUrl,
    uploadResume,
    removeResume,
    openPreview,
    closePreview,
    formatFileSize,
    loading
  };
}
