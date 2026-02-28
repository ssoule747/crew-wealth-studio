// NOTE: This component is no longer used in the current app architecture.
// Kept for reference. Can be safely deleted.
"use client";

import { motion } from "framer-motion";

interface FileInfo {
  name: string;
  id: string;
}

interface FileChipsProps {
  files: FileInfo[];
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

export default function FileChips({ files }: FileChipsProps) {
  if (files.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-wrap gap-1.5"
      style={{ padding: "12px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
          marginRight: "4px",
          alignSelf: "center",
        }}
      >
        Files
      </span>
      {files.map((f) => {
        const meta = getFileMeta(f.name);
        return (
          <div
            key={f.id}
            className="flex items-center gap-1.5 rounded-md"
            style={{
              background: "rgba(255,255,255,0.03)",
              padding: "3px 8px",
              fontSize: "11px",
            }}
          >
            <span style={{ color: meta.color, fontSize: "9px" }}>{meta.icon}</span>
            <span
              style={{
                color: "rgba(255,255,255,0.4)",
                maxWidth: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {f.name}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}
