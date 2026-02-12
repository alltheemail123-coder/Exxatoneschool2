"use client"

import * as React from "react"
import { Sparkles, X, AlertTriangle, Clock } from "lucide-react"
import { SimpleMetric, createSimpleMetricData } from "../simple-metric"
import { InsightCard, createInsightCardData } from "../insight-card"
import { cn } from "../ui/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

// Metric data with historical tracking
const metricsData = {
  pendingRequests: { current: 23, previous: 18, trend: "up" as const },
  confirmedPlacements: { current: 89, previous: 77, trend: "up" as const },
  pendingReviews: { current: 8, previous: 11, trend: "down" as const },
  availableSlots: { current: 156, previous: 132, trend: "up" as const },
  complianceRate: { current: 98, previous: 96, trend: "up" as const },
  newApplications: { current: 34, previous: 27, trend: "up" as const },
}

/**
 * MetricShowcase - Key metrics with attention-focused insight card
 * InsightCard on left, metrics grid on right
 */
export function MetricShowcase() {
  const [timePeriod, setTimePeriod] = React.useState("week")
  const [showBanner, setShowBanner] = React.useState(false)

  const handleMetricClick = (metricName: string) => {
    console.log("Metric clicked:", metricName)
    // Add navigation or detail view logic here
  }

  // Calculate actionable insights that require attention
  const actionableInsight = React.useMemo(() => {
    // Priority 1: Pending reviews with pending requests backing up
    if (metricsData.pendingReviews.current >= 8 && metricsData.pendingRequests.current >= 20) {
      return {
        title: "Review Bottleneck",
        description: `${metricsData.pendingReviews.current} reviews pending with ${metricsData.pendingRequests.current} new requests waiting. Clear reviews to maintain placement velocity.`,
        icon: AlertTriangle,
        action: "Review Queue",
      }
    }
    
    // Priority 2: Pending requests need attention
    if (metricsData.pendingRequests.current >= 20) {
      const increase = metricsData.pendingRequests.current - metricsData.pendingRequests.previous
      return {
        title: "Requests Need Attention",
        description: `${metricsData.pendingRequests.current} pending requests (+${increase} this ${timePeriod}). Review and respond to maintain service quality.`,
        icon: Clock,
        action: "Pending Requests",
      }
    }
    
    // Priority 3: Compliance dropped below threshold
    if (metricsData.complianceRate.current < 95) {
      return {
        title: "Compliance Alert",
        description: `Compliance rate at ${metricsData.complianceRate.current}%. Review documentation gaps and coordinate with sites to improve.`,
        icon: AlertTriangle,
        action: "Compliance Details",
      }
    }
    
    // Fallback: General attention item
    return {
      title: "Needs Attention",
      description: `${metricsData.pendingReviews.current} reviews and ${metricsData.newApplications.current} new applications require immediate action.`,
      icon: Sparkles,
      action: "Action Items",
    }
  }, [timePeriod])

  return (
    <div className="relative">
      {/* Gradient Background - Brand color to White */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, color-mix(in oklch, var(--brand-color) 8%, transparent), transparent)" }}
      />
      
      {/* Content with relative positioning */}
      <div className="relative">
        {/* Header with Title and Filter */}
        <div className="px-4 lg:px-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Key Metrics</h3>
              <p className="text-muted-foreground mt-1">
                Overview of performance indicators
              </p>
            </div>
            
            {/* Time Period Filter */}
            <div className="flex items-center gap-2">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-[180px] h-9 bg-transparent">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">vs last week</SelectItem>
                  <SelectItem value="month">vs last month</SelectItem>
                  <SelectItem value="quarter">vs last quarter</SelectItem>
                  <SelectItem value="year">vs last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Layout: Metrics Grid (left) + Insight Card (right) */}
        <div className="px-[24px] pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            {/* Left: 2x3 Metrics Grid with full-height separators - wrapped to contain dividers */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-2 gap-x-6 gap-y-10 md:divide-x divide-border">
                {/* Row 1, Column 1 */}
                <div className="md:pr-6">
                  <SimpleMetric
                    data={createSimpleMetricData("Pending requests", String(metricsData.pendingRequests.current), {
                      trend: metricsData.pendingRequests.trend,
                      trendValue: `+${metricsData.pendingRequests.current - metricsData.pendingRequests.previous}`,
                    })}
                    onClick={() => handleMetricClick("Pending requests")}
                  />
                </div>

                {/* Row 1, Column 2 */}
                <div className="md:px-6">
                  <SimpleMetric
                    data={createSimpleMetricData("Confirmed placements", String(metricsData.confirmedPlacements.current), {
                      trend: metricsData.confirmedPlacements.trend,
                      trendValue: `+${metricsData.confirmedPlacements.current - metricsData.confirmedPlacements.previous}`,
                    })}
                    onClick={() => handleMetricClick("Confirmed placements")}
                  />
                </div>

                {/* Row 1, Column 3 */}
                <div className="md:pl-6">
                  <SimpleMetric
                    data={createSimpleMetricData("Pending Reviews", String(metricsData.pendingReviews.current), {
                      trend: metricsData.pendingReviews.trend,
                      trendValue: `-${metricsData.pendingReviews.previous - metricsData.pendingReviews.current}`,
                    })}
                    onClick={() => handleMetricClick("Pending Reviews")}
                  />
                </div>

                {/* Row 2, Column 1 */}
                <div className="md:pr-6">
                  <SimpleMetric
                    data={createSimpleMetricData("Available Slots", String(metricsData.availableSlots.current), {
                      trend: metricsData.availableSlots.trend,
                      trendValue: `+${metricsData.availableSlots.current - metricsData.availableSlots.previous}`,
                    })}
                    onClick={() => handleMetricClick("Available Slots")}
                  />
                </div>

                {/* Row 2, Column 2 */}
                <div className="md:px-6">
                  <SimpleMetric
                    data={createSimpleMetricData("New Applications", String(metricsData.newApplications.current), {
                      trend: metricsData.newApplications.trend,
                      trendValue: `+${metricsData.newApplications.current - metricsData.newApplications.previous}`,
                    })}
                    onClick={() => handleMetricClick("New Applications")}
                  />
                </div>

                {/* Row 2, Column 3 */}
                <div className="md:pl-6">
                  <SimpleMetric
                    data={createSimpleMetricData("Compliance Rate", `${metricsData.complianceRate.current}%`, {
                      trend: metricsData.complianceRate.trend,
                      trendValue: `+${metricsData.complianceRate.current - metricsData.complianceRate.previous}`,
                    })}
                    onClick={() => handleMetricClick("Compliance Rate")}
                  />
                </div>
              </div>
            </div>

            {/* Right: Actionable Insight Card */}
            <div className="flex items-stretch">
              <InsightCard
                data={createInsightCardData(
                  actionableInsight.title,
                  actionableInsight.description,
                  actionableInsight.icon
                )}
                onClick={() => handleMetricClick(actionableInsight.action)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Horizontal Separator at Bottom of Gradient */}
        <div className="h-px bg-border" />
      </div>

      {/* Floating Dismissible Insight Banner — bottom-right toast */}
      {showBanner && (
        <div className="fixed bottom-4 right-6 z-50 w-full max-w-sm">
          <div
            className="relative"
            style={{
              animation: "toast-slide-in-right 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
          >
            <style>{`
              @keyframes toast-slide-in-right {
                0%   { opacity: 0; transform: translateX(100%); }
                100% { opacity: 1; transform: translateX(0); }
              }
            `}</style>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute -top-2 -right-2 z-10 rounded-full bg-background border border-border shadow-md hover:bg-accent transition-colors p-1"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
            <InsightCard
              data={createInsightCardData(
                "Needs attention",
                "5 requests require immediate review and action.",
                Sparkles
              )}
              onClick={() => console.log("Needs attention clicked")}
            />
          </div>
        </div>
      )}
    </div>
  )
}
