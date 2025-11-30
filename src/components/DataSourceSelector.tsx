import { FileText, Database, Globe } from "lucide-react";
import { useState } from "react";

interface DataSource {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  details: string[];
  color: string;
}

export function DataSourceSelector() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const dataSources: DataSource[] = [
    {
      id: "research-papers",
      name: "Research Papers",
      icon: FileText,
      description: "Custom injected high-quality data",
      details: ["Patents", "Academic journals", "Industry reports", "Technical papers"],
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    },
    {
      id: "ontoloop-data",
      name: "Ontoloop Data",
      icon: Database,
      description: "Ontoloop Lakehouse",
      details: ["Snowflake", "Databricks", "SQL databases"],
      color: "bg-pink-50 border-pink-200 hover:border-pink-400",
    },
    {
      id: "web-data",
      name: "Data Scraping",
      icon: Globe,
      description: "Web data collection",
      details: ["ChatGPT", "Claude", "LLM open models"],
      color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[#333333] mb-1">Choose Research Method</h3>
        <p className="text-xs text-[#666666]">Select your data source to begin analysis</p>
      </div>

      <div className="grid gap-3">
        {dataSources.map((source) => {
          const Icon = source.icon;
          const isSelected = selectedSource === source.id;
          return (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-[#0466C8] bg-[#0466C8]/5 shadow-lg"
                  : `${source.color} border`
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-[#0466C8] text-white" : "bg-white text-[#0466C8]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[#333333] mb-1">{source.name}</div>
                  <div className="text-xs text-[#666666] mb-2">{source.description}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {source.details.map((detail, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-0.5 rounded ${
                          isSelected
                            ? "bg-[#0466C8]/10 text-[#0466C8]"
                            : "bg-white text-[#666666] border border-[#ebebeb]"
                        }`}
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
