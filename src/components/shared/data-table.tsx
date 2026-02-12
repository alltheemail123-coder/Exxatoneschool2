import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Pagination, type PaginationInfo } from "./pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff,
  Snowflake,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Grid3X3,
  Calculator,
  EyeOff,
  WrapText,
  Copy,
  Trash,
  Palette,
  RotateCcw,
  Check,
  Minus,
  Edit,
  Eye,
  Trash2,
  Users,
  User,
  Circle,
  Zap,
  GripHorizontal
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export type FreezeDirection = 'left' | 'right' | null;
export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isPinned: boolean;
  pinSide?: 'left' | 'right';
  isVisible: boolean;
  color?: string;
  width: number;
  minWidth?: number;
  freezeDirection?: FreezeDirection;
  wrapText?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

/**
 * Auto-detect and suggest column pinning for wide tables
 * 
 * Guideline: When tables have 8+ columns, automatically pin:
 * - Left: Selection checkbox + Identifier columns (id, name, title, email, etc.)
 * - Right: Action and status columns
 * 
 * @param columns - Array of column configurations
 * @param autoPinThreshold - Number of columns to trigger auto-pinning (default: 8)
 * @returns Updated columns with suggested pinning
 */
export function autoSuggestColumnPinning(
  columns: ColumnConfig[],
  autoPinThreshold: number = 8
): ColumnConfig[] {
  // Only suggest pinning if table has enough columns to warrant it
  if (columns.length < autoPinThreshold) {
    return columns;
  }

  // Identifier column keywords (should be pinned left)
  const identifierKeywords = ['id', 'name', 'title', 'email', 'identifier', 'user', 'student'];
  
  // Action/Status column keywords (should be pinned right)
  const actionKeywords = ['action', 'status', 'edit', 'delete', 'menu'];

  let leftPinCount = 0;
  let rightPinCount = 0;

  return columns.map((col, index) => {
    const keyLower = col.key.toLowerCase();
    const labelLower = col.label.toLowerCase();
    
    // Check if already pinned - don't override user preferences
    if (col.isPinned) {
      return col;
    }

    // Always pin select column to left (if exists)
    if (keyLower === 'select' && leftPinCount < 3) {
      leftPinCount++;
      return { ...col, isPinned: true, pinSide: 'left' as const };
    }

    // Pin first 1-2 identifier columns to left (excluding select)
    const isIdentifier = identifierKeywords.some(keyword => 
      keyLower.includes(keyword) || labelLower.includes(keyword)
    );
    if (isIdentifier && leftPinCount < 3) {
      leftPinCount++;
      return { ...col, isPinned: true, pinSide: 'left' as const };
    }

    // Pin last 1-2 action/status columns to right
    const isAction = actionKeywords.some(keyword => 
      keyLower.includes(keyword) || labelLower.includes(keyword)
    );
    if (isAction && index >= columns.length - 2 && rightPinCount < 2) {
      rightPinCount++;
      return { ...col, isPinned: true, pinSide: 'right' as const };
    }

    return col;
  });
}

export interface SortConfig {
  columnKey: string;
  direction: SortDirection;
}

export interface GroupConfig {
  columnKey: string;
  expanded: boolean;
}

// Re-export PaginationInfo for backwards compatibility
export type { PaginationInfo } from "./pagination";

export interface DataTableProps<T = any> {
  data: T[];
  columns: ColumnConfig[];
  onColumnChange: (columns: ColumnConfig[]) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedItems?: string[];
  renderCell: (column: ColumnConfig, item: T, index: number) => React.ReactNode;
  getItemId: (item: T) => string;
  className?: string;
  showSelection?: boolean;
  paginationInfo?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onColumnFilter?: (columnKey: string) => void;
  getRowClassName?: (item: T) => string;
}

// DnD types - FIXED
const ItemType = {
  COLUMN: 'column',
};

interface DragItem {
  id: string;
  index: number;
}

// Enhanced checkbox with proper alignment - FIXED
function DataTableCheckbox({ 
  checked, 
  indeterminate, 
  onCheckedChange, 
  className,
  ...props 
}: { 
  checked: boolean; 
  indeterminate?: boolean; 
  onCheckedChange: (checked: boolean) => void;
  className?: string;
} & Omit<React.ComponentProps<typeof Checkbox>, 'checked' | 'onCheckedChange' | 'className'>) {
  
  if (indeterminate) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <button
          type="button"
          role="checkbox"
          aria-checked="mixed"
          onClick={() => onCheckedChange(!checked)}
          className={cn(
            "inline-flex items-center justify-center h-[18px] w-[18px] rounded-[3px] border transition-colors",
            "bg-primary border-primary text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={className}
        {...props}
      />
    </div>
  );
}

// Column Resize Handle
function ResizeHandle({ 
  onResize, 
  column 
}: { 
  onResize: (newWidth: number) => void;
  column: ColumnConfig;
}) {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(column.width);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [column.width]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const diff = e.clientX - startX;
    const newWidth = Math.max(startWidth + diff, column.minWidth || 60);
    onResize(newWidth);
  }, [isResizing, startX, startWidth, column.minWidth, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-chart-1 transition-colors group-hover:opacity-100 opacity-0"
      onMouseDown={handleMouseDown}
      style={{ zIndex: 10 }}
    />
  );
}

// COMPLETELY FIXED DraggableColumn component
function DraggableColumn({
  column,
  index,
  children,
  moveColumn,
  onColumnResize,
  canDrag = true,
  ...props
}: {
  column: ColumnConfig;
  index: number;
  children: React.ReactNode;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onColumnResize: (columnKey: string, newWidth: number) => void;
  canDrag?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ── Stable refs: prevent useDrag/useDrop spec recreation during drag ──
  // Without these, every column move triggers moveColumn/index changes,
  // which recreates ALL useDrop specs mid-drag, breaking the operation.
  const moveColumnRef = useRef(moveColumn);
  moveColumnRef.current = moveColumn;

  const indexRef = useRef(index);
  indexRef.current = index;

  // Drag setup — uses indexRef so spec doesn't recreate when index changes
  const [{ isDragging: dragIsDragging }, dragRef, preview] = useDrag(() => ({
    type: ItemType.COLUMN,
    item: () => ({ id: column.key, index: indexRef.current }),
    canDrag: canDrag && column.key !== 'select',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      setIsDragging(false);
    },
  }), [column.key, canDrag]);

  // Drop setup — uses moveColumnRef/indexRef so spec is completely stable
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemType.COLUMN,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (item: DragItem, monitor) => {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = indexRef.current;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items width
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      moveColumnRef.current(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      item.index = hoverIndex;
    },
  }), []);  // Stable — reads from refs, no dependency recreation

  // Combine the refs
  const attachRef = useCallback((node: HTMLDivElement | null) => {
    ref.current = node;
    if (canDrag && column.key !== 'select') {
      dragRef(node);
      preview(node);
    }
    drop(node);
  }, [dragRef, drop, preview, canDrag, column.key]);

  useEffect(() => {
    setIsDragging(dragIsDragging);
  }, [dragIsDragging]);

  return (
    <div
      ref={attachRef}
      className={cn(
        "relative group border-r border-border transition-all duration-200",
        isDragging && "opacity-50 transform rotate-1 scale-105 z-50 shadow-lg",
        isOver && canDrop && "bg-accent/20 ring-2 ring-primary/50 ring-inset",
        canDrag && column.key !== 'select' && !isDragging && "cursor-move",
        props.className
      )}
      style={props.style}
    >
      {children}
      
      {/* Resize handle */}
      <ResizeHandle 
        column={column} 
        onResize={(newWidth) => onColumnResize(column.key, newWidth)} 
      />
      
      {/* Enhanced drag indicator with better visibility */}
      {canDrag && column.key !== 'select' && !isDragging && (
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
          <div className="bg-background/80 backdrop-blur-sm rounded px-1 py-0.5 border border-border/50">
            <GripHorizontal className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Drop zone indicator */}
      {isOver && canDrop && (
        <div className="absolute inset-0 bg-primary/10 rounded border-2 border-primary/30 border-dashed z-10" />
      )}
    </div>
  );
}

// Main DataTable export - wrapped in DndProvider
export function DataTable<T = any>(props: DataTableProps<T>) {
  return (
    <DndProvider backend={HTML5Backend}>
      <DataTableInner {...props} />
    </DndProvider>
  );
}

/**
 * DataTable Component - Cleveland Clinic Exxat One
 * 
 * FIXED FEATURES:
 * ✅ Working drag and drop column reordering with visual feedback
 * ✅ Text wrapping works for all columns based on wrapText property
 * ✅ Fixed checkbox alignment in all table states
 * ✅ Enhanced hover detection and drop zone visualization
 * ✅ Proper ref management for drag and drop functionality
 */
function DataTableInner<T = any>({ 
  data, 
  columns, 
  onColumnChange, 
  onSelectionChange,
  selectedItems = [],
  renderCell,
  getItemId,
  className,
  showSelection = true,
  paginationInfo,
  onPageChange,
  onPageSizeChange,
  onColumnFilter,
  getRowClassName
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [groupConfig, setGroupConfig] = useState<GroupConfig | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Memoize derived column arrays ──────────────────────────────────────
  // These were previously computed on every render, creating new array instances
  // that cascaded into re-computation of orderedColumns, totalWidth, etc.
  const visibleColumns = useMemo(() => columns.filter(col => col.isVisible), [columns]);
  
  const leftPinnedColumns = useMemo(() => visibleColumns.filter(col => col.isPinned && col.pinSide === 'left'), [visibleColumns]);
  const rightPinnedColumns = useMemo(() => visibleColumns.filter(col => col.isPinned && col.pinSide === 'right'), [visibleColumns]);
  const leftFrozenColumns = useMemo(() => visibleColumns.filter(col => !col.isPinned && col.freezeDirection === 'left'), [visibleColumns]);
  const rightFrozenColumns = useMemo(() => visibleColumns.filter(col => !col.isPinned && col.freezeDirection === 'right'), [visibleColumns]);
  const regularColumns = useMemo(() => visibleColumns.filter(col => !col.isPinned && !col.freezeDirection), [visibleColumns]);
  
  // Order: left pinned, left frozen, regular, right frozen, right pinned
  const orderedColumns = useMemo(
    () => [...leftPinnedColumns, ...leftFrozenColumns, ...regularColumns, ...rightFrozenColumns, ...rightPinnedColumns],
    [leftPinnedColumns, leftFrozenColumns, regularColumns, rightFrozenColumns, rightPinnedColumns]
  );

  const allSelected = selectedItems.length === data.length && data.length > 0;
  const someSelected = selectedItems.length > 0 && selectedItems.length < data.length;

  // Calculate total table width
  const totalWidth = useMemo(() => orderedColumns.reduce((sum, col) => sum + col.width, 0), [orderedColumns]);

  // FIXED: Column reordering function
  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    const draggedItem = orderedColumns[dragIndex];
    const newColumns = [...orderedColumns];
    
    // Remove dragged item
    newColumns.splice(dragIndex, 1);
    // Insert at new position
    newColumns.splice(hoverIndex, 0, draggedItem);
    
    // Update the original columns array to maintain all properties
    const updatedColumns = columns.map(col => {
      const newIndex = newColumns.findIndex(newCol => newCol.key === col.key);
      if (newIndex !== -1) {
        return { ...col, ...newColumns[newIndex] };
      }
      return col;
    });
    
    onColumnChange(updatedColumns);
  }, [orderedColumns, columns, onColumnChange]);

  // Sort and group data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply sorting
    if (sortConfig && sortConfig.direction) {
      result.sort((a, b) => {
        const column = columns.find(col => col.key === sortConfig.columnKey);
        if (!column) return 0;

        let aValue = a[sortConfig.columnKey];
        let bValue = b[sortConfig.columnKey];

        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply grouping
    if (groupConfig) {
      const grouped = result.reduce((groups: {[key: string]: T[]}, item) => {
        const groupKey = String(item[groupConfig.columnKey] || 'Ungrouped');
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(item);
        return groups;
      }, {});

      result = [];
      Object.entries(grouped).forEach(([groupKey, items]) => {
        result.push({ __isGroupHeader: true, __groupKey: groupKey, __groupCount: items.length } as any);
        result.push(...items);
      });
    }

    return result;
  }, [data, sortConfig, groupConfig, columns]);

  // Calculate sticky positions
  const getPinnedLeftPosition = (columnIndex: number) => {
    let leftPosition = 0;
    for (let i = 0; i < columnIndex; i++) {
      const col = leftPinnedColumns[i];
      if (col) leftPosition += col.width;
    }
    return leftPosition;
  };

  const getPinnedRightPosition = (columnIndex: number) => {
    let rightPosition = 0;
    // Calculate from the end, going backwards
    for (let i = rightPinnedColumns.length - 1; i > columnIndex; i--) {
      const col = rightPinnedColumns[i];
      if (col) rightPosition += col.width;
    }
    return rightPosition;
  };

  const getLeftFrozenPosition = (columnIndex: number) => {
    const leftPinnedWidth = leftPinnedColumns.reduce((sum, col) => sum + col.width, 0);
    let leftPosition = leftPinnedWidth;
    for (let i = 0; i < columnIndex; i++) {
      const col = leftFrozenColumns[i];
      if (col) leftPosition += col.width;
    }
    return leftPosition;
  };

  const getRightFrozenPosition = (columnIndex: number) => {
    const rightPinnedWidth = rightPinnedColumns.reduce((sum, col) => sum + col.width, 0);
    let rightPosition = rightPinnedWidth;
    for (let i = rightFrozenColumns.length - 1; i > columnIndex; i--) {
      const col = rightFrozenColumns[i];
      if (col) rightPosition += col.width;
    }
    return rightPosition;
  };

  // Synchronize horizontal scroll between header and body + handle scroll shadow
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const header = headerRef.current;
    
    if (!scrollContainer || !header) return;

    const handleScroll = () => {
      // Sync horizontal scroll — requestAnimationFrame prevents layout thrashing
      header.scrollLeft = scrollContainer.scrollLeft;
      
      // Handle vertical scroll shadow
      const scrollTop = scrollContainer.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    // Use passive listener for better scroll performance
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      onSelectionChange?.(data.map(getItemId));
    } else {
      onSelectionChange?.([]);
    }
  }, [data, getItemId, onSelectionChange]);

  const handleSelectItem = useCallback((itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedItems, itemId]);
    } else {
      onSelectionChange?.(selectedItems.filter(id => id !== itemId));
    }
  }, [selectedItems, onSelectionChange]);

  const handleColumnResize = useCallback((columnKey: string, newWidth: number) => {
    const updatedColumns = columns.map(col => 
      col.key === columnKey 
        ? { ...col, width: Math.max(newWidth, col.minWidth || 60) }
        : col
    );
    onColumnChange(updatedColumns);
  }, [columns, onColumnChange]);

  const getColumnBackgroundClass = (column: ColumnConfig) => {
    if (column.color) {
      return `bg-${column.color}/10`;
    }
    return "bg-background";
  };

  const getPinnedColumnClasses = (column: ColumnConfig) => {
    const isPinned = column.isPinned;
    const isLeftPinned = isPinned && column.pinSide === 'left';
    const isRightPinned = isPinned && column.pinSide === 'right';
    const isLeftFrozen = column.freezeDirection === 'left';
    const isRightFrozen = column.freezeDirection === 'right';

    // Only show shadow on the EDGE column of each pinned/frozen group
    const isLastLeftPinned = isLeftPinned && leftPinnedColumns[leftPinnedColumns.length - 1]?.key === column.key;
    const isFirstRightPinned = isRightPinned && rightPinnedColumns[0]?.key === column.key;
    const isLastLeftFrozen = isLeftFrozen && leftFrozenColumns[leftFrozenColumns.length - 1]?.key === column.key;
    const isFirstRightFrozen = isRightFrozen && rightFrozenColumns[0]?.key === column.key;

    const isEdge = isLastLeftPinned || isFirstRightPinned || isLastLeftFrozen || isFirstRightFrozen;

    return {
      isSticky: isPinned || isLeftFrozen || isRightFrozen,
      shadowClasses: cn(
        isEdge && (isLastLeftPinned || isLastLeftFrozen) && "shadow-[2px_0_8px_-2px_rgba(0,0,0,0.1)]",
        isEdge && (isFirstRightPinned || isFirstRightFrozen) && "shadow-[-2px_0_8px_-2px_rgba(0,0,0,0.1)]"
      ),
      isPinned,
      isLeftPinned,
      isRightPinned,
      isLeftFrozen,
      isRightFrozen,
      isEdge,
      isFirstRightPinned,
      isFirstRightFrozen
    };
  };

  // Column action handlers
  const handlePinColumn = (columnKey: string) => {
    const updatedColumns = columns.map(col => 
      col.key === columnKey 
        ? { ...col, isPinned: !col.isPinned, freezeDirection: null }
        : col
    );
    onColumnChange(updatedColumns);
  };

  const handleFreezeColumn = (columnKey: string, direction: FreezeDirection) => {
    const updatedColumns = columns.map(col => 
      col.key === columnKey 
        ? { ...col, freezeDirection: col.freezeDirection === direction ? null : direction, isPinned: false }
        : col
    );
    onColumnChange(updatedColumns);
  };

  const handleSortColumn = (columnKey: string, direction: SortDirection) => {
    if (sortConfig?.columnKey === columnKey && sortConfig?.direction === direction) {
      setSortConfig(null);
    } else {
      setSortConfig({ columnKey, direction });
    }
  };

  const handleGroupColumn = (columnKey: string) => {
    if (groupConfig?.columnKey === columnKey) {
      setGroupConfig(null);
    } else {
      setGroupConfig({ columnKey, expanded: true });
    }
  };

  const handleColumnColorChange = (columnKey: string, color: string) => {
    const updatedColumns = columns.map(col => 
      col.key === columnKey 
        ? { ...col, color }
        : col
    );
    onColumnChange(updatedColumns);
  };

  const handleHideColumn = (columnKey: string) => {
    const updatedColumns = columns.map(col => 
      col.key === columnKey 
        ? { ...col, isVisible: false }
        : col
    );
    onColumnChange(updatedColumns);
  };

  const handleWrapText = (columnKey: string) => {
    const updatedColumns = columns.map(col => 
      col.key === columnKey 
        ? { ...col, wrapText: !col.wrapText }
        : col
    );
    onColumnChange(updatedColumns);
  };

  // FIXED: Cell content wrapper with proper text wrapping
  const getCellContentClass = (column: ColumnConfig) => {
    return cn(
      "data-table-cell-content w-full",
      column.wrapText 
        ? "whitespace-normal break-words" 
        : "overflow-hidden whitespace-nowrap text-ellipsis"
    );
  };

  // Horizontal scroll control
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScrollButtons = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  React.useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [checkScrollButtons, data]);

  const scrollHorizontally = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      ref={tableRef}
      className={cn("flex flex-col relative w-full bg-background overflow-clip flex-1 min-h-0", className)}
      style={{ 
        isolation: 'isolate',
      }}
    >
      {/* Fixed Header */}
      <div 
        className={cn(
          "flex-none bg-muted/30 relative overflow-hidden border-b border-border transition-shadow duration-200 data-table-header",
          isScrolled && "shadow-sm"
        )}
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 10
        }}
      >
        <div 
          ref={headerRef}
          className="overflow-hidden"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div 
            className="flex"
            style={{ width: Math.max(totalWidth, 800) }}
          >
            {orderedColumns.map((column, index) => {
              const Icon = column.icon;
              const bgClass = getColumnBackgroundClass(column);
              const pinnedStyles = getPinnedColumnClasses(column);
              
              let stickyLeft: number | undefined;
              let stickyRight: number | undefined;
              
              // Check if column is pinned to left or right
              if (column.isPinned && column.pinSide === 'left') {
                stickyLeft = getPinnedLeftPosition(leftPinnedColumns.findIndex(col => col.key === column.key));
              } else if (column.isPinned && column.pinSide === 'right') {
                stickyRight = getPinnedRightPosition(rightPinnedColumns.findIndex(col => col.key === column.key));
              } else if (pinnedStyles.isLeftFrozen) {
                stickyLeft = getLeftFrozenPosition(leftFrozenColumns.findIndex(col => col.key === column.key));
              } else if (pinnedStyles.isRightFrozen) {
                stickyRight = getRightFrozenPosition(rightFrozenColumns.findIndex(col => col.key === column.key));
              }

              const isCurrentSort = sortConfig?.columnKey === column.key;
              const isCurrentGroup = groupConfig?.columnKey === column.key;
              
              return (
                <DraggableColumn
                  key={`header-${column.key}-${index}`}
                  column={column}
                  index={index}
                  moveColumn={moveColumn}
                  onColumnResize={handleColumnResize}
                  canDrag={true}
                  className={cn(
                    bgClass,
                    pinnedStyles.isSticky && "sticky z-50",
                    pinnedStyles.shadowClasses,
                    (pinnedStyles.isFirstRightPinned || pinnedStyles.isFirstRightFrozen) && "border-l border-l-border",
                    "overflow-hidden"
                  )}
                  style={{
                    width: `${column.width}px`,
                    minWidth: `${column.minWidth || 60}px`,
                    maxWidth: `${column.width}px`,
                    left: stickyLeft !== undefined ? `${stickyLeft}px` : undefined,
                    right: stickyRight !== undefined ? `${stickyRight}px` : undefined,
                  }}
                >
                  {column.key === "select" && showSelection ? (
                    <div className="flex items-center justify-center py-3 h-12 px-3">
                      <DataTableCheckbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all items"
                      />
                    </div>
                  ) : (
                    <DropdownMenu>
                      <div className="relative w-full group/header">
                        {/* Non-clickable header content */}
                        <div className="w-full flex items-center py-3 text-left px-4">
                          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                            <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            <span className="text-sm font-bold truncate text-foreground max-w-full">{column.label}</span>
                            {column.isPinned && <Pin className="h-3 w-3 text-primary flex-shrink-0" />}
                            {column.freezeDirection === 'left' && <ChevronLeft className="h-3 w-3 text-primary flex-shrink-0" />}
                            {column.freezeDirection === 'right' && <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />}
                            {isCurrentSort && (
                              <div className="flex-shrink-0">
                                {sortConfig?.direction === 'asc' ? 
                                  <ArrowUp className="h-3 w-3 text-primary" /> : 
                                  <ArrowDown className="h-3 w-3 text-primary" />
                                }
                              </div>
                            )}
                            {isCurrentGroup && <Grid3X3 className="h-3 w-3 text-chart-3 flex-shrink-0" />}
                          </div>
                        </div>
                        
                        {/* Clickable chevron trigger - only this opens the menu */}
                        <DropdownMenuTrigger asChild>
                          <button 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover/header:opacity-100 transition-opacity duration-200 z-10 hover:bg-accent rounded p-1 focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-offset-2"
                            aria-label={`${column.label} column options`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <ChevronDown className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                        </DropdownMenuTrigger>
                      </div>
                      <DropdownMenuContent 
                        className="w-56" 
                        style={{ zIndex: 9999 }}
                        sideOffset={5}
                      >
                        {column.filterable && (
                          <DropdownMenuItem onClick={() => onColumnFilter?.(column.key)}>
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </DropdownMenuItem>
                        )}
                        
                        {column.sortable && (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <ArrowUpDown className="h-4 w-4 mr-2" />
                              Sort
                              {isCurrentSort && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  {sortConfig?.direction === 'asc' ? '↑' : '↓'}
                                </Badge>
                              )}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent style={{ zIndex: 9999 }}>
                              <DropdownMenuItem onClick={() => handleSortColumn(column.key, 'asc')}>
                                <ArrowUp className="h-4 w-4 mr-2" />
                                Ascending
                                {isCurrentSort && sortConfig?.direction === 'asc' && <Check className="h-4 w-4 ml-auto" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSortColumn(column.key, 'desc')}>
                                <ArrowDown className="h-4 w-4 mr-2" />
                                Descending
                                {isCurrentSort && sortConfig?.direction === 'desc' && <Check className="h-4 w-4 ml-auto" />}
                              </DropdownMenuItem>
                              {isCurrentSort && (
                                <DropdownMenuItem onClick={() => setSortConfig(null)}>
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Clear Sort
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        )}
                        
                        <DropdownMenuItem onClick={() => handleGroupColumn(column.key)}>
                          <Grid3X3 className="h-4 w-4 mr-2" />
                          {isCurrentGroup ? 'Ungroup' : 'Group'}
                          {isCurrentGroup && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Snowflake className="h-4 w-4 mr-2" />
                            Pin
                            {(column.isPinned || column.freezeDirection) && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {column.isPinned ? 'Pin' : column.freezeDirection}
                              </Badge>
                            )}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent style={{ zIndex: 9999 }}>
                            <DropdownMenuItem onClick={() => handlePinColumn(column.key)}>
                              <Pin className="h-4 w-4 mr-2" />
                              {column.isPinned ? 'Unpin' : 'Pin Left'}
                              {column.isPinned && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFreezeColumn(column.key, 'left')}>
                              <ChevronLeft className="h-4 w-4 mr-2" />
                              Freeze Left
                              {column.freezeDirection === 'left' && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFreezeColumn(column.key, 'right')}>
                              <ChevronRight className="h-4 w-4 mr-2" />
                              Freeze Right
                              {column.freezeDirection === 'right' && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem onClick={() => handleWrapText(column.key)}>
                          <WrapText className="h-4 w-4 mr-2" />
                          {column.wrapText ? 'Disable' : 'Enable'} Text Wrap
                          {column.wrapText && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleHideColumn(column.key)}>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide Column
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </DraggableColumn>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Table Body */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto bg-background"
        style={{ 
          scrollbarWidth: 'auto',
          scrollbarColor: 'var(--border) transparent'
        }}
      >
        <div 
          className="flex flex-col"
          style={{ width: Math.max(totalWidth, 800) }}
        >
          {processedData.map((item: any, rowIndex) => {
            const isGroupHeader = item.__isGroupHeader;
            const itemId = isGroupHeader ? `group-${item.__groupKey}` : getItemId(item);
            const isSelected = selectedItems.includes(itemId);

            if (isGroupHeader) {
              return (
                <div 
                  key={itemId}
                  className="border-b border-border bg-muted/80 backdrop-blur-sm"
                  style={{ 
                    minHeight: '40px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 40,
                  }}
                >
                  <div 
                    className="flex items-center gap-2 py-2 px-4 font-medium text-sm text-foreground"
                    style={{ position: 'sticky', left: 0, width: 'fit-content' }}
                  >
                    <Grid3X3 className="h-4 w-4 text-chart-3" />
                    <span>{item.__groupKey}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.__groupCount}
                    </Badge>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={itemId}
                className={cn(
                  "flex w-full border-b border-border hover:bg-accent/20 transition-colors",
                  isSelected && "bg-chart-1/10",
                  getRowClassName?.(item)
                )}
                style={{ minHeight: '48px' }}
              >
                {orderedColumns.map((column, colIndex) => {
                  const bgClass = getColumnBackgroundClass(column);
                  const pinnedStyles = getPinnedColumnClasses(column);
                  
                  let stickyLeft: number | undefined;
                  let stickyRight: number | undefined;
                  
                  // Check if column is pinned to left or right
                  if (column.isPinned && column.pinSide === 'left') {
                    stickyLeft = getPinnedLeftPosition(leftPinnedColumns.findIndex(col => col.key === column.key));
                  } else if (column.isPinned && column.pinSide === 'right') {
                    stickyRight = getPinnedRightPosition(rightPinnedColumns.findIndex(col => col.key === column.key));
                  } else if (pinnedStyles.isLeftFrozen) {
                    stickyLeft = getLeftFrozenPosition(leftFrozenColumns.findIndex(col => col.key === column.key));
                  } else if (pinnedStyles.isRightFrozen) {
                    stickyRight = getRightFrozenPosition(rightFrozenColumns.findIndex(col => col.key === column.key));
                  }

                  return (
                    <div
                      key={`${itemId}-${column.key}`}
                      className={cn(
                        "flex py-3 border-r border-border",
                        column.wrapText ? "items-start" : "items-center",
                        (pinnedStyles.isFirstRightPinned || pinnedStyles.isFirstRightFrozen) && "border-l border-l-border",
                        bgClass,
                        pinnedStyles.isSticky && "sticky z-30",
                        pinnedStyles.shadowClasses,
                        column.key === "select" ? "px-3" : "px-4"
                      )}
                      style={{
                        width: `${column.width}px`,
                        minWidth: `${column.minWidth || 60}px`,
                        maxWidth: `${column.width}px`,
                        left: stickyLeft !== undefined ? `${stickyLeft}px` : undefined,
                        right: stickyRight !== undefined ? `${stickyRight}px` : undefined,
                      }}
                    >
                      {column.key === "select" && showSelection ? (
                        <DataTableCheckbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectItem(itemId, checked)}
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      ) : (
                        <div 
                          className={getCellContentClass(column)}
                          data-wrap-text={column.wrapText ? "true" : undefined}
                        >
                          {renderCell(column, item, rowIndex)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination with Scroll Controls */}
      {paginationInfo && onPageChange && onPageSizeChange && (
        <div className="flex-none sticky bottom-0 z-50 bg-background border-t border-border shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between px-4 py-2 w-full">
            {/* Left side - Horizontal scroll controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Scroll:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollHorizontally('left')}
                disabled={!canScrollLeft}
                className="h-7 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollHorizontally('right')}
                disabled={!canScrollRight}
                className="h-7 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Right side - Pagination info and controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-foreground">
                {true && (
                  <>
                    <span>Rows per page:</span>
                    <Select
                      value={paginationInfo.pageSize.toString()}
                      onValueChange={(value) => onPageSizeChange(parseInt(value))}
                    >
                      <SelectTrigger className="w-20 h-7 border-border bg-background text-foreground hover:border-border-strong focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent sideOffset={5} className="z-[9999]">
                        {[10, 25, 50, 100].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
                <span className="text-muted-foreground">
                  {paginationInfo.startItem}-{paginationInfo.endItem} of {paginationInfo.totalItems}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(paginationInfo.currentPage - 1)}
                  disabled={paginationInfo.currentPage === 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(paginationInfo.currentPage + 1)}
                  disabled={paginationInfo.currentPage === paginationInfo.totalPages}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
