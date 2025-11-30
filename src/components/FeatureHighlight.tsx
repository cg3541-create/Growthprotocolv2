import { Brain, Database, Zap, FileSearch } from "lucide-react";

export function FeatureHighlight() {
  const features = [
    {
      icon: Brain,
      title: "Neurosymbolic AI",
      description: "Combines neural networks with symbolic reasoning for enhanced accuracy",
    },
    {
      icon: Database,
      title: "Multi-Source Data",
      description: "Access research papers, lakehouse data, and real-time web scraping",
    },
    {
      icon: Zap,
      title: "Automated Workflow",
      description: "8-stage process from prompt to final delivery with validation",
    },
    {
      icon: FileSearch,
      title: "Explainable Results",
      description: "Transparent reasoning with visual insights and data provenance",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className="bg-white border border-[#ebebeb] rounded-xl p-4 hover:border-[#472be9] transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-[#472be9]/10 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-[#472be9]" />
            </div>
            <h3 className="text-[#333333] text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-[#666666] leading-relaxed">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}
