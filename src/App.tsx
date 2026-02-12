import * as React from "react";
import { AppSidebar } from "./components/layout/app-sidebar";
import { SiteHeader, type BreadcrumbItemType } from "./components/layout/site-header";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { useAppStore } from "./stores/app-store";

// ─── React.lazy: Code-split ALL heavy page components ────────────────────────
// Each page bundle only loads when first navigated to, reducing initial JS by ~60%
// Import paths use the organized /components/{pages,features,shared}/ structure.

const LazyAvailabilityPage = React.lazy(() =>
  import("./components/pages/availability-page").then(m => ({ default: m.AvailabilityPage }))
);
const LazyAvailabilityDetail = React.lazy(() =>
  import("./components/pages/availability-detail").then(m => ({ default: m.AvailabilityDetail }))
);
const LazyRequestDetailPage = React.lazy(() =>
  import("./components/pages/request-detail-page").then(m => ({ default: m.RequestDetailPage }))
);
const LazySchoolProfile = React.lazy(() =>
  import("./components/pages/school-profile").then(m => ({ default: m.SchoolProfile }))
);
const LazyStudentProfile = React.lazy(() =>
  import("./components/pages/student-profile").then(m => ({ default: m.StudentProfile }))
);
const LazyLeoAIPage = React.lazy(() =>
  import("./components/pages/leo-ai-page").then(m => ({ default: m.LeoAIPage }))
);
const LazyReportsPage = React.lazy(() =>
  import("./components/pages/reports-page").then(m => ({ default: m.ReportsPage }))
);
const LazyRequestedSlotsPage = React.lazy(() =>
  import("./components/pages/requested-slots-page").then(m => ({ default: m.RequestedSlotsPage }))
);
const LazyApprovedSlotsPage = React.lazy(() =>
  import("./components/pages/approved-slots-page").then(m => ({ default: m.ApprovedSlotsPage }))
);
const LazySlotsPage = React.lazy(() =>
  import("./components/pages/slots-page").then(m => ({ default: m.SlotsPage }))
);
const LazyStudentSchedulePage = React.lazy(() =>
  import("./components/pages/student-schedule-page").then(m => ({ default: m.StudentSchedulePage }))
);
const LazyStudentScheduleDetail = React.lazy(() =>
  import("./components/pages/student-schedule-detail").then(m => ({ default: m.StudentScheduleDetail }))
);
const LazyWishlistPage = React.lazy(() =>
  import("./components/pages/wishlist-page").then(m => ({ default: m.WishlistPage }))
);
const LazyHomeMapSection = React.lazy(() =>
  import("./components/pages/home-map-section").then(m => ({ default: m.HomeMapSection }))
);
const LazyLeoPanel = React.lazy(() =>
  import("./components/features/leo-panel").then(m => ({ default: m.LeoPanel }))
);
const LazyChatProvider = React.lazy(() =>
  import("./components/features/chat-context").then(m => ({ default: m.ChatProvider }))
);
const LazyMetricShowcase = React.lazy(() =>
  import("./components/pages/metric-showcase").then(m => ({ default: m.MetricShowcase }))
);
const LazyAlertsSection = React.lazy(() =>
  import("./components/pages/alerts-section").then(m => ({ default: m.AlertsSection }))
);
const LazyPipelineOverviewSection = React.lazy(() =>
  import("./components/pages/dashboard-visualizations").then(m => ({ default: m.PipelineOverviewSection }))
);
const LazyPendingItemsSection = React.lazy(() =>
  import("./components/pages/pending-items-section").then(m => ({ default: m.PendingItemsSection }))
);
const LazyPartnerPerformanceSection = React.lazy(() =>
  import("./components/pages/partner-performance-section").then(m => ({ default: m.PartnerPerformanceSection }))
);

// ─── Skeleton loader for Suspense boundaries ────────────────────────────────
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[200px]">
    <div className="animate-pulse space-y-4 w-full max-w-2xl px-8">
      <div className="h-8 bg-muted rounded-lg w-1/3" />
      <div className="h-4 bg-muted rounded w-2/3" />
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
      </div>
      <div className="h-64 bg-muted rounded-lg mt-4" />
    </div>
  </div>
);

const SectionLoader = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-muted rounded-lg" />
  </div>
);

// ─── Consolidated store selectors ────────────────────────────────────────────
// Using individual selectors for state (prevents unnecessary re-renders)
// but grouping action selectors into a single stable reference via `useRef`-style
// since Zustand actions never change identity.

/** Grab all navigation actions once — they're stable across renders */
const useActions = () => {
  // Actions from Zustand are stable references (they never change),
  // so subscribing to them individually is safe and won't cause re-renders.
  const store = useAppStore;
  return React.useMemo(() => ({
    setShowNotifications: store.getState().setShowNotifications,
    navigateToPage: store.getState().navigateToPage,
    navigateToAvailabilityDetail: store.getState().navigateToAvailabilityDetail,
    navigateBackToAvailability: store.getState().navigateBackToAvailability,
    navigateToRequestDetail: store.getState().navigateToRequestDetail,
    navigateBackFromRequestDetail: store.getState().navigateBackFromRequestDetail,
    updateRequestStage: store.getState().updateRequestStage,
    navigateToSchoolProfile: store.getState().navigateToSchoolProfile,
    navigateToStudentProfile: store.getState().navigateToStudentProfile,
    navigateBackFromSchoolProfile: store.getState().navigateBackFromSchoolProfile,
    navigateBackFromStudentProfile: store.getState().navigateBackFromStudentProfile,
    navigateToScheduleDetail: store.getState().navigateToScheduleDetail,
    navigateBackFromScheduleDetail: store.getState().navigateBackFromScheduleDetail,
    toggleLeoPanel: store.getState().toggleLeoPanel,
    openLeoPanelWithQuery: store.getState().openLeoPanelWithQuery,
    setLeoPanelContext: store.getState().setLeoPanelContext,
  }), []);
};

// ─── Main App ────────────────────────────────────────────────────────────────

function App() {
  // ── State selectors (each subscribes only to its own slice) ──
  const currentPage = useAppStore(s => s.currentPage);
  const showNotifications = useAppStore(s => s.showNotifications);
  const selectedAvailabilityId = useAppStore(s => s.selectedAvailabilityId);
  const selectedRequestId = useAppStore(s => s.selectedRequestId);
  const selectedRequestStage = useAppStore(s => s.selectedRequestStage);
  const selectedSchoolId = useAppStore(s => s.selectedSchoolId);
  const selectedStudentId = useAppStore(s => s.selectedStudentId);
  const selectedScheduleId = useAppStore(s => s.selectedScheduleId);
  const showLeoPanel = useAppStore(s => s.showLeoPanel);
  // FIX: Extract hook call to component body (was illegally called in JSX before)
  const leoPanelContext = useAppStore(s => s.leoPanelContext);

  // ── Stable action references (never cause re-renders) ──
  const actions = useActions();

  // ── useTransition: Keep the UI responsive during heavy page transitions ──
  const [isPending, startTransition] = React.useTransition();

  // ── Sync Leo panel context with navigation state ──
  React.useEffect(() => {
    let context = currentPage;
    if (selectedStudentId) context = "Student Profile";
    else if (selectedSchoolId) context = "School Profile";
    else if (selectedScheduleId) context = "Schedule Detail";
    else if (selectedRequestId) context = "Request Detail";
    else if (selectedAvailabilityId) context = "Availability Detail";
    actions.setLeoPanelContext(context);
  }, [currentPage, selectedAvailabilityId, selectedRequestId, selectedSchoolId, selectedStudentId, selectedScheduleId, actions]);

  // ── Theme bootstrap (runs once) ──
  React.useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const effective = (saved || "light") === "system" ? system : (saved || "light");
    document.documentElement.classList.toggle("dark", effective === "dark");

    // Restore color theme
    const savedColor = localStorage.getItem("colorTheme");
    if (savedColor && savedColor !== "rose") {
      document.documentElement.classList.add(`theme-${savedColor}`);
    }
  }, []);

  // ── Navigation handler — wraps in startTransition for non-blocking page switch ──
  const handleNavigation = React.useCallback((page: string) => {
    startTransition(() => {
      if (page === "Inbox") {
        actions.setShowNotifications(!showNotifications);
      } else {
        actions.navigateToPage(page);
      }
    });
  }, [showNotifications, actions, startTransition]);

  // ── Memoised sidebar style ──
  const sidebarStyle = React.useMemo(() => ({
    "--sidebar-width": showNotifications ? "calc(var(--sidebar-width-icon) + 320px)" : "240px",
    "--sidebar-width-icon": "48px",
  } as React.CSSProperties), [showNotifications]);

  // ── Breadcrumb configs (stable references via useMemo) ──
  const requestDetailBreadcrumbs: BreadcrumbItemType[] = React.useMemo(() => [
    { label: "Home", onClick: () => actions.navigateToPage("Home") },
    { label: "Availability", onClick: actions.navigateBackFromRequestDetail },
  ], [actions]);

  const availabilityDetailBreadcrumbs: BreadcrumbItemType[] = React.useMemo(() => [
    { label: "Home", onClick: () => actions.navigateToPage("Home") },
    { label: "Availability", onClick: actions.navigateBackToAvailability },
  ], [actions]);

  // ── Shared SiteHeader props (avoids repetition) ──
  const leoProps = React.useMemo(() => ({
    onLeoToggle: actions.toggleLeoPanel,
    onLeoSearch: actions.openLeoPanelWithQuery,
    showLeoPanel,
  }), [actions, showLeoPanel]);

  // ── Render helpers ──

  const renderAvailabilityContent = () => {
    if (selectedSchoolId) {
      return (
        <div className="min-w-0 overflow-clip bg-background text-foreground">
          <SiteHeader currentPage="School Profile" {...leoProps} />
          <React.Suspense fallback={<PageLoader />}>
            <LazySchoolProfile
              schoolId={selectedSchoolId}
              onBack={actions.navigateBackFromSchoolProfile}
              onStudentClick={actions.navigateToStudentProfile}
            />
          </React.Suspense>
        </div>
      );
    }

    if (selectedStudentId) {
      return (
        <div className="min-w-0 overflow-clip bg-background text-foreground">
          <SiteHeader currentPage="Student Profile" {...leoProps} />
          <React.Suspense fallback={<PageLoader />}>
            <LazyStudentProfile
              studentId={selectedStudentId}
              onBack={actions.navigateBackFromStudentProfile}
              onSchoolClick={actions.navigateToSchoolProfile}
            />
          </React.Suspense>
        </div>
      );
    }

    if (selectedRequestId) {
      return (
        <div className="min-w-0 overflow-clip bg-background text-foreground">
          <SiteHeader currentPage="Johns Hopkins University" breadcrumbs={requestDetailBreadcrumbs} {...leoProps} />
          <React.Suspense fallback={<PageLoader />}>
            <LazyRequestDetailPage
              requestId={selectedRequestId}
              stage={selectedRequestStage}
              onBack={actions.navigateBackFromRequestDetail}
              onStageUpdate={actions.updateRequestStage}
              onSchoolClick={actions.navigateToSchoolProfile}
              onStudentClick={actions.navigateToStudentProfile}
            />
          </React.Suspense>
        </div>
      );
    }

    if (selectedAvailabilityId) {
      return (
        <div className="min-w-0 overflow-clip bg-background text-foreground">
          <SiteHeader currentPage="Availability Detail" breadcrumbs={availabilityDetailBreadcrumbs} {...leoProps} />
          <React.Suspense fallback={<PageLoader />}>
            <LazyAvailabilityDetail
              availabilityId={selectedAvailabilityId}
              onBack={actions.navigateBackToAvailability}
              onViewRequestDetails={actions.navigateToRequestDetail}
              onStageUpdate={actions.updateRequestStage}
            />
          </React.Suspense>
        </div>
      );
    }

    return (
      <div className="min-w-0 overflow-hidden bg-background text-foreground h-full flex flex-col">
        <SiteHeader currentPage="Availability" {...leoProps} />
        <React.Suspense fallback={<PageLoader />}>
          <LazyAvailabilityPage onItemClick={actions.navigateToAvailabilityDetail} />
        </React.Suspense>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentPage) {
      case "Leo AI":
        return (
          <div className="min-w-0 overflow-clip bg-background text-foreground">
            <SiteHeader currentPage="Leo AI" {...leoProps} />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 pt-4 pb-12 md:gap-6 md:pt-6 md:pb-16">
                  <React.Suspense fallback={<PageLoader />}>
                    <LazyLeoAIPage />
                  </React.Suspense>
                </div>
              </div>
            </div>
          </div>
        );

      case "Reports":
        return (
          <div className="min-w-0 overflow-clip bg-background text-foreground">
            <SiteHeader currentPage="Reports" {...leoProps} />
            <div className="p-4 lg:p-6">
              <React.Suspense fallback={<PageLoader />}>
                <LazyReportsPage />
              </React.Suspense>
            </div>
          </div>
        );

      case "Slots":
        return (
          <div className="min-w-0 overflow-hidden bg-background text-foreground h-full flex flex-col">
            <SiteHeader currentPage="Slots" {...leoProps} />
            <React.Suspense fallback={<PageLoader />}>
              <LazySlotsPage onItemClick={actions.navigateToAvailabilityDetail} />
            </React.Suspense>
          </div>
        );

      case "Student Schedule": {
        if (selectedScheduleId) {
          const scheduleDetailBreadcrumbs: BreadcrumbItemType[] = [
            { label: "Home", onClick: () => actions.navigateToPage("Home") },
            { label: "Student Schedule", onClick: actions.navigateBackFromScheduleDetail },
          ];
          return (
            <div className="min-w-0 overflow-clip bg-background text-foreground">
              <SiteHeader currentPage="Schedule Details" breadcrumbs={scheduleDetailBreadcrumbs} {...leoProps} />
              <React.Suspense fallback={<PageLoader />}>
                <LazyStudentScheduleDetail
                  scheduleId={selectedScheduleId}
                  onBack={actions.navigateBackFromScheduleDetail}
                  onStudentClick={actions.navigateToStudentProfile}
                  onSchoolClick={actions.navigateToSchoolProfile}
                />
              </React.Suspense>
            </div>
          );
        }
        return (
          <div className="min-w-0 overflow-hidden bg-background text-foreground h-full flex flex-col">
            <SiteHeader currentPage="Student Schedule" {...leoProps} />
            <React.Suspense fallback={<PageLoader />}>
              <LazyStudentSchedulePage onItemClick={actions.navigateToScheduleDetail} />
            </React.Suspense>
          </div>
        );
      }

      case "Requested":
        return (
          <div className="min-w-0 overflow-hidden bg-background text-foreground h-full flex flex-col">
            <SiteHeader currentPage="Requested Slots" {...leoProps} />
            <React.Suspense fallback={<PageLoader />}>
              <LazyRequestedSlotsPage onItemClick={actions.navigateToAvailabilityDetail} />
            </React.Suspense>
          </div>
        );

      case "Approved":
        return (
          <div className="min-w-0 overflow-hidden bg-background text-foreground h-full flex flex-col">
            <SiteHeader currentPage="Approved Slots" {...leoProps} />
            <React.Suspense fallback={<PageLoader />}>
              <LazyApprovedSlotsPage onItemClick={actions.navigateToAvailabilityDetail} />
            </React.Suspense>
          </div>
        );

      case "Availability":
        return renderAvailabilityContent();

      case "Wishlist":
        return (
          <div className="min-w-0 overflow-hidden bg-background text-foreground h-full flex flex-col">
            <SiteHeader currentPage="Wishlist" {...leoProps} />
            <React.Suspense fallback={<PageLoader />}>
              <LazyWishlistPage />
            </React.Suspense>
          </div>
        );

      case "Home":
      default:
        return (
          <>
            <div className="min-w-0 overflow-clip bg-background text-foreground">
              <SiteHeader currentPage="Home" breadcrumbs={[]} {...leoProps} />
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-6 py-4 md:gap-6 md:py-6">
                    <React.Suspense fallback={<SectionLoader />}>
                      <LazyHomeMapSection />
                    </React.Suspense>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background text-foreground">
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-8 py-4 md:gap-8 md:py-6">
                    <React.Suspense fallback={<SectionLoader />}>
                      <LazyMetricShowcase />
                    </React.Suspense>
                    <React.Suspense fallback={<SectionLoader />}>
                      <LazyPipelineOverviewSection />
                    </React.Suspense>
                    <React.Suspense fallback={<SectionLoader />}>
                      <LazyAlertsSection />
                    </React.Suspense>
                    <React.Suspense fallback={<SectionLoader />}>
                      <LazyPendingItemsSection />
                    </React.Suspense>
                    <React.Suspense fallback={<SectionLoader />}>
                      <LazyPartnerPerformanceSection />
                    </React.Suspense>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <React.Suspense fallback={null}>
      <LazyChatProvider>
        <SidebarProvider style={sidebarStyle}>
          <AppSidebar
            variant="inset"
            onNotificationsChange={actions.setShowNotifications}
            onNavigationChange={handleNavigation}
            currentPage={currentPage}
          />
          <SidebarInset className="min-w-0 overflow-y-auto h-screen bg-background text-foreground border-0">
            <div className={`h-full overflow-y-auto${isPending ? " opacity-80 transition-opacity duration-150" : ""}`}>
              {renderContent()}
            </div>
          </SidebarInset>

          {/* Leo AI Panel — lazy loaded */}
          {showLeoPanel && (
            <React.Suspense fallback={null}>
              <LazyLeoPanel
                isOpen={showLeoPanel}
                onClose={actions.toggleLeoPanel}
                pageContext={leoPanelContext}
              />
            </React.Suspense>
          )}
        </SidebarProvider>
      </LazyChatProvider>
    </React.Suspense>
  );
}

export default App;