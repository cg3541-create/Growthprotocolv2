import { ChatMessage } from "./ChatMessage";
import { WorkflowStatus } from "./WorkflowStatus";
import { DataSourceSelector } from "./DataSourceSelector";
import { BarChart, Database, FileText, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

export function WorkflowDemo() {
  return (
    <div className="space-y-6">
      {/* User Initial Prompt */}
      <ChatMessage
        role="user"
        content="Analyze the latest trends in neurosymbolic AI research. Focus on academic papers from 2024-2025, include industry applications, and provide a comprehensive report with visualizations."
      />

      {/* Assistant Response - Prompt Definition */}
      <ChatMessage
        role="assistant"
        content="Perfect! I'll conduct a comprehensive research analysis on neurosymbolic AI trends. Here's what I'll cover:

• Research Goals: Identify emerging trends in neurosymbolic AI
• Coverage: Academic papers (2024-2025), industry applications
• Subject Matter: Neural-symbolic integration, knowledge graphs, reasoning systems
• Location: Global research (focus on top AI institutions)
• Depth: Comprehensive analysis with visual insights

Let's proceed with data collection."
        stage="Step 1: Prompt Definition - Complete"
      />

      {/* Data Source Selection */}
      <div className="bg-[#f9f9f9] rounded-2xl p-4 border border-[#ebebeb]">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-[#472be9]" />
            <span className="text-sm text-[#333333]">Step 2: Choose Research Method</span>
          </div>
          <p className="text-xs text-[#666666]">I'll use multiple data sources for comprehensive coverage:</p>
        </div>
        
        <div className="space-y-2">
          <WorkflowStatus
            stage="Research Papers - Academic Journals & Patents"
            status="completed"
            description="Collected 127 papers from IEEE, ACM, arXiv"
          />
          <WorkflowStatus
            stage="Ontoloop Lakehouse - Internal Data"
            status="completed"
            description="Queried Snowflake and Databricks for industry data"
          />
          <WorkflowStatus
            stage="Web Data Scraping - Latest Developments"
            status="completed"
            description="Extracted insights using Claude and ChatGPT APIs"
          />
        </div>
      </div>

      {/* Data Collection Summary */}
      <ChatMessage
        role="assistant"
        content="Data collection complete! I've gathered comprehensive information from multiple sources."
        stage="Step 3: Collect Data - Complete"
        showDataSummary
      />

      {/* Clean & Validate */}
      <ChatMessage
        role="assistant"
        content="Data cleaning and validation completed. Removed duplicates, standardized formats, and verified source credibility. Quality score: 94%"
        stage="Step 4: Clean & Validate - Complete"
      />

      {/* Analysis */}
      <div className="bg-[#f9f9f9] rounded-2xl p-4 border border-[#ebebeb]">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-[#472be9]" />
          <span className="text-sm text-[#333333]">Step 5: Analyze Insights</span>
        </div>
        
        <div className="text-sm text-[#333333] mb-3">Key findings from the analysis:</div>
        
        <div className="space-y-2 text-xs text-[#666666]">
          <div className="bg-white p-3 rounded-lg border border-[#ebebeb]">
            <div className="text-[#333333] mb-1">🔍 Trend 1: Integration with LLMs</div>
            <div>78% of recent papers focus on combining symbolic reasoning with large language models</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-[#ebebeb]">
            <div className="text-[#333333] mb-1">🔍 Trend 2: Knowledge Graph Enhancement</div>
            <div>Significant growth in using neurosymbolic approaches for knowledge graph completion (+156%)</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-[#ebebeb]">
            <div className="text-[#333333] mb-1">🔍 Trend 3: Explainable AI</div>
            <div>Industry adoption driven by need for interpretable AI decisions in healthcare and finance</div>
          </div>
        </div>
      </div>

      {/* Generate Visuals */}
      <div className="bg-[#f9f9f9] rounded-2xl p-4 border border-[#ebebeb]">
        <div className="flex items-center gap-2 mb-3">
          <BarChart className="w-5 h-5 text-[#472be9]" />
          <span className="text-sm text-[#333333]">Step 6: Generate Visuals</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg border border-[#ebebeb]">
            <div className="text-xs text-[#666666] mb-2">Publication Trends</div>
            <div className="h-24 bg-gradient-to-t from-[#472be9]/10 to-transparent rounded flex items-end justify-center">
              <div className="text-2xl text-[#472be9]">📈</div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-[#ebebeb]">
            <div className="text-xs text-[#666666] mb-2">Research Areas</div>
            <div className="h-24 bg-gradient-to-br from-[#472be9]/10 to-purple-100 rounded flex items-center justify-center">
              <div className="text-2xl">🎯</div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Review */}
      <ChatMessage
        role="assistant"
        content="Analysis complete! I've generated a comprehensive report with key insights and visualizations. Please review and let me know if you'd like any adjustments."
        stage="Step 7: Client Review"
        showActions
      />

      {/* Final Delivery Options */}
      <div className="bg-[#f9f9f9] rounded-2xl p-4 border border-[#ebebeb]">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-green-600" />
          <span className="text-sm text-[#333333]">Step 8: Deliver Final Report</span>
        </div>
        
        <p className="text-xs text-[#666666] mb-3">Choose your preferred export format:</p>
        
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="text-xs bg-[#472be9] hover:bg-[#3a22ba]">
            <FileText className="w-3 h-3 mr-1.5" />
            Export to Google Doc
          </Button>
          <Button size="sm" variant="outline" className="text-xs border-[#ebebeb]">
            <FileText className="w-3 h-3 mr-1.5" />
            Generate Slides
          </Button>
          <Button size="sm" variant="outline" className="text-xs border-[#ebebeb]">
            <FileText className="w-3 h-3 mr-1.5" />
            Download PDF Report
          </Button>
        </div>
      </div>
    </div>
  );
}
