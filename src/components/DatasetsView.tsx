import { Database, Bot, BookOpen, Plus, Check, Settings, RefreshCw, Upload } from "lucide-react";
import { useState } from "react";

interface DataSource {
  id: string;
  name: string;
  description: string;
  isConnected: boolean;
  lastSync?: string;
  recordCount?: string;
}

interface DataCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  sources: DataSource[];
}

const dataCategories: DataCategory[] = [
  {
    id: "databases",
    name: "Databases",
    icon: Database,
    description: "Connect to your internal databases and data warehouses",
    sources: [
      {
        id: "crm",
        name: "CRM Database",
        description: "Customer relationship management data",
        isConnected: true,
        lastSync: "2 hours ago",
        recordCount: "1.2M records"
      },
      {
        id: "sales",
        name: "Sales Database",
        description: "Historical sales and revenue data",
        isConnected: true,
        lastSync: "1 hour ago",
        recordCount: "850K records"
      },
      {
        id: "market-data",
        name: "Market Data Warehouse",
        description: "Market trends and industry statistics",
        isConnected: true,
        lastSync: "30 min ago",
        recordCount: "3.5M records"
      },
      {
        id: "competitor-db",
        name: "Competitor Intelligence DB",
        description: "Competitor pricing, products, and positioning",
        isConnected: false,
        recordCount: "0 records"
      },
      {
        id: "customer-feedback",
        name: "Customer Feedback Database",
        description: "Surveys, reviews, and sentiment data",
        isConnected: true,
        lastSync: "5 hours ago",
        recordCount: "425K records"
      }
    ]
  },
  {
    id: "ai-agents",
    name: "AI Agents",
    icon: Bot,
    description: "Automated data collection and analysis agents",
    sources: [
      {
        id: "web-scraper",
        name: "Web Scraping Agent",
        description: "Automated competitor website monitoring",
        isConnected: true,
        lastSync: "15 min ago",
        recordCount: "125K pages"
      },
      {
        id: "price-monitor",
        name: "Price Monitoring Agent",
        description: "Real-time competitor pricing tracking",
        isConnected: true,
        lastSync: "10 min ago",
        recordCount: "45K products"
      },
      {
        id: "social-listener",
        name: "Social Media Listener",
        description: "Brand mentions and sentiment across platforms",
        isConnected: true,
        lastSync: "5 min ago",
        recordCount: "2.8M mentions"
      },
      {
        id: "news-aggregator",
        name: "News Aggregation Agent",
        description: "Industry news and press releases",
        isConnected: false,
        recordCount: "0 articles"
      },
      {
        id: "patent-monitor",
        name: "Patent Monitor Agent",
        description: "Track competitor patents and innovations",
        isConnected: false,
        recordCount: "0 patents"
      }
    ]
  },
  {
    id: "academic-industry",
    name: "Academic/Industry Source",
    icon: BookOpen,
    description: "Research papers, industry reports, and market studies",
    sources: [
      {
        id: "gartner",
        name: "Gartner Research",
        description: "Market research and industry analysis",
        isConnected: true,
        lastSync: "1 day ago",
        recordCount: "1,200 reports"
      },
      {
        id: "forrester",
        name: "Forrester Reports",
        description: "Technology and business insights",
        isConnected: true,
        lastSync: "1 day ago",
        recordCount: "850 reports"
      },
      {
        id: "statista",
        name: "Statista",
        description: "Statistics and market data portal",
        isConnected: true,
        lastSync: "12 hours ago",
        recordCount: "95K datasets"
      },
      {
        id: "academic-journals",
        name: "Academic Journals",
        description: "Peer-reviewed research publications",
        isConnected: false,
        recordCount: "0 papers"
      },
      {
        id: "industry-associations",
        name: "Industry Associations",
        description: "Trade association reports and benchmarks",
        isConnected: true,
        lastSync: "2 days ago",
        recordCount: "320 reports"
      },
      {
        id: "census-data",
        name: "Census & Government Data",
        description: "Demographic and economic statistics",
        isConnected: false,
        recordCount: "0 records"
      }
    ]
  }
];

export function DatasetsView() {
  const [selectedCategory, setSelectedCategory] = useState<string>("databases");

  const currentCategory = dataCategories.find(cat => cat.id === selectedCategory);
  const connectedCount = currentCategory?.sources.filter(s => s.isConnected).length || 0;
  const totalCount = currentCategory?.sources.length || 0;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-[#e5e7eb] px-6 py-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-[#1a1a1a]">Datasets</h2>
            <p className="text-sm text-[#9ca3af]">
              Manage your connected data sources and integrations
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0466C8] text-white rounded-lg hover:bg-[#0353A4] transition-colors">
            <Plus className="w-4 h-4" />
            Add Data Source
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2">
          {dataCategories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            const connected = category.sources.filter(s => s.isConnected).length;
            const total = category.sources.length;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#0466C8] text-white"
                    : "bg-[#f8f9fa] text-[#666666] hover:bg-[#e5e7eb]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#e5e7eb] text-[#666666]"
                }`}>
                  {connected}/{total}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentCategory && (
          <>
            {/* Category Description */}
            <div className="mb-6">
              <p className="text-sm text-[#666666]">
                {currentCategory.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                  <span className="text-[#666666]">{connectedCount} Connected</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-[#e5e7eb] rounded-full"></div>
                  <span className="text-[#666666]">{totalCount - connectedCount} Available</span>
                </div>
              </div>
            </div>

            {/* Data Sources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCategory.sources.map((source) => (
                <div
                  key={source.id}
                  className={`border rounded-lg p-4 transition-all ${
                    source.isConnected
                      ? "border-[#10b981] bg-[#ecfdf5]"
                      : "border-[#e5e7eb] bg-white hover:border-[#0466C8] hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          source.isConnected
                            ? "bg-[#10b981]"
                            : "bg-[#f8f9fa]"
                        }`}
                      >
                        {source.isConnected ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          currentCategory.icon && <currentCategory.icon className="w-5 h-5 text-[#666666]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm text-[#1a1a1a] mb-1">
                          {source.name}
                        </h3>
                        <p className="text-xs text-[#666666]">
                          {source.description}
                        </p>
                      </div>
                    </div>
                    <button className="text-[#666666] hover:text-[#1a1a1a] transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Status Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#e5e7eb]">
                    <div className="flex items-center gap-4 text-xs">
                      {source.isConnected ? (
                        <>
                          <div className="flex items-center gap-1 text-[#10b981]">
                            <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse"></div>
                            <span>Active</span>
                          </div>
                          <span className="text-[#999999]">
                            {source.lastSync}
                          </span>
                          <span className="text-[#999999]">
                            {source.recordCount}
                          </span>
                        </>
                      ) : (
                        <span className="text-[#999999]">Not connected</span>
                      )}
                    </div>
                    {source.isConnected ? (
                      <button className="flex items-center gap-1 text-xs text-[#0466C8] hover:text-[#0353A4] transition-colors">
                        <RefreshCw className="w-3 h-3" />
                        Sync
                      </button>
                    ) : (
                      <button className="flex items-center gap-1 text-xs text-[#0466C8] hover:text-[#0353A4] transition-colors">
                        <Plus className="w-3 h-3" />
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State for Available Sources */}
            {totalCount - connectedCount === 0 && (
              <div className="mt-8 text-center py-12 bg-[#f8f9fa] rounded-lg">
                <Check className="w-12 h-12 text-[#10b981] mx-auto mb-3" />
                <h3 className="text-sm text-[#1a1a1a] mb-1">
                  All sources connected
                </h3>
                <p className="text-xs text-[#666666]">
                  You've connected all available sources in this category
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
