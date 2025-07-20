import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
}

interface UploadedFile {
  file: File;
  id: string;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export function FileUpload({
  onFilesSelected,
  accept = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
    "text/html": [".html"],
    "text/csv": [".csv"],
    "application/json": [".json"],
    "text/xml": [".xml"],
    "application/zip": [".zip"],
    "audio/mpeg": [".mp3"],
    "audio/wav": [".wav"],
  },
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        console.log("Rejected files:", rejectedFiles);
      }

      // Add accepted files
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        file,
        id: `${file.name}-${Date.now()}`,
        status: "success",
        progress: 100,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple: true,
  });

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setUploadedFiles([]);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type.includes("pdf")) return "📄";
    if (file.type.includes("word") || file.type.includes("docx")) return "📝";
    if (file.type.includes("presentation") || file.type.includes("pptx"))
      return "📊";
    if (file.type.includes("spreadsheet") || file.type.includes("xlsx"))
      return "📈";
    if (file.type.includes("audio")) return "🎵";
    if (file.type.includes("zip")) return "🗜️";
    return "📋";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      <Card className="bg-gradient-card border-border/50">
        <div
          {...getRootProps()}
          className={cn(
            "p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300",
            "hover:border-primary/50 hover:bg-accent/30",
            isDragActive
              ? "border-primary bg-accent/50 scale-[1.02]"
              : "border-border",
            "flex flex-col items-center justify-center text-center space-y-4"
          )}
        >
          <input {...getInputProps()} />

          <div
            className={cn(
              "p-4 rounded-full transition-all duration-300",
              isDragActive ? "bg-primary/20 animate-pulse-glow" : "bg-accent"
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8 transition-colors duration-300",
                isDragActive ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isDragActive ? "Drop files here" : "Upload your documents"}
            </h3>
            <p className="text-muted-foreground">
              Drag & drop files here, or{" "}
              <span className="text-primary font-medium">click to browse</span>
            </p>
          </div>

          <Button variant="upload" size="lg" className="mt-4">
            <Upload className="mr-2 h-4 w-4" />
            Choose Files
          </Button>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="p-4 bg-gradient-card border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
              >
                <span className="text-xl">
                  {getFileIcon(uploadedFile.file)}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {uploadedFile.status === "success" && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {uploadedFile.status === "error" && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  {uploadedFile.status === "uploading" && (
                    <div className="w-16">
                      <Progress value={uploadedFile.progress} className="h-1" />
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
