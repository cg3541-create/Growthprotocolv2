import workflowImage from "figma:asset/c028fd13e699298266e421503b0285e6bce4ab91.png";

export function WorkflowDiagram() {
  return (
    <div className="bg-white rounded-lg border border-[#ebebeb] p-4">
      <div className="mb-3">
        <h3 className="text-sm text-[#333333] mb-1">Research Workflow</h3>
        <p className="text-xs text-[#666666]">Our neurosymbolic AI research process</p>
      </div>
      
      <div className="overflow-auto max-h-96">
        <img 
          src={workflowImage} 
          alt="Research Workflow Diagram" 
          className="w-full h-auto rounded-lg"
        />
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="text-xs text-[#666666]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-green-200 border border-green-300"></div>
            <span>Decision Points</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-yellow-200 border border-yellow-300"></div>
            <span>Processing Steps</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-pink-200 border border-pink-300"></div>
            <span>Analysis Stage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-200 border border-blue-300"></div>
            <span>Data Collection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
