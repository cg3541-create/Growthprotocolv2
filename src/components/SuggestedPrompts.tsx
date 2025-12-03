import { Lightbulb } from "lucide-react";

interface SuggestedPromptsProps {
  onSelect?: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  const prompts = [
    {
      id: 1,
      label: "Show me emerging trends in athletic wear for Q2 2026, prioritizing categories where our Q4 2025 bestsellers align with market momentum",
    },
    {
      id: 2,
      label: "Which fabric innovations are gaining traction in competitor products, and how should we respond?",
    },
    {
      id: 3,
      label: "What adjacent product categories should we prioritize based on current demand signals?",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
      {prompts.map((prompt) => {
        return (
          <button
            key={prompt.id}
            onClick={() => onSelect?.(prompt.label)}
            className="flex flex-col items-center gap-4 p-6 rounded-xl border border-[#e5e7eb] hover:border-[#0466C8] hover:bg-[#f9fafb] transition-all text-center group bg-white"
          >
            <div className="w-12 h-12 rounded-lg border border-[#e5e7eb] flex items-center justify-center group-hover:border-[#0466C8] group-hover:bg-[#0466C8]/5 transition-all">
              <Lightbulb className="w-6 h-6 text-[#9ca3af] group-hover:text-[#0466C8] transition-colors" />
            </div>
            <div className="text-sm text-[#1a1a1a] leading-relaxed">{prompt.label}</div>
          </button>
        );
      })}
    </div>
  );
}
