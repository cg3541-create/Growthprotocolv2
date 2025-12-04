import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Database, Link2 } from "lucide-react";
import { parseOntologyFile, ParsedOntology } from "../utils/ontologyParser";
import { mergeOntology, OntologyNode, OntologyRelationship } from "../utils/ontologyMerger";

interface OntologyImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingNodes: OntologyNode[];
  existingRelationships: OntologyRelationship[];
  onImport: (nodes: OntologyNode[], relationships: OntologyRelationship[]) => void;
}

export function OntologyImportDialog({
  open,
  onOpenChange,
  existingNodes,
  existingRelationships,
  onImport
}: OntologyImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedOntology | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergePreview, setMergePreview] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setParsedData(null);
    setMergePreview(null);
    setIsProcessing(true);

    try {
      const result = await parseOntologyFile(file);
      
      if (!result.success || !result.data) {
        setError(result.error || "Failed to parse file");
        setIsProcessing(false);
        return;
      }

      setParsedData(result.data);

      // Generate merge preview
      const preview = mergeOntology(existingNodes, existingRelationships, result.data);
      setMergePreview(preview);
    } catch (err: any) {
      setError(err.message || "An error occurred while processing the file");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleImport = () => {
    if (mergePreview) {
      onImport(mergePreview.nodes, mergePreview.relationships);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setParsedData(null);
    setError(null);
    setMergePreview(null);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1a1a1a]">Import Ontology</DialogTitle>
          <DialogDescription className="text-[#666666]">
            Upload a JSON or CSV file to merge entities and relationships into your ontology.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 mt-4">
          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-[#0466C8] bg-[#f0f7ff]"
                : "border-[#e5e7eb] bg-[#fafafa] hover:border-[#0466C8] hover:bg-[#f9fafb]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Upload className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
            <p className="text-sm text-[#1a1a1a] mb-1">
              Drag and drop a file here, or click to browse
            </p>
            <p className="text-xs text-[#666666]">
              Supported formats: JSON, CSV
            </p>
          </div>

          {/* Selected File */}
          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-lg border border-[#e5e7eb]">
              <FileText className="w-5 h-5 text-[#0466C8]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a1a1a] truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-[#666666]">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              {isProcessing ? (
                <div className="text-xs text-[#666666]">Processing...</div>
              ) : parsedData ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setParsedData(null);
                    setError(null);
                    setMergePreview(null);
                  }}
                  className="p-1 hover:bg-[#fee2e2] rounded transition-colors"
                >
                  <X className="w-4 h-4 text-[#dc2626]" />
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Merge Preview */}
          {mergePreview && parsedData && (
            <div className="space-y-4">
              <div className="p-4 bg-[#f0f7ff] border border-[#0466C8] rounded-lg">
                <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">Import Preview</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-[#0466C8]" />
                      <span className="font-medium text-[#1a1a1a]">Entities</span>
                    </div>
                    <div className="space-y-1 text-xs text-[#666666]">
                      <div>• {mergePreview.stats.entitiesAdded} new entities</div>
                      <div>• {mergePreview.stats.entitiesUpdated} entities updated</div>
                      <div>• Total: {mergePreview.nodes.length} entities</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="w-4 h-4 text-[#0466C8]" />
                      <span className="font-medium text-[#1a1a1a]">Relationships</span>
                    </div>
                    <div className="space-y-1 text-xs text-[#666666]">
                      <div>• {mergePreview.stats.relationshipsAdded} new relationships</div>
                      <div>• {mergePreview.stats.relationshipsUpdated} relationships updated</div>
                      <div>• Total: {mergePreview.relationships.length} relationships</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* New Entities Preview */}
              {parsedData.entities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[#1a1a1a] mb-2">
                    New Entities ({parsedData.entities.length})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {parsedData.entities.map((entity, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-[#f8f9fa] rounded border border-[#e5e7eb] text-xs"
                      >
                        <div className="font-medium text-[#1a1a1a]">{entity.type}</div>
                        {entity.description && (
                          <div className="text-[#666666] mt-0.5 truncate">
                            {entity.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Relationships Preview */}
              {parsedData.relationships.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[#1a1a1a] mb-2">
                    New Relationships ({parsedData.relationships.length})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {parsedData.relationships.map((rel, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-[#f8f9fa] rounded border border-[#e5e7eb] text-xs"
                      >
                        <div className="font-medium text-[#1a1a1a]">
                          {rel.from} <span className="text-[#0466C8]">{rel.relationship}</span> {rel.to}
                        </div>
                        {rel.description && (
                          <div className="text-[#666666] mt-0.5 truncate">
                            {rel.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e7eb] mt-4 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-[#e5e7eb] text-[#666666] hover:bg-[#f8f9fa] px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!mergePreview || isProcessing}
            className="bg-[#0466C8] hover:bg-[#0353A4] text-white disabled:opacity-50 disabled:cursor-not-allowed px-4"
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

