import React, { useState, useEffect, useMemo, useRef } from "react";
import { Database, Link2, ChevronRight, Search, Download, Plus, X, Grid } from "lucide-react";
import { getOntologyData } from "../services/claudeApi";
import * as d3 from "d3";

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

interface GraphNode {
  id: string;
  name: string;
  type: string;
  description: string;
  attributes: string[];
  color: string;
  val: number;
}

interface GraphLink {
  source: string;
  target: string;
  relationship: string;
  description: string;
}

export function OntologyVisualization() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [nodes, setNodes] = useState<OntologyNode[]>([]);
  const [relationships, setRelationships] = useState<OntologyRelationship[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newFieldValue, setNewFieldValue] = useState("");
  const [isAddingField, setIsAddingField] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<any>(null);

  // Load ontology data
  useEffect(() => {
    const ontologyData = getOntologyData();
    console.log('Ontology data loaded:', ontologyData);
    if (ontologyData) {
      const mappedNodes = ontologyData.ontology.entities.map((entity: any) => ({
        id: entity.id,
        name: entity.type,
        type: entity.type,
        description: entity.description,
        attributes: entity.attributes || []
      }));
      console.log('Setting nodes:', mappedNodes);
      console.log('Setting relationships:', ontologyData.ontology.relationships);
      setNodes(mappedNodes);
      setRelationships(ontologyData.ontology.relationships);
    }
  }, []);

  // Initialize D3 force graph
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 1000;
    const height = 600;

    // Clear previous content
    svg.selectAll("*").remove();

    // Add arrowhead marker definition
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 45) // Position at edge of circle (radius 40 + buffer)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Create graph data
    const graphNodes = nodes.map((node) => ({
      ...node,
      color: getColorForNode(node),
      x: width / 2,
      y: height / 2
    }));

    const graphLinks = relationships.map(rel => ({
      source: nodes.find(n => n.type === rel.from)?.id || rel.from,
      target: nodes.find(n => n.type === rel.to)?.id || rel.to,
      relationship: rel.relationship
    }));

    console.log('Initializing D3 graph with', graphNodes.length, 'nodes and', graphLinks.length, 'links');

    // Create force simulation
    const simulation = d3.forceSimulation(graphNodes as any)
      .force("link", d3.forceLink(graphLinks).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    simulationRef.current = simulation;

    // Create links with arrows
    const link = svg.append("g")
      .selectAll("line")
      .data(graphLinks)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", "url(#arrowhead)");

    // Create nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(graphNodes)
      .join("circle")
      .attr("r", 40)
      .attr("fill", (d: any) => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any)
      .on("click", (event, d: any) => {
        console.log('Node clicked:', d);
        setSelectedNode(d.id);
      })
      .on("mouseover", function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 45)
          .attr("stroke-width", 3);
      })
      .on("mouseout", function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 40)
          .attr("stroke-width", 2);
      });

    // Add tooltips to nodes
    node.append("title")
      .text((d: any) => `${d.name}\n${d.description}`);

    // Create labels
    const label = svg.append("g")
      .selectAll("text")
      .data(graphNodes)
      .join("text")
      .text((d: any) => d.name)
      .attr("font-size", 14)
      .attr("font-weight", 600)
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("fill", "#fff")
      .style("pointer-events", "none");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, relationships]);


  const getColorForNode = (node: OntologyNode) => {
    // Assign specific colors based on entity type
    const colorMap: { [key: string]: string } = {
      'Products': '#2563eb',      // Blue
      'Markets': '#8B5CF6',        // Purple
      'Customers': '#DC2626',      // Red
      'Materials': '#0466C8',      // Blue
      'Competitors': '#059669'     // Green
    };
    return colorMap[node.type] || '#6B7280'; // Default gray if not found
  };

  // Find selected node data
  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  
  // Get connections for a node
  const getNodeConnections = (nodeId: string) => {
    const nodeName = nodes.find(n => n.id === nodeId)?.type;
    return relationships.filter(r => r.from === nodeName || r.to === nodeName);
  };

  // Handle adding a new field
  const handleAddField = () => {
    if (!selectedNodeData || !newFieldValue.trim()) return;
    
    const updatedNodes = nodes.map(node => {
      if (node.id === selectedNodeData.id) {
        return {
          ...node,
          attributes: [...(node.attributes || []), newFieldValue.trim()]
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    setNewFieldValue("");
    setIsAddingField(false);
  };

  // Handle removing a field
  const handleRemoveField = (fieldToRemove: string) => {
    if (!selectedNodeData) return;
    
    const updatedNodes = nodes.map(node => {
      if (node.id === selectedNodeData.id) {
        return {
          ...node,
          attributes: (node.attributes || []).filter(attr => attr !== fieldToRemove)
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
  };

  // Handle editing a field
  const handleEditField = (oldField: string, newField: string) => {
    if (!selectedNodeData || !newField.trim()) return;
    
    const updatedNodes = nodes.map(node => {
      if (node.id === selectedNodeData.id) {
        return {
          ...node,
          attributes: (node.attributes || []).map(attr => 
            attr === oldField ? newField.trim() : attr
          )
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    setEditingField(null);
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
        <div 
          className="bg-[#fafafa] relative transition-all duration-300 ease-in-out flex-1"
          style={{ 
            minWidth: 0 // Allows flexbox to shrink properly
          }}
        >
          {/* D3 Force-Directed Graph */}
          <div className="flex items-center justify-center w-full h-full p-8">
            {nodes.length > 0 ? (
              <svg
                ref={svgRef}
                width="1000"
                height="600"
                className="border border-[#e5e7eb] rounded-lg bg-white shadow-lg"
              />
            ) : (
              <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <p className="text-sm text-[#9ca3af] mb-2">Loading ontology data...</p>
                <p className="text-xs text-[#cccccc]">Nodes: {nodes.length}, Relationships: {relationships.length}</p>
              </div>
            )}
          </div>

          {/* Info Box */}
          {nodes.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md border border-[#e5e7eb] p-4 max-w-sm z-5">
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
          )}
        </div>

        {/* Details Panel - Side by Side */}
        <div 
          className="bg-white border-l border-[#e5e7eb] overflow-y-auto transition-all duration-300 ease-in-out relative"
          style={{ 
            width: selectedNode ? '448px' : '0',
            opacity: selectedNode ? 1 : 0,
            flexShrink: 0,
            pointerEvents: selectedNode ? 'auto' : 'none' // Don't block interactions when closed
          }}
        >
          {selectedNodeData ? (
            <div className="p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedNode(null);
                  setEditingField(null);
                  setIsAddingField(false);
                  setNewFieldValue("");
                }}
                className="absolute top-4 right-4 p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors z-10"
                title="Close panel"
              >
                <X className="w-5 h-5 text-[#666666]" />
              </button>

              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: getColorForNode(selectedNodeData) }}
                >
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pr-8">
                  <h3 className="text-lg text-[#1a1a1a] mb-1">{selectedNodeData.name}</h3>
                  <span className="text-xs text-[#666666] bg-[#f8f9fa] px-2 py-1 rounded">
                    Entity
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#666666] mb-6">
                {selectedNodeData.description}
              </p>

              {/* Fields Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-[#666666]" />
                    <h4 className="text-sm font-medium text-[#1a1a1a]">Fields</h4>
                  </div>
                  {!isAddingField && (
                    <button
                      onClick={() => setIsAddingField(true)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-[#0466C8] hover:bg-[#f8f9fa] rounded transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {selectedNodeData.attributes && selectedNodeData.attributes.map((attr, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 group"
                    >
                      {editingField === attr ? (
                        <input
                          type="text"
                          defaultValue={attr}
                          onBlur={(e) => {
                            if (e.target.value !== attr) {
                              handleEditField(attr, e.target.value);
                            } else {
                              setEditingField(null);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            } else if (e.key === 'Escape') {
                              setEditingField(null);
                            }
                          }}
                          autoFocus
                          className="flex-1 px-3 py-2 bg-[#f8f9fa] rounded text-xs text-[#333333] font-mono border border-[#0466C8] focus:outline-none"
                        />
                      ) : (
                        <>
                          <div
                            className="flex-1 px-3 py-2 bg-[#f8f9fa] rounded text-xs text-[#333333] font-mono cursor-pointer hover:bg-[#e5e7eb] transition-colors"
                            onClick={() => setEditingField(attr)}
                          >
                            {attr}
                          </div>
                          <button
                            onClick={() => handleRemoveField(attr)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#fee2e2] rounded transition-all"
                            title="Remove field"
                          >
                            <X className="w-3 h-3 text-[#dc2626]" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  {isAddingField && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter field name..."
                        value={newFieldValue}
                        onChange={(e) => setNewFieldValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newFieldValue.trim()) {
                            handleAddField();
                          } else if (e.key === 'Escape') {
                            setIsAddingField(false);
                            setNewFieldValue("");
                          }
                        }}
                        autoFocus
                        className="flex-1 px-3 py-2 bg-[#f8f9fa] rounded text-xs text-[#333333] font-mono border border-[#0466C8] focus:outline-none"
                      />
                      <button
                        onClick={handleAddField}
                        className="px-2 py-1 text-xs text-white bg-[#0466C8] rounded hover:bg-[#0353A4] transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingField(false);
                          setNewFieldValue("");
                        }}
                        className="p-1 hover:bg-[#fee2e2] rounded transition-colors"
                      >
                        <X className="w-3 h-3 text-[#dc2626]" />
                      </button>
                    </div>
                  )}
                  {(!selectedNodeData.attributes || selectedNodeData.attributes.length === 0) && !isAddingField && (
                    <div className="text-xs text-[#9ca3af] text-center py-4">
                      No fields yet. Click "Add" to create one.
                    </div>
                  )}
                </div>
              </div>

              {/* Relationships Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="w-4 h-4 text-[#666666]" />
                  <h4 className="text-sm font-medium text-[#1a1a1a]">
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
                        className="w-full px-3 py-2 bg-[#f8f9fa] hover:bg-[#e5e7eb] rounded text-left transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-[#0466C8]">{rel.relationship}</span>
                          <ChevronRight className="w-3 h-3 text-[#999999] group-hover:text-[#0466C8] transition-colors" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getColorForNode(targetNode) }}
                          />
                          <span className="text-xs text-[#333333]">{targetType}</span>
                        </div>
                        {rel.description && (
                          <p className="text-xs text-[#999999] mt-1">{rel.description}</p>
                        )}
                      </button>
                    );
                  })}
                  {getNodeConnections(selectedNodeData.id).length === 0 && (
                    <div className="text-xs text-[#9ca3af] text-center py-4">
                      No relationships defined.
                    </div>
                  )}
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
