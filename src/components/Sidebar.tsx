import { Plus, MessageSquare, Settings, User } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 bg-[#171717] flex flex-col border-r border-white/10">
      {/* New Chat Button */}
      <div className="p-3">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-white">
          <Plus className="w-4 h-4" />
          <span className="text-sm">New chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <div className="text-xs text-white/50 px-3 py-2">Today</div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 text-sm text-left">
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Neurosymbolic AI query</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 text-sm text-left">
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Previous conversation</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 text-sm text-left">
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Another chat</span>
        </button>
        
        <div className="text-xs text-white/50 px-3 py-2 mt-4">Yesterday</div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 text-sm text-left">
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Data analysis help</span>
        </button>
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-white/70">
          <User className="w-4 h-4" />
          <span className="text-sm">User Account</span>
        </button>
      </div>
    </div>
  );
}
