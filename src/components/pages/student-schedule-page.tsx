import * as React from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  User,
  Briefcase,
  Building2,
  MapPin,
  CalendarDays,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  MoreHorizontal,
  TrendingUp,
  AlertTriangle,
  Activity,
  Bell,
  Eye,
  FileText,
  Download,
  Calendar,
  Award,
  Target,
  Sparkles,
} from "lucide-react"
import { cn } from "../ui/utils"
import { DataTable, type ColumnConfig, type PaginationInfo } from "../shared/data-table"
import type { ActiveFilter, FilterConfig } from "../shared/filter-bar"
import { createSimpleMetricData } from "../shared/simple-metric"
import type { ViewSettings } from "../shared/view-manager"
import { generateStudentScheduleData } from "../../data/mock-data"
import { formatDaysUntil } from "../../utils/date-utils"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { InsightCard, createInsightCardData } from "../shared/insight-card"
import {
  PrimaryPageTemplate,
  type ViewConfig,
  type PrimaryPageFilterConfig,
  type PrimaryPageTablePropertiesConfig,
  type PrimaryPageBulkAction,
} from "../shared/primary-page-template"

// ─── NewBadge ───────────────────────────────────────────────────────────────

const NewBadge = () => (
  <span className="inline-flex items-center justify-center h-4 px-1.5 text-xs font-medium bg-chart-1 text-white rounded">
    NEW
  </span>
)

// ─── Tab icon map ───────────────────────────────────────────────────────────

const TAB_ICONS: Record<string, React.ReactNode> = {
  upcoming: <Clock className="h-4 w-4" />,
  ongoing: <TrendingUp className="h-4 w-4" />,
  completed: <CheckCircle className="h-4 w-4" />,
}

// ─── Column Definitions ─────────────────────────────────────────────────────

const upcomingColumns: ColumnConfig[] = [
  { key: "studentName", label: "Student Name", icon: User, isPinned: true, pinSide: "left", isVisible: true, width: 200, minWidth: 150, sortable: true, wrapText: true },
  { key: "siteName", label: "Site & Location", icon: Building2, isPinned: false, isVisible: true, width: 200, minWidth: 150, sortable: true },
  { key: "preceptor", label: "Preceptor", icon: User, isPinned: false, isVisible: true, width: 180, minWidth: 150, sortable: true },
  { key: "internshipName", label: "Internship", icon: Briefcase, isPinned: false, isVisible: true, width: 220, minWidth: 180, sortable: true },
  { key: "specialization", label: "Specialization", icon: GraduationCap, isPinned: false, isVisible: true, width: 180, minWidth: 150, sortable: true },
  { key: "startDate", label: "Start Date", icon: CalendarDays, isPinned: false, isVisible: true, width: 140, minWidth: 120, sortable: true },
  { key: "compliancePercent", label: "Compliance", icon: Shield, isPinned: false, isVisible: true, width: 120, minWidth: 100, sortable: true },
  { key: "readinessStatus", label: "Readiness", icon: Shield, isPinned: true, pinSide: "right", isVisible: true, width: 140, minWidth: 120, sortable: true },
  { key: "daysUntilStart", label: "Days Until Start", icon: Clock, isPinned: false, isVisible: true, width: 150, minWidth: 120, sortable: true },
  { key: "actions", label: "Action", icon: MoreHorizontal, isPinned: true, pinSide: "right", isVisible: true, width: 120, minWidth: 120, sortable: false },
]

const ongoingColumns: ColumnConfig[] = [
  { key: "studentName", label: "Student Name", icon: User, isPinned: true, pinSide: "left", isVisible: true, width: 200, minWidth: 150, sortable: true, wrapText: true },
  { key: "siteName", label: "Site & Location", icon: Building2, isPinned: false, isVisible: true, width: 200, minWidth: 150, sortable: true },
  { key: "preceptor", label: "Preceptor", icon: User, isPinned: false, isVisible: true, width: 180, minWidth: 150, sortable: true },
  { key: "internshipName", label: "Internship", icon: Briefcase, isPinned: false, isVisible: true, width: 220, minWidth: 180, sortable: true },
  { key: "specialization", label: "Specialization", icon: GraduationCap, isPinned: false, isVisible: true, width: 180, minWidth: 150, sortable: true },
  { key: "progress", label: "Progress", icon: Target, isPinned: false, isVisible: true, width: 150, minWidth: 120, sortable: false },
  { key: "endDate", label: "End Date", icon: CalendarDays, isPinned: false, isVisible: true, width: 140, minWidth: 120, sortable: true },
  { key: "lastCheckin", label: "Last Check-in", icon: Clock, isPinned: false, isVisible: true, width: 120, minWidth: 100, sortable: true },
  { key: "actions", label: "Action", icon: MoreHorizontal, isPinned: true, pinSide: "right", isVisible: true, width: 120, minWidth: 120, sortable: false },
]

const completedColumns: ColumnConfig[] = [
  { key: "studentName", label: "Student Name", icon: User, isPinned: true, pinSide: "left", isVisible: true, width: 200, minWidth: 150, sortable: true, wrapText: true },
  { key: "siteName", label: "Site & Location", icon: Building2, isPinned: false, isVisible: true, width: 200, minWidth: 150, sortable: true },
  { key: "preceptor", label: "Preceptor", icon: User, isPinned: false, isVisible: true, width: 180, minWidth: 150, sortable: true },
  { key: "internshipName", label: "Internship", icon: Briefcase, isPinned: false, isVisible: true, width: 220, minWidth: 180, sortable: true },
  { key: "specialization", label: "Specialization", icon: GraduationCap, isPinned: false, isVisible: true, width: 180, minWidth: 150, sortable: true },
  { key: "completionDate", label: "Completion Date", icon: CalendarDays, isPinned: false, isVisible: true, width: 160, minWidth: 140, sortable: true },
  { key: "finalStatus", label: "Final Status", icon: CheckCircle, isPinned: false, isVisible: true, width: 160, minWidth: 120, sortable: true },
  { key: "finalEvaluation", label: "Final Evaluation", icon: Award, isPinned: false, isVisible: true, width: 140, minWidth: 120, sortable: true },
  { key: "actions", label: "Action", icon: MoreHorizontal, isPinned: true, pinSide: "right", isVisible: true, width: 120, minWidth: 120, sortable: false },
]

function getColumnsForTab(tab: string): ColumnConfig[] {
  switch (tab) {
    case "upcoming": return upcomingColumns
    case "ongoing": return ongoingColumns
    case "completed": return completedColumns
    default: return upcomingColumns
  }
}

// ─── Bulk actions ───────────────────────────────────────────────────────────

const bulkActionDefs = [
  { label: "Send Reminder", icon: AlertCircle, action: "send-reminder", variant: "default" as const },
  { label: "Export Selected", icon: Download, action: "export", variant: "default" as const },
]

// ─── Component ──────────────────────────────────────────────────────────────

interface StudentSchedulePageProps {
  onItemClick?: (itemId: string, studentName?: string, siteName?: string) => void
}

export function StudentSchedulePage({ onItemClick }: StudentSchedulePageProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("upcoming")
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [showFilters, setShowFilters] = React.useState(false)
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([])
  const [activeMetricFilter, setActiveMetricFilter] = React.useState<string | null>(null)
  const [showBanner, setShowBanner] = React.useState(true)

  const deferredSearchQuery = React.useDeferredValue(searchQuery)
  const [isTabPending, startTabTransition] = React.useTransition()

  const handleTabChange = React.useCallback((tab: string) => {
    startTabTransition(() => {
      setActiveTab(tab)
    })
  }, [])

  const [views, setViews] = React.useState<ViewConfig[]>([
    { name: "Upcoming", count: "28", id: "upcoming", type: "table", settings: null, icon: TAB_ICONS["upcoming"] },
    { name: "Ongoing", count: "142", id: "ongoing", type: "table", settings: null, icon: TAB_ICONS["ongoing"] },
    { name: "Completed", count: "315", id: "completed", type: "table", settings: null, icon: TAB_ICONS["completed"] },
  ])

  const [columns, setColumns] = React.useState<ColumnConfig[]>(getColumnsForTab("upcoming"))
  const [tableFilters, setTableFilters] = React.useState<any[]>([])
  const [tableSorts, setTableSorts] = React.useState<any[]>([])
  const [tableGroupBy, setTableGroupBy] = React.useState<any>(null)

  const studentScheduleData = React.useMemo(() => generateStudentScheduleData(50), [])

  React.useEffect(() => {
    setColumns(getColumnsForTab(activeTab))
    setCurrentPage(1)
    setSelectedItems([])
  }, [activeTab])

  const activeView = views.find((v) => v.id === activeTab)
  React.useEffect(() => {
    if (activeView?.settings?.columns) {
      setColumns(activeView.settings.columns as ColumnConfig[])
    }
  }, [activeView])

  const computedMetrics = React.useMemo(() => {
    const totalPlacements = studentScheduleData.length
    const startingThisWeek = studentScheduleData.filter((s) => s.daysUntilStart <= 7).length
    const complianceAlerts = studentScheduleData.filter((s) => s.compliancePercent < 85).length
    const avgCompliance = Math.round(
      studentScheduleData.reduce((sum, s) => sum + s.compliancePercent, 0) / totalPlacements
    )
    return [
      createSimpleMetricData("Total Placements", String(totalPlacements), { trend: "up", trendValue: "+12" }),
      createSimpleMetricData("Starting This Week", String(startingThisWeek), {
        trend: startingThisWeek > 5 ? "up" : "down",
        trendValue: startingThisWeek > 5 ? `+${startingThisWeek - 5}` : `-${5 - startingThisWeek}`,
      }),
      createSimpleMetricData("Compliance Alerts", String(complianceAlerts), {
        trend: complianceAlerts > 10 ? "up" : "down",
        trendValue: complianceAlerts > 10 ? `+${complianceAlerts - 10}` : `-${10 - complianceAlerts}`,
      }),
      createSimpleMetricData("Avg Compliance", `${avgCompliance}%`, {
        trend: avgCompliance >= 85 ? "up" : "down",
        trendValue: avgCompliance >= 85 ? "+3" : "-2",
      }),
    ]
  }, [studentScheduleData])

  const filterConfigs: FilterConfig[] = React.useMemo(
    () => [
      { key: "readinessStatus", label: "Readiness Status", icon: Shield, options: Array.from(new Set(studentScheduleData.map((s) => s.readinessStatus))).sort() },
      { key: "discipline", label: "Discipline", icon: GraduationCap, options: Array.from(new Set(studentScheduleData.map((s) => s.discipline))).sort() },
      { key: "specialization", label: "Specialization", icon: Briefcase, options: Array.from(new Set(studentScheduleData.map((s) => s.specialization))).sort() },
      { key: "siteName", label: "Site", icon: Building2, options: Array.from(new Set(studentScheduleData.map((s) => s.siteName))).sort() },
      { key: "location", label: "Location", icon: MapPin, options: Array.from(new Set(studentScheduleData.map((s) => s.location))).sort() },
      { key: "duration", label: "Duration", icon: Clock, options: Array.from(new Set(studentScheduleData.map((s) => s.duration))).sort() },
    ],
    [studentScheduleData]
  )

  const filteredData = React.useMemo(() => {
    let data = studentScheduleData
    data = data.filter((item) => item.stage === activeTab)
    if (activeMetricFilter) {
      if (activeMetricFilter === "starting-this-week") data = data.filter((item) => item.daysUntilStart <= 7)
      else if (activeMetricFilter === "compliance-alerts") data = data.filter((item) => item.compliancePercent < 85)
      else if (activeMetricFilter === "at-risk") data = data.filter((item) => item.progressPercent < 50 || item.lastCheckin === "7+ days ago")
    }
    if (activeFilters.length > 0) {
      activeFilters.forEach((filter) => {
        if (filter.values.length > 0) {
          data = data.filter((item) => {
            const value = (item as any)[filter.key]
            return filter.values.includes(String(value))
          })
        }
      })
    }
    if (deferredSearchQuery.trim()) {
      const q = deferredSearchQuery.toLowerCase()
      data = data.filter(
        (item) =>
          item.studentName.toLowerCase().includes(q) ||
          item.studentEmail.toLowerCase().includes(q) ||
          item.studentId.toLowerCase().includes(q) ||
          item.scheduleId.toLowerCase().includes(q) ||
          item.internshipName.toLowerCase().includes(q) ||
          item.courseName.toLowerCase().includes(q) ||
          item.availabilityName.toLowerCase().includes(q) ||
          item.discipline.toLowerCase().includes(q) ||
          item.specialization.toLowerCase().includes(q) ||
          item.siteName.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
      )
    }
    if (activeTab === "upcoming") data = [...data].sort((a, b) => a.daysUntilStart - b.daysUntilStart)
    return data
  }, [studentScheduleData, activeTab, deferredSearchQuery, activeMetricFilter, activeFilters])

  React.useEffect(() => {
    const counts: Record<string, number> = {
      upcoming: studentScheduleData.filter((item) => item.stage === "upcoming").length,
      ongoing: studentScheduleData.filter((item) => item.stage === "ongoing").length,
      completed: studentScheduleData.filter((item) => item.stage === "completed").length,
    }
    setViews((prev) => prev.map((v) => ({ ...v, count: String(counts[v.id] ?? v.count) })))
  }, [studentScheduleData])

  const paginationInfo: PaginationInfo = React.useMemo(() => {
    const totalItems = filteredData.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)
    return { currentPage, totalPages, pageSize, totalItems, startItem, endItem }
  }, [filteredData.length, currentPage, pageSize])

  const currentData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const handleAddFilter = React.useCallback(
    (filterKey: string) => {
      const existing = activeFilters.find((f) => f.key === filterKey)
      if (existing) { setShowFilters(true); return }
      const newFilter: ActiveFilter = { id: `${filterKey}_${Date.now()}`, key: filterKey, label: filterConfigs.find((c) => c.key === filterKey)?.label || filterKey, values: [] }
      setActiveFilters((prev) => [...prev, newFilter])
      setShowFilters(true)
    },
    [activeFilters, filterConfigs]
  )

  const handleToggleFilterValue = React.useCallback((filterId: string, value: string) => {
    setActiveFilters((prev) => prev.map((f) => {
      if (f.id === filterId) {
        const newValues = f.values.includes(value) ? f.values.filter((v) => v !== value) : [...f.values, value]
        return { ...f, values: newValues }
      }
      return f
    }))
    setCurrentPage(1)
  }, [])

  const handleRemoveFilter = React.useCallback((filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== filterId))
    setCurrentPage(1)
  }, [])

  const handleClearAllFilters = React.useCallback(() => { setActiveFilters([]); setCurrentPage(1) }, [])
  const handleClearSelection = React.useCallback(() => setSelectedItems([]), [])

  const handleBulkAction = React.useCallback((action: string, ids: string[]) => {
    console.log(`Bulk action: ${action}`, ids)
    setSelectedItems([])
  }, [])

  const handleAddView = React.useCallback((viewName: string, viewSettings: ViewSettings) => {
    const newView: ViewConfig = { name: viewName, count: "0", id: `view_${Date.now()}`, type: viewSettings.type, settings: viewSettings }
    setViews((prev) => [...prev, newView])
    setActiveTab(newView.id)
  }, [])

  const handleMetricClick = React.useCallback((index: number) => {
    startTabTransition(() => {
      if (index === 0) { setActiveTab("upcoming"); setActiveMetricFilter(null); setCurrentPage(1) }
      else if (index === 1) { setActiveTab("upcoming"); setActiveMetricFilter("starting-this-week"); setCurrentPage(1) }
      else if (index === 2) { setActiveTab("upcoming"); setActiveMetricFilter("compliance-alerts"); setCurrentPage(1) }
      else if (index === 3) { setActiveTab("completed"); setActiveMetricFilter(null); setCurrentPage(1) }
    })
  }, [startTabTransition])

  React.useEffect(() => {
    const timer = setTimeout(() => setActiveMetricFilter(null), 100)
    return () => clearTimeout(timer)
  }, [activeTab])

  const hasActiveFilterValues = activeFilters.some((f) => f.values.length > 0)

  const getRowClassName = React.useCallback((item: any) => {
    if (activeTab === "upcoming") {
      const isUrgent = item.daysUntilStart >= 1 && item.daysUntilStart <= 4
      const isNotReady = item.compliancePercent < 100 || item.readinessStatus !== "Ready"
      if (isUrgent && isNotReady) return "bg-destructive/10 hover:bg-destructive/15"
    }
    return ""
  }, [activeTab])

  const renderCell = React.useCallback(
    (column: ColumnConfig, item: any, _index: number) => {
      switch (column.key) {
        case "studentName":
          return (
            <div className="flex items-start gap-2 w-full overflow-hidden">
              <div className="flex-1 space-y-1 min-w-0">
                <div className={cn("data-table-clickable font-medium text-base", !column.wrapText && "line-clamp-1")} onClick={() => onItemClick?.(item.id, item.studentName, item.siteName)}>
                  {item.studentName}
                </div>
                <div className={cn("text-xs text-foreground", !column.wrapText && "truncate")}>{item.studentEmail}</div>
              </div>
              {activeTab === "upcoming" && (
                <TooltipProvider>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {item.hasNewActivity && (
                      <Tooltip>
                        <TooltipTrigger asChild><div><NewBadge /></div></TooltipTrigger>
                        <TooltipContent side="top" className="bg-popover text-popover-foreground border border-border"><p className="text-xs">New activity on this schedule</p></TooltipContent>
                      </Tooltip>
                    )}
                    {item.hasNotification && (
                      <Tooltip>
                        <TooltipTrigger asChild><div className="relative group cursor-help"><Bell className="h-3.5 w-3.5 text-chart-4" /><span className="sr-only">Has notification</span></div></TooltipTrigger>
                        <TooltipContent side="top" className="bg-popover text-popover-foreground border border-border"><p className="text-xs">Pending notifications or messages</p></TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TooltipProvider>
              )}
            </div>
          )
        case "internshipName":
          return (
            <div className="space-y-1 w-full overflow-hidden">
              <div className="truncate font-medium text-base">{item.internshipName}</div>
              <div className="text-xs text-foreground truncate">{item.courseName} &bull; {item.availabilityName}</div>
              <div className="text-xs text-foreground truncate">ID: {item.scheduleId}</div>
            </div>
          )
        case "siteName":
          return (
            <div className="space-y-1 w-full overflow-hidden">
              <div className="truncate font-medium text-base data-table-clickable" onClick={() => console.log("Navigate to site:", item.siteName)}>{item.siteName}</div>
              <div className="text-xs text-foreground truncate">{item.location}</div>
            </div>
          )
        case "preceptor":
          return (
            <div className="space-y-1 w-full overflow-hidden">
              <div className="truncate font-medium text-base">{item.preceptorName}</div>
              <div className="text-xs text-foreground truncate">{item.preceptorTitle}</div>
            </div>
          )
        case "specialization":
          return <div className="font-medium text-base">{item.specialization}</div>
        case "startDate":
          return (<div className="space-y-1"><div className="font-medium text-base">{item.startDate}</div><div className="text-xs text-muted-foreground">{item.duration}</div></div>)
        case "endDate":
          return (<div className="space-y-1"><div className="font-medium text-base">{item.endDate}</div><div className="text-xs text-muted-foreground">{item.duration}</div></div>)
        case "readinessStatus":
          return (
            <Badge variant="secondary" className={item.readinessStatus === "Ready" ? "bg-chart-2/10 text-chart-2 border-chart-2/20" : item.readinessStatus === "Action Required" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-chart-4/10 text-chart-4 border-chart-4/20"}>
              {item.readinessStatus === "Ready" && <CheckCircle className="h-3 w-3 mr-1" />}
              {item.readinessStatus === "Action Required" && <AlertTriangle className="h-3 w-3 mr-1" />}
              {item.readinessStatus === "Pending" && <Clock className="h-3 w-3 mr-1" />}
              {item.readinessStatus}
            </Badge>
          )
        case "daysUntilStart":
          return (
            <div className="space-y-1">
              <div className="font-medium text-base">{formatDaysUntil(item.daysUntilStart)}</div>
              <div className="text-xs text-muted-foreground">
                {item.daysUntilStart < 7 ? (<span className="flex items-center gap-1 text-chart-4"><AlertCircle className="h-3 w-3" />Starting soon</span>)
                  : item.daysUntilStart < 30 ? (<span className="flex items-center gap-1"><Clock className="h-3 w-3" />This month</span>)
                  : item.daysUntilStart < 90 ? (<span className="flex items-center gap-1"><Clock className="h-3 w-3" />This quarter</span>)
                  : (<span className="flex items-center gap-1"><Clock className="h-3 w-3" />Long-term</span>)}
              </div>
            </div>
          )
        case "progress":
          return (
            <div className="space-y-1">
              <div className="font-medium text-base">{item.progress}</div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-1"><div className="bg-chart-1 h-1.5 rounded-full transition-all" style={{ width: `${item.progressPercent}%` }} /></div>
            </div>
          )
        case "compliancePercent":
          return (
            <div className="space-y-1">
              <div className="font-medium text-base">{item.compliancePercent}%</div>
              <div className="text-xs text-muted-foreground">
                {item.compliancePercent === 100 ? (<span className="flex items-center gap-1 text-chart-2"><CheckCircle className="h-3 w-3" />Complete</span>)
                  : item.compliancePercent >= 85 ? (<span className="flex items-center gap-1 text-chart-1"><Activity className="h-3 w-3" />On track</span>)
                  : (<span className="flex items-center gap-1 text-chart-4"><AlertTriangle className="h-3 w-3" />School action needed</span>)}
              </div>
            </div>
          )
        case "lastCheckin":
          return <div className="font-medium text-base">{item.lastCheckin}</div>
        case "completionDate":
          return (<div className="space-y-1"><div className="font-medium text-base">{item.completionDate}</div><div className="text-xs text-muted-foreground">{item.duration}</div></div>)
        case "finalStatus":
          return (<Badge variant="secondary" className="bg-chart-2/10 text-chart-2 border-chart-2/20"><CheckCircle className="h-3 w-3 mr-1" />{item.finalStatus}</Badge>)
        case "finalEvaluation":
          return (
            <div className="space-y-1">
              <div className="font-medium text-base">{item.finalEvaluation}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                {parseFloat(item.finalEvaluation) >= 4.7 ? (<><CheckCircle className="h-3 w-3 text-chart-2" /><span className="text-chart-2">Excellent</span></>) : (<><CheckCircle className="h-3 w-3 text-chart-1" /><span className="text-chart-1">Good</span></>)}
              </div>
            </div>
          )
        case "actions": {
          const getPrimaryAction = () => {
            if (activeTab === "upcoming") return { label: "View", icon: Eye, onClick: () => onItemClick?.(item.id, item.studentName, item.siteName) }
            if (activeTab === "ongoing") return { label: "Progress", icon: Activity, onClick: () => onItemClick?.(item.id, item.studentName, item.siteName) }
            return { label: "Report", icon: FileText, onClick: () => onItemClick?.(item.id, item.studentName, item.siteName) }
          }
          const getMenuItems = () => {
            if (activeTab === "upcoming") {
              return (<><DropdownMenuItem><AlertCircle className="h-4 w-4 mr-2" />Send Reminder</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem><User className="h-4 w-4 mr-2" />Contact Student</DropdownMenuItem><DropdownMenuItem><Clock className="h-4 w-4 mr-2" />Postpone Start</DropdownMenuItem></>)
            }
            if (activeTab === "ongoing") {
              return (<><DropdownMenuItem><Activity className="h-4 w-4 mr-2" />View Evaluations</DropdownMenuItem><DropdownMenuItem><Calendar className="h-4 w-4 mr-2" />Schedule Check-in</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem><User className="h-4 w-4 mr-2" />Contact Student</DropdownMenuItem><DropdownMenuItem><AlertTriangle className="h-4 w-4 mr-2" />Report Issue</DropdownMenuItem></>)
            }
            return (<><DropdownMenuItem><Download className="h-4 w-4 mr-2" />Download Certificate</DropdownMenuItem><DropdownMenuItem><FileText className="h-4 w-4 mr-2" />View Full History</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem><Download className="h-4 w-4 mr-2" />Export Records</DropdownMenuItem></>)
          }
          const primaryAction = getPrimaryAction()
          const PrimaryIcon = primaryAction.icon
          return (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 px-2" onClick={primaryAction.onClick}><PrimaryIcon className="h-3.5 w-3.5 mr-1" />{primaryAction.label}</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">More actions</span></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">{getMenuItems()}</DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        }
        default:
          return <div className="font-medium text-base">{item[column.key]}</div>
      }
    },
    [activeTab, onItemClick]
  )

  const getItemId = React.useCallback((item: any) => item.id, [])

  const filtersConfig: PrimaryPageFilterConfig = {
    showFilters,
    onToggleFilters: () => setShowFilters((p) => !p),
    filterConfigs,
    activeFilters,
    onAddFilter: handleAddFilter,
    onToggleFilterValue: handleToggleFilterValue,
    onRemoveFilter: handleRemoveFilter,
    onClearAllFilters: handleClearAllFilters,
    hasActiveFilterValues,
  }

  const tablePropertiesConfig: PrimaryPageTablePropertiesConfig = {
    columns,
    onColumnChange: setColumns,
    filters: tableFilters,
    onFiltersChange: setTableFilters,
    sorts: tableSorts,
    onSortsChange: setTableSorts,
    groupBy: tableGroupBy,
    onGroupByChange: setTableGroupBy,
  }

  const bulkActions: PrimaryPageBulkAction[] = bulkActionDefs.map((a) => ({
    label: a.label,
    icon: a.icon,
    onClick: () => handleBulkAction(a.action, selectedItems),
    variant: a.variant,
  }))

  const complianceAlertCount = React.useMemo(
    () => studentScheduleData.filter((s) => s.compliancePercent < 85).length,
    [studentScheduleData]
  )

  const metricsBanner = showBanner ? (
    <InsightCard
      data={createInsightCardData(
        "Compliance action needed",
        `${complianceAlertCount} students are below 85% compliance and need documentation before their rotation starts.`,
        Sparkles
      )}
      onClick={() => { setActiveTab("upcoming"); setActiveMetricFilter("compliance-alerts"); setCurrentPage(1) }}
    />
  ) : null

  const renderTabContent = React.useCallback(
    (tabId: string) => {
      return (
        <DataTable
          data={currentData}
          columns={columns}
          onColumnChange={setColumns}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          renderCell={renderCell}
          getItemId={getItemId}
          showSelection={true}
          paginationInfo={paginationInfo}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => { setPageSize(newSize); setCurrentPage(1) }}
          onColumnFilter={handleAddFilter}
          getRowClassName={tabId === "upcoming" ? getRowClassName : undefined}
        />
      )
    },
    [currentData, columns, selectedItems, paginationInfo, renderCell, getItemId, getRowClassName, handleAddFilter]
  )

  return (
    <PrimaryPageTemplate
      title="Student Schedule"
      description="Monitor student assignments, readiness status, and compliance"
      metrics={{ data: computedMetrics, onMetricClick: handleMetricClick, columns: 4, banner: metricsBanner }}
      views={views}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onAddView={handleAddView}
      searchPlaceholder="Search students..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filters={filtersConfig}
      tableProperties={tablePropertiesConfig}
      renderTabContent={renderTabContent}
      selectedItems={selectedItems}
      onClearSelection={handleClearSelection}
      bulkActions={bulkActions}
      className="student-schedule-page-container"
    />
  )
}