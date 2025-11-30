import { useState } from "react";
import { Database, Table, Link2, ChevronRight, Search, Filter, Download, Maximize2, ZoomIn, ZoomOut } from "lucide-react";

interface OntologyNode {
  id: string;
  name: string;
  type: 'entity' | 'attribute' | 'relationship';
  category: string;
  description: string;
  connections: string[];
  fields?: string[];
}

const ontologyData: OntologyNode[] = [
  {
    id: "company",
    name: "Company",
    type: "entity",
    category: "Core Entities",
    description: "Company information and profiles",
    connections: ["product", "market", "financials"],
    fields: ["company_id", "name", "industry", "founded_date", "headquarters", "employee_count"]
  },
  {
    id: "product",
    name: "Product",
    type: "entity",
    category: "Core Entities",
    description: "Product catalog and specifications",
    connections: ["company", "pricing", "features"],
    fields: ["product_id", "name", "category", "launch_date", "description"]
  },
  {
    id: "market",
    name: "Market",
    type: "entity",
    category: "Market Data",
    description: "Market segments and trends",
    connections: ["company", "competitor", "trends"],
    fields: ["market_id", "segment", "size", "growth_rate", "region"]
  },
  {
    id: "competitor",
    name: "Competitor",
    type: "entity",
    category: "Competitive Intelligence",
    description: "Competitor analysis and tracking",
    connections: ["market", "pricing", "features"],
    fields: ["competitor_id", "name", "market_share", "strengths", "weaknesses"]
  },
  {
    id: "pricing",
    name: "Pricing",
    type: "entity",
    category: "Financial Data",
    description: "Pricing strategies and data",
    connections: ["product", "competitor"],
    fields: ["pricing_id", "product_id", "price", "currency", "discount", "effective_date"]
  },
  {
    id: "financials",
    name: "Financials",
    type: "entity",
    category: "Financial Data",
    description: "Financial metrics and performance",
    connections: ["company"],
    fields: ["financial_id", "revenue", "profit", "quarter", "year", "growth_rate"]
  },
  {
    id: "features",
    name: "Features",
    type: "entity",
    category: "Product Data",
    description: "Product features and capabilities",
    connections: ["product", "competitor"],
    fields: ["feature_id", "name", "category", "availability", "rating"]
  },
  {
    id: "trends",
    name: "Market Trends",
    type: "entity",
    category: "Market Data",
    description: "Industry trends and insights",
    connections: ["market"],
    fields: ["trend_id", "name", "direction", "impact", "timeframe"]
  },
  {
    id: "customer",
    name: "Customer",
    type: "entity",
    category: "Customer Data",
    description: "Customer profiles and behavior",
    connections: ["sentiment", "engagement"],
    fields: ["customer_id", "segment", "acquisition_date", "lifetime_value", "churn_risk"]
  },
  {
    id: "sentiment",
    name: "Sentiment",
    type: "entity",
    category: "Customer Data",
    description: "Customer sentiment analysis",
    connections: ["customer"],
    fields: ["sentiment_id", "score", "source", "date", "topic"]
  },
  {
    id: "engagement",
    name: "Engagement",
    type: "entity",
    category: "Customer Data",
    description: "Customer engagement metrics",
    connections: ["customer"],
    fields: ["engagement_id", "channel", "frequency", "duration", "conversion_rate"]
  }
];

const categories = Array.from(new Set(ontologyData.map(node => node.category)));

export function OntologyVisualization() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [zoom, setZoom] = useState(1);

  const filteredNodes = ontologyData.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         node.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || node.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedNodeData = selectedNode ? ontologyData.find(n => n.id === selectedNode) : null;

  const getNodePosition = (index: number, total: number) => {
    const radius = 200 * zoom;
    const angle = (2 * Math.PI * index) / total;
    return {
      x: 400 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle)
    };
  };

  const getColorForCategory = (category: string) => {
    const colors: Record<string, string> = {
      "Core Entities": "#0466C8",
      "Market Data": "#2563eb",
      "Competitive Intelligence": "#8B5CF6",
      "Financial Data": "#059669",
      "Product Data": "#DC2626",
      "Customer Data": "#EA580C"
    };
    return colors[category] || "#6B7280";
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-[#e5e7eb] px-6 py-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-[#1a1a1a]">Data Ontology</h2>
            <p className="text-sm text-[#9ca3af]">
              Visual representation of your data lake structure
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg hover:bg-[#f8f9fa] transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search entities, attributes, relationships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#0466C8]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#0466C8]"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Visualization Area */}
        <div className="flex-1 relative bg-[#fafafa]">
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-md border border-[#e5e7eb] p-2 z-10">
            <button
              onClick={() => setZoom(Math.min(zoom * 1.2, 2))}
              className="p-2 hover:bg-[#f8f9fa] rounded transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-[#666666]" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-2 hover:bg-[#f8f9fa] rounded transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-[#666666]" />
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom * 0.8, 0.5))}
              className="p-2 hover:bg-[#f8f9fa] rounded transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-[#666666]" />
            </button>
          </div>

          {/* SVG Canvas */}
          <div className="w-full h-full overflow-auto">
            <svg width="800" height="600" className="w-full h-full">
              {/* Connection Lines */}
              {filteredNodes.map((node, index) => {
                const pos = getNodePosition(index, filteredNodes.length);
                return node.connections.map(connId => {
                  const targetIndex = filteredNodes.findIndex(n => n.id === connId);
                  if (targetIndex === -1) return null;
                  const targetPos = getNodePosition(targetIndex, filteredNodes.length);
                  return (
                    <line
                      key={`${node.id}-${connId}`}
                      x1={pos.x}
                      y1={pos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke="#d1d5db"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  );
                });
              })}

              {/* Nodes */}
              {filteredNodes.map((node, index) => {
                const pos = getNodePosition(index, filteredNodes.length);
                const isSelected = selectedNode === node.id;
                const color = getColorForCategory(node.category);

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className="cursor-pointer"
                    style={{ transition: 'all 0.3s' }}
                  >
                    {/* Node Circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 45 : 35}
                      fill={color}
                      stroke={isSelected ? "#1a1a1a" : "white"}
                      strokeWidth={isSelected ? 3 : 2}
                      opacity={isSelected ? 1 : 0.9}
                    />
                    
                    {/* Icon Background */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={20}
                      fill="white"
                      opacity="0.3"
                    />

                    {/* Node Label */}
                    <text
                      x={pos.x}
                      y={pos.y + 60}
                      textAnchor="middle"
                      className="text-xs fill-[#1a1a1a]"
                      fontWeight={isSelected ? "600" : "500"}
                    >
                      {node.name}
                    </text>

                    {/* Connection Count Badge */}
                    <circle
                      cx={pos.x + 25}
                      cy={pos.y - 25}
                      r="12"
                      fill="#f8f9fa"
                      stroke={color}
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x + 25}
                      y={pos.y - 20}
                      textAnchor="middle"
                      className="text-xs fill-[#1a1a1a]"
                      fontWeight="600"
                    >
                      {node.connections.length}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md border border-[#e5e7eb] p-4 max-w-xs">
            <div className="text-sm font-medium text-[#1a1a1a] mb-3">Categories</div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <div key={category} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getColorForCategory(category) }}
                  />
                  <span className="text-xs text-[#666666]">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="w-80 border-l border-[#e5e7eb] bg-white overflow-y-auto">
          {selectedNodeData ? (
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: getColorForCategory(selectedNodeData.category) }}
                >
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-[#1a1a1a] mb-1">{selectedNodeData.name}</h3>
                  <span className="text-xs text-[#666666] bg-[#f8f9fa] px-2 py-1 rounded">
                    {selectedNodeData.category}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#666666] mb-6">
                {selectedNodeData.description}
              </p>

              {/* Fields */}
              {selectedNodeData.fields && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Table className="w-4 h-4 text-[#666666]" />
                    <h4 className="text-sm text-[#1a1a1a]">Fields</h4>
                  </div>
                  <div className="space-y-2">
                    {selectedNodeData.fields.map(field => (
                      <div
                        key={field}
                        className="px-3 py-2 bg-[#f8f9fa] rounded text-xs text-[#333333] font-mono"
                      >
                        {field}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Relationships */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="w-4 h-4 text-[#666666]" />
                  <h4 className="text-sm text-[#1a1a1a]">
                    Relationships ({selectedNodeData.connections.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {selectedNodeData.connections.map(connId => {
                    const connNode = ontologyData.find(n => n.id === connId);
                    if (!connNode) return null;
                    return (
                      <button
                        key={connId}
                        onClick={() => setSelectedNode(connId)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-[#f8f9fa] hover:bg-[#e5e7eb] rounded text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getColorForCategory(connNode.category) }}
                          />
                          <span className="text-[#333333]">{connNode.name}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-[#999999]" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <Database className="w-12 h-12 text-[#e5e7eb] mx-auto mb-3" />
              <p className="text-sm text-[#999999]">
                Select a node to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
