import { useState, useEffect } from "react";
import { X, CheckCircle2, Loader2, AlertCircle, TrendingUp, FileBarChart, Database, Filter } from "lucide-react";
import { NodeData } from "./WorkflowNode";

interface WorkflowExecutionProps {
  nodes: NodeData[];
  connections: Array<{ from: string; to: string }>;
  onClose: () => void;
}

interface ExecutionStep {
  nodeId: string;
  label: string;
  status: "pending" | "running" | "validating" | "success" | "error";
  validationMessages: string[];
  outputPreview?: string;
  duration?: number;
}

export function WorkflowExecution({ nodes, connections, onClose }: WorkflowExecutionProps) {
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [finalOutput, setFinalOutput] = useState<any>(null);

  useEffect(() => {
    // Initialize execution steps based on workflow nodes
    const orderedNodes = getExecutionOrder(nodes, connections);
    const steps: ExecutionStep[] = orderedNodes.map(node => ({
      nodeId: node.id,
      label: node.label,
      status: "pending",
      validationMessages: [],
    }));
    setExecutionSteps(steps);

    // Start execution simulation
    executeWorkflow(steps);
  }, []);

  const getExecutionOrder = (nodes: NodeData[], connections: Array<{ from: string; to: string }>) => {
    // Simple topological sort for workflow execution order
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    // Initialize
    nodes.forEach(node => {
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
    });

    // Build graph
    connections.forEach(conn => {
      adjList.get(conn.from)?.push(conn.to);
      inDegree.set(conn.to, (inDegree.get(conn.to) || 0) + 1);
    });

    // Topological sort
    const queue: string[] = [];
    const result: NodeData[] = [];

    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = nodeMap.get(nodeId);
      if (node) result.push(node);

      adjList.get(nodeId)?.forEach(neighborId => {
        const newDegree = (inDegree.get(neighborId) || 0) - 1;
        inDegree.set(neighborId, newDegree);
        if (newDegree === 0) queue.push(neighborId);
      });
    }

    return result.length > 0 ? result : nodes;
  };

  const executeWorkflow = async (steps: ExecutionStep[]) => {
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      
      // Running phase
      await updateStepStatus(i, "running", []);
      await delay(800);

      // Validation phase
      const validationMessages = getValidationMessages(steps[i].label);
      await updateStepStatus(i, "validating", validationMessages);
      
      // Show validation messages one by one
      for (let j = 0; j < validationMessages.length; j++) {
        await delay(600);
        setExecutionSteps(prev => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            validationMessages: validationMessages.slice(0, j + 1)
          };
          return updated;
        });
      }

      await delay(400);

      // Success phase
      const outputPreview = getOutputPreview(steps[i].label);
      await updateStepStatus(i, "success", validationMessages, outputPreview);
      await delay(600);
    }

    // Generate final output
    setIsComplete(true);
    generateFinalOutput(steps);
  };

  const updateStepStatus = async (
    index: number, 
    status: ExecutionStep["status"], 
    validationMessages: string[],
    outputPreview?: string
  ) => {
    setExecutionSteps(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status,
        validationMessages,
        outputPreview,
        duration: status === "success" ? Math.floor(Math.random() * 500) + 300 : undefined
      };
      return updated;
    });
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getValidationMessages = (nodeLabel: string): string[] => {
    const validations: Record<string, string[]> = {
      "Web Scraping": [
        "✓ Connection established",
        "✓ Data extraction successful",
        "✓ 1,245 records retrieved"
      ],
      "API Import": [
        "✓ API authentication verified",
        "✓ Rate limits checked",
        "✓ 3,892 records imported"
      ],
      "Database Query": [
        "✓ Database connection established",
        "✓ Query syntax validated",
        "✓ 5,234 records fetched"
      ],
      "Merge Data": [
        "✓ Data schemas aligned",
        "✓ Duplicate records identified",
        "✓ 10,371 records merged successfully"
      ],
      "Clean Data": [
        "✓ Null values handled",
        "✓ Data types normalized",
        "✓ Outliers detected and processed"
      ],
      "Validate": [
        "✓ Data integrity verified",
        "✓ Business rules applied",
        "✓ Quality score: 98.5%"
      ],
      "Analyze Market": [
        "✓ Market trends analyzed",
        "✓ Growth patterns identified",
        "✓ 15 key insights extracted"
      ],
      "Compare Competitors": [
        "✓ Competitor data normalized",
        "✓ Benchmarks calculated",
        "✓ 8 competitive gaps identified"
      ],
      "Extract Insights": [
        "✓ AI models applied",
        "✓ Pattern recognition complete",
        "✓ 23 actionable insights generated"
      ],
      "Sentiment Analysis": [
        "✓ Text preprocessing complete",
        "✓ Sentiment models applied",
        "✓ Overall sentiment: +0.72 (Positive)"
      ],
      "Generate Report": [
        "✓ Template loaded",
        "✓ Data visualization created",
        "✓ Report compiled (45 pages)"
      ],
      "Visualize Data": [
        "✓ Chart configurations validated",
        "✓ Interactive dashboards created",
        "✓ 12 visualizations generated"
      ],
      "Price Report": [
        "✓ Pricing data aggregated",
        "✓ Trends calculated",
        "✓ Report ready for export"
      ],
      "Price Alert": [
        "✓ Alert conditions evaluated",
        "✓ Notification rules applied",
        "✓ 3 alerts triggered"
      ],
    };

    return validations[nodeLabel] || [
      "✓ Process initialized",
      "✓ Data validated",
      "✓ Execution successful"
    ];
  };

  const getOutputPreview = (nodeLabel: string): string => {
    const previews: Record<string, string> = {
      "Web Scraping": "Retrieved competitor pricing data from 5 sources",
      "API Import": "Imported market trends from industry databases",
      "Database Query": "Extracted historical sales data (Q1-Q4 2024)",
      "Merge Data": "Consolidated data from multiple sources",
      "Clean Data": "Processed and normalized 10K+ records",
      "Validate": "Data quality verified, ready for analysis",
      "Analyze Market": "Market size: $2.4B, YoY growth: +12.3%",
      "Compare Competitors": "Top competitor pricing 15% higher",
      "Extract Insights": "Identified emerging market opportunity in APAC",
      "Sentiment Analysis": "72% positive customer sentiment",
      "Generate Report": "Comprehensive market analysis report generated",
      "Visualize Data": "Interactive dashboard with 12 charts created",
    };

    return previews[nodeLabel] || "Step completed successfully";
  };

  const generateFinalOutput = (steps: ExecutionStep[]) => {
    // Generate comprehensive final output based on workflow type
    const hasAnalysis = steps.some(s => s.label.includes("Analyze") || s.label.includes("Compare"));
    const hasReport = steps.some(s => s.label.includes("Report"));
    
    setFinalOutput({
      summary: "Workflow executed successfully",
      totalRecords: "10,371 records processed",
      duration: `${(steps.length * 1.5).toFixed(1)}s`,
      insights: [
        "Market opportunity identified in Asia-Pacific region (+$450M potential)",
        "Competitor pricing analysis reveals 15% premium opportunity",
        "Customer sentiment trending positive (72% approval)",
        "Recommend expansion into emerging markets within Q2 2025"
      ],
      metrics: {
        "Data Sources": steps.filter(s => s.label.includes("Scraping") || s.label.includes("API") || s.label.includes("Database")).length,
        "Records Processed": "10,371",
        "Insights Generated": "23",
        "Quality Score": "98.5%"
      },
      nextSteps: [
        "Review detailed analysis in generated report",
        "Share insights with product team",
        "Schedule follow-up analysis for Q1 2025"
      ]
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
          <div>
            <h2 className="text-xl text-[#1a1a1a]">Workflow Execution</h2>
            <p className="text-sm text-[#666666]">
              {isComplete ? "Completed" : `Step ${currentStepIndex + 1} of ${executionSteps.length}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#999999] hover:text-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Execution Steps */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4">
            {executionSteps.map((step, index) => (
              <div
                key={step.nodeId}
                className={`border rounded-lg p-4 transition-all ${
                  step.status === "success"
                    ? "border-[#10b981] bg-[#ecfdf5]"
                    : step.status === "running" || step.status === "validating"
                    ? "border-[#0466C8] bg-[#eff6ff]"
                    : step.status === "error"
                    ? "border-[#ef4444] bg-[#fef2f2]"
                    : "border-[#e5e7eb] bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {step.status === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    ) : step.status === "running" || step.status === "validating" ? (
                      <Loader2 className="w-5 h-5 text-[#0466C8] animate-spin" />
                    ) : step.status === "error" ? (
                      <AlertCircle className="w-5 h-5 text-[#ef4444]" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#e5e7eb]" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm text-[#1a1a1a]">{step.label}</h3>
                      {step.duration && (
                        <span className="text-xs text-[#999999]">{step.duration}ms</span>
                      )}
                    </div>

                    {/* Validation Messages */}
                    {step.validationMessages.length > 0 && (
                      <div className="space-y-1 mb-3">
                        {step.validationMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-[#10b981] flex items-center gap-2"
                          >
                            <span>{msg}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Output Preview */}
                    {step.outputPreview && (
                      <div className="mt-2 p-3 bg-white/50 rounded border border-[#10b981]/20">
                        <p className="text-xs text-[#666666]">{step.outputPreview}</p>
                      </div>
                    )}

                    {/* Status Text */}
                    {step.status === "running" && (
                      <p className="text-xs text-[#0466C8]">Processing...</p>
                    )}
                    {step.status === "validating" && (
                      <p className="text-xs text-[#0466C8]">Validating data...</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final Output */}
          {isComplete && finalOutput && (
            <div className="mt-6 border-2 border-[#0466C8] rounded-xl p-6 bg-gradient-to-br from-[#eff6ff] to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0466C8] rounded-lg flex items-center justify-center">
                  <FileBarChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-[#1a1a1a]">Workflow Complete</h3>
                  <p className="text-sm text-[#666666]">{finalOutput.summary}</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {Object.entries(finalOutput.metrics).map(([key, value]) => (
                  <div key={key} className="bg-white rounded-lg p-3 border border-[#e5e7eb]">
                    <div className="text-xs text-[#999999] mb-1">{key}</div>
                    <div className="text-lg text-[#1a1a1a]">{value as string}</div>
                  </div>
                ))}
              </div>

              {/* Key Insights */}
              <div className="mb-6">
                <h4 className="text-sm text-[#1a1a1a] mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#0466C8]" />
                  Key Insights
                </h4>
                <div className="space-y-2">
                  {finalOutput.insights.map((insight: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-[#10b981] mt-0.5">✓</span>
                      <span className="text-[#333333]">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="text-sm text-[#1a1a1a] mb-3">Recommended Next Steps</h4>
                <div className="space-y-2">
                  {finalOutput.nextSteps.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-[#666666]">
                      <span className="text-[#0466C8]">{idx + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button className="flex-1 px-4 py-2 bg-[#0466C8] text-white rounded-lg hover:bg-[#0353A4] transition-colors">
                  View Full Report
                </button>
                <button className="flex-1 px-4 py-2 border border-[#e5e7eb] text-[#333333] rounded-lg hover:bg-[#f8f9fa] transition-colors">
                  Export Results
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e5e7eb] flex justify-between items-center">
          <div className="text-sm text-[#666666]">
            {isComplete ? (
              <span className="text-[#10b981]">✓ All steps completed successfully</span>
            ) : (
              <span>Executing workflow...</span>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={!isComplete}
            className="px-4 py-2 bg-[#0466C8] text-white rounded-lg hover:bg-[#0353A4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isComplete ? "Done" : "Running..."}
          </button>
        </div>
      </div>
    </div>
  );
}
