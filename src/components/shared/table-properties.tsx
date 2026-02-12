"use client"

import * as React from "react"
import {
  Settings,
  Eye,
  EyeOff,
  Pin,
  GripVertical,
  Filter,
  ArrowUpDown,
  Grid,
  X,
  Check,
  SortAsc,
  SortDesc,
  Plus,
  Search,
  PinOff,
  ChevronDown,
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"
import { cn } from "../ui/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs"

export interface ColumnConfig {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  isPinned: boolean
  pinSide?: 'left' | 'right'
  isVisible: boolean
  width: number
  minWidth: number
  sortable?: boolean
  filterable?: boolean
  groupable?: boolean
  options?: string[]
}

interface FilterConfig {
  id: string
  columnKey: string
  label: string
  values: string[]
}

interface SortConfig {
  id: string
  columnKey: string
  direction: string
  label: string
}

interface TablePropertiesProps {
  columns: ColumnConfig[]
  onColumnChange: (columns: ColumnConfig[]) => void
  filters?: FilterConfig[]
  onFiltersChange?: (filters: FilterConfig[]) => void
  sorts?: SortConfig[]
  onSortsChange?: (sorts: SortConfig[]) => void
  groupBy?: any
  onGroupByChange?: (groupBy: any) => void
}

export function TableProperties({
  columns,
  onColumnChange,
  filters = [],
  onFiltersChange,
  sorts = [],
  onSortsChange,
  groupBy,
  onGroupByChange,
}: TablePropertiesProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("columns")
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null)
  const [openFilterId, setOpenFilterId] = React.useState<string | null>(null)
  const [searchTerms, setSearchTerms] = React.useState<Record<string, string>>({})

  const visibleColumns = columns.filter(col => col.isVisible)
  const filterableColumns = columns.filter(col => col.filterable)
  const sortableColumns = columns.filter(col => col.sortable)
  const groupableColumns = columns.filter(col => col.groupable)

  // Column drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
    
    // Add drag styling to the dragged element
    const target = e.currentTarget as HTMLElement
    target.style.opacity = '0.5'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're leaving the entire element
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null)
    }
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const newColumns = [...columns]
    const draggedColumn = newColumns[draggedIndex]
    
    newColumns.splice(draggedIndex, 1)
    newColumns.splice(dropIndex, 0, draggedColumn)
    
    onColumnChange(newColumns)
    setDraggedIndex(null)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.opacity = '1'
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleToggleColumnVisibility = (columnKey: string) => {
    const newColumns = columns.map(col => 
      col.key === columnKey ? { ...col, isVisible: !col.isVisible } : col
    )
    onColumnChange(newColumns)
  }

  const handleToggleColumnPin = (columnKey: string, pinSide?: 'left' | 'right') => {
    const newColumns = columns.map(col => {
      if (col.key === columnKey) {
        if (pinSide) {
          return { ...col, isPinned: true, pinSide }
        } else {
          return { ...col, isPinned: false, pinSide: undefined }
        }
      }
      return col
    })
    onColumnChange(newColumns)
  }

  // Filter handlers
  const handleAddFilter = (columnKey: string) => {
    if (!onFiltersChange) return
    
    const column = columns.find(col => col.key === columnKey)
    if (!column) return

    const newFilter: FilterConfig = {
      id: `filter-${Date.now()}`,
      columnKey: columnKey,
      label: column.label,
      values: [],
    }
    onFiltersChange([...filters, newFilter])
    
    setTimeout(() => {
      setOpenFilterId(newFilter.id)
    }, 0)
  }

  const handleRemoveFilter = (filterId: string) => {
    if (!onFiltersChange) return
    onFiltersChange(filters.filter(filter => filter.id !== filterId))
    setOpenFilterId(null)
  }

  const handleToggleFilterValue = (filterId: string, value: string) => {
    if (!onFiltersChange) return
    
    const newFilters = filters.map(filter => {
      if (filter.id !== filterId) return filter
      
      const newValues = filter.values.includes(value)
        ? filter.values.filter(v => v !== value)
        : [...filter.values, value]
      
      return { ...filter, values: newValues }
    })
    onFiltersChange(newFilters)
  }

  const handleClearAllFilterValues = (filterId: string) => {
    if (!onFiltersChange) return
    
    const newFilters = filters.map(filter =>
      filter.id === filterId ? { ...filter, values: [] } : filter
    )
    onFiltersChange(newFilters)
  }

  const handleSearchChange = (filterId: string, searchTerm: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [filterId]: searchTerm
    }))
  }

  const getFilteredOptions = (filter: FilterConfig) => {
    const column = columns.find(col => col.key === filter.columnKey)
    if (!column || !column.options) return []
    
    const searchTerm = searchTerms[filter.id] || ''
    if (!searchTerm) return column.options
    
    return column.options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const getFilterDisplayText = (filter: FilterConfig) => {
    if (filter.values.length === 0) {
      return filter.label
    } else if (filter.values.length === 1) {
      return `${filter.label}: ${filter.values[0]}`
    } else {
      return `${filter.label}: ${filter.values.length} selected`
    }
  }

  // Sort handlers
  const handleAddSortColumn = (columnKey: string, direction: 'asc' | 'desc' = 'asc') => {
    if (!onSortsChange) return
    
    const column = columns.find(col => col.key === columnKey)
    if (!column) return

    const newSort: SortConfig = {
      id: `sort-${Date.now()}`,
      columnKey: columnKey,
      direction: direction,
      label: column.label,
    }
    onSortsChange([...sorts, newSort])
  }

  const handleRemoveSort = (sortId: string) => {
    if (!onSortsChange) return
    onSortsChange(sorts.filter(sort => sort.id !== sortId))
  }

  const handleUpdateSort = (sortId: string, field: string, value: string) => {
    if (!onSortsChange) return
    
    const newSorts = sorts.map(sort =>
      sort.id === sortId ? { ...sort, [field]: value } : sort
    )
    onSortsChange(newSorts)
  }

  // Group handlers
  const handleSetGroup = (column: any) => {
    if (!onGroupByChange) return
    onGroupByChange(groupBy?.key === column.key ? null : column)
  }

  const addedFilterKeys = filters.map(filter => filter.columnKey)
  const availableFilters = filterableColumns.filter(
    col => !addedFilterKeys.includes(col.key)
  )

  const renderFilterBar = () => {
    if (filters.length === 0) return null

    return (
      <div className="space-y-2">
        {filters.map((filter) => {
          const column = columns.find(col => col.key === filter.columnKey)
          if (!column) return null
          
          const Icon = column.icon
          const hasValues = filter.values.length > 0
          const showSearch = (column.options?.length || 0) > 10
          const filteredOptions = getFilteredOptions(filter)
          
          return (
            <div key={filter.id} className="flex items-center gap-1">
              <DropdownMenu 
                open={openFilterId === filter.id} 
                onOpenChange={(open) => {
                  setOpenFilterId(open ? filter.id : null)
                  if (!open) {
                    setSearchTerms(prev => ({
                      ...prev,
                      [filter.id]: ''
                    }))
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "max-w-[200px] gap-1 justify-start h-8 text-sm",
                      hasValues && "border-primary bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{getFilterDisplayText(filter)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-64 z-[110]"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  avoidCollisions={true}
                  collisionPadding={8}
                >
                  <div className="px-2 py-1.5 text-sm border-b">
                    {filter.label} is
                  </div>
                  
                  {showSearch && (
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search options..."
                          value={searchTerms[filter.id] || ''}
                          onChange={(e) => handleSearchChange(filter.id, e.target.value)}
                          className="pl-8 h-8 text-sm"
                          autoFocus
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="max-h-48 overflow-y-auto" role="listbox">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <div 
                          key={option}
                          className="flex items-center gap-3 px-2 py-2 hover:bg-accent cursor-pointer rounded-sm"
                          onClick={(e) => {
                            e.preventDefault()
                            handleToggleFilterValue(filter.id, option)
                          }}
                          role="option"
                          aria-selected={filter.values.includes(option)}
                        >
                          <Checkbox 
                            checked={filter.values.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked !== filter.values.includes(option)) {
                                handleToggleFilterValue(filter.id, option)
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-sm flex-1 select-none">{option}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        No options found
                      </div>
                    )}
                  </div>
                  
                  {filter.values.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleClearAllFilterValues(filter.id)}
                        className="text-sm text-muted-foreground"
                      >
                        Clear all selections
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFilter(filter.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/10"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )
        })}
      </div>
    )
  }

  const renderSortBar = () => {
    if (sorts.length === 0) return null

    return (
      <div className="space-y-2">
        {sorts.map((sort, index) => (
          <div key={sort.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <Badge variant="secondary" className="text-xs">
              {sort.label}
            </Badge>
            {index === 0 && sorts.length > 1 && (
              <Badge variant="outline" className="text-xs">Primary</Badge>
            )}
            <Select
              value={sort.direction}
              onValueChange={(value) => handleUpdateSort(sort.id, 'direction', value)}
            >
              <SelectTrigger className="w-24 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc" className="text-xs">
                  <div className="flex items-center gap-1">
                    <SortAsc className="h-3 w-3" />
                    Asc
                  </div>
                </SelectItem>
                <SelectItem value="desc" className="text-xs">
                  <div className="flex items-center gap-1">
                    <SortDesc className="h-3 w-3" />
                    Desc
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveSort(sort.id)}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
          <span className="sr-only">View settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 z-[100]" 
        align="end" 
        side="bottom"
        sideOffset={5}
        avoidCollisions={true}
        collisionPadding={10}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="p-4 border-b">
            <h3 className="font-medium text-sm">View Settings</h3>
            <TabsList className="grid w-full grid-cols-4 mt-3">
              <TabsTrigger value="columns" className="text-xs">Columns</TabsTrigger>
              <TabsTrigger value="filters" className="text-xs">Filters</TabsTrigger>
              <TabsTrigger value="sort" className="text-xs">Sort</TabsTrigger>
              <TabsTrigger value="group" className="text-xs">Group</TabsTrigger>
            </TabsList>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            <TabsContent value="columns" className="p-4 mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  Columns ({visibleColumns.length} visible)
                </Label>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newColumns = columns.map(col => ({ ...col, isVisible: true }))
                      onColumnChange(newColumns)
                    }}
                    className="h-7 text-xs px-2"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newColumns = columns.map(col => 
                        col.key === 'actions' ? col : { ...col, isVisible: false }
                      )
                      onColumnChange(newColumns)
                    }}
                    className="h-7 text-xs px-2"
                  >
                    <EyeOff className="h-3 w-3 mr-1" />
                    None
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                {columns.map((column, index) => (
                  <div
                    key={column.key}
                    className={cn(
                      "flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-move transition-all duration-200",
                      "border border-transparent",
                      draggedIndex === index && "opacity-50 scale-[0.98]",
                      dragOverIndex === index && "border-primary border-dashed bg-primary/5",
                      "select-none"
                    )}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="drag-handle cursor-move p-1 -m-1 hover:bg-muted/30 rounded">
                      <GripVertical className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <column.icon className="h-3 w-3 text-muted-foreground" />
                    <span className="flex-1 text-sm">{column.label}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onMouseDown={(e) => e.stopPropagation()}
                          onDragStart={(e) => e.preventDefault()}
                          className={cn(
                            "h-6 w-6 p-0 relative",
                            column.isPinned ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          <Pin className="h-3 w-3" />
                          {column.isPinned && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-[6px] text-primary-foreground font-bold">
                                {column.pinSide === 'left' ? 'L' : 'R'}
                              </span>
                            </div>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-32 z-[120]" 
                        align="center"
                        side="left"
                        avoidCollisions={true}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleColumnPin(column.key, 'left')
                          }}
                          className={cn(
                            "text-xs cursor-pointer",
                            column.isPinned && column.pinSide === 'left' && "bg-accent"
                          )}
                        >
                          <Pin className="h-3 w-3 mr-2" />
                          Pin Left
                          {column.isPinned && column.pinSide === 'left' && (
                            <Check className="h-3 w-3 ml-auto" />
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleColumnPin(column.key, 'right')
                          }}
                          className={cn(
                            "text-xs cursor-pointer",
                            column.isPinned && column.pinSide === 'right' && "bg-accent"
                          )}
                        >
                          <Pin className="h-3 w-3 mr-2 scale-x-[-1]" />
                          Pin Right
                          {column.isPinned && column.pinSide === 'right' && (
                            <Check className="h-3 w-3 ml-auto" />
                          )}
                        </DropdownMenuItem>
                        {column.isPinned && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleColumnPin(column.key)
                              }}
                              className="text-xs cursor-pointer text-muted-foreground"
                            >
                              <PinOff className="h-3 w-3 mr-2" />
                              Unpin
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div onMouseDown={(e) => e.stopPropagation()} onDragStart={(e) => e.preventDefault()}>
                      <Switch
                        checked={column.isVisible}
                        onCheckedChange={() => handleToggleColumnVisibility(column.key)}
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="filters" className="p-4 mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  Filters {filters.length > 0 && `(${filters.length})`}
                </Label>
                {availableFilters.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-[110]" avoidCollisions={true}>
                      <DropdownMenuLabel className="text-xs">Select column</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {availableFilters.map((column) => (
                        <DropdownMenuItem
                          key={column.key}
                          onClick={() => handleAddFilter(column.key)}
                          className="text-sm"
                        >
                          <column.icon className="h-3 w-3 mr-2" />
                          {column.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              {renderFilterBar()}
              {filters.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onFiltersChange?.([])} 
                  className="h-7 text-xs w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </TabsContent>

            <TabsContent value="sort" className="p-4 mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  Sort {sorts.length > 0 && `(${sorts.length})`}
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-[110]" avoidCollisions={true}>
                    <DropdownMenuLabel className="text-xs">Sort by column</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-sm">
                        <SortAsc className="h-3 w-3 mr-2" />
                        Ascending
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {sortableColumns.map((column) => (
                          <DropdownMenuItem
                            key={`${column.key}-asc`}
                            onClick={() => handleAddSortColumn(column.key, 'asc')}
                            className="text-sm"
                          >
                            <column.icon className="h-3 w-3 mr-2" />
                            {column.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-sm">
                        <SortDesc className="h-3 w-3 mr-2" />
                        Descending
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {sortableColumns.map((column) => (
                          <DropdownMenuItem
                            key={`${column.key}-desc`}
                            onClick={() => handleAddSortColumn(column.key, 'desc')}
                            className="text-sm"
                          >
                            <column.icon className="h-3 w-3 mr-2" />
                            {column.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {renderSortBar()}
            </TabsContent>

            <TabsContent value="group" className="p-4 mt-0 space-y-4">
              <Label className="text-sm">
                Group By {groupBy && `(${groupBy.label})`}
              </Label>
              {groupBy ? (
                <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
                  <groupBy.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary flex-1">{groupBy.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onGroupByChange?.(null)}
                    className="h-6 w-6 p-0 text-primary hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No grouping applied</div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start h-8 text-xs">
                    <Grid className="h-3 w-3 mr-2" />
                    {groupBy ? 'Change Group' : 'Select Column'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full z-[110]" avoidCollisions={true}>
                  <DropdownMenuLabel className="text-xs">Group by column</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {groupBy && (
                    <>
                      <DropdownMenuItem onClick={() => onGroupByChange?.(null)} className="text-sm">
                        <X className="h-3 w-3 mr-2" />
                        Remove grouping
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {groupableColumns.map((column) => (
                    <DropdownMenuItem
                      key={column.key}
                      onClick={() => handleSetGroup(column)}
                      className="text-sm"
                    >
                      <column.icon className="h-3 w-3 mr-2" />
                      {column.label}
                      {groupBy?.key === column.key && (
                        <Check className="h-3 w-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TabsContent>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
