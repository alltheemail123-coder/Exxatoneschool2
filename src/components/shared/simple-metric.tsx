"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react"
import { cn } from "../ui/utils"

export interface SimpleMetricData {
  label: string
  value: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  showArrow?: boolean
}

export interface SimpleMetricProps {
  data: SimpleMetricData
  className?: string
  onClick?: () => void
}

/**
 * SimpleMetric - Minimalist borderless metric component
 * Matches the Figma design: label on top, large number below with optional arrow and count
 * Used for compact metric displays like "Assessments Completed: 03 +5"
 */
export function SimpleMetric({ 
  data, 
  className,
  onClick
}: SimpleMetricProps) {
  const { label, value, trend, trendValue, showArrow = true } = data
  
  const TrendIcon = trend === "up" ? TrendingUp : (trend === "down" ? TrendingDown : ArrowUpRight)
  const trendColor = trend === "up" 
    ? "text-chart-2" // Green theme color
    : trend === "down" 
    ? "text-destructive" // Red theme color
    : "text-foreground" // Default foreground

  return (
    <div 
      className={cn(
        "flex flex-col gap-2 transition-all duration-200 relative overflow-hidden group",
        onClick ? "cursor-pointer hover:opacity-70 active:opacity-50" : "",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {/* Label */}
      <div className="text-sm text-muted-foreground font-normal">
        {label}
      </div>
      
      {/* Value with arrow and count */}
      <div className="flex items-center gap-2">
        <div className="text-4xl font-bold tracking-tight text-foreground font-display">
          {value}
        </div>
        {showArrow && TrendIcon && (
          <div className="flex items-center gap-1">
            <TrendIcon className={cn("h-5 w-5", trendColor)} />
            {trendValue && (
              <span className={cn("text-sm font-medium", trendColor)}>
                {trendValue}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Utility function to create simple metric data
 */
export function createSimpleMetricData(
  label: string,
  value: string,
  options?: {
    trend?: "up" | "down" | "neutral"
    trendValue?: string
    showArrow?: boolean
  }
): SimpleMetricData {
  return {
    label,
    value,
    trend: options?.trend || "neutral",
    trendValue: options?.trendValue,
    showArrow: options?.showArrow ?? true,
  }
}
