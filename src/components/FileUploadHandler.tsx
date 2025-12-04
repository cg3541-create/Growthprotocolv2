import React, { useRef, useState } from "react";
import { X, FileText, File, CheckCircle2, AlertCircle } from "lucide-react";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: "pending" | "success" | "error";
  error?: string;
}

interface FileUploadHandlerProps {
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  maxFiles?: number;
  onFilesChange?: (files: UploadedFile[]) => void;
  children?: React.ReactNode;
  className?: string;
}

export function FileUploadHandler({
  acceptedTypes = [".json", ".csv", ".txt"],
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  onFilesChange,
  children,
  className = "",
}: FileUploadHandlerProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `File type not supported. Accepted types: ${acceptedTypes.join(", ")}`,
      };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit`,
      };
    }

    return { valid: true };
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    const remainingSlots = maxFiles - uploadedFiles.length;

    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      const validation = validateFile(file);
      const fileId = `${Date.now()}-${Math.random()}`;
      
      newFiles.push({
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        status: validation.valid ? "success" : "error",
        error: validation.error,
      });
    });

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "json") return <FileText className="w-4 h-4" />;
    if (extension === "csv") return <FileText className="w-4 h-4" />;
    if (extension === "txt") return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      {children && (
        <div onClick={() => fileInputRef.current?.click()}>
          {children}
        </div>
      )}
      {uploadedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {uploadedFiles.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className={`flex items-center gap-2 p-2 rounded-lg border ${
                uploadedFile.status === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-[#f8f9fa] border-[#e5e7eb]"
              }`}
            >
              <div className="text-[#666666]">
                {getFileIcon(uploadedFile.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[#1a1a1a] truncate">
                  {uploadedFile.name}
                </div>
                <div className="text-xs text-[#666666]">
                  {formatFileSize(uploadedFile.size)}
                  {uploadedFile.status === "error" && uploadedFile.error && (
                    <span className="text-red-600 ml-2">
                      • {uploadedFile.error}
                    </span>
                  )}
                </div>
              </div>
              {uploadedFile.status === "success" && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
              {uploadedFile.status === "error" && (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <button
                onClick={() => handleRemoveFile(uploadedFile.id)}
                className="p-1 hover:bg-[#e5e7eb] rounded transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Export utility function to trigger file picker programmatically
export function useFileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return { fileInputRef, openFilePicker };
}

