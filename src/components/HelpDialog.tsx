import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { BookOpen, Network, MessageSquare, Keyboard, Lightbulb, ChevronRight } from "lucide-react";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1a1a1a]">Help & Documentation</DialogTitle>
          <DialogDescription className="text-[#666666]">
            Learn how to use Growth Protocol to get the most out of your AI-powered research platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Getting Started */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-[#0466C8]" />
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Getting Started</h3>
            </div>
            <div className="pl-7 space-y-3 text-sm text-[#666666]">
              <div>
                <h4 className="font-medium text-[#1a1a1a] mb-1">Welcome to Growth Protocol</h4>
                <p>
                  Growth Protocol is a neurosymbolic AI platform that combines knowledge graphs with advanced AI to help you analyze data, understand relationships, and make informed decisions.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-[#1a1a1a] mb-1">Quick Start</h4>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Start a new chat by clicking the "+ New Chat" button</li>
                  <li>Enter your question or select a suggested prompt</li>
                  <li>Review the AI's response with source citations</li>
                  <li>Explore the ontology visualization to understand data relationships</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Using the Ontology Visualization */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Network className="w-5 h-5 text-[#0466C8]" />
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Using the Ontology Visualization</h3>
            </div>
            <div className="pl-7 space-y-3 text-sm text-[#666666]">
              <div>
                <h4 className="font-medium text-[#1a1a1a] mb-1">Understanding the Knowledge Graph</h4>
                <p>
                  The ontology visualization shows entities (nodes) and their relationships (connections) in your data structure. Each node represents a different entity type, and arrows show how they relate to each other.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-[#1a1a1a] mb-1">Interacting with Nodes</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Click a node</strong> to view detailed information about that entity</li>
                  <li><strong>Drag nodes</strong> to rearrange the graph layout</li>
                  <li><strong>Hover over nodes</strong> to see quick information</li>
                  <li><strong>Click relationships</strong> in the detail panel to navigate between connected entities</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[#1a1a1a] mb-1">Search Functionality</h4>
                <p>
                  Use the search bar to quickly find specific entities or relationships in the ontology. The search filters results in real-time as you type.
                </p>
              </div>
            </div>
          </section>

          {/* Querying the AI System */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-[#0466C8]" />
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Querying the AI System</h3>
            </div>
            <div className="pl-7 space-y-3 text-sm text-[#666666]">
              <div>
                <h4 className="font-medium text-[#1a1a1a] mb-1">Asking Questions</h4>
                <p>
                  You can ask natural language questions about your data. The AI will analyze your ontology and data sources to provide comprehensive answers with citations.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-[#1a1a1a] mb-1">Autonomy Levels</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Search:</strong> Quick answers using existing data</li>
                  <li><strong>Research:</strong> Deeper analysis with cross-referencing (default)</li>
                  <li><strong>Deep Research:</strong> Comprehensive analysis with multiple data sources</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[#1a1a1a] mb-1">Attaching Files</h4>
                <p>
                  Use the paperclip icon in the input field to attach files (JSON, CSV, TXT) for analysis. The AI can incorporate data from uploaded files into its responses.
                </p>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Keyboard className="w-5 h-5 text-[#0466C8]" />
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Keyboard Shortcuts</h3>
            </div>
            <div className="pl-7">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between p-2 bg-[#f8f9fa] rounded">
                  <span className="text-[#666666]">Send message</span>
                  <kbd className="px-2 py-1 bg-white border border-[#e5e7eb] rounded text-xs font-mono">Enter</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#f8f9fa] rounded">
                  <span className="text-[#666666]">New line</span>
                  <kbd className="px-2 py-1 bg-white border border-[#e5e7eb] rounded text-xs font-mono">Shift + Enter</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#f8f9fa] rounded">
                  <span className="text-[#666666]">New chat</span>
                  <kbd className="px-2 py-1 bg-white border border-[#e5e7eb] rounded text-xs font-mono">Ctrl/Cmd + N</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#f8f9fa] rounded">
                  <span className="text-[#666666]">Search</span>
                  <kbd className="px-2 py-1 bg-white border border-[#e5e7eb] rounded text-xs font-mono">Ctrl/Cmd + K</kbd>
                </div>
              </div>
            </div>
          </section>

          {/* Tips and Best Practices */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-[#0466C8]" />
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Tips & Best Practices</h3>
            </div>
            <div className="pl-7 space-y-3 text-sm text-[#666666]">
              <div className="flex gap-2">
                <ChevronRight className="w-4 h-4 text-[#0466C8] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#1a1a1a]">Be specific:</strong> The more specific your question, the better the AI can target relevant data sources.
                </div>
              </div>
              <div className="flex gap-2">
                <ChevronRight className="w-4 h-4 text-[#0466C8] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#1a1a1a]">Use the ontology:</strong> Explore the knowledge graph to understand what data is available before asking questions.
                </div>
              </div>
              <div className="flex gap-2">
                <ChevronRight className="w-4 h-4 text-[#0466C8] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#1a1a1a]">Check sources:</strong> Always review the source citations to verify the AI's responses.
                </div>
              </div>
              <div className="flex gap-2">
                <ChevronRight className="w-4 h-4 text-[#0466C8] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#1a1a1a]">Upload relevant data:</strong> Upload your own data files to enhance the AI's knowledge base.
                </div>
              </div>
              <div className="flex gap-2">
                <ChevronRight className="w-4 h-4 text-[#0466C8] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#1a1a1a]">Follow-up questions:</strong> Ask follow-up questions to dive deeper into specific topics.
                </div>
              </div>
            </div>
          </section>

          {/* Support */}
          <section className="pt-4 border-t border-[#e5e7eb]">
            <div className="text-sm text-[#666666]">
              <p className="mb-2">
                <strong className="text-[#1a1a1a]">Need more help?</strong>
              </p>
              <p>
                For additional support, please check the settings panel or contact your administrator.
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

