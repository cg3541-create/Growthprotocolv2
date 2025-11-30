import { useState, useEffect } from "react";
import { Database, Table, Link2, ChevronRight, Search, Filter, Download, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { getOntologyData } from "../services/claudeApi";

interface OntologyNode {
  id: string;
  name: string;
  type: string;
  description: string;
  attributes: string[];
}

interface OntologyRelationship {
  from: string;
  to: string;
  relationship: string;
  description: string;
}

export function OntologyVisualization() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(1);
  const [nodes, setNodes] = useState<OntologyNode[]>([]);
  const [relationships, setRelationships] = useState<OntologyRelationship[]>([]);

  useEffect(() => {
    // Load ontology data
    const ontologyData = getOntologyData();
    if (ontologyData) {
      setNodes(ontologyData.ontology.entities.map((entity: any) => ({
        id: entity.id,
        name: entity.type,
        type: entity.type,
        description: entity.description,
        attributes: entity.attributes
      })));
      setRelationships(ontologyData.ontology.relationships);
    }
  }, []);

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         node.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  
  // Get connections for a node
  const getNodeConnections = (nodeId: string) => {
    const nodeName = nodes.find(n => n.id === nodeId)?.type;
    return relationships.filter(r => r.from === nodeName || r.to === nodeName);
  };

  const getNodePosition = (index: number, total: number) => {
    const radius = 200 * zoom;
    const angle = (2 * Math.PI * index) / total;
    return {
      x: 400 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle)
    };
  };

  const getColorForNode = (index: number) => {
    const colors = ["#0466C8", "#2563eb", "#8B5CF6", "#059669", "#DC2626"];
    return colors[index % colors.length];
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-[#e5e7eb] px-6 py-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-[#1a1a1a]">Lululemon Retail Intelligence Ontology</h2>
            <p className="text-sm text-[#9ca3af]">
              Neurosymbolic knowledge graph structure - {nodes.length} entities, {relationships.length} relationships
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg hover:bg-[#f8f9fa] transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search entities and relationships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#0466C8]"
            />
          </div>
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
              {relationships.map((rel, idx) => {
                const fromNode = filteredNodes.find(n => n.type === rel.from);
                const toNode = filteredNodes.find(n => n.type === rel.to);
                if (!fromNode || !toNode) return null;

                const fromIndex = filteredNodes.indexOf(fromNode);
                const toIndex = filteredNodes.indexOf(toNode);
                const fromPos = getNodePosition(fromIndex, filteredNodes.length);
                const toPos = getNodePosition(toIndex, filteredNodes.length);

                return (
                  <g key={`rel-${idx}`}>
                    <line
                      x1={fromPos.x}
                      y1={fromPos.y}
                      x2={toPos.x}
                      y2={toPos.y}
                      stroke="#d1d5db"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    {/* Relationship label */}
                    <text
                      x={(fromPos.x + toPos.x) / 2}
                      y={(fromPos.y + toPos.y) / 2}
                      textAnchor="middle"
                      className="text-xs fill-[#9ca3af]"
                      fontSize="10"
                    >
                      {rel.relationship}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node, index) => {
                const pos = getNodePosition(index, filteredNodes.length);
                const isSelected = selectedNode === node.id;
                const color = getColorForNode(index);
                const connections = getNodeConnections(node.id);

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
                      {connections.length}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Info Box */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md border border-[#e5e7eb] p-4 max-w-sm">
            <div className="text-sm font-medium text-[#1a1a1a] mb-2">Growth Protocol Ontology</div>
            <p className="text-xs text-[#666666] mb-3">
              This knowledge graph represents the complete data structure for Lululemon's retail intelligence system.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#666666]">
              <div>
                <span className="font-medium text-[#0466C8]">{nodes.length}</span> Entities
              </div>
              <div>
                <span className="font-medium text-[#0466C8]">{relationships.length}</span> Relationships
              </div>
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
                  style={{ backgroundColor: getColorForNode(nodes.indexOf(selectedNodeData)) }}
                >
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-[#1a1a1a] mb-1">{selectedNodeData.name}</h3>
                  <span className="text-xs text-[#666666] bg-[#f8f9fa] px-2 py-1 rounded">
                    Entity
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#666666] mb-6">
                {selectedNodeData.description}
              </p>

              {/* Attributes */}
              {selectedNodeData.attributes && selectedNodeData.attributes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Table className="w-4 h-4 text-[#666666]" />
                    <h4 className="text-sm text-[#1a1a1a]">Attributes</h4>
                  </div>
                  <div className="space-y-2">
                    {selectedNodeData.attributes.map(attr => (
                      <div
                        key={attr}
                        className="px-3 py-2 bg-[#f8f9fa] rounded text-xs text-[#333333] font-mono"
                      >
                        {attr}
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
                    Relationships ({getNodeConnections(selectedNodeData.id).length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {getNodeConnections(selectedNodeData.id).map((rel, idx) => {
                    const isFrom = rel.from === selectedNodeData.type;
                    const targetType = isFrom ? rel.to : rel.from;
                    const targetNode = nodes.find(n => n.type === targetType);
                    if (!targetNode) return null;

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedNode(targetNode.id)}
                        className="w-full px-3 py-2 bg-[#f8f9fa] hover:bg-[#e5e7eb] rounded text-left transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-[#0466C8]">{rel.relationship}</span>
                          <ChevronRight className="w-3 h-3 text-[#999999]" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getColorForNode(nodes.indexOf(targetNode)) }}
                          />
                          <span className="text-xs text-[#333333]">{targetType}</span>
                        </div>
                        <p className="text-xs text-[#999999] mt-1">{rel.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <Database className="w-12 h-12 text-[#e5e7eb] mx-auto mb-3" />
              <p className="text-sm text-[#999999] mb-1">
                Select an entity to view details
              </p>
              <p className="text-xs text-[#cccccc]">
                Click on any node in the graph
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
