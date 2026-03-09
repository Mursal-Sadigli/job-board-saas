"use client";
import { useState } from "react";
import { ResumeFile } from "@/types/user";
import { formatFileSize } from "@/utils/formatters";

export function useResume() {
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadResume = (file: File) => {
    const url = URL.createObjectURL(file);
    const newResume: ResumeFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      url,
    };
    setResumes((prev) => [newResume, ...prev]);
    return newResume;
  };

  const removeResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
    if (previewUrl) setPreviewUrl(null);
  };

  const openPreview = (url: string) => setPreviewUrl(url);
  const closePreview = () => setPreviewUrl(null);

  return {
    resumes,
    previewUrl,
    uploadResume,
    removeResume,
    openPreview,
    closePreview,
    formatFileSize,
  };
}
