import { Lightbulb } from "lucide-react";

export function SuggestedPrompts() {
  const prompts = [
    {
      id: 1,
      label: "Analyze our top 5 competitors' pricing strategies",
    },
    {
      id: 2,
      label: "What are the emerging trends in our market?",
    },
    {
      id: 3,
      label: "Compare customer sentiment across competitors",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
      {prompts.map((prompt) => {
        return (
          <button
            key={prompt.id}
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
