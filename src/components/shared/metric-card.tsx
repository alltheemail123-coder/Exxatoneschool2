"use client"

import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "../ui/utils"

export interface MetricCardData {
  title: string
  value: string
  change?: string
  trend?: "up" | "down" | "neutral"
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  color?: string
}

export interface MetricCardProps {
  data: MetricCardData
  className?: string
  onClick?: () => void
}

export function MetricCard({ 
  data, 
  className,
  onClick
}: MetricCardProps) {
  const { title, value, change, trend, icon: Icon, color } = data
  const TrendIcon = trend === "up" ? TrendingUp : (trend === "down" ? TrendingDown : null)
  const trendColor = trend === "up" ? "text-chart-2" : (trend === "down" ? "text-destructive" : "text-muted-foreground")

  return (
    <div 
      className={cn(
        "flex flex-col p-4 bg-background",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        {Icon && (
          <Icon className={cn("h-4 w-4", color || "text-muted-foreground")} />
        )}
      </div>
      
      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold tracking-tight font-display">{value}</div>
        {change && (
          <div className="flex items-center text-sm mb-1">
            {trend && TrendIcon && (
              <TrendIcon className={cn("mr-1 h-3 w-3", trendColor)} />
            )}
            <span className={cn("font-medium", trendColor)}>{change}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Utility function to create metric card data
export function createMetricCardData(
  title: string,
  value: string,
  icon: React.ComponentType<{ className?: string }>,
  color: string,
  options?: {
    change?: string
    trend?: "up" | "down" | "neutral"
    description?: string
  }
): MetricCardData {
  return {
    title,
    value,
    icon,
    color,
    ...options,
  }
}
