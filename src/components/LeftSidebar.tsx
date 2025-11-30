import { Plus, Home, Database, BookOpen, Network, HelpCircle, Settings, Search, MessageSquare, Zap, Workflow, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface LeftSidebarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function LeftSidebar({ activeItem = "Home", onNavigate, isCollapsed = false, onToggleCollapse }: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    { icon: Plus, label: "New Chat", special: true },
    { icon: Network, label: "Ontology" },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: "Help" },
    { icon: Settings, label: "Settings" },
  ];

  const recentChats = [
    { id: 1, title: "Competitor Pricing Analysis Q4 2024", time: "2 hours ago" },
    { id: 2, title: "Market Share Trends - Tech Sector", time: "5 hours ago" },
    { id: 3, title: "Customer Sentiment Comparison", time: "Yesterday" },
    { id: 4, title: "Industry Growth Forecast", time: "Yesterday" },
    { id: 5, title: "Brand Positioning Analysis", time: "2 days ago" },
    { id: 6, title: "Competitor Product Features Gap", time: "3 days ago" },
    { id: 7, title: "Market Entry Strategy Review", time: "1 week ago" },
    { id: 8, title: "Consumer Behavior Insights", time: "1 week ago" },
  ];

  const filteredChats = recentChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#001845] text-white flex flex-col h-full relative">
      {/* Collapse/Expand Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-6 z-10 w-6 h-6 bg-[#0466C8] border border-[#023E7D] rounded-full flex items-center justify-center hover:bg-[#0353A4] transition-all shadow-md"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-white" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-white" />
          )}
        </button>
      )}

      {/* Logo/Brand */}
      <div className="p-4 border-b border-[#002855]">
        <div className="flex items-center gap-2 justify-center">
          <div className="w-8 h-8 bg-[#0466C8] rounded flex items-center justify-center">
            <span className="text-white">G</span>
          </div>
          {!isCollapsed && <span className="text-lg">Growth Protocol</span>}
        </div>
      </div>

      {/* Main Menu */}
      <div className="py-4 border-b border-[#002855]">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            return (
              <button
                key={item.label}
                onClick={() => onNavigate?.(item.label)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-colors text-left ${
                  item.special
                    ? "bg-[#0466C8] hover:bg-[#0353A4] text-white"
                    : isActive
                    ? "bg-[#023E7D] text-white"
                    : "text-[#979DAC] hover:bg-[#002855]/50 hover:text-white"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recents Section */}
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden flex flex-col py-4">
          <div className="px-3 mb-3">
            <div className="text-xs text-[#979DAC] mb-2 px-3">RECENTS</div>
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#979DAC]" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#002855]/30 border border-[#002855] rounded-lg text-white placeholder:text-[#7D8597] focus:outline-none focus:bg-[#002855]/50 focus:border-[#023E7D]"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-3">
            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-[#002855]/50 transition-colors group"
                >
                  <MessageSquare className="w-4 h-4 text-[#7D8597] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#979DAC] group-hover:text-white truncate transition-colors">
                      {chat.title}
                    </div>
                    <div className="text-xs text-[#5C677D] mt-0.5">{chat.time}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Menu */}
      <div className="border-t border-[#002855] p-3 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-[#979DAC] hover:bg-[#002855]/50 hover:text-white transition-colors text-left`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}