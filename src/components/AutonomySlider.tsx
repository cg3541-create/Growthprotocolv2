import { useState } from "react";
import { Slider } from "./ui/slider";

interface AutonomySliderProps {
  onAutonomyChange?: (level: "search" | "research" | "deep research") => void;
}

export function AutonomySlider({ onAutonomyChange }: AutonomySliderProps) {
  const [value, setValue] = useState<number[]>([50]);

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue);
    
    // Map slider value to autonomy level
    let level: "search" | "research" | "deep research";
    if (newValue[0] < 33) {
      level = "search";
    } else if (newValue[0] < 67) {
      level = "research";
    } else {
      level = "deep research";
    }
    
    if (onAutonomyChange) {
      onAutonomyChange(level);
    }
  };

  // Determine current level for visual feedback
  const getCurrentLevel = () => {
    if (value[0] < 33) return "search";
    if (value[0] < 67) return "research";
    return "deep research";
  };

  const currentLevel = getCurrentLevel();

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-[#6b7280]">Search and tools</div>
      </div>
      
      {/* Slider */}
      <div className="mb-2">
        <Slider 
          value={value} 
          onValueChange={handleValueChange}
          max={100}
          step={1}
        />
      </div>
      
      {/* Labels */}
      <div className="flex items-center justify-between text-xs text-[#6b7280]">
        <span className={currentLevel === "search" ? "text-[#0466C8]" : ""}>search</span>
        <span className={currentLevel === "research" ? "text-[#0466C8]" : ""}>research</span>
        <span className={currentLevel === "deep research" ? "text-[#0466C8]" : ""}>deep research</span>
      </div>
    </div>
  );
}