import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { WorkflowBuilder, WorkflowAction } from "./WorkflowBuilder";
import { useState } from "react";
import { Upload, X, MessageSquare, Plus, Workflow } from "lucide-react";

interface SourcesPanelProps {
  workflowActions?: WorkflowAction[];
  onSaveWorkflow?: (name: string, actions: WorkflowAction[]) => void;
  onClearWorkflow?: () => void;
}

export function SourcesPanel({ workflowActions = [], onSaveWorkflow, onClearWorkflow }: SourcesPanelProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>(["Research Papers-0"]);
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"sources" | "history" | "workflow">("sources");

  const filters = ["Research Papers", "Ontoloop Data", "Web Scraping"];
  const sources = [
    "AI Patents Database.pdf",
    "Academic Journals Collection.pdf",
    "Snowflake Data Lake",
    "Databricks Analytics",
    "ChatGPT API Responses",
    "Claude Analysis Results",
  ];

  const toggleFilter = (filter: string, index: number) => {
    const key = `${filter}-${index}`;
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const toggleSource = (source: string, index: number) => {
    const key = `${source}-${index}`;
    setSelectedSources((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute right-4 top-4 p-2 bg-[#f9fafb] text-[#1a1a1a] rounded-lg hover:bg-[#e5e7eb] transition-colors border border-[#e5e7eb]"
      >
        Panel
      </button>
    );
  }

  return (
    <div className="w-80 bg-[#f9fafb] border-l border-[#e5e7eb] flex flex-col">
      {/* Header with Tabs */}
      <div className="border-b border-[#e5e7eb]">
        <div className="p-4 flex items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("sources")}
              className={`text-sm transition-colors pb-1 ${
                activeTab === "sources"
                  ? "text-[#1a1a1a] border-b-2 border-[#0466C8]"
                  : "text-[#9ca3af] hover:text-[#6b7280]"
              }`}
            >
              Sources
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`text-sm transition-colors pb-1 ${
                activeTab === "history"
                  ? "text-[#1a1a1a] border-b-2 border-[#0466C8]"
                  : "text-[#9ca3af] hover:text-[#6b7280]"
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab("workflow")}
              className={`text-sm transition-colors pb-1 flex items-center gap-1.5 ${
                activeTab === "workflow"
                  ? "text-[#1a1a1a] border-b-2 border-[#0466C8]"
                  : "text-[#9ca3af] hover:text-[#6b7280]"
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              Workflow
            </button>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-[#e5e7eb] rounded transition-colors"
          >
            <X className="w-4 h-4 text-[#6b7280]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "workflow" ? (
          <WorkflowBuilder 
            actions={workflowActions}
            onSaveWorkflow={onSaveWorkflow}
            onClearWorkflow={onClearWorkflow}
          />
        ) : activeTab === "sources" ? (
          <div className="p-4 space-y-6">
            {/* Data Source Type Pills */}
            <div>
              <div className="text-xs text-[#9ca3af] mb-2">Data Source Type</div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter, index) => {
                  const key = `${filter}-${index}`;
                  const isActive = activeFilters.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleFilter(filter, index)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        isActive
                          ? "bg-[#0466C8] text-white"
                          : "bg-white text-[#6b7280] hover:bg-[#e5e7eb] border border-[#e5e7eb]"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input */}
            <Input
              type="text"
              placeholder="Search files..."
              className="bg-white border-[#e5e7eb] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:border-[#0466C8]"
            />

            {/* Sources List */}
            <div className="space-y-3">
              <div className="text-xs text-[#9ca3af]">Available Sources</div>
              {sources.map((source, index) => {
                const key = `${source}-${index}`;
                const isChecked = selectedSources.includes(key);
                return (
                  <div key={key} className="flex items-start space-x-3">
                    <Checkbox
                      id={key}
                      checked={isChecked}
                      onCheckedChange={() => toggleSource(source, index)}
                      className="mt-0.5 border-[#e5e7eb] data-[state=checked]:bg-[#0466C8] data-[state=checked]:border-[#0466C8]"
                    />
                    <Label
                      htmlFor={key}
                      className="text-sm text-[#1a1a1a] cursor-pointer leading-tight"
                    >
                      {source}
                    </Label>
                  </div>
                );
              })}
            </div>

            {/* Upload Area */}
            <div className="space-y-2">
              <div className="text-xs text-[#9ca3af]">Upload files</div>
              <label className="border-2 border-dashed border-[#e5e7eb] bg-white rounded-lg h-32 flex flex-col items-center justify-center hover:border-[#0466C8] hover:bg-[#f9fafb] transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-[#9ca3af] mb-2" />
                <div className="text-[#9ca3af] text-xs">Drop files or click to upload</div>
                <input type="file" className="hidden" multiple />
              </label>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* New Chat Button */}
            <div className="p-4">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#e5e7eb] hover:bg-white transition-colors text-[#1a1a1a]">
                <Plus className="w-4 h-4" />
                <span className="text-sm">New chat</span>
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-4 space-y-1">
              <div className="text-xs text-[#9ca3af] px-3 py-2">Today</div>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition-colors text-[#6b7280] text-sm text-left">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Neurosymbolic AI query</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition-colors text-[#6b7280] text-sm text-left">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Previous conversation</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition-colors text-[#6b7280] text-sm text-left">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Another chat</span>
              </button>
              
              <div className="text-xs text-[#9ca3af] px-3 py-2 mt-4">Yesterday</div>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition-colors text-[#6b7280] text-sm text-left">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Data analysis help</span>
              </button>
              
              <div className="text-xs text-[#9ca3af] px-3 py-2 mt-4">Previous 7 Days</div>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition-colors text-[#6b7280] text-sm text-left">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Knowledge base queries</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white transition-colors text-[#6b7280] text-sm text-left">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Code generation task</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
