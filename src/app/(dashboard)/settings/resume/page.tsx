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
    <div
      className="h-full overflow-y-auto px-6 py-6"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={20} style={{ color: "hsl(var(--primary))" }} />
          <h1
            className="text-xl font-bold"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "hsl(var(--foreground))",
            }}
          >
            Resume
          </h1>
        </div>
        <p className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>
          Upload your CV / resume for job applications
        </p>
      </div>

      <div className="flex flex-col gap-5 max-w-xl">
        {/* Upload area */}
        <div
          className={`upload-area ${dragging ? "dragging" : ""}`}
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
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.12)" }}
            >
              <Upload size={22} style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div>
              <p
                className="font-semibold text-sm"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Click to upload or drag & drop
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "hsl(var(--foreground-subtle))" }}
              >
                PDF files only
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded resumes list */}
        {resumes.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "hsl(var(--surface))",
              border: "1px solid hsl(var(--border-subtle))",
            }}
          >
            <div
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wider"
              style={{
                color: "hsl(var(--foreground-subtle))",
                borderBottom: "1px solid hsl(var(--border-subtle))",
              }}
            >
              Uploaded Resumes ({resumes.length})
            </div>
            <div className="divide-y" style={{ borderColor: "hsl(var(--border-subtle))" }}>
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center gap-3 px-4 py-3 animate-fade-in"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(239,68,68,0.12)" }}
                  >
                    <File size={16} style={{ color: "#ef4444" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {resume.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "hsl(var(--foreground-subtle))" }}
                    >
                      {formatFileSize(resume.size)} •{" "}
                      {formatRelativeTime(resume.uploadedAt)}
                    </p>
                  </div>
                  {/* View Resume button */}
                  <button
                    onClick={() => openPreview(resume.url)}
                    className="btn-secondary py-1.5 px-3 text-xs"
                    style={{ width: "auto" }}
                  >
                    <Eye size={13} />
                    View
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => removeResume(resume.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: "hsl(var(--foreground-subtle))" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "hsl(var(--danger))")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        "hsl(var(--foreground-subtle))")
                    }
                  >
                    <Trash2 size={14} />
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={closePreview}
        >
          <div
            className="relative w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
            style={{
              background: "hsl(var(--surface))",
              border: "1px solid hsl(var(--border))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: "1px solid hsl(var(--border-subtle))" }}
            >
              <div className="flex items-center gap-2">
                <FileText
                  size={16}
                  style={{ color: "hsl(var(--primary))" }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Resume Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewUrl}
                  download
                  className="btn-secondary py-1.5 px-3 text-xs"
                  style={{ width: "auto" }}
                >
                  <Download size={13} />
                  Download
                </a>
                <button
                  onClick={closePreview}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                  style={{ color: "hsl(var(--foreground-subtle))" }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            {/* PDF iframe */}
            <iframe
              src={previewUrl}
              className="w-full"
              style={{ height: "calc(90vh - 57px)", border: "none" }}
              title="Resume Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
