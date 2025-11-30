import { X, Zap, TrendingUp, FileBarChart, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  nodes: Array<{
    id: string;
    label: string;
    color: string;
    icon: string;
    x: number;
    y: number;
  }>;
  connections: Array<{
    from: string;
    to: string;
  }>;
}

const templates: WorkflowTemplate[] = [
  {
    id: "competitor-analysis",
    name: "Competitor Analysis",
    description: "Scrape competitor websites, analyze data, and generate insights report",
    icon: TrendingUp,
    color: "#0466C8",
    nodes: [
      { id: "web-scrape-1", label: "Web Scraping", color: "#2563eb", icon: "Globe", x: 100, y: 100 },
      { id: "clean-1", label: "Clean Data", color: "#3b82f6", icon: "Filter", x: 350, y: 100 },
      { id: "compare-1", label: "Compare Competitors", color: "#0466C8", icon: "Scale", x: 600, y: 100 },
      { id: "report-1", label: "Generate Report", color: "#0353A4", icon: "FileBarChart", x: 850, y: 100 },
    ],
    connections: [
      { from: "web-scrape-1", to: "clean-1" },
      { from: "clean-1", to: "compare-1" },
      { from: "compare-1", to: "report-1" },
    ]
  },
  {
    id: "market-research",
    name: "Market Research",
    description: "Import market data, extract insights, and visualize trends",
    icon: FileBarChart,
    color: "#7c3aed",
    nodes: [
      { id: "api-import-1", label: "API Import", color: "#2563eb", icon: "FileText", x: 100, y: 100 },
      { id: "validate-1", label: "Validate", color: "#3b82f6", icon: "CheckCircle2", x: 350, y: 100 },
      { id: "analyze-1", label: "Analyze Market", color: "#0466C8", icon: "TrendingUp", x: 600, y: 100 },
      { id: "visualize-1", label: "Visualize Data", color: "#0353A4", icon: "BarChart3", x: 850, y: 100 },
    ],
    connections: [
      { from: "api-import-1", to: "validate-1" },
      { from: "validate-1", to: "analyze-1" },
      { from: "analyze-1", to: "visualize-1" },
    ]
  },
  {
    id: "sentiment-tracking",
    name: "Sentiment Tracking",
    description: "Upload customer reviews, analyze sentiment, and get notifications",
    icon: Sparkles,
    color: "#ec4899",
    nodes: [
      { id: "file-upload-1", label: "File Upload", color: "#2563eb", icon: "FileUp", x: 100, y: 100 },
      { id: "sentiment-1", label: "Sentiment Analysis", color: "#0466C8", icon: "MessageCircle", x: 400, y: 100 },
      { id: "insights-1", label: "Extract Insights", color: "#0466C8", icon: "Lightbulb", x: 700, y: 100 },
      { id: "notify-1", label: "Send Notification", color: "#0353A4", icon: "Bell", x: 950, y: 180 },
      { id: "export-1", label: "Export Data", color: "#0353A4", icon: "Download", x: 950, y: 20 },
    ],
    connections: [
      { from: "file-upload-1", to: "sentiment-1" },
      { from: "sentiment-1", to: "insights-1" },
      { from: "insights-1", to: "notify-1" },
      { from: "insights-1", to: "export-1" },
    ]
  },
];

interface WorkflowOnboardingProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
  onClose: () => void;
}

export function WorkflowOnboarding({ onSelectTemplate, onClose }: WorkflowOnboardingProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#e5e7eb] flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-[#1a1a1a] mb-1">Get Started with Workflows</h2>
            <p className="text-sm text-[#666666]">
              Choose a pre-built template or start from scratch
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#999999] hover:text-[#333333] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-1 gap-4 mb-6">
            {templates.map((template) => {
              const IconComponent = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="group flex items-start gap-4 p-5 bg-white border-2 border-[#e5e7eb] rounded-lg hover:border-[#0466C8] hover:shadow-md transition-all text-left"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: template.color }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-[#1a1a1a] mb-1 group-hover:text-[#0466C8] transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-[#666666]">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-[#999999]">
                        {template.nodes.length} actions
                      </span>
                      <span className="text-xs text-[#999999]">•</span>
                      <span className="text-xs text-[#999999]">
                        {template.connections.length} connections
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-[#0466C8] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm mr-2">Use template</span>
                    <Zap className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[#e5e7eb] flex items-center justify-between bg-[#fafafa]">
          <p className="text-sm text-[#666666]">
            Start with a template and customize it to your needs
          </p>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-[#e5e7eb] hover:border-[#0466C8] text-[#333333] px-6"
          >
            Build from Scratch
          </Button>
        </div>
      </div>
    </div>
  );
}
