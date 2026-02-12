import * as React from "react";
import { Button } from "../ui/button";
import Leo from "../../imports/Leo-68-134";
import { useAppStore } from "../../stores/app-store";

const LeoIconSmall = () => (
  <div className="h-4 w-4 flex items-center justify-center shrink-0">
    <Leo />
  </div>
);

interface AskLeoButtonProps {
  className?: string;
  onClick?: () => void;
  /** Chart/graph title for context-aware Leo AI analysis */
  chartTitle?: string;
  /** Brief description of what the chart shows */
  chartDescription?: string;
  /** Stringified summary of the chart data for Leo to analyze */
  chartData?: string;
}

export function AskLeoButton({ className = "", onClick, chartTitle, chartDescription, chartData }: AskLeoButtonProps) {
  const openLeoPanelWithQuery = useAppStore((s) => s.openLeoPanelWithQuery);

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    // Build a context-rich prompt for Leo
    if (chartTitle) {
      let prompt = `Analyze the "${chartTitle}" chart`;
      if (chartDescription) {
        prompt += ` (${chartDescription})`;
      }
      if (chartData) {
        prompt += `. Data: ${chartData}`;
      }
      prompt += `. Provide a summary, highlight any issues or concerns, and share key insights.`;
      openLeoPanelWithQuery(prompt);
    } else {
      openLeoPanelWithQuery("Analyze this section and provide a summary, any issues, and key insights.");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`gap-1.5 text-xs font-medium transition-all duration-200 ${className}`}
    >
      <LeoIconSmall />
      Ask Leo
      {/* Brand radial glow — same pattern as primary button */}
      <span
        className="absolute inset-0 pointer-events-none opacity-0 transition-all duration-200 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 z-0"
        style={{
          background:
            "radial-gradient(at bottom, color-mix(in oklch, var(--brand-color) 6%, transparent), transparent)",
        }}
      />
    </Button>
  );
}
