// NOTE: This component is no longer used in the current app architecture.
// Kept for reference. Can be safely deleted.
export interface FilePayload {
  name: string;
  content: string;
}

const TEXT_EXTENSIONS = ["csv", "txt", "json", "xml", "md"];

function getExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export async function readFileForUpload(file: File): Promise<FilePayload> {
  const ext = getExtension(file.name);

  if (TEXT_EXTENSIONS.includes(ext)) {
    const content = await file.text();
    return { name: file.name, content };
  }

  // For binary files (.key, .pptx, .pdf, .xlsx, .xls), we can't meaningfully
  // read them client-side. Send the filename so the AI knows what was uploaded.
  return {
    name: file.name,
    content: "",
  };
}

export async function readAllFiles(files: File[]): Promise<FilePayload[]> {
  return Promise.all(files.map(readFileForUpload));
}
