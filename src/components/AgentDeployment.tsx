import { useState } from "react";
import { motion } from "motion/react";
import { Rocket, CheckCircle2, X, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { ActionPlan } from "./ActionPlan";
import { UpgradeModal } from "./UpgradeModal";

interface AgentDeploymentProps {
  plan: ActionPlan;
  userPlan?: 'basic' | 'premium'; // User's current plan
}

export function AgentDeployment({ plan, userPlan = 'basic' }: AgentDeploymentProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleDeploy = () => {
    if (userPlan === 'basic') {
      setShowUpgradeModal(true);
    } else {
      // Premium users can deploy
      console.log('Deploying agents with plan:', plan);
      // TODO: Implement actual deployment logic
      alert('Agent deployment would start here for premium users');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-gradient-to-br from-[#0466C8] to-[#0353a4] rounded-lg p-6 text-white"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Rocket className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Ready to Deploy Agents</h3>
              <p className="text-sm text-blue-100">
                {plan.actions.length} action{plan.actions.length !== 1 ? 's' : ''} ready for execution
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <div className="text-sm font-medium mb-2">Execution Summary</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-blue-100">Total Actions</span>
              <span className="font-semibold">{plan.actions.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-100">Workflow Steps</span>
              <span className="font-semibold">{plan.workflow.steps.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-100">High Priority</span>
              <span className="font-semibold">
                {plan.actions.filter(a => a.priority === 'high').length}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleDeploy}
          className="w-full bg-white text-[#0466C8] hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors"
        >
          <Rocket className="w-4 h-4 mr-2" />
          Deploy Agents
        </Button>

        {userPlan === 'basic' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-blue-100">
            <AlertCircle className="w-3 h-3" />
            <span>Upgrade to Premium to deploy agents automatically</span>
          </div>
        )}
      </motion.div>

      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
}

