import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface Stage {
  id: string;
  name: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

export function WorkflowProgress() {
  const stages: Stage[] = [
    {
      id: "prompt",
      name: "Define Prompt",
      description: "Goals, parameters, subject matter",
      status: "completed",
    },
    {
      id: "method",
      name: "Choose Method",
      description: "Research papers, data, or web scraping",
      status: "completed",
    },
    {
      id: "collect",
      name: "Collect Data",
      description: "Gather from selected sources",
      status: "current",
    },
    {
      id: "clean",
      name: "Clean & Validate",
      description: "Process and verify data quality",
      status: "upcoming",
    },
    {
      id: "analyze",
      name: "Analyze Insights",
      description: "Show reasoning and findings",
      status: "upcoming",
    },
    {
      id: "visualize",
      name: "Generate Visuals",
      description: "Charts and key findings",
      status: "upcoming",
    },
    {
      id: "review",
      name: "Client Review",
      description: "Approve or request changes",
      status: "upcoming",
    },
    {
      id: "deliver",
      name: "Deliver Final",
      description: "Export report and archive",
      status: "upcoming",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#ebebeb] p-5">
      <div className="mb-4">
        <h3 className="text-[#333333] mb-1">Analysis Progress</h3>
        <p className="text-xs text-[#666666]">Track your research workflow stages</p>
      </div>

      <div className="space-y-3">
        {stages.map((stage, index) => {
          const isCompleted = stage.status === "completed";
          const isCurrent = stage.status === "current";
          const isUpcoming = stage.status === "upcoming";

          return (
            <div key={stage.id}>
              <div
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  isCurrent
                    ? "bg-[#472be9]/5 border-2 border-[#472be9]"
                    : isCompleted
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-[#ebebeb]"
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-[#472be9] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-[#cccccc]" />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={`text-sm mb-0.5 ${
                      isCurrent
                        ? "text-[#472be9]"
                        : isCompleted
                        ? "text-green-700"
                        : "text-[#999999]"
                    }`}
                  >
                    {stage.name}
                  </div>
                  <div className="text-xs text-[#666666]">{stage.description}</div>
                </div>
              </div>

              {/* Connector Arrow */}
              {index < stages.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight
                    className={`w-4 h-4 ${
                      isCompleted || isCurrent ? "text-[#472be9]" : "text-[#ebebeb]"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
