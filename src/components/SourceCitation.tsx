import { FileText, Database, Globe, ExternalLink } from "lucide-react";
import { useState } from "react";

export interface Source {
  id: string;
  title: string;
  type: "paper" | "database" | "web";
  snippet: string;
  relevance: number;
  url?: string;
}

interface SourceCitationProps {
  source: Source;
  index: number;
}

export function SourceCitation({ source, index }: SourceCitationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (source.type) {
      case "paper":
        return <FileText className="w-4 h-4" />;
      case "database":
        return <Database className="w-4 h-4" />;
      case "web":
        return <Globe className="w-4 h-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (source.type) {
      case "paper":
        return "Research Paper";
      case "database":
        return "Database";
      case "web":
        return "Web Source";
    }
  };

  return (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className="inline-flex items-center gap-1 text-[#472be9] hover:text-[#5a3ef7] transition-colors cursor-pointer group"
    >
      <sup className="text-xs">[{index}]</sup>
      {isExpanded && (
        <div className="fixed z-50 bg-white border border-[#ebebeb] rounded-lg shadow-lg p-4 max-w-md mt-2 left-1/2 transform -translate-x-1/2">
          <div className="flex items-start gap-3">
            <div className="text-[#472be9] mt-1">{getIcon()}</div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#999999]">{getTypeLabel()}</span>
                <span className="text-xs bg-[#472be9] text-white px-2 py-0.5 rounded-full">
                  {Math.round(source.relevance * 100)}% relevant
                </span>
              </div>
              <div className="text-sm text-[#333333] mb-2">{source.title}</div>
              <div className="text-xs text-[#666666] mb-3 line-clamp-3">{source.snippet}</div>
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#472be9] hover:text-[#5a3ef7] flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  View source <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </button>
  );
}
