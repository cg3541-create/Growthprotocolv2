import { useState, useRef, useEffect } from "react";
import { WorkflowNode, NodeData } from "./WorkflowNode";
import { Plus, Play, Save, Download, Upload, Globe, FileText, FileUp, Database, Filter, CheckCircle2, Repeat, Merge, TrendingUp, Scale, Lightbulb, MessageCircle, FileBarChart, BarChart3, Bell, ZoomIn, ZoomOut, Maximize2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { WorkflowOnboarding } from "./WorkflowOnboarding";
import { AIWorkflowGenerator } from "./AIWorkflowGenerator";
import { WorkflowExecution } from "./WorkflowExecution";

const iconMap: Record<string, any> = {
  Globe, FileText, FileUp, Database, Filter, CheckCircle2, Repeat, Merge, 
  TrendingUp, Scale, Lightbulb, MessageCircle, FileBarChart, BarChart3, Download, Bell
};

interface Connection {
  from: string;
  to: string;
}

const actionCategories = [
  {
    category: "Data Collection",
    actions: [
      { id: "web-scraping", label: "Web Scraping", color: "#2563eb", icon: "Globe" },
      { id: "api-import", label: "API Import", color: "#2563eb", icon: "FileText" },
      { id: "file-upload", label: "File Upload", color: "#2563eb", icon: "FileUp" },
      { id: "database-query", label: "Database Query", color: "#2563eb", icon: "Database" },
    ]
  },
  {
    category: "Data Processing",
    actions: [
      { id: "clean-data", label: "Clean Data", color: "#3b82f6", icon: "Filter" },
      { id: "validate", label: "Validate", color: "#3b82f6", icon: "CheckCircle2" },
      { id: "transform", label: "Transform", color: "#3b82f6", icon: "Repeat" },
      { id: "merge", label: "Merge Data", color: "#3b82f6", icon: "Merge" },
    ]
  },
  {
    category: "Analysis",
    actions: [
      { id: "analyze-market", label: "Analyze Market", color: "#0466C8", icon: "TrendingUp" },
      { id: "compare", label: "Compare Competitors", color: "#0466C8", icon: "Scale" },
      { id: "extract-insights", label: "Extract Insights", color: "#0466C8", icon: "Lightbulb" },
      { id: "sentiment", label: "Sentiment Analysis", color: "#0466C8", icon: "MessageCircle" },
    ]
  },
  {
    category: "Output",
    actions: [
      { id: "generate-report", label: "Generate Report", color: "#0353A4", icon: "FileBarChart" },
      { id: "visualize", label: "Visualize Data", color: "#0353A4", icon: "BarChart3" },
      { id: "export", label: "Export Data", color: "#0353A4", icon: "Download" },
      { id: "notify", label: "Send Notification", color: "#0353A4", icon: "Bell" },
    ]
  },
];

export function WorkflowCanvas() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tempConnection, setTempConnection] = useState<{ x: number; y: number } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showExecution, setShowExecution] = useState(false);
  
  // Zoom and Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Keyboard event listeners for space bar panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spacePressed) {
        e.preventDefault();
        setSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [spacePressed]);

  const addNode = (action: { id: string; label: string; color: string; icon: string }) => {
    const newNode: NodeData = {
      id: `node-${Date.now()}`,
      label: action.label,
      color: action.color,
      icon: action.icon,
      x: 300 + Math.random() * 200,
      y: 150 + Math.random() * 200,
    };
    setNodes([...nodes, newNode]);
  };

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, x, y } : node
    ));
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
    setConnections(connections.filter(conn => conn.from !== id && conn.to !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const updateNodeConfiguration = (id: string, configuration: any) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, configuration, isConfigured: true } : node
    ));
  };

  const startConnection = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectingFrom(nodeId);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setTempConnection({ x, y });
    }
  };

  const completeConnection = (toNodeId: string) => {
    if (connectingFrom && connectingFrom !== toNodeId) {
      // Check if connection already exists
      const alreadyConnected = connections.some(
        conn => conn.from === connectingFrom && conn.to === toNodeId
      );
      
      if (!alreadyConnected) {
        const newConnection: Connection = {
          from: connectingFrom,
          to: toNodeId,
        };
        setConnections([...connections, newConnection]);
      }
    }
    setConnectingFrom(null);
    setTempConnection(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    // Handle panning
    if (isPanning) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      setPan(prevPan => ({
        x: prevPan.x + deltaX,
        y: prevPan.y + deltaY,
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    // Handle connection drawing
    if (connectingFrom && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setTempConnection({ x, y });
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Check if clicking on canvas background (not a node or button)
    const target = e.target as HTMLElement;
    const clickedOnNode = target.closest('[data-node-id]');
    const clickedOnButton = target.closest('button');
    const clickedOnInput = target.closest('input, textarea, select');
    const isCanvasBackground = target === canvasRef.current || (!clickedOnNode && !clickedOnButton && !clickedOnInput);
    
    // Enable panning when clicking on background (left click, middle click, or space + click)
    if (isCanvasBackground && (e.button === 0 || e.button === 1 || spacePressed)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    setIsPanning(false);

    if (connectingFrom) {
      // Check if we're over a node
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const nodeElement = element?.closest('[data-node-id]');
      
      if (nodeElement) {
        const nodeId = nodeElement.getAttribute('data-node-id');
        if (nodeId && nodeId !== connectingFrom) {
          completeConnection(nodeId);
          return;
        }
      }
      
      // If not over a valid target, cancel the connection
      setConnectingFrom(null);
      setTempConnection(null);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (connectingFrom) {
      setConnectingFrom(null);
      setTempConnection(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(zoom * delta, 0.25), 2);
      setZoom(newZoom);
    }
  };

  const zoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 2));
  };

  const zoomOut = () => {
    setZoom(Math.max(zoom * 0.8, 0.25));
  };

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getConnectionCoordinates = (conn: Connection) => {
    const fromNode = nodes.find(n => n.id === conn.from);
    const toNode = nodes.find(n => n.id === conn.to);
    
    if (fromNode && toNode) {
      return {
        fromX: fromNode.x + 200, // Right side of source node
        fromY: fromNode.y + 35,  // Middle height
        toX: toNode.x,           // Left side of target node
        toY: toNode.y + 35,      // Middle height
      };
    }
    return null;
  };

  const runWorkflow = () => {
    setShowExecution(true);
  };

  const saveWorkflow = () => {
    console.log("Saving workflow...");
  };

  const handleTemplateSelect = (template: any) => {
    // Create nodes from template
    const newNodes: NodeData[] = template.nodes.map((node: any) => ({
      id: `${node.id}-${Date.now()}`,
      label: node.label,
      color: node.color,
      icon: node.icon,
      x: node.x,
      y: node.y,
    }));
    
    // Create connections from template
    const nodeIdMap: Record<string, string> = {};
    template.nodes.forEach((node: any, index: number) => {
      nodeIdMap[node.id] = newNodes[index].id;
    });
    
    const newConnections: Connection[] = template.connections.map((conn: any) => ({
      from: nodeIdMap[conn.from],
      to: nodeIdMap[conn.to],
    }));
    
    setNodes(newNodes);
    setConnections(newConnections);
    setShowOnboarding(false);
  };

  const handleAIGeneratedWorkflow = (generatedNodes: NodeData[], generatedConnections: Array<{ from: string; to: string }>) => {
    // Map node types to actions to get proper icons
    const actionMap = actionCategories.reduce((acc, category) => {
      category.actions.forEach(action => {
        acc[action.id] = action;
      });
      return acc;
    }, {} as Record<string, any>);

    // Create nodes with proper configuration
    const newNodes: NodeData[] = generatedNodes.map((node) => {
      const action = actionMap[node.type];
      return {
        id: node.id,
        label: node.label,
        color: node.color,
        icon: action?.icon || 'FileText',
        x: node.position.x,
        y: node.position.y,
        configured: node.configured,
      };
    });
    
    setNodes(newNodes);
    setConnections(generatedConnections);
  };

  return (
    <div className="h-full flex bg-white">
      {/* AI Workflow Generator Panel (conditionally shown) */}
      {showAIGenerator && (
        <AIWorkflowGenerator 
          onGenerateWorkflow={handleAIGeneratedWorkflow}
          onClose={() => setShowAIGenerator(false)}
        />
      )}

      {/* Action Palette Sidebar */}
      {!showAIGenerator && (
        <div className="w-64 border-r border-[#e5e7eb] bg-white p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg text-[#1a1a1a] mb-1">Workflow Actions</h3>
            <p className="text-xs text-[#666666]">
              Click to add to canvas
            </p>
          </div>
        
        <div className="space-y-6">
          {actionCategories.map((category) => (
            <div key={category.category}>
              <h4 className="text-sm text-[#333333] mb-2">{category.category}</h4>
              <div className="space-y-1">
                {category.actions.map((action) => {
                  const IconComponent = iconMap[action.icon];
                  return (
                    <button
                      key={action.id}
                      onClick={() => addNode(action)}
                      className="w-full flex items-center gap-3 p-2.5 bg-white border border-[#e5e7eb] rounded-md hover:bg-[#f8f9fa] hover:border-[#2563eb] transition-all text-left group"
                    >
                      <div 
                        className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: action.color }}
                      >
                        {IconComponent && <IconComponent className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-sm text-[#333333]">
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-[#e5e7eb] px-6 py-4 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl text-[#1a1a1a]">Workflow Builder</h2>
            <p className="text-sm text-[#9ca3af]">
              {nodes.length} {nodes.length === 1 ? 'action' : 'actions'} • {connections.length} {connections.length === 1 ? 'connection' : 'connections'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAIGenerator(!showAIGenerator)}
              variant="outline"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showAIGenerator 
                  ? 'bg-[#0466C8] text-white border-[#0466C8] hover:bg-[#0353A4]' 
                  : 'border-[#e5e7eb] hover:border-[#0466C8] text-[#333333]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Generator
            </Button>
            <Button
              onClick={runWorkflow}
              disabled={nodes.length === 0}
              className="flex items-center gap-2 bg-[#0466C8] hover:bg-[#0353a4] text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              Run Workflow
            </Button>
            <Button
              onClick={saveWorkflow}
              disabled={nodes.length === 0}
              variant="outline"
              className="flex items-center gap-2 border-[#e5e7eb] hover:border-[#0466C8] text-[#333333] px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className={`flex-1 relative overflow-hidden bg-[#fafafa] ${isPanning || spacePressed ? 'cursor-grab' : ''} ${isPanning ? 'cursor-grabbing' : ''}`}
          style={{
            backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          onClick={handleCanvasClick}
          onWheel={handleWheel}
        >
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-md border border-[#e5e7eb] p-2 z-50">
            <button
              onClick={zoomIn}
              className="p-2 hover:bg-[#f8f9fa] rounded transition-colors"
              title="Zoom In (Ctrl + Scroll)"
            >
              <ZoomIn className="w-4 h-4 text-[#666666]" />
            </button>
            <button
              onClick={resetZoom}
              className="p-2 hover:bg-[#f8f9fa] rounded transition-colors"
              title="Reset Zoom"
            >
              <Maximize2 className="w-4 h-4 text-[#666666]" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 hover:bg-[#f8f9fa] rounded transition-colors"
              title="Zoom Out (Ctrl + Scroll)"
            >
              <ZoomOut className="w-4 h-4 text-[#666666]" />
            </button>
            <div className="text-xs text-center text-[#666666] pt-1 border-t border-[#e5e7eb]">
              {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Pan Instructions */}
          {nodes.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md border border-[#e5e7eb] px-3 py-2 text-xs text-[#666666] z-50">
              Click & drag canvas to pan • <kbd className="px-1.5 py-0.5 bg-[#f8f9fa] border border-[#e5e7eb] rounded text-[#333333]">Ctrl + Scroll</kbd> to zoom
            </div>
          )}

          {/* Empty State - Fixed to viewport */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
              <div className="text-center">
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#e5e7eb] hover:border-[#0466C8] hover:shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-10 h-10 text-[#999999]" />
                </button>
                <h3 className="text-xl text-[#1a1a1a] mb-3">Start Building Your Workflow</h3>
                <p className="text-sm text-[#666666] max-w-lg px-4 mb-4">
                  Click the plus icon to choose from pre-built templates or build from scratch
                </p>
                <Button
                  onClick={() => setShowOnboarding(true)}
                  className="bg-[#0466C8] hover:bg-[#0353a4] text-white px-6 py-2 rounded-lg"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}

          {/* Transformed container for SVG and Nodes */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            {/* SVG for connections */}
            <svg 
              className="absolute inset-0 pointer-events-none"
              style={{ 
                width: '5000px', 
                height: '5000px',
                zIndex: 1 
              }}
            >
              {/* Existing connections */}
              {connections.map((conn, index) => {
                const coords = getConnectionCoordinates(conn);
                if (!coords) return null;
                
                const midX = (coords.fromX + coords.toX) / 2;
                return (
                  <g key={index}>
                    <path
                      d={`M ${coords.fromX} ${coords.fromY} Q ${midX} ${coords.fromY}, ${midX} ${(coords.fromY + coords.toY) / 2} T ${coords.toX} ${coords.toY}`}
                      stroke="#0466C8"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      markerEnd="url(#arrowhead)"
                    />
                    <circle
                      cx={coords.fromX}
                      cy={coords.fromY}
                      r="4"
                      fill="#0466C8"
                    />
                  </g>
                );
              })}
              
              {/* Temporary connection line while dragging */}
              {connectingFrom && tempConnection && (() => {
                const fromNode = nodes.find(n => n.id === connectingFrom);
                if (fromNode) {
                  const fromX = fromNode.x + 200;
                  const fromY = fromNode.y + 35;
                  const midX = (fromX + tempConnection.x) / 2;
                  return (
                    <g>
                      <path
                        d={`M ${fromX} ${fromY} Q ${midX} ${fromY}, ${midX} ${(fromY + tempConnection.y) / 2} T ${tempConnection.x} ${tempConnection.y}`}
                        stroke="#472be9"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        opacity="0.7"
                      />
                      <circle
                        cx={fromX}
                        cy={fromY}
                        r="4"
                        fill="#472be9"
                      />
                      <circle
                        cx={tempConnection.x}
                        cy={tempConnection.y}
                        r="6"
                        fill="#472be9"
                        opacity="0.5"
                      />
                    </g>
                  );
                }
              })()}
              
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#0466C8" />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            <div className="relative" style={{ width: '5000px', height: '5000px', zIndex: 2 }}>
              {nodes.map((node) => (
                <WorkflowNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode === node.id}
                  isConnecting={connectingFrom === node.id}
                  onSelect={() => setSelectedNode(node.id)}
                  onDelete={() => deleteNode(node.id)}
                  onUpdatePosition={(x, y) => updateNodePosition(node.id, x, y)}
                  onStartConnection={(e) => startConnection(node.id, e)}
                  onCompleteConnection={() => completeConnection(node.id)}
                  isConnectionTarget={connectingFrom !== null && connectingFrom !== node.id}
                  onUpdateConfiguration={(config) => updateNodeConfiguration(node.id, config)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <WorkflowOnboarding
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {/* Workflow Execution Modal */}
      {showExecution && (
        <WorkflowExecution
          nodes={nodes}
          connections={connections}
          onClose={() => setShowExecution(false)}
        />
      )}
    </div>
  );
}
