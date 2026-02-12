import * as React from "react"
import {
  Activity, Filter, UserCheck, Edit, Eye, Trash2, Sparkles, CheckCircle,
  Users, User, MapPin, Calendar, Clock, AlertCircle, DoorOpen, Bell,
  MoreHorizontal, Copy, Archive, Settings, GraduationCap,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { OutlineSearchInput } from "../ui/outline-search-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { DataTable, type ColumnConfig } from "../data-table"
import { type PaginationInfo } from "../pagination"
import { TableProperties } from "../table-properties"
import FilterBar, { type FilterConfig, type ActiveFilter } from "../filter-bar"
import { BulkActionBar, availabilityBulkActions } from "../floating-action-bar"
import { ViewManager, type ViewSettings } from "../view-manager"
import { MetricCard, createMetricCardData } from "../metric-card"
import { availabilityData } from "../../data/availability-data"

const availabilityMetrics = [
  createMetricCardData("Open Availability", "472", DoorOpen, "text-chart-1", { change: "+12.5%", trend: "up", description: "Available availability slots" }),
  createMetricCardData("Pending Approval", "23", UserCheck, "text-chart-4", { change: "+5%", trend: "up", description: "Requests awaiting approval" }),
  createMetricCardData("Fill Rate", "89.5%", Activity, "text-chart-3", { change: "+3.2%", trend: "up", description: "Availability success rate" }),
]

interface ViewData { name: string; count: string; id: string; type: string; settings: ViewSettings | null; }
interface AvailabilityPageProps { onItemClick?: (itemId: string) => void }

export function AvailabilityPage({ onItemClick }: AvailabilityPageProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("published")
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [showFilters, setShowFilters] = React.useState(false)
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([])
  const [views, setViews] = React.useState<ViewData[]>([
    { name: "Published", count: "120", id: "published", type: "table", settings: null },
    { name: "Unpublished", count: "8", id: "unpublished", type: "table", settings: null },
    { name: "Closed", count: "67", id: "closed", type: "table", settings: null }
  ])

  const [tableFilters, setTableFilters] = React.useState<any[]>([])
  const [tableSorts, setTableSorts] = React.useState<any[]>([])
  const [tableGroupBy, setTableGroupBy] = React.useState<any>(null)

  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { key: "location", label: "Location", icon: MapPin, options: Array.from(new Set(availabilityData.map(item => item.location))).sort() },
    { key: "discipline", label: "Discipline", icon: GraduationCap, options: Array.from(new Set(availabilityData.map(item => item.discipline))).sort() },
    { key: "experienceType", label: "Experience Type", icon: Users, options: Array.from(new Set(availabilityData.map(item => item.experienceType))).sort() },
    { key: "specialization", label: "Specialization", icon: Activity, options: Array.from(new Set(availabilityData.map(item => item.specialization))).sort() },
  ], [])

  const activeView = views.find(view => view.id === activeTab);

  const [columns, setColumns] = React.useState<ColumnConfig[]>(() => [
    { key: "select", label: "Select", icon: CheckCircle, isPinned: false, pinSide: undefined, isVisible: true, width: 60, minWidth: 60 },
    { key: "name", label: "Availability", icon: DoorOpen, isPinned: false, pinSide: undefined, isVisible: true, width: 300, minWidth: 200, sortable: true, filterable: true, groupable: true, options: Array.from(new Set(availabilityData.map(item => item.name))).sort() },
    { key: "experienceType", label: "Experience Type", icon: Users, isPinned: false, pinSide: undefined, isVisible: true, width: 140, minWidth: 120, sortable: true, filterable: true, groupable: true, options: Array.from(new Set(availabilityData.map(item => item.experienceType))).sort() },
    { key: "location", label: "Location", icon: MapPin, isPinned: false, pinSide: undefined, isVisible: true, width: 160, minWidth: 140, sortable: true, filterable: true, groupable: true, options: Array.from(new Set(availabilityData.map(item => item.location))).sort() },
    { key: "discipline", label: "Discipline", icon: Activity, isPinned: false, pinSide: undefined, isVisible: true, width: 160, minWidth: 150, sortable: true, filterable: true, groupable: true, options: Array.from(new Set(availabilityData.map(item => item.discipline))).sort() },
    { key: "slots", label: "Slots", icon: User, isPinned: false, pinSide: undefined, isVisible: true, width: 120, minWidth: 100, sortable: true },
    { key: "schedule", label: "Duration", icon: Calendar, isPinned: false, pinSide: undefined, isVisible: true, width: 180, minWidth: 160, sortable: true, groupable: true, options: Array.from(new Set(availabilityData.map(item => item.duration))).sort() },
    { key: "lastRequested", label: "Last Requested", icon: Clock, isPinned: false, pinSide: undefined, isVisible: true, width: 140, minWidth: 120, sortable: true },
    { key: "actions", label: "Actions", icon: Activity, isPinned: false, pinSide: undefined, isVisible: true, width: 80, minWidth: 80 },
  ]);

  React.useEffect(() => { if (activeView?.settings?.columns) setColumns(activeView.settings.columns); }, [activeView]);
  React.useEffect(() => { if (activeView?.settings?.filters) { setActiveFilters(activeView.settings.filters.map(filter => ({ id: filter.id, key: filter.columnKey, label: filter.label, values: filter.values }))); } }, [activeView]);

  const filteredData = React.useMemo(() => {
    let data = availabilityData;
    if (activeView?.settings?.filters) { activeView.settings.filters.forEach(filter => { if (filter.values.length > 0) data = data.filter(item => filter.values.includes(item[filter.columnKey as keyof typeof item] as string)); }); }
    activeFilters.forEach(filter => { if (filter.values.length > 0) data = data.filter(item => filter.values.includes(item[filter.key as keyof typeof item] as string)); });
    tableFilters.forEach(filter => { if (filter.values.length > 0) data = data.filter(item => filter.values.includes(item[filter.columnKey as keyof typeof item] as string)); });
    if (searchQuery.trim()) { data = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase()) || item.discipline.toLowerCase().includes(searchQuery.toLowerCase()) || item.specialization.toLowerCase().includes(searchQuery.toLowerCase())); }
    if (activeView?.settings?.sorts && activeView.settings.sorts.length > 0) { data = [...data].sort((a, b) => { for (const sort of activeView.settings!.sorts) { const aVal = a[sort.columnKey as keyof typeof a]; const bVal = b[sort.columnKey as keyof typeof b]; let cmp = 0; if (aVal < bVal) cmp = -1; if (aVal > bVal) cmp = 1; if (sort.direction === 'desc') cmp *= -1; if (cmp !== 0) return cmp; } return 0; }); }
    if (tableSorts.length > 0) { data = [...data].sort((a, b) => { for (const sort of tableSorts) { const aVal = a[sort.columnKey as keyof typeof a]; const bVal = b[sort.columnKey as keyof typeof b]; let cmp = 0; if (aVal < bVal) cmp = -1; if (aVal > bVal) cmp = 1; if (sort.direction === 'desc') cmp *= -1; if (cmp !== 0) return cmp; } return 0; }); }
    return data;
  }, [activeTab, activeView, activeFilters, searchQuery, tableFilters, tableSorts])

  const paginationInfo: PaginationInfo = React.useMemo(() => {
    const totalItems = filteredData.length; const totalPages = Math.ceil(totalItems / pageSize);
    return { currentPage, totalPages, pageSize, totalItems, startItem: (currentPage - 1) * pageSize + 1, endItem: Math.min(currentPage * pageSize, totalItems) }
  }, [filteredData.length, currentPage, pageSize])

  const currentData = React.useMemo(() => filteredData.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize), [filteredData, currentPage, pageSize])

  const handleAddFilter = (filterKey: string) => { if (activeFilters.find(f => f.key === filterKey)) { setShowFilters(true); return; } setActiveFilters(prev => [...prev, { id: `${filterKey}_${Date.now()}`, key: filterKey, label: filterConfigs.find(c => c.key === filterKey)?.label || filterKey, values: [] }]); setShowFilters(true) }
  const handleToggleFilterValue = (filterId: string, value: string) => { setActiveFilters(prev => prev.map(f => f.id === filterId ? { ...f, values: f.values.includes(value) ? f.values.filter(v => v !== value) : [...f.values, value] } : f)); setCurrentPage(1) }
  const handleRemoveFilter = (filterId: string) => { setActiveFilters(prev => prev.filter(f => f.id !== filterId)); setCurrentPage(1) }
  const handleClearAllFilters = () => { setActiveFilters([]); setCurrentPage(1) }

  const handleAddView = (viewName: string, viewSettings: ViewSettings) => { const nv: ViewData = { name: viewName, count: "0", id: `view_${Date.now()}`, type: viewSettings.type, settings: viewSettings }; setViews(prev => [...prev, nv]); setActiveTab(nv.id) }
  const handleUpdateView = (viewId: string, viewSettings: ViewSettings) => { setViews(prev => prev.map(v => v.id === viewId ? { ...v, settings: viewSettings } : v)); if (viewId === activeTab && viewSettings.columns) setColumns(viewSettings.columns); }
  const handleDuplicateView = (viewId: string) => { const v = views.find(v => v.id === viewId); if (v) { const dup = { ...v, id: `view_${Date.now()}`, name: `${v.name} Copy`, count: "0" }; setViews(prev => [...prev, dup]); setActiveTab(dup.id); } }
  const handleDeleteView = (viewId: string) => { if (['published', 'unpublished', 'closed'].includes(viewId)) return; setViews(prev => prev.filter(v => v.id !== viewId)); if (activeTab === viewId) setActiveTab('published'); }
  const canDeleteView = (viewId: string) => !['published', 'unpublished', 'closed'].includes(viewId)

  const renderCell = (column: ColumnConfig, item: any, index: number) => {
    switch (column.key) {
      case "name":
        return (<div className="space-y-1 w-full overflow-hidden"><div className="flex items-center gap-2 min-w-0"><div className="line-clamp-2 data-table-clickable min-w-0 flex-1 break-words font-medium text-base" onClick={() => onItemClick?.(item.id)}>{item.name}</div>{item.isNewRequest && (<div className="flex items-center gap-1"><div className="h-2 w-2 bg-destructive rounded-full animate-pulse" /><span className="text-xs text-destructive">NEW</span></div>)}{item.hasRecentRequest && !item.isNewRequest && (<Bell className="h-3 w-3 text-chart-1" />)}</div><div className="text-xs text-muted-foreground truncate">ID: {item.id}</div></div>)
      case "experienceType":
        return (<Badge variant="secondary" withIcon iconPosition="left" className="w-fit">{item.experienceType === "Group" ? <Users className="h-3 w-3" /> : <User className="h-3 w-3" />}{item.experienceType}</Badge>)
      case "location":
        return (<div className="truncate w-full font-medium text-base">{item.location}</div>)
      case "discipline":
        return (<div className="space-y-1 w-full overflow-hidden"><div className="truncate font-medium text-base">{item.discipline}</div><div className="text-xs text-muted-foreground truncate">{item.specialization}</div></div>)
      case "slots":
        return (<div className="space-y-1"><div className="font-medium text-base">{item.isUnlimited ? (<div className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-chart-3" /><span className="text-chart-3">Unlimited</span></div>) : (`${item.totalSlots - item.totalRequest}/${item.totalSlots} Available`)}</div><div className="text-xs text-muted-foreground">{item.pendingReview > 0 && (<span className="flex items-center gap-1"><AlertCircle className="h-3 w-3 text-chart-4" />{item.pendingReview} pending</span>)}</div></div>)
      case "schedule":
        return (<div className="space-y-1 w-full overflow-hidden"><div className="truncate font-medium text-base">{item.startDate} - {item.endDate}</div><div className="text-xs text-muted-foreground">{item.isYearRound ? (<div className="flex items-center gap-1"><Calendar className="h-3 w-3 text-chart-3" /><span className="text-chart-3">Year-round</span></div>) : (<div className="flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" />{item.duration}</div>)}</div></div>)
      case "lastRequested":
        return (<div>{item.lastRequestTime ? (<div className="flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground" /><span className={item.isNewRequest ? "text-destructive font-medium text-base" : "text-foreground font-medium text-base"}>{item.lastRequestTime}</span></div>) : (<span className="text-muted-foreground">Never</span>)}</div>)
      case "actions":
        return (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Open menu</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48"><DropdownMenuItem onClick={() => onItemClick?.(item.id)}><Eye className="h-4 w-4 mr-2" />View Details</DropdownMenuItem><DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem><DropdownMenuItem><Copy className="h-4 w-4 mr-2" />Duplicate</DropdownMenuItem><DropdownMenuItem><Settings className="h-4 w-4 mr-2" />Settings</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem><Archive className="h-4 w-4 mr-2" />Archive</DropdownMenuItem><DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>)
      default:
        return <div className="font-medium text-base">{item[column.key]}</div>
    }
  }

  const getItemId = (item: any) => item.id
  const hasActiveFilterValues = activeFilters.some(f => f.values.length > 0)
  const handleClearSelection = () => setSelectedItems([])
  const handleBulkAction = (action: string, selectedIds: string[]) => { console.log(`Bulk action: ${action}`, selectedIds); setSelectedItems([]) }

  return (
    <div className="availability-page-container px-4 lg:px-6 pt-4 lg:pt-6 pb-20 space-y-6 max-w-full overflow-clip" data-page="availability">
      <div className="space-y-2"><h1 className="text-2xl font-bold text-foreground font-display">Availability</h1><p className="text-muted-foreground">Manage and monitor student availability opportunities across all sites and disciplines</p></div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{availabilityMetrics.map((metric, index) => (<MetricCard key={index} data={metric} className="p-4" />))}</div>
      <div className="bg-card border border-border rounded-lg overflow-clip min-w-0">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit"><TabsList>{views.map((view) => (<TabsTrigger key={view.id} value={view.id}><div className="flex items-center gap-2"><span>{view.name}</span><Badge variant="secondary" className="h-4 px-1.5">{view.count}</Badge></div></TabsTrigger>))}</TabsList></Tabs>
            <ViewManager onAddView={handleAddView} />
          </div>
          <div className="flex items-center gap-4">
            <OutlineSearchInput placeholder="Search availability..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64" />
            <Button variant={showFilters || hasActiveFilterValues ? "default" : "outline"} size="sm" className="h-8 w-8 p-0" onClick={() => setShowFilters(!showFilters)}><Filter className="h-4 w-4" /></Button>
            <TableProperties columns={columns} onColumnChange={setColumns} filters={tableFilters} onFiltersChange={setTableFilters} sorts={tableSorts} onSortsChange={setTableSorts} groupBy={tableGroupBy} onGroupByChange={setTableGroupBy} />
          </div>
        </div>
        {showFilters && (<FilterBar filterConfigs={filterConfigs} activeFilters={activeFilters} onAddFilter={handleAddFilter} onToggleFilterValue={handleToggleFilterValue} onRemoveFilter={handleRemoveFilter} onClearAll={handleClearAllFilters} />)}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="published" className="m-0"><DataTable data={currentData} columns={columns} onColumnChange={setColumns} selectedItems={selectedItems} onSelectionChange={setSelectedItems} renderCell={renderCell} getItemId={getItemId} showSelection={true} paginationInfo={paginationInfo} onPageChange={setCurrentPage} onPageSizeChange={(newSize) => { setPageSize(newSize); setCurrentPage(1) }} onColumnFilter={handleAddFilter} /></TabsContent>
          <TabsContent value="unpublished" className="min-h-[400px] m-0"><div className="p-8 text-center text-muted-foreground h-full flex flex-col items-center justify-center"><DoorOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" /><p>No unpublished availability items found</p></div></TabsContent>
          <TabsContent value="closed" className="min-h-[400px] m-0"><div className="p-8 text-center text-muted-foreground h-full flex flex-col items-center justify-center"><DoorOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" /><p>No closed availability items found</p></div></TabsContent>
          {views.filter(view => !['published', 'unpublished', 'closed'].includes(view.id)).map(view => (<TabsContent key={view.id} value={view.id} className="m-0"><DataTable data={currentData} columns={view.settings?.columns || columns} onColumnChange={setColumns} selectedItems={selectedItems} onSelectionChange={setSelectedItems} renderCell={renderCell} getItemId={getItemId} showSelection={true} paginationInfo={paginationInfo} onPageChange={setCurrentPage} onPageSizeChange={(newSize) => { setPageSize(newSize); setCurrentPage(1) }} onColumnFilter={handleAddFilter} /></TabsContent>))}
        </Tabs>
      </div>
      {selectedItems.length > 0 && (<BulkActionBar selectedCount={selectedItems.length} onClear={handleClearSelection} actions={availabilityBulkActions.map(action => ({ label: action.label, icon: action.icon, onClick: () => handleBulkAction(action.action, selectedItems), variant: action.variant }))} />)}
    </div>
  )
}
