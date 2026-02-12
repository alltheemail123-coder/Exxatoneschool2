"use client";

import * as React from "react";
import {
  Plus,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  ChevronRight,
  Search,
  Shield,
  Upload,
  Star,
  AlertTriangle,
  UserPlus,
  UserMinus,
  CreditCard,
  Zap,
  Timer,
  Target,
  Award,
  TrendingUp,
  BookmarkPlus,
  FileBarChart,
  Clipboard,
  HelpCircle,
  Bell,
} from "lucide-react";

import { FontAwesomeIcon, type IconName } from "../font-awesome-icon";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { OutlineSearchInput } from "../ui/outline-search-input";
import {
  Badge,
  CountText,
  NewBadge,
  BetaBadge,
  CountBadge,
} from "../ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../ui/sidebar";
import Leo from "../../imports/Leo-68-134";
import ExxatOneLogo from "../../imports/Layer12-2076-99";
import { ExxatLogoMark } from "../exxat-logo-mark";

// Wrapper component to constrain Leo icon size
const LeoIcon = () => (
  <div className="h-4 w-4 flex items-center justify-center text-foreground">
    <Leo />
  </div>
);

// This is sample data for Exxat One
const data = {
  user: {
    name: "Dr. Sarah Johnson",
    email: "s.johnson@exxatone.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
  },
  teams: [
    {
      name: "Physical Therapy",
      logo: "graduation-cap" as IconName,
      plan: "BSc Program",
    },
    {
      name: "Occupational Therapy",
      logo: "graduation-cap" as IconName,
      plan: "MSc Program",
    },
    {
      name: "Nursing",
      logo: "graduation-cap" as IconName,
      plan: "BSN Program",
    },
  ],
  // Pipeline items excluded per program
  programExclusions: {
    "Physical Therapy": ["Explore"],
    "Occupational Therapy": [],
    "Nursing": ["Wishlist"],
  } as Record<string, string[]>,
  navMain: [
    // ── PRIMARY NAV ── Core daily-driver pages
    {
      title: "Home",
      url: "#",
      icon: "home" as IconName,
      isActive: true,
      navGroup: "primary" as const,
    },
    {
      title: "Leo AI",
      url: "#",
      icon: LeoIcon,
      isActive: false,
      badge: "Beta",
      navGroup: "primary" as const,
    },
    {
      title: "Inbox",
      url: "#",
      icon: "inbox" as IconName,
      isActive: false,
      badge: "15",
      navGroup: "primary" as const,
    },
    // ── PIPELINE ── School placement workflow (Explore → Wishlist → Slots → Schedule)
    {
      title: "Explore",
      url: "#",
      icon: "compass" as IconName,
      isActive: false,
      navGroup: "pipeline" as const,
    },
    {
      title: "Wishlist",
      url: "#",
      icon: "heart" as IconName,
      isActive: false,
      badge: "New",
      navGroup: "pipeline" as const,
    },
    {
      title: "Slots",
      url: "#",
      icon: "layer-group" as IconName,
      isActive: false,
      badge: "24",
      navGroup: "pipeline" as const,
    },
    {
      title: "Student Schedule",
      url: "#",
      icon: "calendar" as IconName,
      isActive: false,
      badge: "12",
      navGroup: "pipeline" as const,
    },
    // ── SUPPORTING ── Reference data & analytics
    {
      title: "Reports",
      url: "#",
      icon: "chart-bar" as IconName,
      isActive: false,
      navGroup: "supporting" as const,
    },
    {
      title: "My Students",
      url: "#",
      icon: "users" as IconName,
      isActive: false,
      navGroup: "supporting" as const,
    },
    {
      title: "Site Partner",
      url: "#",
      icon: "building" as IconName,
      isActive: false,
      navGroup: "supporting" as const,
    },
  ],
  projects: [
    {
      name: "Availability",
      url: "#",
      icon: "door-open" as IconName,
      hasNewRequests: true,
      newRequestCount: 5,
    },
    {
      name: "School Request",
      url: "#",
      icon: "graduation-cap" as IconName,
    },
    {
      name: "Internship",
      url: "#",
      icon: "clock" as IconName,
    },
  ],
  resourcesAndHelp: [
    {
      name: "Help Center",
      url: "#",
      icon: "book-open" as IconName,
    },
    {
      name: "Contact Support",
      url: "#",
      icon: "life-buoy" as IconName,
    },
  ],
  support: [
    {
      name: "Settings",
      url: "#",
      icon: "gear" as IconName,
    },
  ],
  notifications: [
    {
      id: "1",
      name: "Emma Wilson",
      title: "New Availability Request",
      message:
        "Student Emma Wilson has requested availability at Mayo Clinic for Internal Medicine rotation starting next week.",
      type: "request",
      icon: AlertCircle,
      time: "2 minutes ago",
      isRead: false,
    },
    {
      id: "2",
      name: "John Smith",
      title: "Schedule Approved",
      message:
        "The availability schedule for John Smith at Johns Hopkins has been approved by the site coordinator.",
      type: "success",
      icon: CheckCircle,
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: "3",
      name: "Cleveland Clinic",
      title: "Site Capacity Update",
      message:
        "Cleveland Clinic has updated their available slots for the upcoming semester. 5 new positions available.",
      type: "info",
      icon: Info,
      time: "3 hours ago",
      isRead: false,
    },
    {
      id: "4",
      name: "Michael Davis",
      title: "Availability Cancelled",
      message:
        "Student Michael Davis has cancelled their availability at Mayo Clinic due to schedule conflicts.",
      type: "warning",
      icon: AlertCircle,
      time: "5 hours ago",
      isRead: true,
    },
    {
      id: "5",
      name: "Dr. Rachel Adams",
      title: "Evaluation Submitted",
      message:
        "Dr. Rachel Adams has submitted the mid-rotation evaluation for student Sarah Kim at Boston Children's Hospital.",
      type: "success",
      icon: FileBarChart,
      time: "8 hours ago",
      isRead: false,
    },
    {
      id: "6",
      name: "System Alert",
      title: "Document Upload Required",
      message:
        "Student Alex Rodriguez needs to upload immunization records before starting placement at Stanford Medical Center.",
      type: "warning",
      icon: Upload,
      time: "12 hours ago",
      isRead: false,
    },
    {
      id: "7",
      name: "Jessica Chen",
      title: "Placement Confirmation",
      message:
        "Placement confirmed for Jessica Chen at UCLA Medical Center for Cardiology rotation from March 15-April 30.",
      type: "success",
      icon: CheckCircle,
      time: "Yesterday",
      isRead: true,
    },
    {
      id: "8",
      name: "Mount Sinai Hospital",
      title: "Site Requirements Updated",
      message:
        "Mount Sinai Hospital has updated their requirements. All students must complete HIPAA training before placement.",
      type: "info",
      icon: Shield,
      time: "Yesterday",
      isRead: false,
    },
    {
      id: "9",
      name: "Dr. Marcus Johnson",
      title: "Student Recommendation",
      message:
        "Dr. Marcus Johnson has submitted a stellar recommendation letter for graduating student Maria Rodriguez.",
      type: "success",
      icon: Star,
      time: "2 days ago",
      isRead: true,
    },
    {
      id: "10",
      name: "University of Miami",
      title: "New School Partnership",
      message:
        "Welcome University of Miami to our network! They have 25 students ready for Spring 2024 placements.",
      type: "success",
      icon: "graduation-cap" as IconName,
      time: "2 days ago",
      isRead: false,
    },
    {
      id: "11",
      name: "Kevin Thompson",
      title: "Attendance Alert",
      message:
        "Student Kevin Thompson has exceeded the maximum absence limit for his current rotation at Presbyterian Hospital.",
      type: "warning",
      icon: AlertTriangle,
      time: "3 days ago",
      isRead: true,
    },
    {
      id: "12",
      name: "Texas Medical Center",
      title: "Orientation Scheduled",
      message:
        "Orientation session scheduled for March 10th at 9:00 AM for all new students starting placements.",
      type: "info",
      icon: "calendar" as IconName,
      time: "3 days ago",
      isRead: false,
    },
    {
      id: "13",
      name: "Lisa Thompson",
      title: "Rotation Completed",
      message:
        "Student Lisa Thompson has successfully completed her pediatrics rotation at Boston Children's Hospital with excellent ratings.",
      type: "success",
      icon: Award,
      time: "4 days ago",
      isRead: true,
    },
    {
      id: "14",
      name: "Dr. Amanda Foster",
      title: "Preceptor Application",
      message:
        "Dr. Amanda Foster from Cedars-Sinai has applied to become a new preceptor for our Emergency Medicine program.",
      type: "request",
      icon: UserPlus,
      time: "5 days ago",
      isRead: false,
    },
    {
      id: "15",
      name: "System Update",
      title: "Billing Integration Complete",
      message:
        "The new billing integration with partner sites is now live. All placement fees will be automatically processed.",
      type: "success",
      icon: CreditCard,
      time: "5 days ago",
      isRead: true,
    },
    {
      id: "16",
      name: "NYU Langone Health",
      title: "Capacity Increase",
      message:
        "NYU Langone Health has expanded their program and can now accommodate 10 additional students per semester.",
      type: "info",
      icon: TrendingUp,
      time: "1 week ago",
      isRead: false,
    },
    {
      id: "17",
      name: "Madison Clark",
      title: "Extension Request",
      message:
        "Student Madison Clark has requested a 2-week extension for her surgery rotation at Denver Health Medical Center.",
      type: "request",
      icon: Timer,
      time: "1 week ago",
      isRead: true,
    },
    {
      id: "18",
      name: "Compliance Team",
      title: "Monthly Audit Complete",
      message:
        "Monthly compliance audit completed. All sites are meeting accreditation standards with 98% compliance rate.",
      type: "success",
      icon: Clipboard,
      time: "1 week ago",
      isRead: true,
    },
    {
      id: "19",
      name: "Houston Methodist",
      title: "New Program Launch",
      message:
        "Houston Methodist is launching a new Neurology placement program starting Fall 2024. Applications now open.",
      type: "info",
      icon: Zap,
      time: "2 weeks ago",
      isRead: false,
    },
    {
      id: "20",
      name: "System Alert",
      title: "Maintenance Scheduled",
      message:
        "System maintenance is scheduled for this weekend from 2 AM to 6 AM EST. Please plan accordingly.",
      type: "info",
      icon: "settings-2" as IconName,
      time: "2 weeks ago",
      isRead: true,
    },
  ],
};

interface AppSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  onNotificationsChange?: (show: boolean) => void;
  onNavigationChange?: (page: string) => void;
  currentPage?: string;
}

export function AppSidebar({
  onNotificationsChange,
  onNavigationChange,
  currentPage = "Home",
  ...props
}: AppSidebarProps) {
  const [notifications, setNotifications] = React.useState(
    data.notifications,
  );
  const [showNotifications, setShowNotifications] =
    React.useState(false);
  const [showUnreadsOnly, setShowUnreadsOnly] =
    React.useState(false);
  const [notificationFilter, setNotificationFilter] =
    React.useState<"all" | "updates" | "messages">("all");
  const [activeProgram, setActiveProgram] = React.useState(data.teams[0].name);

  const { setOpen, open, state } = useSidebar();

  // Filter nav items based on selected program
  const filteredNavMain = React.useMemo(() => {
    const exclusions = data.programExclusions[activeProgram] || [];
    return data.navMain.filter((item) => !exclusions.includes(item.title));
  }, [activeProgram]);

  const filteredNotifications = React.useMemo(() => {
    let filtered = notifications;

    // Apply unread filter first
    if (showUnreadsOnly) {
      filtered = filtered.filter((notif) => !notif.isRead);
    }

    // Then apply type filter
    if (notificationFilter === "updates") {
      filtered = filtered.filter(
        (notif) =>
          notif.type === "success" || notif.type === "info",
      );
    } else if (notificationFilter === "messages") {
      filtered = filtered.filter(
        (notif) =>
          notif.type === "request" || notif.type === "warning",
      );
    }

    return filtered;
  }, [notifications, showUnreadsOnly, notificationFilter]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-chart-1"; // Using chart colors for consistency
      case "warning":
        return "text-chart-4";
      case "request":
        return "text-chart-2";
      default:
        return "text-muted-foreground";
    }
  };

  const handleNavClick = (item: any) => {
    if (item.title === "Inbox") {
      setShowNotifications(true);
      onNotificationsChange?.(true);
      // Update the current page to Inbox so sidebar shows it as active
      if (onNavigationChange) {
        onNavigationChange("Inbox");
      }
      setOpen(true);
    } else {
      setShowNotifications(false);
      onNotificationsChange?.(false);

      // Handle navigation to different pages
      if (onNavigationChange) {
        onNavigationChange(item.title);
      }
    }
  };

  // Check if sidebar should be in collapsed state
  const isCollapsed =
    showNotifications || state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="[&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar - Main Navigation */}
      <Sidebar
        collapsible="none"
        className={`${isCollapsed ? "w-12" : "w-[240px]"} transition-all duration-200 group`}
        data-collapsible={isCollapsed ? "icon" : "none"}
        data-state={isCollapsed ? "collapsed" : "expanded"}
      >
        <SidebarHeader
          className={`${isCollapsed ? "items-center" : ""}`}
        >
          {/* Exxat One Logo at the top - Responsive */}
          <div className="px-3 py-3 border-b border-sidebar-border">
            {isCollapsed ? (
              // Show compact logo mark when collapsed
              <div className="h-8 w-8 flex items-center justify-center mx-auto">
                <ExxatLogoMark />
              </div>
            ) : (
              // Show logo mark + full wordmark when expanded
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 flex-shrink-0">
                  <ExxatLogoMark />
                </div>
                <div className="h-8 w-32">
                  <ExxatOneLogo />
                </div>
              </div>
            )}
          </div>

          <TeamSwitcher teams={data.teams} isCollapsed={isCollapsed} onProgramChange={setActiveProgram} />
        </SidebarHeader>

        <SidebarContent>
          {/* AI & Analytics Section */}
          <SidebarGroup>
            <SidebarGroupContent
              className={`${isCollapsed ? "px-0" : "px-1.5 md:px-0"}`}
            >
              <SidebarMenu className="overflow-visible">
                {filteredNavMain.map((item, index) => {
                  // Determine if we need a section label before this item
                  const prevItem = index > 0 ? filteredNavMain[index - 1] : null;
                  const showPipelineLabel = prevItem && prevItem.navGroup === "primary" && item.navGroup === "pipeline";
                  const showSupportingLabel = prevItem && prevItem.navGroup === "pipeline" && item.navGroup === "supporting";

                  return (
                  <div key={item.title}>
                    {/* ── Section labels between nav groups ── */}
                    {showPipelineLabel && !isCollapsed && (
                      <SidebarGroupLabel className="mt-2">Pipeline</SidebarGroupLabel>
                    )}
                    {showSupportingLabel && !isCollapsed && (
                      <SidebarGroupLabel className="mt-2">Supporting</SidebarGroupLabel>
                    )}
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => handleNavClick(item)}
                        isActive={currentPage === item.title}
                        className="px-2.5 md:px-2"
                        tooltip={isCollapsed ? item.title : undefined}
                      >
                        {typeof item.icon === 'string' ? (
                          <FontAwesomeIcon
                            name={item.icon as IconName}
                            weight={currentPage === item.title ? 'solid' : 'regular'}
                            className="h-4 w-4 transition-all"
                          />
                        ) : typeof item.icon === 'function' ? (
                          <item.icon />
                        ) : null}
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-[13px] font-medium">
                              {item.title}
                            </span>
                            {item.badge && (
                              <>
                                {item.badge === "New" ? (
                                  <NewBadge />
                                ) : item.badge === "Beta" ? (
                                  <BetaBadge />
                                ) : (
                                  <CountBadge>
                                    {item.badge}
                                  </CountBadge>
                                )}
                              </>
                            )}
                          </>
                        )}
                        {/* Show notification dot when collapsed for items with count badges */}
                        {isCollapsed && item.badge && !isNaN(Number(item.badge)) && (
                          <div className="absolute top-1/2 -translate-y-1/2 -right-1 h-3 w-3 bg-destructive rounded-full" />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Projects Section */}
          <NavProjects
            projects={data.projects}
            onItemClick={handleNavClick}
            showNotifications={showNotifications}
            isCollapsed={isCollapsed}
            currentPage={currentPage}
          />
        </SidebarContent>

        <SidebarFooter>
          {/* Utility Nav Section — Notifications, Resources, Settings */}
          <SidebarGroup className={isCollapsed ? "p-0" : ""}>
            {!isCollapsed && (
              <SidebarGroupLabel>Support</SidebarGroupLabel>
            )}
            <SidebarMenu>
              {/* Resources and Help Collapsible */}
              <Collapsible
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={
                        isCollapsed
                          ? "Resources & Help"
                          : undefined
                      }
                      className="px-2.5 md:px-2"
                    >
                      <HelpCircle className="h-4 w-4" />
                      {!isCollapsed && (
                        <span>Resources & Help</span>
                      )}
                      {!isCollapsed && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!isCollapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {data.resourcesAndHelp.map((item) => (
                          <SidebarMenuSubItem key={item.name}>
                            <SidebarMenuSubButton
                              onClick={() =>
                                handleNavClick({
                                  title: item.name,
                                })
                              }
                            >
                              <FontAwesomeIcon
                                name={item.icon as IconName}
                                weight="regular"
                                className="h-4 w-4"
                              />
                              <span>{item.name}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {/* Settings */}
              {data.support.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() =>
                      handleNavClick({ title: item.name })
                    }
                    tooltip={
                      isCollapsed ? item.name : undefined
                    }
                    className="px-2.5 md:px-2"
                  >
                    {typeof item.icon === 'string' ? (
                      <FontAwesomeIcon
                        name={item.icon as IconName}
                        weight={currentPage === item.name ? 'solid' : 'regular'}
                        className="h-4 w-4"
                      />
                    ) : (
                      <item.icon className="h-4 w-4" />
                    )}
                    {!isCollapsed && <span>{item.name}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <NavUser user={data.user} isCollapsed={isCollapsed} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar - Inbox Panel */}
      {showNotifications && (
        <Sidebar
          collapsible="none"
          className="w-[320px] md:flex"
        >
          <SidebarHeader className="gap-3.5 border-b border-border p-4 ">
            <div className="flex w-full items-center justify-between">
              <div className="font-medium text-foreground">
                Inbox
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNotifications(false);
                  onNotificationsChange?.(false);
                  // When closing inbox, navigate back to previous page
                  if (onNavigationChange) {
                    onNavigationChange("Home");
                  }
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">
                  Close inbox
                </span>
              </Button>
            </div>

            {/* Filter Chips and Unread Toggle */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant={
                    notificationFilter === "all"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => setNotificationFilter("all")}
                  className="h-7 px-3 text-xs"
                >
                  All
                </Button>
                <Button
                  variant={
                    notificationFilter === "updates"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setNotificationFilter("updates")
                  }
                  className="h-7 px-3 text-xs"
                >
                  Updates
                </Button>
                <Button
                  variant={
                    notificationFilter === "messages"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setNotificationFilter("messages")
                  }
                  className="h-7 px-3 text-xs"
                >
                  Messages
                </Button>
              </div>
              <Button
                variant={showUnreadsOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUnreadsOnly(!showUnreadsOnly)}
                className="h-7 px-3 text-xs"
              >
                Unread
              </Button>
            </div>

            <OutlineSearchInput
              placeholder="Search inbox..."
              className="h-8 w-full"
            />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup className="px-0">
              <SidebarGroupContent>
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex flex-col items-start gap-2 border-b border-border p-4 leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer transition-colors ${
                      !notification.isRead
                        ? "bg-chart-1/10"
                        : ""
                    }`}
                    onClick={() => {
                      // Mark as read when
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === notification.id
                            ? { ...n, isRead: true }
                            : n,
                        ),
                      );
                    }}
                  >
                    <div className="flex w-full items-center gap-2">
                      <notification.icon
                        className={`h-4 w-4 ${getNotificationColor(notification.type)}`}
                      />
                      <span className="font-medium">
                        {notification.name}
                      </span>
                      {!notification.isRead && (
                        <div className="ml-auto h-2 w-2 bg-chart-1 rounded-full" />
                      )}
                      <span className="ml-auto text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <span className="font-medium">
                      {notification.title}
                    </span>
                    <span className="line-clamp-3 w-[280px] text-muted-foreground whitespace-break-spaces">
                      {notification.message}
                    </span>
                  </div>
                ))}

                {filteredNotifications.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      {notificationFilter === "unread"
                        ? "No unread notifications"
                        : "No notifications"}
                    </p>
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}
    </Sidebar>
  );
}
