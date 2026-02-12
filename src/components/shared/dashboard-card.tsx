"use client"

import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { cn } from "../ui/utils"

export interface DashboardCardData {
  title: string
  value: string
  change?: string
  trend?: "up" | "down" | "neutral"
  description?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export interface DashboardCardProps {
  data: DashboardCardData
  variant?: "medium" | "large" | "insight"
  className?: string
  onClick?: () => void
}

export function DashboardCard({ 
  data, 
  variant = "medium", 
  className,
  onClick
}: DashboardCardProps) {
  const { title, value, change, trend, description, icon: Icon, color } = data

  // Size configurations for each variant
  const variantConfig = {
    medium: {
      headerPadding: "pb-1",
      titleSize: "text-xs",
      iconSize: "h-3 w-3",
      contentPadding: "pt-1", 
      valueSize: "text-3xl",
      showChange: true,
      showDescription: false,
    },
    large: {
      headerPadding: "pb-2",
      titleSize: "text-sm",
      iconSize: "h-4 w-4",
      contentPadding: "pt-2",
      valueSize: "text-4xl",
      showChange: true,
      showDescription: true,
    },
    insight: {
      headerPadding: "pb-1",
      titleSize: "text-sm font-semibold text-foreground",
      iconSize: "h-4 w-4",
      contentPadding: "pt-2",
      valueSize: "text-lg font-medium text-foreground",
      showChange: false,
      showDescription: true,
    },
  }

  const config = variantConfig[variant]
  const TrendIcon = trend === "up" ? TrendingUp : (trend === "down" ? TrendingDown : null)
  const trendColor = trend === "up" ? "text-chart-2" : (trend === "down" ? "text-destructive" : "text-muted-foreground")

  return (
    <Card 
      className={cn(
        onClick ? "cursor-pointer transition-all hover:shadow-md hover:border-primary/50" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", config.headerPadding)}>
        <CardTitle className={cn("font-medium", config.titleSize)}>
          {title}
        </CardTitle>
        <Icon className={cn(
          config.iconSize, 
          variant === "insight" ? "text-foreground" : color
        )} />
      </CardHeader>
      <CardContent className={config.contentPadding}>
        <div className={cn("font-bold font-display", config.valueSize)}>{value}</div>
        
        {config.showChange && change && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
            {trend && TrendIcon && (
              <div className="flex items-center">
                <TrendIcon className={cn("mr-0.5 h-2 w-2", trendColor)} />
                <span className={trendColor}>{change}</span>
              </div>
            )}
            {!trend && <span>{change}</span>}
            <span>from last month</span>
          </div>
        )}
        
        {config.showDescription && description && (
          <p className={cn(
            "text-xs mt-2",
            variant === "insight" ? "text-foreground" : "text-muted-foreground"
          )}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Utility function to create dashboard card data
export function createDashboardCardData(
  title: string,
  value: string,
  icon: React.ComponentType<{ className?: string }>,
  color: string,
  options?: {
    change?: string
    trend?: "up" | "down" | "neutral"
    description?: string
  }
): DashboardCardData {
  return {
    title,
    value,
    icon,
    color,
    ...options,
  }
}
