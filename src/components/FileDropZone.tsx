// NOTE: This component is no longer used in the current app architecture.
// Kept for reference. Can be safely deleted.
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

interface UploadedFile {
  file: File;
  id: string;
}

interface FileDropZoneProps {
  files: UploadedFile[];
  onFilesAdded: (newFiles: UploadedFile[]) => void;
  onFileRemoved: (id: string) => void;
}

const FILE_ICONS: Record<string, { icon: string; color: string }> = {
  key: { icon: "◆", color: "#C9A96E" },
  pptx: { icon: "◆", color: "#C9A96E" },
  pdf: { icon: "▣", color: "#C96E6E" },
  csv: { icon: "▤", color: "#6EAAC9" },
  xlsx: { icon: "▦", color: "#8BC96E" },
  xls: { icon: "▦", color: "#8BC96E" },
};

function getFileMeta(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[ext] || { icon: "◇", color: "rgba(255,255,255,0.3)" };
}

export default function FileDropZone({ files, onFilesAdded, onFileRemoved }: FileDropZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const newFiles: UploadedFile[] = accepted.map((file) => ({
        file,
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      }));
      onFilesAdded(newFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.apple.keynote": [".key"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "application/pdf": [".pdf"],
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  const hasFiles = files.length > 0;

  return (
    <div className="flex flex-col gap-2">
      {!hasFiles && (
        <div
          {...getRootProps()}
          className="relative cursor-pointer transition-all duration-200 rounded-[10px]"
          style={{
            border: isDragActive
              ? "1.5px dashed #C9A96E"
              : "1.5px dashed rgba(255,255,255,0.06)",
            background: isDragActive
              ? "rgba(201,169,110,0.06)"
              : "transparent",
            padding: "20px 16px",
            maxHeight: "120px",
          }}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <span
              style={{
                fontSize: "20px",
                color: isDragActive ? "#C9A96E" : "rgba(255,255,255,0.15)",
                transition: "color 200ms",
              }}
            >
              ◇
            </span>
            <div className="text-center">
              <p className="text-text-secondary" style={{ fontSize: "12px", fontWeight: 500 }}>
                Drop files here
              </p>
              <p className="text-text-muted" style={{ fontSize: "11px", marginTop: "3px" }}>
                Keynote, PowerPoint, PDF, CSV, Excel
              </p>
            </div>
          </div>
        </div>
      )}

      {hasFiles && (
        <div className="flex flex-wrap items-center gap-2">
          <AnimatePresence mode="popLayout">
            {files.map((f) => {
              const meta = getFileMeta(f.file.name);
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    padding: "5px 9px",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: meta.color, fontSize: "10px" }}>{meta.icon}</span>
                  <span className="text-text-secondary" style={{ maxWidth: "130px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "12px" }}>
                    {f.file.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemoved(f.id);
                    }}
                    className="text-text-muted hover:text-text-secondary transition-colors duration-200"
                    style={{ fontSize: "12px", lineHeight: 1, marginLeft: "2px" }}
                  >
                    ×
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <button
            type="button"
            {...getRootProps()}
            className="text-text-muted hover:text-text-secondary transition-colors duration-200"
            style={{ fontSize: "11px", padding: "4px 8px" }}
          >
            <input {...getInputProps()} />
            + Add
          </button>
        </div>
      )}
    </div>
  );
}
