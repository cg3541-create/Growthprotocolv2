import { useState } from "react";
import { LeftSidebar } from "./components/LeftSidebar";
import { ChatArea } from "./components/ChatArea";
import { RightSidebar } from "./components/RightSidebar";
import { OntologyVisualization } from "./components/OntologyVisualization";

export default function App() {
  const [activeView, setActiveView] = useState<string>("Chat");
  const [activeDataSources, setActiveDataSources] = useState<string[]>([]);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

  const handleNavigation = (item: string) => {
    if (item === "New Chat") {
      setActiveView("Chat");
    } else {
      setActiveView(item);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Sidebar - 1/5 of screen */}
      <div className={`transition-all duration-300 ${isLeftSidebarCollapsed ? 'w-16' : 'flex-[1] min-w-[240px] max-w-[280px]'}`}>
        <LeftSidebar 
          activeItem={activeView} 
          onNavigate={handleNavigation}
          isCollapsed={isLeftSidebarCollapsed}
          onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      {activeView === "Ontology" ? (
        <div className="flex-[4]">
          <OntologyVisualization />
        </div>
      ) : (
        <>
          {/* Main Chat Area - 3/5 of screen */}
          <div className="flex-[3]">
            <ChatArea 
              onPromptSubmit={() => {}} // Placeholder for prompt submission
              onActiveSourcesChange={setActiveDataSources}
            />
          </div>

          {/* Right Sidebar - 1/5 of screen */}
          <div className="flex-[1] min-w-[240px] max-w-[320px]">
            <RightSidebar 
              workflowActions={[]} // Placeholder for workflow actions
              activeDataSources={activeDataSources}
            />
          </div>
        </>
      )}
    </div>
  );
}