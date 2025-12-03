import { motion } from "motion/react";
import { SourceCitation, Source } from "./SourceCitation";
import { Award, ChevronDown, ChevronUp, ExternalLink, Globe, Database } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SearchResponse, OnlineSource, AnswerSection } from "../services/claudeApi";

interface AIResponseProps {
  showResponse: boolean;
  content?: string;
  sources?: Array<{ name: string; type: string }>;
  searchResponse?: SearchResponse; // New prop for structured response
}

// Helper function to convert data sources to Source format
function convertToSources(dataSources?: Array<{ name: string; type: string }>): Source[] {
  if (!dataSources || dataSources.length === 0) {
    return [];
  }

  return dataSources.map((source, index) => {
    // Determine source type and create appropriate snippet
    const isJson = source.name.endsWith('.json');
    const type = isJson ? 'database' : 'paper';
    
    let snippet = '';
    if (source.name.includes('products')) {
      snippet = 'Product catalog data including SKUs, categories, pricing, and sales performance metrics.';
    } else if (source.name.includes('market')) {
      snippet = 'Market trends and analysis data including growth rates, consumer preferences, and competitive intelligence.';
    } else if (source.name.includes('ontology')) {
      snippet = 'Knowledge graph structure defining entity relationships, attributes, and semantic connections.';
    } else {
      snippet = `${source.type || 'Data source'} containing relevant information for analysis.`;
    }

    return {
      id: String(index + 1),
      title: source.name,
      type: type,
      snippet: snippet,
      relevance: 0.9 - (index * 0.05), // Slight variation in relevance
      url: '#',
    };
  });
}

// Sample markdown response content
const markdownContent = `# Neurosymbolic AI Market Analysis

Based on recent analysis, neurosymbolic AI represents a **significant paradigm shift** in artificial intelligence. This approach combines the pattern recognition capabilities of neural networks with the logical reasoning of symbolic AI systems.

## Key Findings

Enterprise adoption is accelerating rapidly, with companies reporting substantial improvements in:

- **AI reliability** and interpretability
- **Complex reasoning tasks** (40% performance improvement)
- **Reduction in hallucinations** (45% decrease)

### Market Growth Indicators

The analysis shows strong investor confidence in this emerging technology sector:

1. **Patent filings** growing at 67% year-over-year
2. **$4.2B in VC investment** during 2024
3. **3.2x faster time-to-insight** for Fortune 500 companies

> "Neurosymbolic approaches are outpacing traditional ML methods across all key metrics." - Industry Report 2024

### Investment Trends

Investment data reveals:

- Traditional AI: 64% growth rate (2024)
- Neurosymbolic AI: **67% growth rate** (2024)
- Total addressable market: $15B+ by 2026

This represents a **transformative moment** for AI systems, with practical applications emerging across healthcare, finance, and autonomous systems.`;

export function AIResponse({ showResponse, content, sources, searchResponse }: AIResponseProps) {
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(false);
  const [isOnlineSourcesExpanded, setIsOnlineSourcesExpanded] = useState(false);
  
  if (!showResponse) return null;

  // Use searchResponse if provided, otherwise fall back to old format
  const useNewFormat = !!searchResponse;
  const rawAnswer = useNewFormat ? (searchResponse?.answer || '') : (content || markdownContent);
  
  // Get database sources - always show them (prefer new format, fallback to old)
  let databaseSources: Source[] = [];
  
  if (useNewFormat && searchResponse?.sources?.database?.length > 0) {
    // Use sources from new API response
    databaseSources = searchResponse.sources.database.map((src, idx) => ({
      id: src.id || String(idx + 1),
      title: src.name || src.title || `Source ${idx + 1}`,
      type: src.type || 'database',
      snippet: src.snippet || 'Database source containing relevant information.',
      relevance: src.relevance || 0.8,
      url: '#'
    }));
  } else if (sources && sources.length > 0) {
    // Fallback to old format sources
    databaseSources = convertToSources(sources);
  }
  
  // Get online sources
  const onlineSources: OnlineSource[] = useNewFormat && searchResponse?.sources?.online
    ? (searchResponse.sources.online || [])
    : [];
  
  // Always show database sources if we have them (either from new format or old format)
  const hasDatabaseSources = databaseSources.length > 0;
  const hasOnlineSources = onlineSources.length > 0;
  
  // Parse answer to identify online vs database sections
  const parseAnswerSections = (answer: string, answerSections?: AnswerSection[]) => {
    // If we have structured answer sections, use them
    if (answerSections && answerSections.length > 0) {
      return answerSections.map(section => ({
        text: section.text,
        sourceType: section.sourceType
      }));
    }
    
    // Try to parse [Online] and [DB] markers from the answer
    const sections: Array<{ text: string; sourceType: 'database' | 'online' | 'combined' }> = [];
    const parts = answer.split(/(\[Online\]|\[DB\]|\[External\]|\[ONLINE\]|\[DATABASE\])/gi);
    
    let currentType: 'database' | 'online' | 'combined' = 'combined';
    let currentText = '';
    
    parts.forEach((part) => {
      if (part.match(/\[Online\]|\[External\]|\[ONLINE\]/i)) {
        if (currentText.trim()) {
          sections.push({ text: currentText.trim(), sourceType: currentType });
          currentText = '';
        }
        currentType = 'online';
      } else if (part.match(/\[DB\]|\[DATABASE\]/i)) {
        if (currentText.trim()) {
          sections.push({ text: currentText.trim(), sourceType: currentType });
          currentText = '';
        }
        currentType = 'database';
      } else {
        currentText += part;
      }
    });
    
    if (currentText.trim()) {
      sections.push({ text: currentText.trim(), sourceType: currentType });
    }
    
    // If we have online sources but no online sections detected, mark the whole answer as combined
    // but we'll still show online sources separately
    if (sections.length === 0 || (hasOnlineSources && !sections.some(s => s.sourceType === 'online'))) {
      return [{ text: answer, sourceType: 'combined' as const }];
    }
    
    return sections;
  };
  
  const answerSections = useNewFormat && searchResponse?.answerSections
    ? parseAnswerSections(rawAnswer, searchResponse.answerSections)
    : parseAnswerSections(rawAnswer);
  
  console.log('📊 AIResponse sources:', {
    useNewFormat,
    hasSearchResponse: !!searchResponse,
    databaseSourcesCount: databaseSources.length,
    onlineSourcesCount: onlineSources.length,
    hasDatabaseSources,
    hasOnlineSources,
    answerSectionsCount: answerSections.length
  });


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      {/* Info banner if external sources were used */}
      {hasOnlineSources && (
        <div className="bg-[#eff6ff] border-l-4 border-[#2563eb] pl-4 pr-4 py-3 rounded-r-lg flex items-center gap-2 text-sm text-[#1e40af]">
          <Globe className="w-4 h-4 text-[#2563eb]" />
          <span>This response includes information from external research sources. External content is highlighted below.</span>
        </div>
      )}
      
      {/* Main Response Text with Markdown - Split by source type */}
      <div className="prose prose-slate max-w-none space-y-4">
        {answerSections.map((section, sectionIndex) => {
          const isOnline = section.sourceType === 'online';
          const isDatabase = section.sourceType === 'database';
          const isCombined = section.sourceType === 'combined';
          
          return (
            <div
              key={sectionIndex}
              className={
                isOnline
                  ? "bg-[#f0f7ff] border-l-4 border-[#2563eb] pl-4 pr-4 py-3 rounded-r-lg"
                  : isDatabase
                  ? "bg-[#f9f9f9] border-l-4 border-[#472be9] pl-4 pr-4 py-3 rounded-r-lg"
                  : ""
              }
            >
              {isOnline && (
                <div className="flex items-center gap-2 mb-2 text-xs text-[#2563eb] font-medium">
                  <Globe className="w-3 h-3" />
                  <span>External Research</span>
        </div>
              )}
              {isDatabase && (
                <div className="flex items-center gap-2 mb-2 text-xs text-[#472be9] font-medium">
                  <Database className="w-3 h-3" />
                  <span>From Your Database</span>
        </div>
              )}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className={`text-2xl font-semibold mt-6 mb-4 flex items-center gap-2 ${isOnline ? 'text-[#1e40af]' : 'text-[#1a1a1a]'}`} {...props}>
                      {!isOnline && <Award className="w-6 h-6 text-[#472be9]" />}
                      {props.children}
                    </h1>
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className={`text-xl font-semibold mt-6 mb-3 ${isOnline ? 'text-[#1e40af]' : 'text-[#1a1a1a]'}`} {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className={`text-lg font-semibold mt-5 mb-2 ${isOnline ? 'text-[#1e40af]' : 'text-[#2d2d2d]'}`} {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className={`leading-relaxed mb-4 text-[15px] ${isOnline ? 'text-[#1e3a8a]' : 'text-[#333333]'}`} {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="space-y-2 my-4 ml-6" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="space-y-2 my-4 ml-6 list-decimal" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className={`leading-relaxed text-[15px] pl-2 ${isOnline ? 'text-[#1e3a8a]' : 'text-[#333333]'}`} {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className={`font-semibold ${isOnline ? 'text-[#1e40af]' : 'text-[#1a1a1a]'}`} {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className={`border-l-4 pl-4 py-2 my-4 italic ${isOnline ? 'border-[#2563eb] bg-[#dbeafe] text-[#1e3a8a]' : 'border-[#472be9] bg-[#f9f9f9] text-[#555555]'}`} {...props} />
                  ),
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code className={`bg-[#f5f5f5] px-1.5 py-0.5 rounded text-sm font-mono ${isOnline ? 'text-[#1e40af]' : 'text-[#d63384]'}`} {...props} />
                    ) : (
                      <code className="block bg-[#f5f5f5] text-[#333333] p-4 rounded-lg my-4 text-sm font-mono overflow-x-auto" {...props} />
                    ),
                  a: ({ node, ...props }) => (
                    <a className={`hover:underline ${isOnline ? 'text-[#2563eb] hover:text-[#1e40af]' : 'text-[#472be9] hover:text-[#3a22ba]'}`} {...props} />
                  ),
                }}
              >
                {section.text}
              </ReactMarkdown>
            </div>
          );
        })}
      </div>

      {/* Database Sources - Always show if available */}
      {databaseSources.length > 0 && (
        <div className="bg-[#f9f9f9] border border-[#ebebeb] rounded-lg p-4 mt-6">
        <button
          onClick={() => setIsSourcesExpanded(!isSourcesExpanded)}
          className="flex items-center justify-between w-full text-left hover:bg-[#f0f0f0] -m-4 p-4 rounded-lg transition-colors"
        >
            <div className="text-sm text-[#333333] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#472be9]" />
              From Your Database ({databaseSources.length})
            </div>
          {isSourcesExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#666666]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#666666]" />
          )}
        </button>
        
        {!isSourcesExpanded ? (
          <div className="mt-3 flex flex-wrap gap-2">
              {databaseSources.map((source, index) => (
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
              {databaseSources.map((source, index) => (
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
      )}

      {/* Online Sources - Show if available */}
      {hasOnlineSources && (
        <div className="bg-[#f0f7ff] border-2 border-[#2563eb] rounded-lg p-4 mt-6">
          <button
            onClick={() => setIsOnlineSourcesExpanded(!isOnlineSourcesExpanded)}
            className="flex items-center justify-between w-full text-left hover:bg-[#e6f2ff] -m-4 p-4 rounded-lg transition-colors"
          >
            <div className="text-sm font-semibold text-[#1e40af] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2563eb]" />
              External Sources ({onlineSources.length})
            </div>
            {isOnlineSourcesExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#666666]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#666666]" />
            )}
          </button>
          
          {!isOnlineSourcesExpanded ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {onlineSources.map((source, index) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOnlineSourcesExpanded(true)}
                  className="inline-flex items-center gap-1 text-xs bg-white border border-[#b3d9ff] rounded-full px-3 py-1 hover:border-[#2563eb] hover:bg-[#e6f2ff] transition-colors"
                >
                  <span className="text-[#2563eb]">[{index + 1}]</span>
                  <span className="text-[#666666] truncate max-w-[200px]">{source.title}</span>
                  <ExternalLink className="w-3 h-3 text-[#2563eb]" />
                </a>
              ))}
        </div>
      ) : (
            <div className="space-y-3 mt-3">
              {onlineSources.map((source, index) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-xs bg-white border border-[#b3d9ff] rounded-lg p-3 hover:border-[#2563eb] hover:shadow-sm transition-all group"
                >
                  {source.image && (
                    <img 
                      src={source.image} 
                      alt={source.title}
                      className="w-16 h-16 object-cover rounded border border-[#e5e7eb] flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="text-[#333333] font-medium group-hover:text-[#2563eb] transition-colors line-clamp-2">
                        {source.title}
                      </div>
                      <ExternalLink className="w-3 h-3 text-[#2563eb] flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="text-[#999999] mb-2 line-clamp-2">{source.snippet || source.url}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#2563eb] text-[10px] truncate max-w-[300px]">{source.url}</span>
                      <span className="text-[#999999]">•</span>
                      <span className="text-[#2563eb]">{Math.round(source.relevance * 100)}% relevant</span>
                    </div>
                  </div>
                </a>
              ))}
          </div>
          )}
        </div>
      )}

      {/* Action Buttons - Removed Keep Going and End Conversation, only Generate Action Plan remains in ChatArea */}
    </motion.div>
  );
}
