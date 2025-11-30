import { useState } from "react";
import { Save, MessageSquare, Trash2, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export interface WorkflowAction {
  id: string;
  prompt: string;
  timestamp: Date;
  isRepeatable: boolean;
}

interface WorkflowBuilderProps {
  actions: WorkflowAction[];
  onSaveWorkflow?: (name: string, actions: WorkflowAction[]) => void;
  onClearWorkflow?: () => void;
}

export function WorkflowBuilder({ actions, onSaveWorkflow, onClearWorkflow }: WorkflowBuilderProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [workflowName, setWorkflowName] = useState("");

  const handleSave = () => {
    if (workflowName.trim() && onSaveWorkflow) {
      onSaveWorkflow(workflowName, actions);
      setWorkflowName("");
      setIsSaving(false);
    }
  };

  if (actions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 bg-[#f9f9f9] rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-[#999999]" />
        </div>
        <h3 className="text-[#333333] mb-2">No Workflow Yet</h3>
        <p className="text-sm text-[#666666] max-w-xs">
          Start a conversation and your prompts will be recorded here as workflow actions. 
          You can save them as a reusable workflow when you're done.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[#333333] mb-1">Building Workflow</h3>
          <p className="text-xs text-[#666666]">
            {actions.length} action{actions.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        {actions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearWorkflow}
            className="text-[#999999] hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Actions List */}
      <div className="space-y-2">
        {actions.map((action, index) => (
          <div
            key={action.id}
            className="bg-white border border-[#ebebeb] rounded-lg p-3 hover:border-[#472be9] transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-[#472be9] text-white flex items-center justify-center text-xs">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#666666]" />
                  <span className="text-xs text-[#999999]">
                    {new Date(action.timestamp).toLocaleTimeString()}
                  </span>
                  {action.isRepeatable && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Repeatable
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#333333] break-words">{action.prompt}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#cccccc] flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Save Workflow Section */}
      {!isSaving ? (
        <Button
          onClick={() => setIsSaving(true)}
          className="w-full bg-[#472be9] hover:bg-[#3a22ba] text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Save as New Workflow
        </Button>
      ) : (
        <div className="bg-[#f9f9f9] border border-[#ebebeb] rounded-lg p-4 space-y-3">
          <div>
            <label className="text-sm text-[#333333] mb-2 block">Workflow Name</label>
            <Input
              type="text"
              placeholder="e.g., Market Research Analysis"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={!workflowName.trim()}
              className="flex-1 bg-[#472be9] hover:bg-[#3a22ba] text-white"
            >
              Save Workflow
            </Button>
            <Button
              onClick={() => {
                setIsSaving(false);
                setWorkflowName("");
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
