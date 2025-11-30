import { SuggestedPrompts } from "./SuggestedPrompts";
import { PromptInput } from "./PromptInput";
import { WorkflowStepper } from "./WorkflowStepper";
import { DataSourceSelector } from "./DataSourceSelector";
import { ChatMessage } from "./ChatMessage";
import { WorkflowDemo } from "./WorkflowDemo";
import { FeatureHighlight } from "./FeatureHighlight";
import { ReasoningDisplay } from "./ReasoningDisplay";
import { AIResponse } from "./AIResponse";
import { useState } from "react";
import { Play, Sparkles, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { sendMessageToClaude } from "../services/claudeApi";

interface ChatAreaProps {
  onPromptSubmit?: (prompt: string) => void;
  onActiveSourcesChange?: (sources: string[]) => void;
  isDataLoaded?: boolean;
}

export function ChatArea({ onPromptSubmit, onActiveSourcesChange, isDataLoaded }: ChatAreaProps) {
  const [chatStarted, setChatStarted] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; stage?: string; showActions?: boolean; showDataSummary?: boolean; showExportOptions?: boolean }>>([]);
  const [showReasoning, setShowReasoning] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autonomyLevel, setAutonomyLevel] = useState<"search" | "research" | "deep research">("research");

  const handlePromptClick = async (promptText: string) => {
    if (!isDataLoaded) {
      alert("Data is still loading. Please wait a moment...");
      return;
    }

    setChatStarted(true);
    setUserQuery(promptText);
    setShowReasoning(true);
    setShowResponse(false);
    setIsLoading(true);
    
    // Track in workflow
    if (onPromptSubmit) {
      onPromptSubmit(promptText);
    }

    // Activate data sources
    if (onActiveSourcesChange) {
      onActiveSourcesChange(["Research Papers", "Ontoloop Data"]);
    }

    try {
      // Call Claude API
      const response = await sendMessageToClaude(promptText);
      setAiResponse(response);
      
      // Show response after reasoning animation
      setTimeout(() => {
        setShowReasoning(false);
        setShowResponse(true);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setAiResponse("Sorry, I encountered an error processing your request. Please check your API key configuration.");
      setTimeout(() => {
        setShowReasoning(false);
        setShowResponse(true);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handlePromptSubmit = async (promptText: string) => {
    if (!promptText.trim()) return;
    
    if (!isDataLoaded) {
      alert("Data is still loading. Please wait a moment...");
      return;
    }
    
    setChatStarted(true);
    setUserQuery(promptText);
    setShowReasoning(true);
    setShowResponse(false);
    setIsLoading(true);
    
    // Track in workflow
    if (onPromptSubmit) {
      onPromptSubmit(promptText);
    }

    // Activate data sources
    if (onActiveSourcesChange) {
      onActiveSourcesChange(["Research Papers", "Ontoloop Data"]);
    }

    try {
      // Call Claude API
      const response = await sendMessageToClaude(promptText);
      setAiResponse(response);
      
      // Show response after reasoning animation
      setTimeout(() => {
        setShowReasoning(false);
        setShowResponse(true);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setAiResponse("Sorry, I encountered an error processing your request. Please check your API key configuration.");
      setTimeout(() => {
        setShowReasoning(false);
        setShowResponse(true);
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-[#e5e7eb] px-6 py-4 flex-shrink-0">
        <h2 className="text-xl text-[#1a1a1a]">New Chat</h2>
        <p className="text-sm text-[#9ca3af]">
          Connected to <span className="text-[#0466C8]">Zeus AI Platform</span>
          {!isDataLoaded && <span className="ml-2 text-orange-500">(Loading data...)</span>}
          {isDataLoaded && <span className="ml-2 text-green-600">✓ Ready</span>}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-4xl mx-auto px-6 py-12 pb-24">
          {!chatStarted ? (
            <>
              {/* Main Heading */}
              <div className="text-center mb-12">
                <h1 className="text-3xl text-[#1a1a1a] mb-2">How can I help you today?</h1>
              </div>

              {/* Suggested Prompts */}
              <div onClick={() => handlePromptClick("Show me emerging trends in athletic wear for Q2 2026, prioritizing categories where our Q4 2025 bestsellers align with market momentum")}>
                <SuggestedPrompts />
              </div>
            </>
          ) : showDemo ? (
            <>
              {/* Demo Header */}
              <div className="mb-6">
                <Button
                  onClick={() => setShowDemo(false)}
                  variant="outline"
                  size="sm"
                  className="mb-4"
                >
                  ← Back to Start
                </Button>
                <h2 className="text-[#1a1a1a] mb-1">Complete Research Workflow Demo</h2>
                <p className="text-xs text-[#6b7280]">Following the neurosymbolic AI research analysis journey</p>
              </div>

              {/* Complete Workflow Demo */}
              <WorkflowDemo />
            </>
          ) : (
            <>
              {/* User Query */}
              {userQuery && (
                <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0466C8] flex items-center justify-center text-white shrink-0">
                      Y
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-[#9ca3af] mb-1">You asked:</div>
                      <div className="text-[#1a1a1a]">{userQuery}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Response Section */}
              <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#0466C8] flex items-center justify-center shrink-0">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#1a1a1a] mb-1">Zeus AI</div>
                    
                    {/* Reasoning Display */}
                    <ReasoningDisplay 
                      isVisible={showReasoning}
                      onActiveSourcesChange={onActiveSourcesChange}
                    />
                    
                    {/* AI Response */}
                    {showResponse && (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-[#374151] leading-relaxed">
                          {aiResponse}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-[#e5e7eb] flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <PromptInput 
            onSubmit={handlePromptSubmit} 
            showAutonomySlider={!chatStarted}
            onAutonomyChange={setAutonomyLevel}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
