import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Clock, AlertCircle, Loader2, FileText, ArrowRight, Rocket } from "lucide-react";
import { Button } from "./ui/button";
import { UpgradeModal } from "./UpgradeModal";

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  agent: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
}

export interface WorkflowStep {
  agent: string;
  action: string;
  dependencies: string[];
}

export interface ActionPlan {
  summary: string;
  actions: ActionItem[];
  workflow: {
    steps: WorkflowStep[];
  };
}

interface ActionPlanProps {
  answer: string;
  onPlanGenerated?: (plan: ActionPlan) => void;
}

export function ActionPlan({ answer, onPlanGenerated }: ActionPlanProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const generateActionPlan = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/generate-action-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: answer
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate action plan');
      }

      const data = await response.json();
      setPlan(data.plan);
      setShowPlan(true);
      if (onPlanGenerated) {
        onPlanGenerated(data.plan);
      }
    } catch (error) {
      console.error('Error generating action plan:', error);
      // Fallback: create a mock plan
      const mockPlan: ActionPlan = {
        summary: "Based on the analysis, here are the recommended action items to address the findings.",
        actions: [
          {
            id: '1',
            title: 'Review Competitor Fabric Innovations',
            description: 'Analyze competitor fabric technologies and identify opportunities for improvement.',
            agent: 'Research Agent',
            priority: 'high',
            estimatedTime: '2-3 hours'
          },
          {
            id: '2',
            title: 'Develop Response Strategy',
            description: 'Create a strategic plan to respond to competitor innovations.',
            agent: 'Strategy Agent',
            priority: 'high',
            estimatedTime: '4-6 hours'
          }
        ],
        workflow: {
          steps: [
            {
              agent: 'Research Agent',
              action: 'Gather competitor data',
              dependencies: []
            },
            {
              agent: 'Strategy Agent',
              action: 'Develop response plan',
              dependencies: ['Research Agent']
            }
          ]
        }
      };
      setPlan(mockPlan);
      setShowPlan(true);
      if (onPlanGenerated) {
        onPlanGenerated(mockPlan);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!showPlan && !isGenerating) {
    return (
      <div className="mt-6">
        <Button
          onClick={generateActionPlan}
          className="flex items-center gap-2 bg-[#0466C8] hover:bg-[#0353a4] text-white px-6 py-2 rounded-lg transition-colors"
        >
          <FileText className="w-4 h-4" />
          Generate Action Plan
        </Button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="mt-6 bg-[#f9f9f9] border border-[#ebebeb] rounded-lg p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-[#0466C8] animate-spin" />
          <div>
            <div className="text-sm font-medium text-[#333333]">Generating Action Plan...</div>
            <div className="text-xs text-[#666666]">Analyzing answer and creating structured action items</div>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDeployAgent = (agentName: string) => {
    setSelectedAgent(agentName);
    setShowUpgradeModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      <div className="bg-white border border-[#ebebeb] rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <FileText className="w-6 h-6 text-[#0466C8] mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Action Plan</h3>
            <p className="text-sm text-[#666666]">{plan.summary}</p>
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-[#333333] mb-3">Action Items</h4>
          {plan.actions.map((action) => (
            <div
              key={action.id}
              className="border border-[#e5e7eb] rounded-lg p-4 hover:border-[#0466C8] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    <h5 className="text-sm font-medium text-[#333333]">{action.title}</h5>
                  </div>
                  <p className="text-xs text-[#666666] mb-2">{action.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#666666]">Agent: <span className="text-[#0466C8] font-medium">{action.agent}</span></span>
                    <span className="text-[#999999]">•</span>
                    <span className="flex items-center gap-1 text-[#666666]">
                      <Clock className="w-3 h-3" />
                      {action.estimatedTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(action.priority)}`}>
                    {action.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow */}
        {plan.workflow.steps.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-[#333333] mb-3">Execution Workflow</h4>
            <div className="space-y-2">
              {plan.workflow.steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-xs bg-[#f9f9f9] border border-[#e5e7eb] rounded-lg p-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0466C8] text-white flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-[#333333] font-medium">{step.agent}</div>
                    <div className="text-[#666666]">{step.action}</div>
                    {step.dependencies.length > 0 && (
                      <div className="text-[#999999] mt-1">
                        Depends on: {step.dependencies.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleDeployAgent(step.agent)}
                      className="flex items-center gap-2 bg-[#0466C8] hover:bg-[#0353a4] text-white px-3 py-1.5 rounded-lg transition-colors text-xs"
                    >
                      <Rocket className="w-3 h-3" />
                      Deploy Agent
                    </Button>
                    <ArrowRight className="w-4 h-4 text-[#999999]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => {
            setShowUpgradeModal(false);
            setSelectedAgent(null);
          }}
        />
      )}
    </motion.div>
  );
}

