import { Check } from "lucide-react";

interface WorkflowStep {
  id: number;
  label: string;
  status: "completed" | "active" | "pending";
}

interface WorkflowStepperProps {
  currentStep: number;
}

export function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  const steps: WorkflowStep[] = [
    { id: 1, label: "Prompt", status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending" },
    { id: 2, label: "Research Method", status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "pending" },
    { id: 3, label: "Collect Data", status: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "pending" },
    { id: 4, label: "Clean & Validate", status: currentStep > 4 ? "completed" : currentStep === 4 ? "active" : "pending" },
    { id: 5, label: "Analyze", status: currentStep > 5 ? "completed" : currentStep === 5 ? "active" : "pending" },
    { id: 6, label: "Generate Visuals", status: currentStep > 6 ? "completed" : currentStep === 6 ? "active" : "pending" },
    { id: 7, label: "Review", status: currentStep > 7 ? "completed" : currentStep === 7 ? "active" : "pending" },
    { id: 8, label: "Deliver", status: currentStep > 8 ? "completed" : currentStep === 8 ? "active" : "pending" },
  ];

  return (
    <div className="bg-white border border-[#ebebeb] rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  step.status === "completed"
                    ? "bg-[#472be9] text-white"
                    : step.status === "active"
                    ? "bg-[#472be9] text-white ring-4 ring-[#472be9]/20"
                    : "bg-[#ebebeb] text-[#999999]"
                }`}
              >
                {step.status === "completed" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs">{step.id}</span>
                )}
              </div>
              {/* Step Label */}
              <span
                className={`text-xs mt-2 text-center whitespace-nowrap ${
                  step.status === "active"
                    ? "text-[#333333]"
                    : "text-[#999999]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-colors ${
                  steps[index + 1].status === "completed" || steps[index + 1].status === "active"
                    ? "bg-[#472be9]"
                    : "bg-[#ebebeb]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
