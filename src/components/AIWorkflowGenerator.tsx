import { useState } from "react";
import { Sparkles, Send, X, Loader2 } from "lucide-react";
import { NodeData } from "./WorkflowNode";

interface AIWorkflowGeneratorProps {
  onGenerateWorkflow: (nodes: NodeData[], connections: Array<{ from: string; to: string }>) => void;
  onClose?: () => void;
}

interface ThinkingStep {
  step: string;
  description: string;
  completed: boolean;
}

const workflowTemplates = {
  "market research": {
    title: "Market Research & Analysis Workflow",
    steps: [
      { step: "Data Collection Planning", description: "Identify sources: web scraping, APIs, databases", completed: false },
      { step: "Workflow Structure", description: "Design multi-source data pipeline with validation", completed: false },
      { step: "Analysis Configuration", description: "Set up market analysis and insights extraction", completed: false },
      { step: "Output Generation", description: "Configure report generation and visualization", completed: false },
    ],
    nodes: [
      { id: "1", type: "web-scraping", label: "Web Scraping", color: "#2563eb", position: { x: 100, y: 100 }, configured: true },
      { id: "2", type: "api-import", label: "API Import", color: "#2563eb", position: { x: 100, y: 250 }, configured: true },
      { id: "3", type: "database-query", label: "Database Query", color: "#2563eb", position: { x: 100, y: 400 }, configured: true },
      { id: "4", type: "merge", label: "Merge Data", color: "#3b82f6", position: { x: 350, y: 250 }, configured: true },
      { id: "5", type: "clean-data", label: "Clean Data", color: "#3b82f6", position: { x: 600, y: 250 }, configured: false },
      { id: "6", type: "analyze-market", label: "Analyze Market", color: "#0466C8", position: { x: 850, y: 250 }, configured: false },
      { id: "7", type: "extract-insights", label: "Extract Insights", color: "#0466C8", position: { x: 1100, y: 250 }, configured: false },
      { id: "8", type: "generate-report", label: "Generate Report", color: "#0353A4", position: { x: 1350, y: 250 }, configured: false },
    ],
    connections: [
      { from: "1", to: "4" },
      { from: "2", to: "4" },
      { from: "3", to: "4" },
      { from: "4", to: "5" },
      { from: "5", to: "6" },
      { from: "6", to: "7" },
      { from: "7", to: "8" },
    ]
  },
  "competitor": {
    title: "Competitor Analysis Workflow",
    steps: [
      { step: "Competitor Identification", description: "Configure competitor tracking sources", completed: false },
      { step: "Data Extraction", description: "Set up web scraping and monitoring agents", completed: false },
      { step: "Comparison Framework", description: "Design competitor comparison analysis", completed: false },
      { step: "Reporting Setup", description: "Configure automated reporting and alerts", completed: false },
    ],
    nodes: [
      { id: "1", type: "web-scraping", label: "Scrape Competitor Sites", color: "#2563eb", position: { x: 100, y: 150 }, configured: true },
      { id: "2", type: "web-scraping", label: "Monitor Pricing", color: "#2563eb", position: { x: 100, y: 350 }, configured: true },
      { id: "3", type: "merge", label: "Merge Data", color: "#3b82f6", position: { x: 400, y: 250 }, configured: true },
      { id: "4", type: "validate", label: "Validate", color: "#3b82f6", position: { x: 650, y: 250 }, configured: false },
      { id: "5", type: "compare", label: "Compare Competitors", color: "#0466C8", position: { x: 900, y: 250 }, configured: false },
      { id: "6", type: "generate-report", label: "Generate Report", color: "#0353A4", position: { x: 1150, y: 150 }, configured: false },
      { id: "7", type: "notify", label: "Send Alert", color: "#0353A4", position: { x: 1150, y: 350 }, configured: false },
    ],
    connections: [
      { from: "1", to: "3" },
      { from: "2", to: "3" },
      { from: "3", to: "4" },
      { from: "4", to: "5" },
      { from: "5", to: "6" },
      { from: "5", to: "7" },
    ]
  },
  "sentiment": {
    title: "Customer Sentiment Analysis Workflow",
    steps: [
      { step: "Data Source Setup", description: "Configure social media and review monitoring", completed: false },
      { step: "Processing Pipeline", description: "Set up data cleaning and transformation", completed: false },
      { step: "Sentiment Analysis", description: "Configure AI sentiment analysis models", completed: false },
      { step: "Visualization", description: "Set up real-time dashboards and reports", completed: false },
    ],
    nodes: [
      { id: "1", type: "api-import", label: "Social Media API", color: "#2563eb", position: { x: 100, y: 100 }, configured: true },
      { id: "2", type: "web-scraping", label: "Review Sites", color: "#2563eb", position: { x: 100, y: 250 }, configured: true },
      { id: "3", type: "api-import", label: "Customer Feedback", color: "#2563eb", position: { x: 100, y: 400 }, configured: true },
      { id: "4", type: "merge", label: "Merge Data", color: "#3b82f6", position: { x: 400, y: 250 }, configured: true },
      { id: "5", type: "clean-data", label: "Clean Data", color: "#3b82f6", position: { x: 650, y: 250 }, configured: false },
      { id: "6", type: "sentiment", label: "Sentiment Analysis", color: "#0466C8", position: { x: 900, y: 250 }, configured: false },
      { id: "7", type: "visualize", label: "Visualize Data", color: "#0353A4", position: { x: 1150, y: 150 }, configured: false },
      { id: "8", type: "notify", label: "Alert on Negative", color: "#0353A4", position: { x: 1150, y: 350 }, configured: false },
    ],
    connections: [
      { from: "1", to: "4" },
      { from: "2", to: "4" },
      { from: "3", to: "4" },
      { from: "4", to: "5" },
      { from: "5", to: "6" },
      { from: "6", to: "7" },
      { from: "6", to: "8" },
    ]
  },
  "pricing": {
    title: "Pricing Intelligence Workflow",
    steps: [
      { step: "Source Configuration", description: "Set up competitor pricing data sources", completed: false },
      { step: "Data Pipeline", description: "Design real-time pricing data collection", completed: false },
      { step: "Analysis Engine", description: "Configure pricing comparison and trends", completed: false },
      { step: "Alerting System", description: "Set up price change notifications", completed: false },
    ],
    nodes: [
      { id: "1", type: "web-scraping", label: "Scrape Pricing", color: "#2563eb", position: { x: 100, y: 200 }, configured: true },
      { id: "2", type: "database-query", label: "Historical Prices", color: "#2563eb", position: { x: 100, y: 350 }, configured: true },
      { id: "3", type: "merge", label: "Merge Data", color: "#3b82f6", position: { x: 400, y: 275 }, configured: true },
      { id: "4", type: "validate", label: "Validate", color: "#3b82f6", position: { x: 650, y: 275 }, configured: false },
      { id: "5", type: "compare", label: "Compare Pricing", color: "#0466C8", position: { x: 900, y: 275 }, configured: false },
      { id: "6", type: "generate-report", label: "Price Report", color: "#0353A4", position: { x: 1150, y: 200 }, configured: false },
      { id: "7", type: "notify", label: "Price Alert", color: "#0353A4", position: { x: 1150, y: 350 }, configured: false },
    ],
    connections: [
      { from: "1", to: "3" },
      { from: "2", to: "3" },
      { from: "3", to: "4" },
      { from: "4", to: "5" },
      { from: "5", to: "6" },
      { from: "5", to: "7" },
    ]
  }
};

function detectWorkflowType(prompt: string): keyof typeof workflowTemplates {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes("competitor") || lowerPrompt.includes("competition")) {
    return "competitor";
  } else if (lowerPrompt.includes("sentiment") || lowerPrompt.includes("customer feedback") || lowerPrompt.includes("review")) {
    return "sentiment";
  } else if (lowerPrompt.includes("pric") || lowerPrompt.includes("cost")) {
    return "pricing";
  } else {
    return "market research";
  }
}

export function AIWorkflowGenerator({ onGenerateWorkflow, onClose }: AIWorkflowGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [workflowTitle, setWorkflowTitle] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setCurrentPrompt(prompt);
    
    const workflowType = detectWorkflowType(prompt);
    const template = workflowTemplates[workflowType];
    
    setWorkflowTitle(template.title);
    setThinkingSteps(template.steps);

    // Simulate AI thinking process
    for (let i = 0; i < template.steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setThinkingSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, completed: true } : step
      ));
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate the workflow
    onGenerateWorkflow(template.nodes, template.connections);
    
    setIsGenerating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="w-96 bg-white border-r border-[#e5e7eb] flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0466C8] to-[#0353A4] rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-sm text-[#1a1a1a]">Workflow Weaver</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#999999] hover:text-[#1a1a1a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-6">
          <p className="text-sm text-[#666666] leading-relaxed">
            Hello, I'm your Workflow Weaver! I can assist you in building automated workflows from the ground up. Simply describe what you need it to do, and I'll help you create it.
          </p>
        </div>

        {/* User Prompt Display */}
        {currentPrompt && (
          <div className="mb-6">
            <div className="bg-[#f8f9fa] rounded-lg p-4 border border-[#e5e7eb]">
              <p className="text-sm text-[#1a1a1a]">{currentPrompt}</p>
            </div>
          </div>
        )}

        {/* Thinking Section */}
        {isGenerating && thinkingSteps.length > 0 && (
          <div className="mb-6">
            <div className="bg-[#f0f4f8] rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Loader2 className="w-4 h-4 text-[#0466C8] animate-spin" />
                <span className="text-sm text-[#666666]">Thinking...</span>
              </div>
              <div className="space-y-2">
                {thinkingSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 text-xs ${
                      step.completed ? "text-[#10b981]" : "text-[#999999]"
                    }`}
                  >
                    <span className="mt-0.5">
                      {step.completed ? "✓" : "○"}
                    </span>
                    <div className="flex-1">
                      <div className={step.completed ? "text-[#10b981]" : "text-[#999999]"}>
                        {step.step}
                      </div>
                      <div className="text-[#999999] mt-0.5">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Workflow Plan Summary */}
        {!isGenerating && workflowTitle && (
          <div className="mb-6">
            <div className="bg-[#ecfdf5] border border-[#10b981] rounded-lg p-4">
              <h3 className="text-sm text-[#1a1a1a] mb-2">Workflow Generated</h3>
              <p className="text-xs text-[#666666] mb-3">{workflowTitle}</p>
              <div className="flex items-center gap-2 text-xs text-[#10b981]">
                <Sparkles className="w-3 h-3" />
                <span>Ready to customize on canvas</span>
              </div>
            </div>
          </div>
        )}

        {/* Example Prompts */}
        {!currentPrompt && !isGenerating && (
          <div className="mb-6">
            <div className="text-xs text-[#999999] mb-3">Try these examples:</div>
            <div className="space-y-2">
              {[
                "Build a workflow for competitor pricing analysis",
                "Create a sentiment analysis pipeline for customer reviews",
                "Set up market research automation for trending products",
                "Monitor and analyze competitor social media presence"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="w-full text-left px-3 py-2 text-xs bg-[#f8f9fa] hover:bg-[#e5e7eb] rounded-lg text-[#666666] transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-[#e5e7eb] p-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe the workflow you want to build..."
            disabled={isGenerating}
            className="w-full px-4 py-3 pr-12 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#0466C8] resize-none disabled:bg-[#f8f9fa] disabled:text-[#999999]"
            rows={3}
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="absolute right-2 bottom-2 w-8 h-8 bg-[#0466C8] text-white rounded-lg flex items-center justify-center hover:bg-[#0353A4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        {!isGenerating && (
          <p className="text-xs text-[#999999] mt-2">
            Press Enter to generate • Shift + Enter for new line
          </p>
        )}
      </div>
    </div>
  );
}
