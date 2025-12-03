import React from "react";

interface FormattedMessageProps {
  message: string;
  sources?: Array<{ name: string; type: string }>;
}

export function FormattedMessage({ message, sources }: FormattedMessageProps) {
  return (
    <div className="whitespace-pre-wrap text-[#374151] leading-relaxed">
      {message}
      {sources && sources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
          <div className="text-sm font-medium text-[#666666] mb-2">Sources:</div>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-[#f8f9fa] rounded text-xs text-[#666666]"
              >
                {source.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

