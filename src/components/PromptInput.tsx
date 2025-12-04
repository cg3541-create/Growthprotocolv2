import { ArrowUp, Paperclip, Plus } from "lucide-react";
import { useState, KeyboardEvent, useRef } from "react";
import { AutonomySlider } from "./AutonomySlider";
import { FileUploadHandler, UploadedFile } from "./FileUploadHandler";

interface PromptInputProps {
  onSubmit?: (text: string) => void;
  showAutonomySlider?: boolean;
  onAutonomyChange?: (level: "search" | "research" | "deep research") => void;
  onFilesChange?: (files: UploadedFile[]) => void;
}

export function PromptInput({ onSubmit, showAutonomySlider = false, onAutonomyChange, onFilesChange }: PromptInputProps) {
  const [value, setValue] = useState("");
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value);
      setValue("");
      setIsSliderVisible(false); // Hide slider after submit
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    onFilesChange?.(files);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-[#f9fafb] rounded-lg px-4 py-3 border border-[#e5e7eb] focus-within:border-[#0466C8] transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".json,.csv,.txt"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const uploaded: UploadedFile[] = files.map((file) => ({
              id: `${Date.now()}-${Math.random()}`,
              file,
              name: file.name,
              size: file.size,
              type: file.type || "application/octet-stream",
              status: "success",
            }));
            handleFileSelect([...uploadedFiles, ...uploaded]);
          }}
          className="hidden"
        />
        <button 
          onClick={handleFileButtonClick}
          className="p-1 hover:bg-[#e5e7eb] rounded transition-colors"
          title="Attach files"
        >
          <Paperclip className="w-5 h-5 text-[#6b7280]" />
        </button>
        {showAutonomySlider && (
          <button 
            onClick={() => setIsSliderVisible(!isSliderVisible)}
            className={`p-1 hover:bg-[#e5e7eb] rounded transition-colors ${isSliderVisible ? 'bg-[#e5e7eb]' : ''}`}
          >
            <Plus className="w-5 h-5 text-[#6b7280]" />
          </button>
        )}
        <input
          type="text"
          placeholder="What may I help you with..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-1 bg-transparent border-none outline-none text-[#1a1a1a] placeholder:text-[#9ca3af]"
        />
        <button 
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="p-2 bg-[#0466C8] text-white rounded hover:bg-[#0353A4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
      
      {/* Autonomy Slider - shows only when plus icon is clicked */}
      {showAutonomySlider && isSliderVisible && (
        <AutonomySlider onAutonomyChange={onAutonomyChange} />
      )}

      {/* File Upload Display */}
      {uploadedFiles.length > 0 && (
        <div className="mt-2 space-y-1">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 px-2 py-1 bg-[#f8f9fa] rounded text-xs text-[#666666]"
            >
              <Paperclip className="w-3 h-3" />
              <span className="flex-1 truncate">{file.name}</span>
              <button
                onClick={() => {
                  const updated = uploadedFiles.filter((f) => f.id !== file.id);
                  setUploadedFiles(updated);
                  onFilesChange?.(updated);
                }}
                className="text-[#999999] hover:text-[#666666]"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}