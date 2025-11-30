import { User, Zap, Check, FileText, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  stage?: string;
  showActions?: boolean;
  showDataSummary?: boolean;
  showExportOptions?: boolean;
}

export function ChatMessage({ 
  role, 
  content, 
  stage, 
  showActions,
  showDataSummary,
  showExportOptions 
}: ChatMessageProps) {
  return (
    <div className={`flex gap-4 mb-6 ${role === "user" ? "justify-end" : ""}`}>
      {role === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-[#0466C8] flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`flex-1 max-w-2xl ${role === "user" ? "flex justify-end" : ""}`}>
        <div
          className={`rounded-2xl p-4 ${
            role === "user"
              ? "bg-[#0466C8] text-white ml-auto max-w-fit"
              : "bg-[#f9f9f9] text-[#333333]"
          }`}
        >
          {stage && (
            <Badge className="mb-2 bg-[#0466C8]/10 text-[#0466C8] border-[#0466C8]/20">
              <Check className="w-3 h-3 mr-1" />
              {stage}
            </Badge>
          )}
          
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{content}</div>
          
          {showDataSummary && (
            <div className="mt-4 space-y-2 border-t border-[#ebebeb] pt-4">
              <div className="text-xs text-[#666666]">Data Collection Summary:</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-lg p-3 border border-[#ebebeb]">
                  <div className="text-xs text-[#999999]">Papers</div>
                  <div className="text-[#333333]">127</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-[#ebebeb]">
                  <div className="text-xs text-[#999999]">Records</div>
                  <div className="text-[#333333]">4.2K</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-[#ebebeb]">
                  <div className="text-xs text-[#999999]">Sources</div>
                  <div className="text-[#333333]">15</div>
                </div>
              </div>
            </div>
          )}

          {showActions && (
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="text-xs border-[#ebebeb]">
                Adjust Prompt
              </Button>
              <Button size="sm" variant="outline" className="text-xs border-[#ebebeb]">
                Change Visuals
              </Button>
              <Button size="sm" className="text-xs bg-[#0466C8] hover:bg-[#0353A4]">
                Approve
              </Button>
            </div>
          )}

          {showExportOptions && (
            <div className="mt-4 space-y-2 border-t border-[#ebebeb] pt-4">
              <div className="text-xs text-[#666666] mb-2">Export Options:</div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="text-xs border-[#ebebeb]">
                  <FileText className="w-3 h-3 mr-1.5" />
                  Google Doc
                </Button>
                <Button size="sm" variant="outline" className="text-xs border-[#ebebeb]">
                  <FileText className="w-3 h-3 mr-1.5" />
                  Slides Report
                </Button>
                <Button size="sm" variant="outline" className="text-xs border-[#ebebeb]">
                  <Download className="w-3 h-3 mr-1.5" />
                  Archive Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {role === "user" && (
        <div className="w-8 h-8 rounded-full bg-[#ebebeb] flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-[#666666]" />
        </div>
      )}
    </div>
  );
}
