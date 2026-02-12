"use client"

import * as React from "react"
import { ArrowUpRight, LucideIcon } from "lucide-react"
import { cn } from "../ui/utils"
import { Button } from "../ui/button"
import Leo from "../../imports/Leo-68-134"
import { useAppStore } from "../../stores/app-store"

export interface InsightCardData {
  title: string
  description: string
  icon: LucideIcon
  /** Optional metric value displayed prominently */
  metric?: string
}

export interface InsightCardProps {
  data: InsightCardData
  className?: string
  onClick?: () => void
}

const LeoIconSmall = () => (
  <div className="h-3.5 w-3.5 flex items-center justify-center shrink-0">
    <Leo />
  </div>
)

/**
 * InsightCard — Reusable card with white background and a subtle brand
 * radial glow behind it.  Used for actionable insights, recommendations, and
 * contextual call-outs throughout the application.
 *
 * Layout:
 *   ┌─────────────────────────────────┐
 *   │  ● icon   Title         →      │
 *   │           Description          │
 *   │           [Metric]             │
 *   │                    [Ask Leo]   │
 *   └─────────────────────────────────┘
 *   (brand gradient sits behind the card)
 */
export function InsightCard({ data, className, onClick }: InsightCardProps) {
  const { title, description, icon: Icon, metric } = data
  const openLeoPanelWithQuery = useAppStore((s) => s.openLeoPanelWithQuery)

  const handleAskLeo = (e: React.MouseEvent) => {
    e.stopPropagation() // Don't trigger card onClick
    const prompt = `Analyze the insight: "${title}" — ${description}${metric ? ` (Metric: ${metric})` : ""}. Provide a deeper analysis, any related issues, and actionable recommendations.`
    openLeoPanelWithQuery(prompt)
  }

  return (
    <div className={cn("relative", className)}>
      {/* Keyframe definition — gentle one-time lift + glow via box-shadow
          Uses color-mix to derive alpha variants from --brand-color */}
      <style>{`
        @keyframes insight-enter {
          0%   { box-shadow: 0 0 0 0 color-mix(in oklch, var(--brand-color) 0%, transparent); transform: translateY(0); }
          40%  { box-shadow: 0 4px 24px 4px color-mix(in oklch, var(--brand-color) 18%, transparent); transform: translateY(-3px); }
          70%  { box-shadow: 0 2px 16px 2px color-mix(in oklch, var(--brand-color) 12%, transparent); transform: translateY(-1px); }
          100% { box-shadow: 0 1px 12px 1px color-mix(in oklch, var(--brand-color) 8%, transparent); transform: translateY(0); }
        }
      `}</style>

      {/* Card — glow rendered as box-shadow so it's never clipped */}
      <div
        className={cn(
          "relative bg-card border border-border rounded-lg p-4 shadow-sm",
          "animate-[insight-enter_2s_ease-in-out_forwards]",
          onClick && "cursor-pointer transition-shadow hover:shadow-md"
        )}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onClick()
                }
              }
            : undefined
        }
      >
        <div className="flex items-start justify-between gap-3">
          {/* Icon + content */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="mt-0.5 text-brand flex-shrink-0">
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-primary leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Arrow */}
          {onClick && (
            <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          )}
        </div>

        {/* Ask Leo ghost button */}
        <div className="flex justify-end mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAskLeo}
            className="gap-1.5 text-xs font-medium h-7 px-2 transition-all duration-200"
          >
            <LeoIconSmall />
            Ask Leo
            <span
              className="absolute inset-0 pointer-events-none opacity-0 transition-all duration-200 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 z-0"
              style={{
                background:
                  "radial-gradient(at bottom, color-mix(in oklch, var(--brand-color) 6%, transparent), transparent)",
              }}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Utility factory for creating InsightCard data objects.
 */
export function createInsightCardData(
  title: string,
  description: string,
  icon: LucideIcon,
  metric?: string
): InsightCardData {
  return { title, description, icon, metric }
}
