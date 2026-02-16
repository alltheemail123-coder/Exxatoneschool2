# Exxat One Design System Guidelines

This document outlines the design system guidelines and component usage rules for the Exxat One healthcare placement and internship management platform.

## Core Component Usage Rules

### 1. Button Component
**Always use the primary button style (black button) from the sidebar across the entire application.**

- **Primary Button**: Use the default shadcn/ui button component with no variant specified
- **Style**: Black background (`--primary: #030213`) with white text
- **Usage**: For main actions, form submissions, and primary CTAs
- **Import**: `import { Button } from "./ui/button"`
- **Example**: `<Button>Create Schedule</Button>`

**Button Hierarchy:**
- **Primary**: Default button (black) - for main actions
- **Secondary**: `variant="outline"` - for secondary actions  
- **Tertiary**: `variant="ghost"` - for subtle actions
- **Destructive**: `variant="destructive"` - for delete/dangerous actions

### 2. Tabs Component
**Always use the standard shadcn tabs component implementation with consistent styling across the app.**

- **Usage**: For all tabbed interfaces throughout the app
- **Import**: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"`
- **Design**: Clean shadcn design matching the provided reference image
- **Styling**: All styles defined in `globals.css` using CSS custom properties
- **Features**:
  - Background color matches sidebar color (`var(--sidebar)`)
  - Active tab has white background with subtle shadow (`var(--shadow-sm)`)
  - Inactive tabs have transparent background with muted text
  - Proper theme-aware colors and smooth transitions
  - Consistent across all pages and components

**Standard Implementation Pattern:**
```tsx
<Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
    <TabsTrigger value="reports">Reports</TabsTrigger>
  </TabsList>
</Tabs>

{/* Tab Content - Separate Tabs wrapper for content */}
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsContent value="overview" className="m-0">
    {/* Content */}
  </TabsContent>
  <TabsContent value="pipeline" className="m-0">
    {/* Content */}
  </TabsContent>
</Tabs>
```

**Key Requirements:**
- **Consistent Design**: All tabs must match the clean shadcn design from the reference image
- **No Custom Styling**: Do not override CSS classes - use the design defined in `globals.css`
- **Margin Reset**: Use `m-0` on TabsContent to prevent unwanted margins
- **Container Width**: Include `className="w-fit"` on TabsList container when appropriate
- **Theme Awareness**: Automatically adapts to light/dark mode via CSS custom properties
- **Shadow Treatment**: Active tabs get subtle shadow, inactive tabs have no shadows

**Visual Specifications:**
- **TabsList Background**: Uses `var(--sidebar)` (light gray in light mode)
- **Active Tab**: White background with `var(--shadow-sm)` shadow
- **Inactive Tab**: Transparent background with `var(--muted-foreground)` text
- **Border Radius**: Consistent with design system using `var(--radius)`
- **Padding**: Proper spacing using design tokens

### 3. Card Component
**Use our MetricCard component with variants for all card displays.**

- **Component**: `MetricCard` with three variants: `small`, `medium`, `large`
- **Import**: `import { MetricCard, createMetricCardData } from "./metric-card"`
- **Usage**: 
  - **Small**: Title, icon, and key number only (for availability pages)
  - **Medium**: Dashboard style with title, key number, trend arrows, "from last month" text, and icon
  - **Large**: All medium content plus description text
  - **Insights**: Special variant for key insights with black text for colored backgrounds

**Variant Usage:**
- **Dashboard**: Medium cards for main metrics
- **Availability Pages**: Small cards for compact display
- **Reports**: Mix of medium and large cards based on content needs
- **Insights Sections**: Insights variant for colored background cards

**Example:**
```tsx
<MetricCard
  data={createMetricCardData("Active Students", "1,234", Users, "text-green-600")}
  variant="medium"
/>
```

### 4. Header Component Pattern
**Use the schedule detail header pattern for all secondary and tertiary pages.**

**Page Hierarchy:**
- **Primary**: Main pages (Home, Slots, Leo AI)
- **Secondary**: Detail pages (Schedule Detail)  
- **Tertiary**: Sub-detail pages (School Profile, Student Profile)

**Header Structure for Secondary/Tertiary Pages:**
- Page title with breadcrumb context
- Status badges and metadata
- Action buttons (dropdown menu with Share, Duplicate, Edit)
- Key information grid below title
- Consistent spacing and layout

**Example Usage:**
```tsx
// Secondary Page (Schedule Detail)
<div className="px-4 lg:px-6 pt-4 lg:pt-6 space-y-6">
  <div className="flex items-start justify-between">
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Internal Medicine Rotation</h1>
      <div className="text-sm text-muted-foreground">
        Mayo Clinic • Rochester, MN
      </div>
    </div>
    <DropdownMenu>...</DropdownMenu>
  </div>
</div>
```

### 5. Filter and Search Pattern
**Use FilterBar component and consistent search implementation across all pages.**

- **FilterBar**: Use the existing FilterBar component for all filtering interfaces
- **Search**: Include search input in page headers with Search icon and consistent placeholder text
- **Filter Button**: Toggle filter visibility with Filter icon, use active state styling
- **Integration**: Match the pattern used in student-schedule-page.tsx and reports-page.tsx

**Example Implementation:**
```tsx
// Header with search and filter
<div className="flex items-center gap-4">
  <div className="relative">
    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    <Input
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-8 w-64"
    />
  </div>
  <Button 
    variant={showFilters || hasActiveFilterValues ? "default" : "outline"} 
    size="sm" 
    className="h-8 w-8 p-0"
    onClick={() => setShowFilters(!showFilters)}
  >
    <Filter className="h-4 w-4" />
  </Button>
</div>

// Filter bar implementation
{showFilters && (
  <FilterBar
    filterConfigs={filterConfigs}
    activeFilters={activeFilters}
    onAddFilter={handleAddFilter}
    onToggleFilterValue={handleToggleFilterValue}
    onRemoveFilter={handleRemoveFilter}
    onClearAll={handleClearAllFilters}
  />
)}
```

## Date Format Standards

### 6. Date Formatting
**All dates across the application must use MM/DD/YYYY format for consistency.**

- **Format**: MM/DD/YYYY (e.g., 03/15/2024, 12/31/2024)
- **Usage**: All date displays, form inputs, and data tables
- **Implementation**: Use `toLocaleDateString("en-US")` with proper options
- **Consistency**: Maintain the same format across all components and pages

**Examples:**
```tsx
// Date formatting utility
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit", 
    year: "numeric"
  });
};

// Usage in components
<p>{formatDate(data.startDate)} - {formatDate(data.endDate)}</p>
```

**Date Range Display:**
- **Single dates**: 03/15/2024
- **Date ranges**: 03/15/2024 - 05/10/2024
- **Short ranges**: Mar 15 - May 10, 2024 (when space is limited)

## State Management Standards

### 7. Zustand Store Pattern
**Use the centralized app store for navigation and global state management.**

- **Store**: Use `useAppStore` from `./stores/app-store`
- **Navigation**: All page navigation should go through store actions
- **State Management**: Keep component-specific state local, global state in store
- **Subscriptions**: Use store selectors to subscribe to specific state slices

**Example Usage:**
```tsx
// Store usage
const currentPage = useAppStore((state) => state.currentPage);
const navigateToPage = useAppStore((state) => state.navigateToPage);
const selectedScheduleId = useAppStore((state) => state.selectedScheduleId);

// Navigation
const handleItemClick = (scheduleId: string) => {
  navigateToScheduleDetail(scheduleId);
};
```

### 8. Performance Optimization
**Follow established patterns for component optimization and lazy loading.**

- **Memoization**: Use React.memo for expensive components
- **Callbacks**: Use useCallback for event handlers passed as props
- **Lazy Loading**: Use React.lazy for heavy components with proper Suspense
- **CSS Classes**: Use predefined CSS class objects to prevent inline styles

**Example Patterns:**
```tsx
// Memoized component
const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <div>...</div>;
});

// Predefined classes object
const layoutClasses = {
  container: "flex flex-col gap-6 p-4",
  header: "flex items-center justify-between",
} as const;

// Lazy loading
const LazyComponent = React.lazy(() => 
  import("./heavy-component").then(m => ({ default: m.HeavyComponent }))
);
```

### 9. Program Context Rule
**The application always operates within the context of a single selected program (e.g., PT, Nursing, OT). The active program is chosen via the TeamSwitcher in the sidebar.**

- **Single Program Context**: All pages, data, filters, and views are scoped to the currently selected program. There is no need to show or filter by "Discipline" — it is implicit from the program selection.
- **Discipline is NOT shown**: Since the user has already selected a program (which corresponds to a discipline), discipline columns, filters, labels, and dropdowns must NOT appear anywhere in the UI. Showing discipline would be redundant.
- **Specialization IS shown (when relevant)**: Within a program/discipline, there may be multiple specializations (e.g., within PT: Orthopedics, Neurology, Pediatrics; within Nursing: ICU, ER, Med-Surg). Show specialization in filters, table columns, detail pages, and search bars only when the context requires distinguishing between specializations.
- **Data scoping**: All data tables, metric cards, charts, and reports display data for the selected program only — no cross-program aggregation unless explicitly requested.
- **Navigation context**: The sidebar dynamically filters nav items based on the selected program via the `programExclusions` map in the Zustand store.

**What to show vs. hide:**

| Element | Show? | Reason |
|---------|-------|--------|
| **Discipline column/filter** | ❌ Never | Redundant — implied by selected program |
| **Discipline label** | ❌ Never | Same as above |
| **Specialization column** | ✅ When needed | Differentiates within the active program |
| **Specialization filter** | ✅ When needed | Useful for narrowing results within program |
| **Program name in header** | ✅ Optional | Can show as context badge (e.g., "PT Program") |

**Example — Correct vs. Incorrect:**
```tsx
// ✅ CORRECT — No discipline, specialization only
<FilterBar filterConfigs={[
  { key: "specialization", label: "Specialization", options: ["Orthopedics", "Neurology", "Pediatrics"] },
  { key: "status", label: "Status", options: ["Active", "Pending", "Completed"] },
]} />

// ❌ WRONG — Discipline filter is redundant
<FilterBar filterConfigs={[
  { key: "discipline", label: "Discipline", options: ["PT", "Nursing", "OT"] }, // NEVER do this
  { key: "specialization", label: "Specialization", options: [...] },
]} />
```

## Design System Standards

### Typography
- **Base font size**: 14px (via `--font-size: 14px`)
- **Font weights**: Normal (400), Medium (500)
- **Do NOT override**: font-size, font-weight, or line-height classes unless specifically requested
- **Use semantic HTML**: h1, h2, h3, h4, p, label elements get automatic styling from globals.css

### Colors - CRITICAL REQUIREMENT
**ALL COLORS MUST USE THEME-AWARE CSS CUSTOM PROPERTIES**

#### Core Theme Colors (Auto-switching Light/Dark Mode)
- **Primary**: `var(--primary)` / `bg-primary` / `text-primary`
- **Secondary**: `var(--secondary)` / `bg-secondary` / `text-secondary`
- **Background**: `var(--background)` / `bg-background`
- **Foreground**: `var(--foreground)` / `text-foreground`
- **Muted**: `var(--muted)` / `bg-muted` / `text-muted-foreground`
- **Accent**: `var(--accent)` / `bg-accent` / `text-accent-foreground`
- **Border**: `var(--border)` / `border-border`
- **Card**: `var(--card)` / `bg-card` / `text-card-foreground`

#### Interactive Element Colors
- **Links**: Must use `var(--chart-1)` / `text-chart-1` (BLUE theme color)
- **Hover states**: Links should use `hover:text-chart-1` with opacity changes
- **Focus states**: Use `focus:ring-primary` for focus indicators
- **Buttons**: Use component variants (primary, secondary, outline, ghost)

#### Status and Data Visualization Colors
- **Charts**: Use `var(--chart-1)` through `var(--chart-5)` for consistent data colors
- **Success/Positive**: `var(--chart-2)` (green theme color)
- **Warning**: `var(--chart-4)` (yellow theme color)  
- **Error/Destructive**: `var(--destructive)` / `text-destructive`
- **Info**: `var(--chart-1)` (blue theme color)

#### Custom Green Scale (Theme-Aware)
- Available as `--green-50` through `--green-950`
- Automatically inverts in dark mode
- Use for specific brand/status indicators

#### PROHIBITED - Never Use Hardcoded Colors
❌ **NEVER USE**: `text-orange-500`, `text-blue-500`, `bg-red-100`, `#FF5733`, etc.
❌ **NEVER USE**: Any hardcoded hex, rgb, or fixed Tailwind color classes
❌ **NEVER USE**: Colors that don't switch between light/dark modes

#### Required Implementation Pattern
```tsx
// ✅ CORRECT - Uses theme-aware colors
<div className="bg-background text-foreground border-border">
  <a className="text-chart-1 hover:text-chart-1 hover:opacity-80">Link</a>
  <button className="bg-primary text-primary-foreground">Button</button>
</div>

// ❌ WRONG - Uses hardcoded colors
<div className="bg-white text-black border-gray-200">
  <a className="text-blue-500 hover:text-blue-600">Link</a>
  <button className="bg-indigo-600 text-white">Button</button>
</div>
```

#### Table Link Standards
- **All table links**: Must use `data-table-clickable` class or `text-chart-1`
- **Hover behavior**: Blue color with underline and opacity change
- **Click behavior**: Maintain blue theme color consistency
- **Never use**: Orange, amber, or any non-theme colors for links

### Spacing
- **Section gaps**: 48px between dashboard sections (gap-12)
- **Component gaps**: 24px for related components (gap-6)
- **Card padding**: 16px-24px based on content density
- **Page padding**: px-4 lg:px-6 for consistent horizontal spacing

### Border Radius
- **Standard radius**: `--radius: 0.625rem` (10px)
- **Variants**: 
  - `rounded-sm`: calc(var(--radius) - 4px)
  - `rounded-md`: calc(var(--radius) - 2px) 
  - `rounded-lg`: var(--radius)
  - `rounded-xl`: calc(var(--radius) + 4px)

## Component-Specific Guidelines

### Data Tables
**Always use the existing `DataTable` component (`/components/data-table.tsx`) for all tabular data displays. Never build custom table markup — use `DataTable` exclusively.**

- **Import**: `import { DataTable, type ColumnConfig, type DataTableProps } from "./data-table"`
- **Component**: `DataTable` — a full-featured, reusable table with sorting, pagination, column pinning, bulk selection, drag-to-reorder columns, and inline actions
- **Header styling**: Always include `data-table-header` class for consistency
- **Bulk actions**: Use FloatingActionBar for multi-select operations
- **Pagination**: Built-in — uses the `Pagination` component from `./pagination`
- **Filters**: Use FilterBar component for table filtering (external to DataTable)
- **Date columns**: All date columns must use MM/DD/YYYY format

#### Specialization Column Rendering
**Specialization values in data table cells must render as plain text — never as chips, badges, or tags.**

- **Render as**: Plain text using `font-medium text-base` styling (same as other text cells)
- **Never use**: `<Badge>`, chip components, or any pill-shaped wrapper around specialization values in table cells
- **Rationale**: Specialization is a standard data attribute, not a status or category indicator — chips add unnecessary visual noise and break scan-ability in dense tables
- **Filters are separate**: The FilterBar may still use its own chip UI for active filter pills — this rule applies only to table cell rendering
- **wrapText support**: Respect the column's `wrapText` setting with `break-words` or `truncate`

**Correct vs. Incorrect:**
```tsx
// ✅ CORRECT — Plain text
case "specialization":
  return (
    <div className={column.wrapText ? "font-medium text-base break-words" : "font-medium text-base truncate"}>
      {item.specialization}
    </div>
  )

// ❌ WRONG — Badge/chip wrapper
case "specialization":
  return (
    <Badge variant="secondary" withIcon iconPosition="left" className="w-fit">
      <GraduationCap className="h-3 w-3" />
      {item.specialization}
    </Badge>
  )
```

#### Column Pinning for Wide Tables
**When tables have many columns that cause horizontal overflow, automatically pin key columns for usability.**

- **Left Pin**: Identifier columns (ID, Name, Title, etc.) - First 1-2 columns that identify the row
- **Right Pin**: Action columns (Actions, Status, etc.) - Last 1-2 columns for row actions
- **Auto-freeze**: Tables with 8+ columns should have identifier and action columns auto-pinned
- **Implementation**: Use `isPinned: true` and `pinSide: 'left'` or `'right'` in column config

**Standard Pinning Pattern:**
```tsx
const columns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    icon: Hash,
    isPinned: true,      // ✅ Pin identifier column
    pinSide: 'left',     // ✅ Pin to left
    isVisible: true,
    width: 80,
  },
  {
    key: 'name',
    label: 'Name',
    icon: User,
    isPinned: true,      // ✅ Pin primary identifier
    pinSide: 'left',     // ✅ Pin to left
    isVisible: true,
    width: 200,
  },
  // ... middle columns (unpinned, scrollable)
  {
    key: 'status',
    label: 'Status',
    icon: Circle,
    isPinned: true,      // ✅ Pin status column
    pinSide: 'right',    // ✅ Pin to right
    isVisible: true,
    width: 120,
  },
  {
    key: 'actions',
    label: 'Actions',
    icon: Settings,
    isPinned: true,      // ✅ Pin action column
    pinSide: 'right',    // ✅ Pin to right
    isVisible: true,
    width: 100,
  },
];
```

**Pinning Guidelines:**
- **Identifier columns**: Always pin left (ID, Name, Title, Email)
- **Status columns**: Pin right when table has 8+ columns
- **Action columns**: Always pin right (Actions, Edit, Delete dropdowns)
- **Max pinned columns**: 2 left + 2 right maximum to preserve scrollable area
- **Visual feedback**: Pinned columns show edge shadows (handled automatically by `getPinnedColumnClasses`)
- **Frozen columns**: Use `freezeDirection` for Excel-style freezing (alternative to pinning)

**When to Auto-Pin:**
- ✅ Tables with 8+ columns
- ✅ Tables with horizontal scroll
- ✅ Wide data tables (reports, analytics, admin views)
- ❌ Simple tables with <6 columns
- ❌ Mobile views (disable pinning, use responsive stacking)

### Navigation — Left Sidebar Rules

The left sidebar is the single entry point for all navigation. It uses `collapsible="icon"` mode and must follow strict UX hierarchy rules.

#### Primary vs Secondary Navigation — Decision Framework

**How to classify a nav item as Primary:**
1. **Frequency**: Used in nearly every user session (daily driver)
2. **Domain object**: Represents a core entity or workflow the platform manages (placements, schedules, slots)
3. **Standalone page**: Has its own full-page view with tables, filters, detail pages
4. **Business-critical**: Directly maps to the user's primary job-to-be-done

**How to classify a nav item as Secondary:**
1. **Supportive**: Helps users do primary work but is not the work itself (AI assistant, notifications)
2. **Discovery**: Used periodically, not every session (explore, wishlist)
3. **Reference**: Provides context but not core workflow (site partners, student roster)
4. **Cross-cutting**: Applies across multiple primary workflows (reports, search)

#### Sidebar Structure (Top → Bottom)

```
┌─────────────────────────┐
│  Logo / Brand           │  ← Always visible, clickable → Home
│  Team Switcher          │  ← Context selector
├─────────────────────────┤
│  PRIMARY NAV            │  ← Core daily-driver pages
│  ● Home                 │     Dashboard / overview
│  ● Leo AI          Beta │     AI assistant (always accessible)
│  ● Inbox           (15) │     Activity feed, notifications, messages
├─────── separator ───────┤
│  PIPELINE               │  ← School placement workflow
│  ● Explore              │     Browse internships, request slots
│    ├ Browse Sites        │       Sub-nav: discover sites
│    └ Saved Searches      │       Sub-nav: bookmarked queries
│  ● Wishlist        New  │     Criteria & student preferences
│    ├ Open Wishlists      │       Sub-nav: active wishlists
│    └ Closed Wishlists    │       Sub-nav: archived wishlists
│  ● Slots           (24) │     Requested slots management
│    ├ Requested           │       Sub-nav: pending requests
│    ├ Approved            │       Sub-nav: accepted slots
│    └ Declined            │       Sub-nav: rejected slots
│  ● Student Schedule(12) │     Approved placements & compliance
│    ├ Individual          │       Sub-nav: per-student schedules
│    └ Group               │       Sub-nav: cohort/group schedules
├─────── separator ───────┤
│  SUPPORTING              │  ← Reference data & analytics
│  ○ Reports              │     Analytics & reporting
│  ○ My Students          │     Student roster/reference
│  ○ Site Partner         │     Partner relationship mgmt
├─────── separator ───────┤
│  UTILITY NAV            │  ← Footer zone
│  ○ Resources & Help     │     Collapsible support links
│  ○ Settings             │     User/system preferences
│  ─── User Avatar ───    │     Profile / sign out
└─────────────────────────┘
```

#### School Workflow Pipeline (Why This Order)

The primary nav follows the school's natural placement workflow:

1. **Explore** → Schools browse available internship sites and request slots
2. **Wishlist** → Schools define wishlist criteria; students share preferences; helps determine how many slots are needed from which sites
3. **Slots** → All requested slots are visible here for tracking and management
4. **Student Schedule** → Once slots are approved, placements appear here for compliance management and ongoing oversight

**Inbox** sits in the primary group as an always-accessible awareness layer — it's where the school sees "what's happening and what has happened" across all workflows.

#### Secondary Navigation (Sub-Items) — SaaS Best Practices

Sub-navigation items appear indented below their parent when expanded, following patterns proven across leading SaaS platforms:

**Research — How Top SaaS Platforms Handle Secondary Nav:**

| Platform | Pattern | Key Insight |
|----------|---------|-------------|
| **Linear** | Collapsible sections: Teams expand to Active, Backlog, Triage | Sub-items act as **view filters** — same data, different lens |
| **Notion** | Nested pages with tree indentation + vertical connector line | Sub-items are **content containers** — each is a distinct workspace |
| **Jira** | Planning expands to Board, Backlog, Timeline | Sub-items are **workflow views** — different visualization of same project |
| **Intercom** | Inbox expands to All, Unassigned, Mentions | Sub-items are **smart filters** — pre-built queries on the same feed |
| **HubSpot** | Main nav with flyout panels on hover | Sub-items are **feature areas** — distinct tools within a domain |
| **Slack** | Channels grouped under collapsible sections | Sub-items are **instances** — individual channels within a category |
| **Figma** | Projects expand to show files with tree connector | Sub-items are **objects** — individual files within organizational groups |

**Pattern Applied to Exxat:**

Our sub-nav follows the **Intercom/Linear pattern** — sub-items are **contextual views or states** of the parent entity:

- **Explore** → Browse Sites (discovery), Saved Searches (recall)
- **Wishlist** → Open (active), Closed (archived) — **status-based filtering**
- **Slots** → Requested, Approved, Declined — **pipeline stage views**
- **Student Schedule** → Individual, Group — **scope-based views**

**Implementation Rules:**
- Sub-items use `SidebarMenuSub` + `SidebarMenuSubItem` (shadcn pattern)
- Parent items with sub-items show a chevron `▸` that rotates `▾` when expanded
- Clicking a parent navigates to its default view AND expands sub-items
- Sub-items do NOT have their own badges — the parent badge reflects aggregate state
- Only one parent can be expanded at a time (accordion behavior) to conserve space
- In collapsed (icon) mode, sub-items are hidden — tooltip shows parent label only
- Sub-items use `font-normal` weight (13px) vs parent's `font-medium`

#### Visual Differentiation Rules

| Aspect | Primary | Secondary | Utility |
|--------|---------|-----------|---------|
| **Position** | Top of sidebar, immediately after header | Below separator, middle zone | Footer / bottom zone |
| **Icon weight** | `solid` when active, `regular` when inactive | `regular` always (solid when active) | `regular` always |
| **Font weight** | `font-medium` (13px) | `font-medium` (13px) | `font-normal` (13px) |
| **Badges** | Count badges for actionable items (e.g. `24`) | Feature badges (`New`, `Beta`) | Count badges for alerts |
| **Group label** | None — primary items are self-evident | Optional label (e.g. "Tools") | "Support" label |
| **Separator** | Separator AFTER the primary group | Separator AFTER secondary group | Built into footer layout |
| **Collapsed state** | Icon only + tooltip + notification dot | Icon only + tooltip | Icon only + tooltip |

#### Active State Rules

- **Current page**: `isActive=true` → darker background (`bg-sidebar-accent`), `font-semibold`, solid icon variant
- **Detail pages**: Parent nav item stays active (e.g. viewing Schedule Details → "Student Schedule" stays highlighted)
- **Sub-pages**: When on Schedule Detail → "Student Schedule" stays active; when on School/Student Profile navigated FROM Student Schedule → "Student Schedule" stays active
- **Only one item active** at any time — no multi-highlight

#### Collapsed (Icon) Mode Rules

- All items show icon only with tooltip on hover
- Notification dots (small red circles) appear for items with unread counts
- No group labels or separators visible
- Logo switches to compact mark
- Team switcher shows abbreviated/icon form
- Tooltips show full label + badge info (e.g. "Slots (24)")

#### Notifications — Special Behavior

- Notifications is a **utility** item, NOT primary nav
- Clicking opens a **slide-out panel** within the sidebar (second sidebar column), not a separate page
- When notification panel is open, the main nav collapses to icon mode automatically
- Unread count badge uses `CountBadge` component
- Red notification dot appears in collapsed mode when unreads > 0

#### Badge Usage Rules

- **Count badges** (`CountBadge`): For actionable item counts — Slots (24), Student Schedule (12), Notifications (15)
- **Feature badges** (`NewBadge`, `BetaBadge`): For new/beta features — Wishlist (New), Leo AI (Beta)
- **Never combine**: An item should have at most one badge type
- **Positioning**: Badges align to the right edge (`ml-auto`)
- **Collapsed mode**: Count/feature badges are NOT shown; a notification dot replaces them

#### Adding a New Nav Item — Checklist

When adding a new page/feature to the sidebar:

1. **Classify**: Is it Primary, Secondary, or Utility? Use the decision framework above
2. **Position**: Place it within the correct group, respecting the separator boundaries
3. **Icon**: Choose from Font Awesome icon set (consistent with existing icons)
4. **Badge**: Does it need a count badge, feature badge, or none?
5. **Active state**: Wire `currentPage === item.title` check
6. **Collapsed mode**: Ensure tooltip text is set and notification dot logic is correct
7. **Store integration**: Add navigation action in `app-store.ts` if the page has detail views
8. **Breadcrumbs**: If the new page has detail/sub-pages, define breadcrumb config in `App.tsx`

#### Breadcrumb Rules for Detail Pages

- **Primary pages**: No breadcrumbs (they ARE the top level)
- **Secondary/Detail pages**: Breadcrumbs show `Home > Parent Page` + page title in header
- **Tertiary pages**: Breadcrumbs show `Home > Parent Page` with deeper context
- **Page title**: Use descriptive static names (e.g. "Schedule Details", "School Profile") — NOT dynamic data
- **Clickable crumbs**: Each breadcrumb segment navigates back to that level

#### Sidebar Implementation Reference

- **Component**: `AppSidebar` at `/components/app-sidebar.tsx`
- **State management**: Zustand `useAppStore` for `currentPage`, navigation actions
- **Collapsible mode**: `collapsible="icon"` on root `<Sidebar>`
- **Width**: Expanded = `240px`, Collapsed = `48px` (`--sidebar-width-icon`)
- **Background**: Uses `--sidebar` CSS variable (OKLCH `oklch(0.955 0.027 343)`)
- **Transition**: `transition-all duration-200` for smooth expand/collapse

### Forms and Inputs
- **Buttons**: Primary button style for submissions
- **Input styling**: Use `--input-background` for form fields
- **Labels**: Semantic label elements with automatic styling
- **Validation**: Use consistent error states and messaging
- **Date inputs**: Must accept and display MM/DD/YYYY format

### Status and Badges
- **Status indicators**: Use Badge component with semantic colors
- **Tier badges**: Gold, Silver, Bronze for partner tiers
- **Consortium**: Simple "Consortium" text, no specific names
- **Priority levels**: High (red), Medium (yellow), Low (gray)

### Charts and Data Visualization
- **Library**: Use Recharts for all charts and graphs
- **Colors**: Use CSS custom properties (`--chart-1` through `--chart-5`)
- **Responsive**: All charts must use ResponsiveContainer
- **Tooltips**: Include proper tooltip formatting with data labels

## Layout Patterns

### Page Layout Structure
**Follow consistent page layout patterns across the application.**

1. **Primary Pages** (Home, Slots):
   - SiteHeader with page title
   - Main content area with proper padding
   - Optional sections with consistent spacing

2. **Secondary Pages** (Detail pages):
   - SiteHeader with breadcrumbs
   - Header section with title, metadata, and actions
   - Tabbed content or structured sections

3. **Tertiary Pages** (Sub-details):
   - SiteHeader with multi-level breadcrumbs
   - Context-aware header information
   - Focused content with clear navigation back

### Responsive Design
- **Mobile-first**: Start with mobile layout, enhance for desktop
- **Breakpoints**: sm: 640px, md: 768px, lg: 1024px, xl: 1280px
- **Grid systems**: Use CSS Grid and Flexbox for layouts
- **Component stacking**: Ensure components stack properly on mobile
- **Sidebar**: Responsive sidebar with proper collapse states

## Accessibility Standards (WCAG AA — Full Application)

The Exxat One platform targets **WCAG 2.1 Level AA** conformance across the entire application — not just logos and SVGs. Every component, page, and interaction must meet the criteria below.

---

### 10. Color Contrast — All Text & UI Elements

#### Text Contrast (WCAG 1.4.3 — Contrast Minimum)
- **Normal text** (< 18px, or < 14px bold): ≥ **4.5:1** contrast ratio against its background
- **Large text** (≥ 18px, or ≥ 14px bold): ≥ **3:1** contrast ratio against its background
- **Placeholder text**: Must still meet **4.5:1** — do NOT use ultra-light grays. Use `text-muted-foreground` (which is tuned per theme)
- **Disabled text**: Exempt from contrast requirements per WCAG, but should remain legible

#### Non-text Contrast (WCAG 1.4.11)
- **UI components** (buttons, inputs, toggles, checkboxes, radio buttons): The visual boundary/indicator must maintain ≥ **3:1** against the adjacent background
- **Graphical objects** (icons conveying meaning, chart segments, status dots): ≥ **3:1** against their background
- **Focus indicators**: See §12 below — must meet ≥ **3:1**
- **Borders on form fields**: `border-border` tokens are pre-verified per theme; do not override with lighter values

#### Verification Checklist for New Components
| Element | Required Ratio | How to Verify |
|---------|---------------|---------------|
| Body text on `bg-background` | ≥ 4.5:1 | `text-foreground` on `bg-background` — verified ✅ |
| Muted text on `bg-background` | ≥ 4.5:1 | `text-muted-foreground` — verified per theme ✅ |
| Link text (`text-chart-1`) on `bg-background` | ≥ 4.5:1 | Verified ✅ |
| White text on `bg-primary` | ≥ 4.5:1 | `#030213` → white = 19.2:1 ✅ |
| White text on `bg-brand-dark` | ≥ 4.5:1 | See theme table below |
| Chart segment colors on white | ≥ 3:1 | `--chart-1` through `--chart-5` — verified ✅ |
| Input border on `bg-background` | ≥ 3:1 | `border-border` — verified ✅ |

#### Theme-Specific Brand Color Verification
| Theme | `--brand-color-dark` | vs White | Status |
|-------|---------------------|----------|--------|
| Rose | `oklch(0.42 0.24 342)` | ≈ 5.5:1 | ✅ Pass |
| Lavender | `oklch(0.40 0.20 270)` | ≈ 7.0:1 | ✅ Pass |
| Sage | `oklch(0.40 0.15 155)` | ≈ 6.2:1 | ✅ Pass |

**When adding a new theme**: Calculate the contrast ratio of the new `--brand-color-dark` against `#FFFFFF`. If the ratio falls below 4.5:1, darken the lightness channel until it passes.

---

### 11. Keyboard Navigation (WCAG 2.1.1 — Keyboard)

**Every interactive element must be operable via keyboard alone — no mouse required.**

#### Tab Order
- **Logical flow**: Tab order must follow visual reading order (left-to-right, top-to-bottom)
- **No tab traps**: Users must be able to tab INTO and OUT OF every component (modals, dropdowns, panels)
- **Skip links**: Consider adding a "Skip to main content" link for pages with complex sidebars (implementation pending)
- **`tabIndex` rules**:
  - `tabIndex={0}`: For custom interactive elements that need to join the natural tab order (e.g., clickable `<div>` cards)
  - `tabIndex={-1}`: For elements that should be focusable programmatically but not via Tab (e.g., heading targets for focus management)
  - **Never use `tabIndex > 0`** — it breaks natural tab order

#### Keyboard Interactions by Component Type

| Component | Keys | Behavior |
|-----------|------|----------|
| **Buttons** | `Enter`, `Space` | Activate the button |
| **Links** | `Enter` | Navigate/activate |
| **Checkboxes** | `Space` | Toggle checked state |
| **Radio buttons** | `Arrow Up/Down` | Move between options; `Space` to select |
| **Tabs** | `Arrow Left/Right` | Switch between tabs; `Enter`/`Space` to activate |
| **Dropdowns/Select** | `Enter`/`Space` to open; `Arrow Up/Down` to navigate; `Enter` to select; `Escape` to close |
| **Modals/Dialogs** | `Escape` to close; Tab trapped inside while open |
| **Data tables** | `Arrow keys` for cell navigation (optional); `Enter` to activate row links |
| **Sidebar nav** | `Arrow Up/Down` between items; `Enter` to activate; `Space` to expand/collapse sub-items |
| **Leo AI panel** | `Escape` to close; focus returns to trigger button |
| **Tooltips** | Appear on focus (not just hover); dismiss on `Escape` |

#### Implementation Pattern — Clickable Non-Button Elements
```tsx
// ✅ CORRECT — Keyboard-accessible clickable card
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
  className="cursor-pointer ..."
>
  {children}
</div>

// ❌ WRONG — Not keyboard accessible
<div onClick={handleClick} className="cursor-pointer">
  {children}
</div>
```

---

### 12. Focus Management & Focus Indicators (WCAG 2.4.7, 2.4.11)

#### Visible Focus Indicators
- **All interactive elements** must show a visible focus ring when focused via keyboard
- **Minimum area**: Focus indicator must have ≥ 2px solid outline or equivalent visual change (WCAG 2.4.11 — Focus Appearance)
- **Contrast**: Focus indicator must maintain ≥ **3:1** contrast against the unfocused state AND adjacent background
- **Never remove outlines**: Do not use `outline-none` without providing an alternative visible indicator

#### Standard Focus Ring Pattern
```tsx
// ✅ CORRECT — Uses design system focus ring
className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"

// ✅ ALSO CORRECT — Simpler outline approach
className="focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"

// ❌ WRONG — Removes focus indicator entirely
className="outline-none focus:outline-none"
```

#### Focus Trapping for Modals & Panels
- **Modals**: When a modal/dialog opens, focus must move to the first focusable element inside; Tab must cycle within the modal; `Escape` closes and returns focus to the trigger
- **Leo AI Panel**: When opened, focus moves to the input field; closing returns focus to the trigger button or Ask Leo button
- **Dropdown menus**: Focus moves to first menu item on open; `Escape` closes and returns focus to trigger
- **Sidebar notifications panel**: When opened, focus enters the panel; closing returns focus to the Inbox nav item

#### Focus Restoration
- After closing any overlay (modal, panel, dropdown), focus MUST return to the element that triggered it
- After navigating back from a detail page, focus should return to the list item that was clicked (best-effort)

---

### 13. ARIA Attributes & Semantic HTML (WCAG 4.1.2 — Name, Role, Value)

#### Semantic HTML First
Always prefer native HTML elements over ARIA. A `<button>` is better than `<div onClick>`, `<span onClick>`.

| Need | Use | Avoid |
|------|-----|-------|
| Button | `<button>` or `<Button>` | `<div onClick>`, `<span onClick>` |
| Link/navigation | `<a href>` or router `<Link>` | `<span onClick>` with no role |
| List | `<ul>/<ol>` + `<li>` | `<div>` + `<div>` |
| Table | `<table>` + `<thead>`/`<tbody>` | Nested `<div>`s with grid CSS |
| Heading | `<h1>`–`<h6>` in order | `<div className="text-2xl font-bold">` |
| Form field | `<input>`, `<select>`, `<textarea>` | Custom divs without roles |
| Navigation | `<nav>` with `aria-label` | `<div>` |

#### Required ARIA Attributes by Component

| Component | ARIA Requirement |
|-----------|-----------------|
| **Icon-only buttons** | `aria-label="descriptive text"` — e.g., `<Button aria-label="Close panel">` |
| **Sidebar toggle** | `aria-label="Toggle sidebar"`, `aria-expanded={isOpen}` |
| **Tabs** | `role="tablist"` on container, `role="tab"` on triggers, `role="tabpanel"` on content, `aria-selected` on active tab — handled by shadcn `Tabs` component |
| **Modals/Dialogs** | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title element — handled by shadcn `Dialog` |
| **Alerts/Toasts** | `role="alert"` or `role="status"` for non-intrusive updates |
| **Loading states** | `aria-busy="true"` on the container; `role="status"` on spinner; include visually hidden "Loading…" text |
| **Badge counts** | `aria-label` on parent or use `<span className="sr-only">15 unread notifications</span>` |
| **Data tables** | `aria-sort` on sortable column headers; `aria-label` on the table describing its content |
| **Expandable sections** | `aria-expanded={isOpen}` on the trigger; `aria-controls="panel-id"` pointing to the content |
| **Pagination** | `nav` wrapper with `aria-label="Pagination"`; current page uses `aria-current="page"` |
| **Search inputs** | `role="search"` on the form/wrapper; `aria-label="Search …"` on the input |
| **Progress indicators** | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| **Tooltips** | `role="tooltip"` on the tooltip; trigger gets `aria-describedby` pointing to it |

#### Meaningful vs Decorative SVGs & Icons
- **Meaningful** (conveys information): `role="img"`, `aria-label="…"`, `<title>…</title>` inside `<svg>`
- **Decorative** (purely visual, adjacent text conveys the same info): `aria-hidden="true"`, `role="presentation"`
- **Lucide icons next to text labels**: Use `aria-hidden="true"` — the label provides the accessible name
- **Lucide icons in icon-only buttons**: The `<Button>` must carry `aria-label`; the icon gets `aria-hidden="true"`

**Logo reference** — `ExxatLogoMark` (`/components/brand/exxat-logo-mark.tsx`):
```tsx
<svg role="img" aria-label="Exxat logo" viewBox="0 0 121.12 121.12">
  <title>Exxat</title>
  <path d={circlePath} fill="var(--brand-color-dark)" />
  <path d={eLetterPath} fill="white" />
</svg>
```

---

### 14. Form Accessibility (WCAG 1.3.1, 3.3.1, 3.3.2)

#### Labels
- **Every form field MUST have a visible `<label>`** associated via `htmlFor`/`id` pairing
- **Never rely on placeholder text alone** as the label — placeholders disappear on input and fail WCAG 3.3.2
- If a visible label is not possible (e.g., search input), use `aria-label` on the `<input>`

```tsx
// ✅ CORRECT — Visible label with htmlFor
<label htmlFor="student-name">Student Name</label>
<Input id="student-name" placeholder="Enter name…" />

// ✅ CORRECT — Hidden label for compact UI (search)
<div className="relative">
  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" aria-hidden="true" />
  <Input
    aria-label="Search availability"
    placeholder="Search…"
    className="pl-8"
  />
</div>

// ❌ WRONG — No label at all
<Input placeholder="Student Name" />
```

#### Error Messages (WCAG 3.3.1 — Error Identification)
- **Error messages must be programmatically associated** with their field via `aria-describedby`
- **Errors must be announced** — use `role="alert"` or `aria-live="polite"` on the error container
- **Error text must be visible** — do not rely on color alone (red border is not enough)
- **Include the field name** in the error message: "Student name is required" not just "Required"

```tsx
// ✅ CORRECT — Accessible error message
<label htmlFor="email">Email</label>
<Input
  id="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && (
  <p id="email-error" role="alert" className="text-sm text-destructive mt-1">
    {errors.email.message}
  </p>
)}
```

#### Required Fields
- Mark required fields with `aria-required="true"` or the HTML `required` attribute
- Visually indicate required fields with an asterisk `*` and a legend explaining it
- The asterisk must have `aria-hidden="true"` with a `<span className="sr-only">required</span>` alternative

#### Form Groups
- Group related fields (e.g., date ranges, address fields) in `<fieldset>` with `<legend>`
- Use `role="group"` with `aria-labelledby` when `<fieldset>` is not semantically appropriate

---

### 15. Dynamic Content & Live Regions (WCAG 4.1.3)

#### Announcements for Screen Readers
- **Toast notifications**: Use `role="status"` with `aria-live="polite"` (sonner handles this)
- **Error alerts**: Use `role="alert"` (equivalent to `aria-live="assertive"`)
- **Loading states**: Add `aria-busy="true"` to the container being loaded; use `aria-live="polite"` to announce "Loaded" when complete
- **Table updates**: After filtering, sorting, or pagination, announce the result count — e.g., `<span className="sr-only" aria-live="polite">Showing 25 of 142 results</span>`
- **Leo AI streaming**: The chat response container should use `aria-live="polite"` so streaming text is announced progressively

#### Implementation Pattern — Result Count Announcer
```tsx
// Add near filtered tables/lists
<div className="sr-only" aria-live="polite" aria-atomic="true">
  {`Showing ${displayedItems.length} of ${totalItems} ${entityName}`}
</div>
```

---

### 16. Motion & Animation (WCAG 2.3.1, 2.3.3)

- **`prefers-reduced-motion`**: All CSS animations and transitions must respect the user's OS preference
- **Tailwind built-in**: Use `motion-safe:` prefix for animations that should be skippable
- **No flashing content**: Never create content that flashes more than 3 times per second
- **Auto-playing animations**: Must have a mechanism to pause, stop, or hide (e.g., insight card glow)

```css
/* Already in globals.css — ensure it stays */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 17. Responsive Accessibility

- **Touch targets**: All interactive elements must have a minimum touch target of **44×44px** (WCAG 2.5.8 — Target Size)
  - Buttons: Minimum `h-9` (36px) with padding bringing total to ≥ 44px — verify hit area
  - Icon-only buttons: Use `h-10 w-10` (40px) minimum, or add padding to reach 44px
  - Table row actions: Ensure dropdown triggers are ≥ 44px touchable area
- **Zoom support**: Application must be usable at 200% browser zoom without loss of content or functionality (WCAG 1.4.4)
- **Orientation**: Do not lock orientation; content must work in both portrait and landscape (WCAG 1.3.4)
- **Text spacing**: Content must remain readable when users increase letter-spacing to 0.12em, word-spacing to 0.16em, line-height to 1.5 (WCAG 1.4.12)

---

### 18. Data Table Accessibility

Since `DataTable` is used extensively, it has specific accessibility requirements:

- **Table caption**: Include a visually hidden `<caption>` or `aria-label` describing the table's purpose
- **Column headers**: Use `<th scope="col">` — the DataTable component handles this
- **Sortable columns**: Add `aria-sort="ascending"`, `aria-sort="descending"`, or `aria-sort="none"` to sortable `<th>` elements
- **Row selection**: Selected rows must have `aria-selected="true"`
- **Bulk action bar**: When visible, announce selection count — "5 items selected. Actions available."
- **Pagination**: `<nav aria-label="Table pagination">` wrapper with `aria-current="page"` on active page
- **Empty state**: Use `role="status"` with descriptive text — "No results found" not just a blank table
- **Frozen columns**: Frozen column behavior must not prevent keyboard navigation across the full table

---

### 19. Color Independence (WCAG 1.4.1 — Use of Color)

**Never convey information through color alone.** Always pair color with a secondary indicator:

| Information | Color | Secondary Indicator |
|-------------|-------|-------------------|
| **Status** (Active/Inactive) | Green/Gray | Text label ("Active") |
| **Trend** (Up/Down) | Green/Red | Arrow icon (↑ ↓) + text ("+5.2%") |
| **Required field** | Red asterisk | `aria-required="true"` + legend text |
| **Error state** | Red border | Error message text + icon |
| **Link** | Blue text | Underline on hover (or always) |
| **Selected tab** | Background change | Bold weight + `aria-selected` |
| **Badge priority** | Color coding | Text label ("High", "Medium", "Low") |
| **Chart data** | Distinct colors | Legends with text labels; patterns where possible |

---

### 20. Accessibility Testing Checklist

Before shipping any new component or page, verify:

- [ ] **Keyboard-only**: Can complete all tasks without a mouse
- [ ] **Screen reader**: Navigable and understandable with VoiceOver (macOS) or NVDA (Windows)
- [ ] **Color contrast**: All text meets 4.5:1 (normal) or 3:1 (large); UI components meet 3:1
- [ ] **Focus visible**: Every interactive element shows a clear focus indicator on keyboard focus
- [ ] **Focus order**: Tab order matches visual layout; no focus traps
- [ ] **ARIA valid**: No misused ARIA roles; `aria-label` on all icon-only buttons; `aria-expanded` on toggles
- [ ] **Form labels**: Every input has a visible label or `aria-label`; errors are associated via `aria-describedby`
- [ ] **Zoom**: Usable at 200% zoom; no horizontal scrolling on text content
- [ ] **Motion**: Animations respect `prefers-reduced-motion`; no flashing content
- [ ] **Touch targets**: All buttons/controls ≥ 44×44px touch area on mobile
- [ ] **Color independence**: No information conveyed by color alone
- [ ] **Dynamic content**: Live regions announce loading states, errors, and filter results to screen readers

### Enhanced Component Patterns

- **Checkboxes**: Use enhanced styling with ≥ 3:1 border contrast; checked state uses both color fill AND a visible checkmark icon
- **Form controls**: Proper `<label>` association, visible error messaging with `aria-describedby`, and `aria-invalid` on error
- **Interactive elements**: Clear hover AND focus states; both must be visually distinct from the default state
- **Status communication**: Use both visual (color + icon) and text-based status indicators; badge counts include `sr-only` text
- **Loading skeletons**: Animated pulse uses `aria-busy="true"` on the parent container; include `<span className="sr-only">Loading…</span>`

## Error Handling and Loading States

### User Experience
- **Graceful degradation**: Components should handle missing data gracefully
- **Error boundaries**: Implement error boundaries for component trees
- **Loading states**: Use skeleton components and loading indicators
- **User feedback**: Provide clear error messages and success notifications

### Performance Considerations
- **Lazy loading**: Use React.lazy with Suspense for heavy components
- **Memoization**: Prevent unnecessary re-renders with proper memoization
- **State optimization**: Minimize state updates and use efficient selectors
- **Bundle splitting**: Keep components modular and focused

## Development Standards

### File Organization
**Components are organized into logical subdirectories under `/components/`:**

```
/components/
├── brand/           # Logo marks, brand icons, Font Awesome wrapper
│   ├── exxat-logo-mark.tsx
│   ├── font-awesome-icon.tsx
│   └── index.ts
├── features/        # Domain-specific feature modules
│   ├── chat-context.tsx
│   ├── image-manager.tsx
│   ├── leo-panel.tsx
│   └── index.ts
├── layout/          # App shell: sidebar, header, navigation
│   ├── app-sidebar.tsx
│   ├── nav-main.tsx
│   ├── nav-projects.tsx
│   ├── nav-user.tsx
│   ├── site-header.tsx
│   ├── team-switcher.tsx
│   └── index.ts
├── pages/           # Full page-level components (one per route/view)
│   ├── student-schedule-page.tsx
│   ├── student-schedule-detail.tsx
│   ├── reports-page.tsx
│   ├── ... (all page components)
│   └── index.ts
├── shared/          # Reusable UI building blocks used across pages
│   ├── data-table.tsx
│   ├── filter-bar.tsx
│   ├── metric-card.tsx
│   ├── pagination.tsx
│   ├── primary-page-template.tsx
│   ├── ... (all shared components)
│   └── index.ts
├── ui/              # shadcn/ui primitives (Button, Input, Dialog, etc.)
│   └── ... 
└── figma/           # Figma-imported components (ImageWithFallback)
```

**Import conventions:**
- **From App.tsx**: `import("./components/pages/student-schedule-page")`, `import("./components/features/leo-panel")`
- **Between components**: Use relative paths — `"../ui/button"`, `"../shared/data-table"`, `"../../stores/app-store"`
- **Barrel imports** (optional): `import { DataTable, FilterBar } from "../shared"`

### Code Organization
- **File structure**: Follow the subdirectory patterns above for all new components
- **Import statements**: Use consistent import ordering and aliasing
- **Type safety**: Use TypeScript interfaces and proper type definitions
- **Component naming**: Use descriptive names and proper display names

### Testing and Quality
- **Component isolation**: Build components to be testable in isolation
- **Props validation**: Use proper TypeScript typing for component props
- **Error handling**: Implement proper error boundaries and fallbacks
- **Documentation**: Include inline comments for complex logic

---

*These guidelines ensure consistency across the Exxat One platform and should be followed for all new components and features. Always refer to existing implementations (student-schedule-page.tsx, reports-page.tsx) as reference patterns when creating new pages or components.*