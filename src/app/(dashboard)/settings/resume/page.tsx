"use client";

import { useRef, useState } from "react";
import {
  FileText,
  Upload,
  Eye,
  Trash2,
  File,
  X,
  Download,
} from "lucide-react";
import { useResume } from "@/hooks/useResume";
import { formatRelativeTime, formatFileSize } from "@/utils/formatters";
import { Button } from "@/components/ui/button";

export default function ResumePage() {
  const {
    resumes,
    userStats,
    previewUrl,
    uploadResume,
    removeResume,
    openPreview,
    closePreview,
    loading
  } = useResume();

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        uploadResume(file);
      }
    });
  };

  const limit = 5;
  const remaining = Math.max(0, limit - userStats.cvUploadCount);
  const progress = Math.min(100, (userStats.cvUploadCount / limit) * 100);
  const isPremium = userStats.plan === 'LIFETIME';

  return (
    <div className="h-full overflow-y-auto px-6 py-6 bg-background">
      {/* Page header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={20} className="text-foreground" />
            <h1 className="text-xl font-bold text-foreground">
              CV-lərim
            </h1>
            {isPremium && (
              <span className="ml-2 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-wider">
                Premium
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            İş müraciətləri üçün CV-lərinizi idarə edin.
          </p>
        </div>

        {!isPremium && (
          <div className="bg-card border border-border rounded-2xl p-4 w-full md:w-64 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">Limit</span>
              <span className="text-sm font-bold text-foreground">{userStats.cvUploadCount} / {limit}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  progress >= 100 ? 'bg-red-500' : progress > 70 ? 'bg-orange-500' : 'bg-primary'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              {remaining > 0 ? `${remaining} yükləmə haqqınız qalıb` : "Limitiniz bitib"}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 max-w-2xl">
        {/* Upload area */}
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
            remaining === 0 && !isPremium
              ? "border-red-500/30 bg-red-500/5 cursor-not-allowed"
              : dragging
              ? "border-foreground bg-muted/30 cursor-pointer"
              : "border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/20 cursor-pointer"
          }`}
          onClick={() => remaining === 0 && !isPremium ? null : inputRef.current?.click()}
          onDragOver={(e) => {
            if (remaining === 0 && !isPremium) return;
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            if (remaining === 0 && !isPremium) return;
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            disabled={remaining === 0 && !isPremium}
          />
          <div className="flex flex-col items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
              remaining === 0 && !isPremium 
                ? "bg-red-500/10 text-red-500 border-red-500/20" 
                : "bg-muted text-muted-foreground border-border"
            }`}>
              {remaining === 0 && !isPremium ? <X size={24} /> : <Upload size={24} />}
            </div>
            <div>
              <p className={`font-semibold ${remaining === 0 && !isPremium ? "text-red-600" : "text-foreground"}`}>
                {remaining === 0 && !isPremium 
                  ? "Yükləmə limiti bitib" 
                  : "Yükləmək və ya sürükləyib buraxmaq üçün klikləyin"}
              </p>
              <p className="text-sm mt-1 text-muted-foreground">
                {remaining === 0 && !isPremium 
                  ? "Yeni CV yükləmək üçün Premium paketi seçin" 
                  : "Yalnız PDF faylları (maks. 5MB)"}
              </p>
            </div>
            {remaining === 0 && !isPremium && (
              <Button 
                variant="destructive" 
                size="sm" 
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = '/upgrade';
                }}
              >
                İndi Yüksəlt
              </Button>
            )}
          </div>
        </div>

        {/* Uploaded resumes list */}
        {resumes.length > 0 && (
          <div className="rounded-xl overflow-hidden bg-card border border-border shadow-sm">
            <div className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
              Yüklənmiş CV-lər ({resumes.length})
            </div>
            <div className="divide-y divide-border">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center gap-4 px-5 py-3 animate-in fade-in"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-muted border border-border text-muted-foreground">
                    <File size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {resume.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatFileSize(resume.size)} •{" "}
                      {formatRelativeTime(resume.uploadedAt)}
                    </p>
                  </div>
                  {/* View Resume button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 group"
                    onClick={() => openPreview(resume.url)}
                  >
                    <Eye size={14} className="mr-1.5 text-muted-foreground group-hover:text-foreground" />
                    Bax
                  </Button>
                  {/* Delete button */}
                  <button
                    onClick={() => removeResume(resume.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200"
          onClick={closePreview}
        >
          <div
            className="relative w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden bg-card border border-border shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-foreground" />
                <span className="font-semibold text-foreground">
                  CV Önizləməsi
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={previewUrl}
                  download
                  className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[min(var(--radius-md),12px)] border border-border bg-background text-[0.8rem] font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Download size={14} />
                  Yüklə
                </a>
                <button
                  onClick={closePreview}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            {/* PDF iframe */}
            <div className="flex-1 w-full bg-muted">
              <iframe
                src={previewUrl}
                className="w-full h-full border-none"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
