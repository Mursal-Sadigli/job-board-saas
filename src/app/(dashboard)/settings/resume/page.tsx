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
    previewUrl,
    uploadResume,
    removeResume,
    openPreview,
    closePreview,
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

  return (
    <div className="h-full overflow-y-auto px-6 py-6 bg-slate-50">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={20} className="text-slate-700" />
          <h1 className="text-xl font-bold text-slate-900">
            Tərcümeyi-hal
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          İş müraciətləri üçün CV / tərcümeyi-halınızı yükləyin
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl">
        {/* Upload area */}
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
            dragging
              ? "border-slate-800 bg-slate-100"
              : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
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
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-700 border border-slate-200">
              <Upload size={24} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Yükləmək və ya sürükləyib buraxmaq üçün klikləyin
              </p>
              <p className="text-sm mt-1 text-slate-500">
                Yalnız PDF faylları (maks. 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded resumes list */}
        {resumes.length > 0 && (
          <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
            <div className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/50">
              Yüklənmiş Tərcümeyi-hallar ({resumes.length})
            </div>
            <div className="divide-y divide-slate-100">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center gap-4 px-5 py-3 animate-in fade-in"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 border border-slate-200 text-slate-600">
                    <File size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {resume.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
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
                    <Eye size={14} className="mr-1.5 text-slate-400 group-hover:text-slate-600" />
                    Bax
                  </Button>
                  {/* Delete button */}
                  <button
                    onClick={() => removeResume(resume.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closePreview}
        >
          <div
            className="relative w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden bg-white shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-slate-700" />
                <span className="font-semibold text-slate-900">
                  Tərcümeyi-hal Önizləməsi
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href={previewUrl} download>
                    <Download size={14} className="mr-2" />
                    Yüklə
                  </a>
                </Button>
                <button
                  onClick={closePreview}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            {/* PDF iframe */}
            <div className="flex-1 w-full bg-slate-100">
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
