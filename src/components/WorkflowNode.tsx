import { useState, useRef, useEffect } from "react";
import { Link, Trash2, Move, Globe, FileText, FileUp, Database, Filter, CheckCircle2, Repeat, Merge, TrendingUp, Scale, Lightbulb, MessageCircle, FileBarChart, BarChart3, Download, Bell, Settings, Save, X, ChevronDown, ChevronUp } from "lucide-react";

const iconMap: Record<string, any> = {
  Globe, FileText, FileUp, Database, Filter, CheckCircle2, Repeat, Merge, 
  TrendingUp, Scale, Lightbulb, MessageCircle, FileBarChart, BarChart3, Download, Bell
};

export interface NodeConfiguration {
  [key: string]: any;
}

export interface NodeData {
  id: string;
  label: string;
  color: string;
  icon: string;
  x: number;
  y: number;
  configuration?: NodeConfiguration;
  isConfigured?: boolean;
}

interface WorkflowNodeProps {
  node: NodeData;
  isSelected: boolean;
  isConnecting: boolean;
  isConnectionTarget: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  onStartConnection: (e: React.MouseEvent) => void;
  onCompleteConnection: () => void;
  onUpdateConfiguration?: (config: NodeConfiguration) => void;
}

export function WorkflowNode({
  node,
  isSelected,
  isConnecting,
  isConnectionTarget,
  onSelect,
  onDelete,
  onUpdatePosition,
  onStartConnection,
  onCompleteConnection,
  onUpdateConfiguration,
}: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempConfig, setTempConfig] = useState<NodeConfiguration>(node.configuration || {});
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Check if clicking on connection handle or button
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.connection-handle') || target.closest('input') || target.closest('textarea') || target.closest('select')) {
      return;
    }
    
    // Don't allow dragging in connection mode
    if (isConnectionTarget) {
      return;
    }
    
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
    onSelect();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setHasMoved(true);
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onUpdatePosition(Math.max(0, newX), Math.max(0, newY));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleClick = (e: React.MouseEvent) => {
    // If we just dragged, don't trigger click
    if (hasMoved) {
      return;
    }
    
    // If this node is a connection target, complete the connection
    if (isConnectionTarget) {
      e.stopPropagation();
      onCompleteConnection();
    }
  };

  const handleSaveConfiguration = () => {
    if (onUpdateConfiguration) {
      onUpdateConfiguration(tempConfig);
    }
    setIsExpanded(false);
  };

  const handleCancelConfiguration = () => {
    setTempConfig(node.configuration || {});
    setIsExpanded(false);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const renderConfigurationForm = () => {
    const label = node.label.toLowerCase();

    // Web Scraping Configuration
    if (label.includes('scrape') || label.includes('web')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Target URL(s)</label>
            <textarea
              value={tempConfig.urls || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, urls: e.target.value })}
              placeholder="https://example.com (one per line)"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8] resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs text-[#666666] mb-1">CSS Selectors (Optional)</label>
            <input
              type="text"
              value={tempConfig.selectors || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, selectors: e.target.value })}
              placeholder=".content, #main-text"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            />
          </div>
        </div>
      );
    }

    // Import Data Configuration
    if (label.includes('import') || label.includes('upload')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Data Source</label>
            <select
              value={tempConfig.sourceType || 'file'}
              onChange={(e) => setTempConfig({ ...tempConfig, sourceType: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            >
              <option value="file">File Upload</option>
              <option value="database">Database</option>
              <option value="api">API</option>
            </select>
          </div>
          {tempConfig.sourceType === 'file' && (
            <div>
              <label className="block text-xs text-[#666666] mb-1">File Format</label>
              <select
                value={tempConfig.fileFormat || 'csv'}
                onChange={(e) => setTempConfig({ ...tempConfig, fileFormat: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="excel">Excel</option>
                <option value="xml">XML</option>
              </select>
            </div>
          )}
        </div>
      );
    }

    // Query Data Lake Configuration
    if (label.includes('query') || label.includes('data lake')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Query/Script</label>
            <textarea
              value={tempConfig.query || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, query: e.target.value })}
              placeholder="SELECT * FROM dataset WHERE..."
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8] font-mono resize-none"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-xs text-[#666666] mb-1">Dataset Name</label>
            <input
              type="text"
              value={tempConfig.dataset || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, dataset: e.target.value })}
              placeholder="competitors_data"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            />
          </div>
        </div>
      );
    }

    // Filter Data Configuration
    if (label.includes('filter')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Filter Condition</label>
            <input
              type="text"
              value={tempConfig.field || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, field: e.target.value })}
              placeholder="Field name"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8] mb-2"
            />
            <select
              value={tempConfig.operator || 'equals'}
              onChange={(e) => setTempConfig({ ...tempConfig, operator: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8] mb-2"
            >
              <option value="equals">Equals</option>
              <option value="contains">Contains</option>
              <option value="greater">Greater than</option>
              <option value="less">Less than</option>
              <option value="not_empty">Not empty</option>
            </select>
            <input
              type="text"
              value={tempConfig.value || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, value: e.target.value })}
              placeholder="Value"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            />
          </div>
        </div>
      );
    }

    // Transform/Validate Configuration
    if (label.includes('transform') || label.includes('validate')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Transformation Rules</label>
            <textarea
              value={tempConfig.rules || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, rules: e.target.value })}
              placeholder="Define transformation or validation rules..."
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8] resize-none"
              rows={4}
            />
          </div>
        </div>
      );
    }

    // Merge Configuration
    if (label.includes('merge')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Merge Strategy</label>
            <select
              value={tempConfig.strategy || 'inner'}
              onChange={(e) => setTempConfig({ ...tempConfig, strategy: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            >
              <option value="inner">Inner Join</option>
              <option value="left">Left Join</option>
              <option value="right">Right Join</option>
              <option value="outer">Outer Join</option>
              <option value="append">Append</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#666666] mb-1">Join Key</label>
            <input
              type="text"
              value={tempConfig.joinKey || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, joinKey: e.target.value })}
              placeholder="id, email, etc."
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            />
          </div>
        </div>
      );
    }

    // Analysis/Trends Configuration
    if (label.includes('analyze') || label.includes('trend')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Analysis Type</label>
            <select
              value={tempConfig.analysisType || 'trend'}
              onChange={(e) => setTempConfig({ ...tempConfig, analysisType: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            >
              <option value="trend">Trend Analysis</option>
              <option value="statistical">Statistical Analysis</option>
              <option value="comparative">Comparative Analysis</option>
              <option value="sentiment">Sentiment Analysis</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#666666] mb-1">Target Fields</label>
            <input
              type="text"
              value={tempConfig.targetFields || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, targetFields: e.target.value })}
              placeholder="revenue, growth_rate (comma separated)"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            />
          </div>
        </div>
      );
    }

    // Score/Rank Configuration
    if (label.includes('score') || label.includes('rank')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Scoring Criteria</label>
            <textarea
              value={tempConfig.criteria || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, criteria: e.target.value })}
              placeholder="Define scoring criteria (one per line)"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8] resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs text-[#666666] mb-1">Ranking Method</label>
            <select
              value={tempConfig.rankingMethod || 'weighted'}
              onChange={(e) => setTempConfig({ ...tempConfig, rankingMethod: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            >
              <option value="weighted">Weighted Average</option>
              <option value="simple">Simple Sum</option>
              <option value="percentile">Percentile Ranking</option>
            </select>
          </div>
        </div>
      );
    }

    // Insight Generation Configuration
    if (label.includes('insight') || label.includes('generate')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Insight Focus</label>
            <textarea
              value={tempConfig.focus || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, focus: e.target.value })}
              placeholder="What insights are you looking for?"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8] resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs text-[#666666] mb-1">AI Model</label>
            <select
              value={tempConfig.model || 'gpt-4'}
              onChange={(e) => setTempConfig({ ...tempConfig, model: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="claude">Claude</option>
              <option value="custom">Custom Model</option>
            </select>
          </div>
        </div>
      );
    }

    // Report/Visualize Configuration
    if (label.includes('report') || label.includes('visualize')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Report/Chart Type</label>
            <select
              value={tempConfig.type || 'bar'}
              onChange={(e) => setTempConfig({ ...tempConfig, type: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="table">Table</option>
              <option value="dashboard">Dashboard</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#666666] mb-1">Title</label>
            <input
              type="text"
              value={tempConfig.title || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, title: e.target.value })}
              placeholder="Report/Chart Title"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            />
          </div>
        </div>
      );
    }

    // Export Configuration
    if (label.includes('export')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Export Format</label>
            <select
              value={tempConfig.format || 'csv'}
              onChange={(e) => setTempConfig({ ...tempConfig, format: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="json">JSON</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#666666] mb-1">Destination</label>
            <input
              type="text"
              value={tempConfig.destination || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, destination: e.target.value })}
              placeholder="File path or email"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            />
          </div>
        </div>
      );
    }

    // Alert Configuration
    if (label.includes('alert')) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#666666] mb-1">Alert Condition</label>
            <textarea
              value={tempConfig.condition || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, condition: e.target.value })}
              placeholder="When should this alert trigger?"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8] resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs text-[#666666] mb-1">Recipients</label>
            <input
              type="text"
              value={tempConfig.recipients || ''}
              onChange={(e) => setTempConfig({ ...tempConfig, recipients: e.target.value })}
              placeholder="email@example.com (comma separated)"
              className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8]"
            />
          </div>
        </div>
      );
    }

    // Generic Configuration for other nodes
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-[#666666] mb-1">Configuration</label>
          <textarea
            value={tempConfig.notes || ''}
            onChange={(e) => setTempConfig({ ...tempConfig, notes: e.target.value })}
            placeholder="Add configuration notes or parameters..."
            className="w-full px-2 py-1.5 text-xs border border-[#e5e7eb] rounded focus:outline-none focus:border-[#0466C8] resize-none"
            rows={4}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={nodeRef}
      data-node-id={node.id}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={`absolute group ${
        isDragging 
          ? 'cursor-grabbing' 
          : isConnectionTarget 
          ? 'cursor-pointer' 
          : 'cursor-grab'
      }`}
      style={{
        left: node.x,
        top: node.y,
        width: isExpanded ? '320px' : '200px',
        zIndex: isExpanded ? 50 : 1,
      }}
    >
      <div
        className={`bg-white border-2 rounded-lg shadow-md transition-all ${
          isSelected
            ? 'border-[#0466C8] shadow-lg'
            : isConnecting
            ? 'border-[#472be9] shadow-lg'
            : isConnectionTarget
            ? 'border-green-500 shadow-lg animate-pulse cursor-pointer'
            : 'border-[#e5e7eb] hover:border-[#0466C8] hover:shadow-lg'
        }`}
      >
        {/* Node Header */}
        <div
          className="px-4 py-3 rounded-t-lg flex items-center gap-2"
          style={{ backgroundColor: node.color }}
        >
          {(() => {
            const IconComponent = iconMap[node.icon];
            return IconComponent ? (
              <IconComponent className="w-4 h-4 text-white" />
            ) : (
              <span className="text-xl">{node.icon}</span>
            );
          })()}
          <span className="text-sm text-white flex-1">{node.label}</span>
          {node.isConfigured && (
            <CheckCircle2 className="w-4 h-4 text-white" />
          )}
          <Move className="w-4 h-4 text-white/70" />
        </div>

        {/* Node Body */}
        <div className="px-4 py-3 bg-white">
          <div className="flex items-center justify-between gap-2 mb-2">
            <button
              onClick={handleToggleExpand}
              className="flex items-center gap-1 px-2 py-1 text-xs text-[#0466C8] hover:bg-[#f0f7ff] rounded transition-colors"
            >
              <Settings className="w-3 h-3" />
              <span>Configure</span>
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 text-[#999999] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Configuration Panel */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[#e5e7eb]">
              {renderConfigurationForm()}
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={handleSaveConfiguration}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#0466C8] text-white text-xs rounded hover:bg-[#0353A4] transition-colors"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
                <button
                  onClick={handleCancelConfiguration}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-[#e5e7eb] text-[#666666] text-xs rounded hover:bg-[#f8f9fa] transition-colors"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Connection Point Indicators - Input (Left) */}
        <div 
          className={`connection-handle absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all ${
            isConnectionTarget 
              ? 'bg-green-500 scale-150 cursor-pointer z-10' 
              : 'bg-[#7D8597] hover:bg-[#0466C8] hover:scale-125'
          }`}
          onClick={(e) => {
            if (isConnectionTarget) {
              e.stopPropagation();
              onCompleteConnection();
            }
          }}
          title="Input"
        />
        
        {/* Connection Point Indicators - Output (Right) */}
        <div 
          className="connection-handle absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-[#0466C8] rounded-full border-2 border-white shadow-md hover:bg-[#023E7D] hover:scale-125 cursor-pointer transition-all z-10"
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConnection(e);
          }}
          title="Drag to connect"
        />
      </div>

      {/* Connection Target Indicator */}
      {isConnectionTarget && (
        <div className="absolute inset-0 -m-2 border-2 border-green-500 rounded-lg pointer-events-none animate-pulse">
          <div className="absolute inset-0 bg-green-500/10 rounded-lg" />
        </div>
      )}
      
      {/* Connecting Indicator */}
      {isConnecting && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#472be9] text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg z-20">
          Drag to another node to connect
        </div>
      )}
    </div>
  );
}
