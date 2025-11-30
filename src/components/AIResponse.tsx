import { motion } from "motion/react";
import { SourceCitation, Source } from "./SourceCitation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Award, ChevronDown, ChevronUp, ArrowRight, StopCircle, FileText, FileBarChart } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface AIResponseProps {
  showResponse: boolean;
}

// Mock data for demonstration
const mockSources: Source[] = [
  {
    id: "1",
    title: "Neurosymbolic AI: The 3rd Wave of Artificial Intelligence",
    type: "paper",
    snippet: "Recent advances in neurosymbolic AI combine neural networks with symbolic reasoning, achieving 40% better performance in complex reasoning tasks compared to pure neural approaches.",
    relevance: 0.95,
    url: "#",
  },
  {
    id: "2",
    title: "Snowflake AI Research Database - Q4 2024",
    type: "database",
    snippet: "Analysis of 15,000 AI patents filed in 2024 shows neurosymbolic approaches growing at 67% year-over-year, outpacing traditional ML methods.",
    relevance: 0.89,
    url: "#",
  },
  {
    id: "3",
    title: "Enterprise AI Adoption Trends",
    type: "paper",
    snippet: "Fortune 500 companies implementing neurosymbolic AI report 3.2x faster time-to-insight and 45% reduction in AI hallucination incidents.",
    relevance: 0.87,
    url: "#",
  },
  {
    id: "4",
    title: "Databricks Analytics - AI Investment Report",
    type: "database",
    snippet: "Venture capital investment in neurosymbolic AI startups reached $4.2B in 2024, representing 23% of total AI investment.",
    relevance: 0.82,
    url: "#",
  },
];

const chartData = [
  { year: "2020", traditional: 45, neurosymbolic: 12 },
  { year: "2021", traditional: 52, neurosymbolic: 18 },
  { year: "2022", traditional: 58, neurosymbolic: 28 },
  { year: "2023", traditional: 61, neurosymbolic: 42 },
  { year: "2024", traditional: 64, neurosymbolic: 67 },
];

export function AIResponse({ showResponse }: AIResponseProps) {
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(false);
  const [showEndOptions, setShowEndOptions] = useState(false);
  
  if (!showResponse) return null;

  const handleKeepGoing = () => {
    console.log("User chose to keep going");
    // This would allow the user to continue the conversation
  };

  const handleEndConversation = () => {
    setShowEndOptions(true);
  };

  const handleGenerateSummary = () => {
    console.log("Generating summary...");
    // This would trigger summary generation
  };

  const handleGenerateReport = () => {
    console.log("Generating report...");
    // This would trigger report generation
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      {/* Main Response Text */}
      <div className="prose max-w-none">
        <h3 className="text-[#333333] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#472be9]" />
          Neurosymbolic AI Market Analysis
        </h3>
        
        <p className="text-[#333333] leading-relaxed">
          Based on analysis of <SourceCitation source={mockSources[0]} index={1} /> and{" "}
          <SourceCitation source={mockSources[1]} index={2} />, neurosymbolic AI represents a significant
          paradigm shift in artificial intelligence. This approach combines the pattern recognition capabilities
          of neural networks with the logical reasoning of symbolic AI systems.
        </p>

        <p className="text-[#333333] leading-relaxed">
          Key findings from <SourceCitation source={mockSources[2]} index={3} /> indicate that enterprise
          adoption is accelerating rapidly, with companies reporting substantial improvements in AI reliability
          and interpretability. The market analysis from <SourceCitation source={mockSources[3]} index={4} />{" "}
          shows strong investor confidence in this emerging technology sector.
        </p>

        {/* Key Insights Box */}
        <div className="bg-[#f9f9f9] border border-[#ebebeb] rounded-lg p-4 my-4">
          <div className="text-sm text-[#333333] mb-2">Key Insights:</div>
          <ul className="space-y-2 text-sm text-[#666666]">
            <li className="flex items-start gap-2">
              <span className="text-[#472be9] mt-1">•</span>
              <span>40% performance improvement in complex reasoning tasks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#472be9] mt-1">•</span>
              <span>67% year-over-year growth in patent filings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#472be9] mt-1">•</span>
              <span>$4.2B in VC investment during 2024</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#472be9] mt-1">•</span>
              <span>45% reduction in AI hallucination incidents</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="bg-white border border-[#ebebeb] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#472be9]" />
          <h4 className="text-[#333333]">Growth Comparison: Traditional AI vs. Neurosymbolic AI</h4>
        </div>
        <div className="text-xs text-[#999999] mb-4">
          Data sources: <SourceCitation source={mockSources[1]} index={2} />,{" "}
          <SourceCitation source={mockSources[3]} index={4} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" />
            <XAxis dataKey="year" stroke="#666666" />
            <YAxis stroke="#666666" label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ebebeb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="traditional" fill="#999999" name="Traditional AI" radius={[4, 4, 0, 0]} />
            <Bar dataKey="neurosymbolic" fill="#472be9" name="Neurosymbolic AI" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sources Summary */}
      <div className="bg-[#f9f9f9] border border-[#ebebeb] rounded-lg p-4">
        <button
          onClick={() => setIsSourcesExpanded(!isSourcesExpanded)}
          className="flex items-center justify-between w-full text-left hover:bg-[#f0f0f0] -m-4 p-4 rounded-lg transition-colors"
        >
          <div className="text-sm text-[#333333]">Sources Referenced ({mockSources.length})</div>
          {isSourcesExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#666666]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#666666]" />
          )}
        </button>
        
        {!isSourcesExpanded ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {mockSources.map((source, index) => (
              <button
                key={source.id}
                onClick={() => setIsSourcesExpanded(true)}
                className="inline-flex items-center gap-1 text-xs bg-white border border-[#ebebeb] rounded-full px-3 py-1 hover:border-[#472be9] hover:bg-[#f9f9f9] transition-colors"
              >
                <span className="text-[#472be9]">[{index + 1}]</span>
                <span className="text-[#666666] truncate max-w-[200px]">{source.title}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            {mockSources.map((source, index) => (
              <div key={source.id} className="flex items-start gap-3 text-xs bg-white border border-[#ebebeb] rounded-lg p-3">
                <span className="text-[#472be9] mt-0.5">[{index + 1}]</span>
                <div className="flex-1">
                  <div className="text-[#333333] mb-1">{source.title}</div>
                  <div className="text-[#999999] mb-2">{source.snippet}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#666666] capitalize">{source.type}</span>
                    <span className="text-[#999999]">•</span>
                    <span className="text-[#472be9]">{Math.round(source.relevance * 100)}% relevant</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!showEndOptions ? (
        <div className="flex items-center gap-3 pt-4">
          <Button
            onClick={handleKeepGoing}
            className="flex items-center gap-2 bg-[#0466C8] hover:bg-[#0353a4] text-white px-6 py-2 rounded-lg transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            Keep Going
          </Button>
          <Button
            onClick={handleEndConversation}
            variant="outline"
            className="flex items-center gap-2 border-[#e5e7eb] hover:border-[#0466C8] hover:bg-[#f9fafb] text-[#333333] px-6 py-2 rounded-lg transition-colors"
          >
            <StopCircle className="w-4 h-4" />
            End Conversation
          </Button>
        </div>
      ) : (
        <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-6">
          <div className="text-[#333333] mb-4">Would you like a summary or a detailed report?</div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleGenerateSummary}
              className="flex items-center gap-2 bg-[#0466C8] hover:bg-[#0353a4] text-white px-6 py-2 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              Generate Summary
            </Button>
            <Button
              onClick={handleGenerateReport}
              className="flex items-center gap-2 bg-[#0466C8] hover:bg-[#0353a4] text-white px-6 py-2 rounded-lg transition-colors"
            >
              <FileBarChart className="w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
