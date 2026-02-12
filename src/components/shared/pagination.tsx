"use client"

import * as React from "react"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "../ui/utils"

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  startItem: number
  endItem: number
}

interface PaginationProps {
  paginationInfo: PaginationInfo
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  className?: string
  showPageSize?: boolean
  pageSizeOptions?: number[]
}

// Helper function to get visible pages for pagination
function getVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: number[] = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
}

export function Pagination({
  paginationInfo,
  onPageChange,
  onPageSizeChange,
  className,
  showPageSize = true,
  pageSizeOptions = [10, 25, 50, 100]
}: PaginationProps) {
  return (
    <div className={cn(
      "flex-none sticky bottom-0 z-50 bg-background px-4 py-3 border-t border-border shadow-[0_-2px_8px_rgba(0,0,0,0.06)]",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-foreground">
          {showPageSize && (
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
                  {pageSizeOptions.map((size) => (
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
          
          {getVisiblePages(paginationInfo.currentPage, paginationInfo.totalPages).map((page) => (
            <Button
              key={page}
              variant={page === paginationInfo.currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="h-7 w-7 p-0"
            >
              {page}
            </Button>
          ))}
          
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
  )
}
