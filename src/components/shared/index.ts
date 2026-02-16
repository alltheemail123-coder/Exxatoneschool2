/**
 * Shared — Reusable UI building blocks used across multiple pages.
 */

// Cards
export { ActionCard, createActionCardData, type ActionCardData, type ActionCardProps } from "./action-card"
export { InsightCard, createInsightCardData, type InsightCardData, type InsightCardProps } from "./insight-card"
export { MetricCard, createMetricCardData, type MetricCardData, type MetricCardProps } from "./metric-card"
export { SimpleMetric, createSimpleMetricData, type SimpleMetricData, type SimpleMetricProps } from "./simple-metric"

// Table infrastructure
export { DataTable, autoSuggestColumnPinning, type ColumnConfig, type DataTableProps, type FreezeDirection, type SortDirection, type SortConfig, type GroupConfig } from "./data-table"
export { Pagination, type PaginationInfo } from "./pagination"
export { TableProperties } from "./table-properties"
export { ViewManager, type ViewSettings } from "./view-manager"
export { default as FilterBar, type FilterConfig, type ActiveFilter } from "./filter-bar"
export { FloatingActionBar, BulkActionBar, defaultBulkActions, slotsBulkActions, getPipelineActionsForStage, type BulkAction } from "./floating-action-bar"

// Page template
export { PrimaryPageTemplate, type ViewConfig, type PrimaryPageMetricsConfig, type PrimaryPageFilterConfig, type PrimaryPageTablePropertiesConfig, type PrimaryPageBulkAction, type PrimaryPageTemplateProps } from "./primary-page-template"

// Visualizations
export { ChartAreaInteractive } from "./chart-area-interactive"
export { CalendarView } from "./calendar-view"
export { PipelineStepper } from "./pipeline-stepper"

// Leo AI
export { AskLeoButton } from "./ask-leo-button"