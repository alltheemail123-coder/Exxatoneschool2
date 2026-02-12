/**
 * Re-export proxy — source physically lives in ./shared/primary-page-template.tsx
 */
export {
  PrimaryPageTemplate,
  type ViewConfig,
  type PrimaryPageMetricsConfig,
  type PrimaryPageFilterConfig,
  type PrimaryPageTablePropertiesConfig,
  type PrimaryPageBulkAction,
  type PrimaryPageTemplateProps,
} from "./shared/primary-page-template"

// Re-exported types from dependencies
export type { SimpleMetricData } from "./shared/simple-metric"
export type { ActiveFilter, FilterConfig } from "./shared/filter-bar"
export type { ColumnConfig } from "./shared/data-table"
export type { ViewSettings } from "./shared/view-manager"
export type { PaginationInfo } from "./shared/pagination"
