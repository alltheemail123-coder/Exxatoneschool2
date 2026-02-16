"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { 
  X, 
  Download, 
  Mail, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Timer, 
  Users,
  FileText,
  AlertTriangle,
  Archive,
  Eye,
  Copy,
  Share,
  Settings,
  UserCheck,
  ArrowRight,
  MessageSquare
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Separator } from "../ui/separator"
import { cn } from "../ui/utils"

export interface BulkAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  variant: "default" | "secondary" | "outline" | "destructive"
  color?: string
}

interface BulkActionBarProps {
  selectedCount: number
  selectedItems: string[]
  actions?: BulkAction[]
  onClearSelection: () => void
  onBulkAction: (action: string, selectedIds: string[]) => void
  className?: string
}

// Legacy props interface for backward compatibility
interface FloatingActionBarProps {
  selectedCount: number
  selectedItems: string[]
  stage: string
  onClearSelection: () => void
  onBulkAction: (action: string, selectedItems: string[]) => void
  className?: string
}

// Default actions that can be used across different contexts
export const defaultBulkActions: BulkAction[] = [
  { id: "export", label: "Export", icon: Download, variant: "outline" },
  { id: "delete", label: "Delete", icon: Trash2, variant: "destructive" },
]

// Pipeline-specific actions for each stage
export const getPipelineActionsForStage = (stage: string): BulkAction[] => {
  switch (stage) {
    case "School Request":
      return [
        { id: "approve", label: "Approve", icon: CheckCircle, variant: "default", color: "bg-chart-2 hover:bg-chart-2" },
        { id: "review", label: "Move to Review", icon: Eye, variant: "outline" },
        { id: "reject", label: "Reject", icon: XCircle, variant: "outline", color: "text-destructive hover:bg-destructive/10" },
        { id: "request-info", label: "Request Info", icon: MessageSquare, variant: "outline" },
        { id: "export", label: "Export", icon: Download, variant: "outline" },
      ]
    
    case "Under Review":
      return [
        { id: "approve", label: "Approve", icon: CheckCircle, variant: "default", color: "bg-chart-2 hover:bg-chart-2" },
        { id: "reject", label: "Reject", icon: XCircle, variant: "outline", color: "text-destructive hover:bg-destructive/10" },
        { id: "reassign", label: "Reassign Reviewer", icon: Users, variant: "outline" },
        { id: "move-stage", label: "Move Stage", icon: ArrowRight, variant: "outline" },
        { id: "export", label: "Export", icon: Download, variant: "outline" },
      ]
    
    case "Approved":
      return [
        { id: "confirm", label: "Confirm Students", icon: UserCheck, variant: "default", color: "bg-chart-2 hover:bg-chart-2" },
        { id: "revoke", label: "Revoke Approval", icon: XCircle, variant: "outline", color: "text-destructive hover:bg-destructive/10" },
        { id: "extend", label: "Extend Deadline", icon: Timer, variant: "outline" },
        { id: "notify", label: "Send Notification", icon: Mail, variant: "outline" },
        { id: "export", label: "Export", icon: Download, variant: "outline" },
      ]
    
    case "Confirmed Students":
      return [
        { id: "compliance", label: "Check Compliance", icon: AlertTriangle, variant: "outline", color: "text-chart-4 hover:bg-chart-4/10" },
        { id: "unenroll", label: "Unenroll", icon: XCircle, variant: "outline", color: "text-destructive hover:bg-destructive/10" },
        { id: "notify", label: "Send Notification", icon: Mail, variant: "outline" },
        { id: "edit", label: "Edit Details", icon: Settings, variant: "outline" },
        { id: "export", label: "Export", icon: Download, variant: "outline" },
      ]
    
    case "Rejected":
      return [
        { id: "reconsider", label: "Reconsider", icon: Eye, variant: "default" },
        { id: "archive", label: "Archive", icon: Archive, variant: "outline" },
        { id: "export", label: "Export", icon: Download, variant: "outline" },
      ]
    
    default:
      return defaultBulkActions
  }
}

// Slots page bulk actions
export const slotsBulkActions: BulkAction[] = [
  { id: "publish", label: "Publish", icon: CheckCircle, variant: "default", color: "bg-chart-2 hover:bg-chart-2" },
  { id: "unpublish", label: "Unpublish", icon: XCircle, variant: "secondary" },
  { id: "duplicate", label: "Duplicate", icon: Copy, variant: "outline" },
  { id: "share", label: "Share", icon: Share, variant: "outline" },
  { id: "export", label: "Export", icon: Download, variant: "outline" },
  { id: "archive", label: "Archive", icon: Archive, variant: "secondary" },
]

export function BulkActionBar({
  selectedCount,
  selectedItems,
  actions = defaultBulkActions,
  onClearSelection,
  onBulkAction,
  className = "",
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  // Show first 2 actions directly, rest in more menu
  const directActions = actions.slice(0, 2)
  const moreActions = actions.slice(2)

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4",
      className
    )}>
      <Card className="shadow-lg border-border bg-card">
        <CardContent className="p-0">
          <div className="flex items-center gap-4 px-4 py-3">
            {/* Selection info */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                {selectedCount} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-6 w-6 p-0 hover:bg-accent"
                aria-label="Clear selection"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Direct Actions */}
            <div className="flex items-center gap-2">
              {directActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.id}
                    variant={action.variant}
                    size="sm"
                    onClick={() => onBulkAction(action.id, selectedItems)}
                    className={cn("h-8", action.color)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                )
              })}

              {/* More actions dropdown */}
              {moreActions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Settings className="h-4 w-4 mr-2" />
                      More Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {moreActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <React.Fragment key={action.id}>
                          <DropdownMenuItem 
                            onClick={() => onBulkAction(action.id, selectedItems)}
                            className={action.color}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {action.label}
                          </DropdownMenuItem>
                        </React.Fragment>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Legacy component for backward compatibility
export function FloatingActionBar({
  selectedCount,
  selectedItems,
  stage,
  onClearSelection,
  onBulkAction,
  className
}: FloatingActionBarProps) {
  const actions = React.useMemo(() => getPipelineActionsForStage(stage), [stage])
  
  return (
    <BulkActionBar
      selectedCount={selectedCount}
      selectedItems={selectedItems}
      actions={actions}
      onClearSelection={onClearSelection}
      onBulkAction={onBulkAction}
      className={className}
    />
  )
}