import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface WorkflowStatusProps {
  stage: string;
  status: "completed" | "in-progress" | "pending";
  description?: string;
}

export function WorkflowStatus({ stage, status, description }: WorkflowStatusProps) {
  const getIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in-progress":
        return <Loader2 className="w-5 h-5 text-[#472be9] animate-spin" />;
      case "pending":
        return <Circle className="w-5 h-5 text-[#ebebeb]" />;
    }
  };

  const getBgColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "in-progress":
        return "bg-blue-50 border-[#472be9]";
      case "pending":
        return "bg-gray-50 border-[#ebebeb]";
    }
  };

  const getTextColor = () => {
    switch (status) {
      case "completed":
        return "text-green-800";
      case "in-progress":
        return "text-[#472be9]";
      case "pending":
        return "text-[#999999]";
    }
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${getBgColor()}`}>
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <div className={`text-sm ${getTextColor()}`}>{stage}</div>
        {description && <div className="text-xs text-[#666666] mt-0.5">{description}</div>}
      </div>
    </div>
  );
}
