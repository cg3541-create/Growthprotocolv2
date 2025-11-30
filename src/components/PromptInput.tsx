import { ArrowUp, Paperclip, Plus } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { AutonomySlider } from "./AutonomySlider";

interface PromptInputProps {
  onSubmit?: (text: string) => void;
  showAutonomySlider?: boolean;
  onAutonomyChange?: (level: "search" | "research" | "deep research") => void;
}

export function PromptInput({ onSubmit, showAutonomySlider = false, onAutonomyChange }: PromptInputProps) {
  const [value, setValue] = useState("");
  const [isSliderVisible, setIsSliderVisible] = useState(false);

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

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-[#f9fafb] rounded-lg px-4 py-3 border border-[#e5e7eb] focus-within:border-[#0466C8] transition-colors">
        <button className="p-1 hover:bg-[#e5e7eb] rounded transition-colors">
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
    </div>
  );
}