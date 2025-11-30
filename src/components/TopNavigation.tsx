import svgPaths from "../imports/svg-p98jh0h2tv";
import { Workflow, Zap, ChevronDown } from "lucide-react";
import { useState } from "react";

function Logo() {
  return (
    <div className="h-[37.293px] relative shrink-0 w-[128px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 128 38">
        <g>
          <path d={svgPaths.p1ae87380} fill="#5b4cdb" />
          <path d={svgPaths.pc4f9400} fill="#959FFF" />
          <path d={svgPaths.p291bf000} fill="#1a1a1a" />
          <path d={svgPaths.pefb300} fill="#1a1a1a" />
          <path d={svgPaths.p15cdeb00} fill="#1a1a1a" />
          <path d={svgPaths.p57ad900} fill="#1a1a1a" />
          <path d={svgPaths.pdec0500} fill="#1a1a1a" />
          <path d={svgPaths.p8620b00} fill="#5b4cdb" />
          <path d={svgPaths.pd2b8100} fill="#5b4cdb" />
        </g>
      </svg>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <button
      className={`box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] py-[8px] relative shrink-0 border-b-2 transition-colors ${
        active ? "border-[#5b4cdb]" : "border-transparent hover:border-[#e5e7eb]"
      }`}
    >
      <div className="w-5 h-5 text-[#1a1a1a]">{icon}</div>
      <p className="font-['Lato',_sans-serif] leading-[1.75] not-italic relative shrink-0 text-[#1a1a1a] text-nowrap whitespace-pre">
        {label}
      </p>
    </button>
  );
}

export function TopNavigation() {
  const [activeNav, setActiveNav] = useState("Zeus");

  return (
    <div className="bg-[#f9fafb] box-border content-stretch flex flex-col gap-[10px] items-start p-[20px] relative shadow-[0px_4px_20px_0px_rgba(0,0,0,0.16)] shrink-0 w-full">
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        {/* Logo */}
        <Logo />

        {/* Navigation */}
        <div className="content-stretch flex gap-px items-start relative shrink-0">
          <NavItem icon={<Workflow className="w-5 h-5" />} label="Workflows" active={activeNav === "Workflows"} />
          <NavItem icon={<Zap className="w-5 h-5" />} label="Zeus" active={activeNav === "Zeus"} />
        </div>

        {/* User Dropdown */}
        <div className="bg-[#f9fafb] box-border content-stretch flex flex-col gap-[10px] h-[36px] items-start justify-center px-[12px] py-[8px] relative rounded-[5px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.16)] shrink-0 w-[150px]">
          <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
            <p className="basis-0 font-['Lato',_sans-serif] grow h-[20px] leading-[1.5] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#1a1a1a] text-[14px] text-nowrap">
              Hello Yaroslav
            </p>
            <ChevronDown className="w-5 h-5 text-[#1a1a1a]" />
          </div>
        </div>
      </div>
    </div>
  );
}
