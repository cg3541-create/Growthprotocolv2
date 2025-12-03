import { WorkflowAction } from "./WorkflowBuilder";
import { X, Upload, CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface RightSidebarProps {
  workflowActions?: WorkflowAction[];
  activeDataSources?: string[];
}

export function RightSidebar({ workflowActions = [], activeDataSources = [] }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<"sources" | "overview">("sources");
  const [isOpen, setIsOpen] = useState(true);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>(["Research Papers-0"]);
  
  // Debug logging
  useEffect(() => {
    console.log('📋 RightSidebar received activeDataSources:', activeDataSources);
    console.log('📋 Available sources in sidebar:', sourcesRef.current);
    // Log which sources should be active
    sourcesRef.current.forEach((source, index) => {
      const isActive = activeDataSources.some(active => {
        const activeLower = active.toLowerCase().trim();
        const sourceLower = source.toLowerCase().trim();
        return activeLower === sourceLower || 
               activeLower.replace(/\.json$/, '') === sourceLower.replace(/\.json$/, '');
      });
      if (isActive) {
        console.log(`✅ Source "${source}" should be checked`);
      } else if (activeDataSources.length > 0) {
        console.log(`❌ Source "${source}" not matched. Active sources:`, activeDataSources);
      }
    });
  }, [activeDataSources]);

  const filters = ["Research Papers", "Ontoloop Data", "Web Scraping"];
  // Actual database files from the ontology/data
  const sources = [
    "products.json",
    "market_data.json",
    "ontology.json",
  ];
  
  // Memoize sources to avoid dependency issues
  const sourcesRef = React.useRef(sources);
  sourcesRef.current = sources;

  const toggleFilter = (filter: string, index: number) => {
    const key = `${filter}-${index}`;
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const toggleSource = (source: string, index: number) => {
    const key = `${source}-${index}`;
    // Don't allow unchecking if it's actively being used
    const isActive = activeDataSources.some(active => {
      const activeLower = active.toLowerCase();
      const sourceLower = source.toLowerCase();
      return activeLower === sourceLower || 
             activeLower.includes(sourceLower) || 
             sourceLower.includes(activeLower.replace('.json', ''));
    });
    
    if (isActive) {
      // Can't uncheck active sources
      return;
    }
    
    setSelectedSources((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };
  
  // Clear manual selections when active sources change (new query)
  useEffect(() => {
    if (activeDataSources.length > 0) {
      // Keep only manually selected sources that aren't in activeDataSources
      setSelectedSources(prev => prev.filter(key => {
        // Extract source name from key (format: "sourceName-index")
        const parts = key.split('-');
        const sourceIndex = parseInt(parts[parts.length - 1] || '0');
        const source = sources[sourceIndex];
        if (!source) return false;
        
        const isActive = activeDataSources.some(active => {
          const activeLower = active.toLowerCase();
          const sourceLower = source.toLowerCase();
          return activeLower === sourceLower || 
                 activeLower.includes(sourceLower) || 
                 sourceLower.includes(activeLower.replace('.json', ''));
        });
        return !isActive; // Keep if not active
      }));
    } else {
      // If no active sources, clear all manual selections
      setSelectedSources([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDataSources]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute right-4 top-4 px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#1a1a1a] hover:bg-[#f9fafb] transition-colors"
      >
        Show Panel
      </button>
    );
  }

  return (
    <div className="w-full bg-white border-l border-[#e5e7eb] flex flex-col h-full">
      {/* Tabs */}
      <div className="border-b border-[#e5e7eb]">
        <div className="flex items-center justify-between px-4 pt-3">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("sources")}
              className={`pb-2 text-sm transition-colors ${
                activeTab === "sources"
                  ? "text-[#1a1a1a] border-b-2 border-[#5b4cdb]"
                  : "text-[#9ca3af] hover:text-[#6b7280]"
              }`}
            >
              Sources
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2 text-sm transition-colors ${
                activeTab === "overview"
                  ? "text-[#1a1a1a] border-b-2 border-[#5b4cdb]"
                  : "text-[#9ca3af] hover:text-[#6b7280]"
              }`}
            >
              Overview
            </button>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-[#f9fafb] rounded transition-colors"
          >
            <X className="w-4 h-4 text-[#6b7280]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "sources" && (
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
            <input
              type="text"
              placeholder="Search files..."
              className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4cdb] focus:border-transparent"
            />

            {/* Sources List */}
            <div className="space-y-3">
              <div className="text-xs text-[#9ca3af]">Available Sources</div>
              {sources.map((source, index) => {
                const key = `${source}-${index}`;
                // Check if this source is in activeDataSources (used in current query)
                // Match by exact name (case-insensitive)
                const isActive = activeDataSources.some(active => {
                  const activeLower = active.toLowerCase().trim();
                  const sourceLower = source.toLowerCase().trim();
                  // Exact match (most common case)
                  if (activeLower === sourceLower) {
                    return true;
                  }
                  // Also check if they match without file extension
                  const activeBase = activeLower.replace(/\.json$/, '');
                  const sourceBase = sourceLower.replace(/\.json$/, '');
                  if (activeBase === sourceBase && activeBase.length > 0) {
                    return true;
                  }
                  return false;
                });
                
                // Debug logging
                if (isActive) {
                  console.log('✅ Source is active:', source, 'matched with:', activeDataSources);
                } else if (activeDataSources.length > 0) {
                  console.log('❌ Source not matched:', source, 'vs activeDataSources:', activeDataSources);
                }
                
                // Also check if manually selected
                const isManuallySelected = selectedSources.includes(key);
                const isChecked = isActive || isManuallySelected;
                return (
                  <div key={key} className="flex items-start space-x-3">
                    <Checkbox
                      id={key}
                      checked={isChecked}
                      onCheckedChange={() => toggleSource(source, index)}
                      disabled={isActive} // Disable if actively used (read-only)
                      className={`mt-0.5 border-[#e5e7eb] data-[state=checked]:bg-[#0466C8] data-[state=checked]:border-[#0466C8] ${
                        isActive ? 'opacity-75' : ''
                      }`}
                    />
                    <Label
                      htmlFor={key}
                      className={`text-sm cursor-pointer leading-tight ${
                        isActive ? 'text-[#0466C8] font-medium' : 'text-[#1a1a1a]'
                      }`}
                    >
                      {source}
                      {isActive && (
                        <span className="ml-2 text-xs text-[#0466C8]">(in use)</span>
                      )}
                    </Label>
                  </div>
                );
              })}
            </div>

            {/* Upload Area */}
            <div className="space-y-2">
              <div className="text-xs text-[#9ca3af]">Upload files</div>
              <label className="border-2 border-dashed border-[#e5e7eb] bg-[#f9fafb] rounded-lg h-32 flex flex-col items-center justify-center hover:border-[#5b4cdb] transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-[#9ca3af] mb-2" />
                <div className="text-[#9ca3af] text-xs text-center px-4">
                  Drag & drop files here
                  <div className="mt-1">
                    <span className="text-[#5b4cdb]">Upload Data</span>
                  </div>
                </div>
                <input type="file" className="hidden" multiple />
              </label>
            </div>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="p-4">
            <div className="text-sm text-[#6b7280]">Overview content goes here...</div>
          </div>
        )}
      </div>
    </div>
  );
}