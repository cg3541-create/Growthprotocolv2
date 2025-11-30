import { motion } from "motion/react";
import { Brain, Database, Search, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ReasoningStep {
  id: string;
  label: string;
  status: "pending" | "active" | "complete";
  details?: string;
  sourcesFound?: number;
  dataSources?: string[]; // Data sources being used in this step
}

interface ReasoningDisplayProps {
  isVisible: boolean;
  onActiveSourcesChange?: (sources: string[]) => void;
}

export function ReasoningDisplay({ isVisible, onActiveSourcesChange }: ReasoningDisplayProps) {
  const [steps, setSteps] = useState<ReasoningStep[]>([
    { id: "1", label: "Understanding the query intent", status: "pending", dataSources: [] },
    { id: "2", label: "Identifying relevant data sources", status: "pending", dataSources: [] },
    { id: "3", label: "Analyzing competitor pricing strategies", status: "pending", dataSources: ["Competitor Pricing Data"] },
    { id: "4", label: "Extracting insights from industry reports", status: "pending", dataSources: ["Industry Reports", "Market Trends 2024"] },
    { id: "5", label: "Cross-referencing customer sentiment data", status: "pending", dataSources: ["Customer Survey Results", "Social Media Sentiment"] },
    { id: "6", label: "Synthesizing competitive intelligence", status: "pending", dataSources: ["Competitor Pricing Data", "Industry Reports", "Customer Survey Results", "Social Media Sentiment"] },
  ]);

  useEffect(() => {
    if (!isVisible) {
      setSteps([
        { id: "1", label: "Understanding the query intent", status: "pending", dataSources: [] },
        { id: "2", label: "Identifying relevant data sources", status: "pending", dataSources: [] },
        { id: "3", label: "Analyzing competitor pricing strategies", status: "pending", dataSources: ["Competitor Pricing Data"] },
        { id: "4", label: "Extracting insights from industry reports", status: "pending", dataSources: ["Industry Reports", "Market Trends 2024"] },
        { id: "5", label: "Cross-referencing customer sentiment data", status: "pending", dataSources: ["Customer Survey Results", "Social Media Sentiment"] },
        { id: "6", label: "Synthesizing competitive intelligence", status: "pending", dataSources: ["Competitor Pricing Data", "Industry Reports", "Customer Survey Results", "Social Media Sentiment"] },
      ]);
      if (onActiveSourcesChange) {
        onActiveSourcesChange([]);
      }
      return;
    }

    // Simulate progressive reasoning
    const timeouts: NodeJS.Timeout[] = [];

    // Step 1: Understanding query
    timeouts.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "1"
              ? { ...step, status: "active", details: "Breaking down the request into analyzable components" }
              : step
          )
        );
        if (onActiveSourcesChange) {
          onActiveSourcesChange([]);
        }
      }, 300)
    );

    // Step 1 complete, Step 2 active
    timeouts.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "1"
              ? { ...step, status: "complete" }
              : step.id === "2"
              ? { ...step, status: "active", details: "Scanning available datasets for relevant information" }
              : step
          )
        );
        if (onActiveSourcesChange) {
          onActiveSourcesChange([]);
        }
      }, 1100)
    );

    // Step 2 complete, Step 3 active - Competitor Pricing Data
    timeouts.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "2"
              ? { ...step, status: "complete", details: "Identified 4 primary datasets" }
              : step.id === "3"
              ? { ...step, status: "active", details: "Comparing pricing across 15 key competitors" }
              : step
          )
        );
        if (onActiveSourcesChange) {
          onActiveSourcesChange(["Competitor Pricing Data"]);
        }
      }, 2000)
    );

    // Step 3 complete, Step 4 active - Industry Reports and Market Trends
    timeouts.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "3"
              ? { ...step, status: "complete", details: "Analyzed 127 pricing data points" }
              : step.id === "4"
              ? { ...step, status: "active", details: "Processing 23 industry reports and trend data" }
              : step
          )
        );
        if (onActiveSourcesChange) {
          onActiveSourcesChange(["Industry Reports", "Market Trends 2024"]);
        }
      }, 3100)
    );

    // Step 4 complete, Step 5 active - Customer Survey and Social Sentiment
    timeouts.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "4"
              ? { ...step, status: "complete", details: "Extracted key market trends and forecasts" }
              : step.id === "5"
              ? { ...step, status: "active", details: "Analyzing feedback from 3,500 customers" }
              : step
          )
        );
        if (onActiveSourcesChange) {
          onActiveSourcesChange(["Customer Survey Results", "Social Media Sentiment"]);
        }
      }, 4200)
    );

    // Step 5 complete, Step 6 active - All sources
    timeouts.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "5"
              ? { ...step, status: "complete", details: "Identified sentiment patterns and preferences" }
              : step.id === "6"
              ? { ...step, status: "active", details: "Generating strategic recommendations" }
              : step
          )
        );
        if (onActiveSourcesChange) {
          onActiveSourcesChange(["Competitor Pricing Data", "Industry Reports", "Customer Survey Results", "Social Media Sentiment"]);
        }
      }, 5200)
    );

    // All complete
    timeouts.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step) => (step.id === "6" ? { ...step, status: "complete" } : step))
        );
        if (onActiveSourcesChange) {
          onActiveSourcesChange([]);
        }
      }, 6200)
    );

    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, [isVisible, onActiveSourcesChange]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#f9f9f9] border border-[#ebebeb] rounded-lg p-4 mb-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-[#0466C8]" />
        <span className="text-sm text-[#1a1a1a]">Reasoning Process</span>
      </div>

      <div className="space-y-2">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: parseInt(step.id) * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="mt-0.5">
              {step.status === "complete" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : step.status === "active" ? (
                <Loader2 className="w-4 h-4 text-[#0466C8] animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-[#e5e7eb]" />
              )}
            </div>
            <div className="flex-1">
              <div
                className={`text-sm ${
                  step.status === "complete"
                    ? "text-[#6b7280]"
                    : step.status === "active"
                    ? "text-[#1a1a1a]"
                    : "text-[#9ca3af]"
                }`}
              >
                {step.label}
              </div>
              {step.details && (
                <div className="text-xs text-[#9ca3af] mt-0.5 flex items-center gap-2">
                  {step.details}
                  {step.dataSources && step.dataSources.length > 0 && step.status === "active" && (
                    <span className="bg-[#0466C8] text-white px-2 py-0.5 rounded-full text-xs">
                      {step.dataSources.length} {step.dataSources.length === 1 ? 'source' : 'sources'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
