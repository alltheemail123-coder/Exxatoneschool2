"use client"

import * as React from "react"
import {
  ArrowLeft,
  DoorOpen,
  Users,
  User,
  MapPin,
  Calendar,
  Clock,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Timer,
  FileText,
  Star,
  Award,
  Eye,
  Edit,
  Copy,
  Share,
  MoreHorizontal,
  ChevronRight,
  GraduationCap,
  Building2,
  Phone,
  Mail,
  Globe,
  Sparkles,
  Target,
  BarChart3,
  PieChart,
  Download,
  XCircle,
  School,
  Hash,
  Table2,
  Grid3X3,
  Shield,
  ClipboardCheck,
  Calendar as CalendarIcon,
  UserCheck,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  MousePointer,
  TrendingDown,
  BookOpen,
  Badge as BadgeIcon,
  Settings,
  Percent,
  ThumbsUp,
  MessageCircle,
  Hourglass,
  Users2,
  Crown,
  Workflow,
  Zap,
} from "lucide-react"

import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import { Input } from "./ui/input"
import { OutlineSearchInput } from "./ui/outline-search-input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { DataTable, type ColumnConfig } from "./data-table"
import { type PaginationInfo } from "./pagination"
import FilterBar, { type FilterConfig, type ActiveFilter } from "./filter-bar"
import { CalendarView } from "./calendar-view"
import { BulkActionBar, getPipelineActionsForStage } from "./floating-action-bar"
import { DashboardCard, createDashboardCardData } from "./dashboard-card"

import { ViewManager } from "./view-manager"
import { useAppStore } from "../stores/app-store"
import { formatDate, formatDateRange } from "../utils/date-utils"

interface AvailabilityDetailProps {
  availabilityId: string
  onBack: () => void
  onViewRequestDetails?: (requestId: string, stage: string) => void
  onStageUpdate?: (requestId: string, newStage: string) => void
}

// Mock data for the selected availability item
const mockAvailabilityData = {
  id: "AV-2024-001",
  name: "Internal Medicine Rotation - Mayo Clinic",
  site: "Mayo Clinic",
  location: "Rochester, MN",
  discipline: "Internal Medicine",
  specialization: "General Internal Medicine",
  experienceType: "Individual",
  duration: "8 weeks",
  startDate: "03/15/2024",
  endDate: "05/10/2024",
  totalSlots: 12,
  availableSlots: 7,
  requestedSlots: 5,
  approvedSlots: 3,
  confirmedSlots: 2,
  isYearRound: false,
  isUnlimited: false,
  status: "Active",
  createdDate: "01/15/2024",
  lastModified: "02/28/2024",
  publishedDate: "01/20/2024",
  publishedBy: "Dr. Sarah Mitchell",
  visibility: "Public",
  autoApproval: false,
  coordinator: {
    name: "Dr. Sarah Mitchell",
    email: "s.mitchell@mayoclinic.org",
    phone: "(507) 284-2511",
  },
  requirements: [
    "Current CPR certification",
    "HIPAA training completion", 
    "Background check clearance",
    "Immunization records up to date",
  ],
  eligibilityCriteria: [
    "Third or fourth year medical student",
    "Minimum GPA of 3.0",
    "Completed core internal medicine coursework",
    "Valid medical student insurance",
    "USMLE Step 1 passed (if applicable)",
  ],
  rolesResponsibilities: [
    "Participate in patient rounds and case presentations",
    "Assist with patient histories and physical examinations", 
    "Attend educational seminars and grand rounds",
    "Complete assigned reading and case studies",
    "Maintain patient confidentiality and professionalism",
    "Submit weekly reflection reports",
  ],
  learningOutcomes: [
    "Develop clinical reasoning skills in internal medicine",
    "Gain experience with common medical conditions",
    "Learn to work effectively in a healthcare team",
    "Improve communication skills with patients and families",
  ],
  schedule: {
    hoursPerWeek: 40,
    daysPerWeek: 5,
    shifts: "Monday - Friday, 7:00 AM - 3:00 PM",
  },
  ratings: {
    overall: 4.8,
    totalReviews: 24,
    teaching: 4.9,
    support: 4.7,
    experience: 4.8,
  },
}

// Pre-generate mock data to avoid performance issues - moved outside component
const schools = [
  { name: "Johns Hopkins University", type: "regular" },
  { name: "University of California San Francisco", type: "consortium" },
  { name: "Mayo Medical School", type: "partner", tier: "gold" }, 
  { name: "Northwestern University", type: "regular" },
  { name: "University of Illinois", type: "consortium" },
  { name: "University of Minnesota", type: "partner", tier: "silver" },
  { name: "University of Michigan", type: "regular" },
  { name: "Stanford University", type: "partner", tier: "gold" },
  { name: "Harvard Medical School", type: "regular" },
  { name: "Yale School of Medicine", type: "consortium" },
  { name: "Duke University", type: "partner", tier: "gold" },
  { name: "University of Pennsylvania", type: "consortium" },
  { name: "Columbia University", type: "regular" },
  { name: "University of Wisconsin", type: "consortium" },
  { name: "Washington University", type: "partner", tier: "silver" },
  { name: "Vanderbilt University", type: "regular" },
  { name: "University of Chicago", type: "partner", tier: "gold" },
  { name: "Case Western Reserve University", type: "consortium" },
  { name: "Mount Sinai School of Medicine", type: "regular" },
  { name: "University of Pittsburgh", type: "consortium" },
  { name: "Emory University", type: "partner", tier: "silver" },
  { name: "University of North Carolina", type: "regular" },
  { name: "University of Virginia", type: "partner", tier: "bronze" },
  { name: "Boston University", type: "consortium" },
  { name: "University of Colorado", type: "regular" },
  { name: "University of Utah", type: "partner", tier: "bronze" },
  { name: "Oregon Health Sciences University", type: "consortium" }
]

const locations = ["Rochester, MN", "Chicago, IL", "Milwaukee, WI", "Cleveland, OH", "Detroit, MI"]
const disciplines = ["Internal Medicine", "Pediatrics", "Radiology", "Psychiatry", "Family Medicine"]
const priorities = ["High", "Medium", "Low", "Urgent"]
const complianceStatuses = ["Compliant", "Pending", "Missing Documents", "Expired", "Under Review"]
const studentNames = [
  "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Kim", "Jessica Williams",
  "James Anderson", "Maria Garcia", "Robert Taylor", "Lisa Thompson", "Kevin Martinez",
  "Amanda Wilson", "Christopher Lee", "Nicole Brown", "Daniel Davis", "Ashley Miller"
]

// Regular function for mock data generation (no hooks)
function generateMockRequests(count: number, stage: string) {
  const requests = []
  for (let i = 0; i < count; i++) {
    const schoolData = schools[i % schools.length]
    const baseDate = new Date('04/01/2024')
    const requestDate = new Date(baseDate.getTime() + (i % 30) * 24 * 60 * 60 * 1000)
    
    // Generate requested dates
    const startDate = new Date('04/15/2024')
    startDate.setDate(startDate.getDate() + (i % 60))
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 56) // 8 weeks
    
    const slots = (i % 15) + 1
    const priority = priorities[i % priorities.length]
    const complianceStatus = complianceStatuses[i % complianceStatuses.length]
    const studentName = studentNames[i % studentNames.length]
    
    const baseRequest = {
      id: `${i + 1}`,
      school: schoolData.name,
      schoolType: schoolData.type,
      tier: schoolData.tier,
      studentName: stage === "Confirmed Students" || (i % 10) < 3 ? studentName : null, // 30% chance to have student info
      slots,
      location: locations[i % locations.length],
      discipline: disciplines[i % disciplines.length],
      requestedDates: `${startDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}/${startDate.getFullYear()} - ${endDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}`,
      priority,
      date: formatDate(requestDate),
      submittedBy: `${schoolData.name} Coordinator`,
      lastUpdated: formatDate(new Date(Date.now() - (i % 7) * 24 * 60 * 60 * 1000)),
      status: stage
    }

    // Add stage-specific fields
    if (stage === "Confirmed Students") {
      requests.push({
        ...baseRequest,
        studentName: studentName, // Always have student name for confirmed students
        complianceStatus,
        enrollmentDate: formatDate(new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000)),
        supervisorName: "Dr. Smith"
      })
    } else if (stage === "Under Review") {
      requests.push({
        ...baseRequest,
        reviewerName: "Dr. Johnson",
        reviewStartDate: formatDate(new Date(Date.now() - (i % 7) * 24 * 60 * 60 * 1000)),
        estimatedDecision: formatDate(new Date(Date.now() + (i % 7) * 24 * 60 * 60 * 1000))
      })
    } else if (stage === "Approved") {
      requests.push({
        ...baseRequest,
        approvalDate: formatDate(new Date(Date.now() - (i % 7) * 24 * 60 * 60 * 1000)),
        approvedBy: "Dr. Wilson",
        expirationDate: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
      })
    } else if (stage === "Ongoing") {
      requests.push({
        ...baseRequest,
        studentName: studentName, // Always have student name for ongoing rotations
        startDate: formatDate(new Date(Date.now() - (i % 60) * 24 * 60 * 60 * 1000)),
        expectedEndDate: formatDate(new Date(Date.now() + (30 + (i % 30)) * 24 * 60 * 60 * 1000)),
        supervisorName: "Dr. Mitchell",
        currentWeek: (i % 8) + 1,
        totalWeeks: 8,
        progressPercentage: Math.round(((i % 8) + 1) / 8 * 100),
        lastCheckIn: formatDate(new Date(Date.now() - (i % 7) * 24 * 60 * 60 * 1000)),
        performanceRating: ["Excellent", "Good", "Satisfactory", "Needs Improvement"][i % 4]
      })
    } else if (stage === "Complete") {
      requests.push({
        ...baseRequest,
        studentName: studentName, // Always have student name for completed rotations
        completionDate: formatDate(new Date(Date.now() - (i % 90) * 24 * 60 * 60 * 1000)),
        supervisorName: "Dr. Rodriguez",
        finalGrade: ["A", "A-", "B+", "B", "B-"][i % 5],
        finalEvaluation: ["Outstanding", "Excellent", "Good", "Satisfactory"][i % 4],
        feedbackSubmitted: (i % 3) === 0,
        certificateIssued: (i % 2) === 0,
        totalHours: 320 + (i % 80),
        attendanceRate: 95 + (i % 5)
      })
    } else if (stage === "Rejected") {
      const reasons = ["Capacity full", "Requirements not met", "Schedule conflict", "Budget constraints"]
      requests.push({
        ...baseRequest,
        rejectionDate: formatDate(new Date(Date.now() - (i % 14) * 24 * 60 * 60 * 1000)),
        rejectionReason: reasons[i % 4],
        rejectedBy: "Dr. Davis"
      })
    } else {
      requests.push(baseRequest)
    }
  }
  return requests
}

// Pre-generated pipeline data to avoid performance issues
const pipelineData = [
  {
    stage: "School Request",
    count: 1200,
    status: "active",
    icon: School,
    color: "text-chart-1",
    bgColor: "bg-chart-1/5",
    description: "Requests from schools for availability slots",
    requests: generateMockRequests(35, "School Request")
  },
  {
    stage: "Under Review",
    count: 156,
    status: "active",
    icon: Eye,
    color: "text-chart-5",
    bgColor: "bg-chart-5/5", 
    description: "Requests currently being evaluated",
    requests: generateMockRequests(28, "Under Review")
  },
  {
    stage: "Approved",
    count: 89,
    status: "active",
    icon: CheckCircle,
    color: "text-chart-2",
    bgColor: "bg-chart-2/5",
    description: "Approved requests awaiting student confirmation",
    requests: generateMockRequests(22, "Approved")
  },
  {
    stage: "Confirmed Students",
    count: 45,
    status: "completed",
    icon: UserCheck,
    color: "text-chart-2",
    bgColor: "bg-chart-2/5",
    description: "Students confirmed for availability",
    requests: generateMockRequests(15, "Confirmed Students")
  },
  {
    stage: "Ongoing",
    count: 32,
    status: "active",
    icon: Activity,
    color: "text-chart-3",
    bgColor: "bg-chart-3/5",
    description: "Active rotations currently in progress",
    requests: generateMockRequests(18, "Ongoing")
  },
  {
    stage: "Complete",
    count: 67,
    status: "completed",
    icon: Award,
    color: "text-chart-1",
    bgColor: "bg-chart-1/5",
    description: "Successfully completed rotations",
    requests: generateMockRequests(25, "Complete")
  },
  {
    stage: "Rejected",
    count: 23,
    status: "rejected",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/5",
    description: "Requests that were declined",
    requests: generateMockRequests(12, "Rejected")
  },
]

// Comprehensive Key Performance Metrics - Pre-generated
const performanceMetrics = [
  // Performance Metrics (0-3)
  createDashboardCardData("Fill Rate", "83%", Target, "text-chart-2", {
    change: "+12%",
    trend: "up",
    description: "Slots filled vs available",
  }),
  createDashboardCardData("Avg Response Time", "2.3 days", Timer, "text-chart-1", {
    change: "-0.5 days",
    trend: "up",
    description: "Request to approval time",
  }),
  createDashboardCardData("Approval Rate", "78.5%", CheckCircle, "text-chart-2", {
    change: "+5%",
    trend: "up",
    description: "Requests approved vs total",
  }),
  createDashboardCardData("Avg Processing Time", "4.2 days", Hourglass, "text-chart-5", {
    change: "-1.2 days",
    trend: "up",
    description: "Time from request to decision",
  }),
  
  // Engagement Metrics (4-7)
  createDashboardCardData("Total Views", "2,847", Eye, "text-chart-3", {
    change: "+15%",
    trend: "up",
    description: "Views by schools this month",
  }),
  createDashboardCardData("Click Rate", "43.4%", MousePointer, "text-chart-1", {
    change: "+8%",
    trend: "up",
    description: "View to click conversion",
  }),
  createDashboardCardData("Request Volume", "487", FileText, "text-chart-2", {
    change: "+23%",
    trend: "up",
    description: "Requests submitted this month",
  }),
  createDashboardCardData("Student Rating", "4.8/5", Star, "text-chart-4", {
    change: "+0.2",
    trend: "up",
    description: "Average student satisfaction",
  }),
  
  // Success Metrics (8-11)
  createDashboardCardData("Student Completion", "94.2%", GraduationCap, "text-chart-1", {
    change: "+2.1%",
    trend: "up",
    description: "Students completing full rotation",
  }),
  createDashboardCardData("Repeat Bookings", "67%", Users, "text-chart-3", {
    change: "+9%",
    trend: "up",
    description: "Schools booking again",
  }),
  createDashboardCardData("Site Utilization", "86%", Building2, "text-chart-2", {
    change: "+4%",
    trend: "up",
    description: "Overall site capacity usage",
  }),
  createDashboardCardData("Quality Score", "9.2/10", Award, "text-chart-4", {
    change: "+0.3",
    trend: "up",
    description: "Overall program quality rating",
  }),
]

// Pre-generated top schools data
const topSchools = [
  {
    name: "University of Minnesota",
    views: 342,
    clicks: 156,
    requests: 23,
    change: "+12%",
    trend: "up"
  },
  {
    name: "Mayo Medical School", 
    views: 298,
    clicks: 134,
    requests: 19,
    change: "+8%",
    trend: "up"
  },
  {
    name: "Northwestern University",
    views: 267,
    clicks: 98,
    requests: 15,
    change: "+5%",
    trend: "up"
  },
  {
    name: "University of Wisconsin",
    views: 234,
    clicks: 87,
    requests: 12,
    change: "+15%",
    trend: "up"
  },
  {
    name: "Johns Hopkins University",
    views: 198,
    clicks: 76,
    requests: 11,
    change: "+3%",
    trend: "up"
  },
  {
    name: "University of Michigan",
    views: 187,
    clicks: 65,
    requests: 9,
    change: "-2%",
    trend: "down"
  },
  {
    name: "Stanford University",
    views: 156,
    clicks: 54,
    requests: 8,
    change: "+7%",
    trend: "up"
  },
  {
    name: "Harvard Medical School",
    views: 143,
    clicks: 45,
    requests: 6,
    change: "+4%",
    trend: "up"
  }
]

// Recent Activity Analytics Data
const recentActivityAnalytics = {
  views: {
    total: 2847,
    change: "+15%",
    trend: "up",
    description: "Views by schools this month",
    icon: Eye,
    color: "text-chart-1",
  },
  clicks: {
    total: 1235,
    change: "+8%",
    trend: "up", 
    description: "Clicks by schools this month",
    icon: MousePointer,
    color: "text-chart-2",
  },
  requests: {
    total: 487,
    change: "+23%",
    trend: "up",
    description: "Requests submitted this month",
    icon: FileText,
    color: "text-chart-3",
  },
  inquiries: {
    total: 156,
    change: "-5%",
    trend: "down",
    description: "Direct inquiries this month",
    icon: Phone,
    color: "text-chart-5",
  },
}

// Recent Activity Timeline Data - regular function
function generateRecentActivities() {
  const activities = []
  const schoolsList = [
    "University of Minnesota", "Mayo Medical School", "University of Wisconsin", 
    "Northwestern University", "University of Illinois", "Johns Hopkins University",
    "University of Michigan", "Stanford University", "Harvard Medical School"
  ]
  
  const activityTypes = [
    { type: "view", icon: Eye, color: "text-chart-1", description: "viewed this availability" },
    { type: "click", icon: MousePointer, color: "text-chart-2", description: "clicked on details" },
    { type: "request", icon: FileText, color: "text-chart-3", description: "submitted a request" },
    { type: "inquiry", icon: Phone, color: "text-chart-5", description: "made an inquiry" },
  ]
  
  // Generate activities for the last 7 days
  for (let i = 0; i < 25; i++) {
    const daysAgo = i % 7
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    
    const school = schoolsList[i % schoolsList.length]
    const activity = activityTypes[i % activityTypes.length]
    
    activities.push({
      id: `activity-${i}`,
      school,
      type: activity.type,
      icon: activity.icon,
      color: activity.color,
      description: activity.description,
      timestamp: date.toISOString(),
      timeAgo: daysAgo === 0 ? `${(i % 12) + 1} hours ago` : 
               daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`
    })
  }
  
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const recentActivities = generateRecentActivities()

// Helper functions - regular functions (no hooks)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-chart-2/10 text-chart-2'
    case 'pending': return 'bg-chart-4/10 text-chart-4'
    case 'reviewing': return 'bg-chart-1/10 text-chart-1'
    case 'approved': return 'bg-chart-2/10 text-chart-2'
    case 'confirmed': return 'bg-chart-2/10 text-chart-2'
    case 'rejected': return 'bg-destructive/10 text-destructive'
    default: return 'bg-muted text-muted-foreground'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-destructive/10 text-destructive'
    case 'Urgent': return 'bg-destructive/10 text-destructive'
    case 'Medium': return 'bg-chart-4/10 text-chart-4'
    case 'Low': return 'bg-muted text-muted-foreground'
    default: return 'bg-muted text-muted-foreground'
  }
}

const formatCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

// Helper function to get tier colors
const getTierColor = (tier: string) => {
  switch (tier) {
    case 'gold': return 'bg-chart-4/10 text-chart-4'
    case 'silver': return 'bg-muted text-muted-foreground'
    case 'bronze': return 'bg-chart-5/10 text-chart-5'
    default: return 'bg-muted text-muted-foreground'
  }
}

// Filter configurations for pipeline data
const pipelineFilterConfigs: FilterConfig[] = [
  {
    key: "school",
    label: "School",
    icon: School,
    options: ["Johns Hopkins University", "University of California San Francisco", "Mayo Medical School", "Northwestern University", "University of Illinois"]
  },
  {
    key: "priority",
    label: "Priority",
    icon: AlertCircle,
    options: ["High", "Medium", "Low", "Urgent"]
  },
  {
    key: "location",
    label: "Location",
    icon: MapPin,
    options: ["Rochester, MN", "Chicago, IL", "Milwaukee, WI", "Cleveland, OH", "Detroit, MI"]
  },
  {
    key: "discipline",
    label: "Discipline",
    icon: Activity,
    options: ["Internal Medicine", "Pediatrics", "Radiology", "Psychiatry", "Family Medicine"]
  }
]

// Table columns configuration for different stages - regular function
const getColumnsForStage = (stage: string): ColumnConfig[] => {
  const selectionColumn: ColumnConfig = {
    key: "select",
    label: "",
    icon: UserCheck,
    isPinned: false,
    isVisible: true,
    width: 50,
    minWidth: 50,
    sortable: false,
  }

  const baseColumns: ColumnConfig[] = [
    selectionColumn,
    {
      key: "school",
      label: "School",
      icon: School,
      isPinned: false,
      isVisible: true,
      width: 320,
      minWidth: 250,
      sortable: true,
    },
    {
      key: "slots",
      label: "Slots",
      icon: Hash,
      isPinned: false,
      isVisible: true,
      width: 80,
      minWidth: 60,
      sortable: true,
    },
  ]

  switch (stage) {
    case "School Request":
      return [
        ...baseColumns,
        {
          key: "location",
          label: "Location",
          icon: MapPin,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "discipline",
          label: "Discipline",
          icon: Activity,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "requestedDates",
          label: "Requested Dates",
          icon: Calendar,
          isPinned: false,
          isVisible: true,
          width: 180,
          minWidth: 160,
          sortable: true,
        },
        {
          key: "priority",
          label: "Priority",
          icon: AlertCircle,
          isPinned: false,
          isVisible: true,
          width: 100,
          minWidth: 80,
          sortable: true,
        },
        {
          key: "date",
          label: "Request Date",
          icon: Calendar,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
          icon: Settings,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 120,
        },
      ]

    case "Under Review":
      return [
        ...baseColumns,
        {
          key: "location",
          label: "Location",
          icon: MapPin,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "reviewerName",
          label: "Reviewer",
          icon: User,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "reviewStartDate",
          label: "Review Started",
          icon: Calendar,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "estimatedDecision",
          label: "Est. Decision",
          icon: Timer,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "priority",
          label: "Priority",
          icon: AlertCircle,
          isPinned: false,
          isVisible: true,
          width: 100,
          minWidth: 80,
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
          icon: Settings,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 120,
        },
      ]

    case "Approved":
      return [
        ...baseColumns,
        {
          key: "location",
          label: "Location",
          icon: MapPin,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "approvalDate",
          label: "Approved Date",
          icon: CheckCircle,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "approvedBy",
          label: "Approved By",
          icon: User,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "expirationDate",
          label: "Expires",
          icon: Timer,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "requestedDates",
          label: "Requested Dates",
          icon: Calendar,
          isPinned: false,
          isVisible: true,
          width: 180,
          minWidth: 160,
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
          icon: Settings,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 120,
        },
      ]

    case "Confirmed Students":
      return [
        selectionColumn,
        {
          key: "students",
          label: "Students",
          icon: User,
          isPinned: false,
          isVisible: true,
          width: 200,
          minWidth: 180,
          sortable: true,
        },
        {
          key: "school",
          label: "School",
          icon: School,
          isPinned: false,
          isVisible: true,
          width: 280,
          minWidth: 220,
          sortable: true,
        },
        {
          key: "complianceStatus",
          label: "Compliance Status",
          icon: Shield,
          isPinned: false,
          isVisible: true,
          width: 150,
          minWidth: 130,
          sortable: true,
        },
        {
          key: "location",
          label: "Location",
          icon: MapPin,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "enrollmentDate",
          label: "Enrollment Date",
          icon: Calendar,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "supervisorName",
          label: "Supervisor",
          icon: UserCheck,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "requestedDates",
          label: "Schedule",
          icon: Calendar,
          isPinned: false,
          isVisible: true,
          width: 180,
          minWidth: 160,
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
          icon: Settings,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 120,
        },
      ]

    case "Ongoing":
      return [
        selectionColumn,
        {
          key: "students",
          label: "Students",
          icon: User,
          isPinned: false,
          isVisible: true,
          width: 200,
          minWidth: 180,
          sortable: true,
        },
        {
          key: "school",
          label: "School",
          icon: School,
          isPinned: false,
          isVisible: true,
          width: 280,
          minWidth: 220,
          sortable: true,
        },
        {
          key: "supervisorName",
          label: "Supervisor",
          icon: UserCheck,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "progress",
          label: "Progress",
          icon: TrendingUp,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "currentWeek",
          label: "Week",
          icon: Calendar,
          isPinned: false,
          isVisible: true,
          width: 80,
          minWidth: 60,
          sortable: true,
        },
        {
          key: "expectedEndDate",
          label: "Expected End",
          icon: Timer,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "performanceRating",
          label: "Performance",
          icon: Star,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "lastCheckIn",
          label: "Last Check-in",
          icon: Clock,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
          icon: Settings,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 120,
        },
      ]

    case "Complete":
      return [
        selectionColumn,
        {
          key: "students",
          label: "Students",
          icon: User,
          isPinned: false,
          isVisible: true,
          width: 200,
          minWidth: 180,
          sortable: true,
        },
        {
          key: "school",
          label: "School",
          icon: School,
          isPinned: false,
          isVisible: true,
          width: 280,
          minWidth: 220,
          sortable: true,
        },
        {
          key: "completionDate",
          label: "Completion Date",
          icon: Calendar,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "finalGrade",
          label: "Grade",
          icon: Award,
          isPinned: false,
          isVisible: true,
          width: 80,
          minWidth: 60,
          sortable: true,
        },
        {
          key: "finalEvaluation",
          label: "Evaluation",
          icon: Star,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "supervisorName",
          label: "Supervisor",
          icon: UserCheck,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "totalHours",
          label: "Total Hours",
          icon: Clock,
          isPinned: false,
          isVisible: true,
          width: 100,
          minWidth: 80,
          sortable: true,
        },
        {
          key: "certificateStatus",
          label: "Certificate",
          icon: Award,
          isPinned: false,
          isVisible: true,
          width: 100,
          minWidth: 80,
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
          icon: Settings,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 120,
        },
      ]

    case "Rejected":
      return [
        ...baseColumns,
        {
          key: "location",
          label: "Location",
          icon: MapPin,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "rejectionDate",
          label: "Rejection Date",
          icon: XCircle,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "rejectionReason",
          label: "Reason",
          icon: FileText,
          isPinned: false,
          isVisible: true,
          width: 160,
          minWidth: 140,
          sortable: true,
        },
        {
          key: "rejectedBy",
          label: "Rejected By",
          icon: User,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 100,
          sortable: true,
        },
        {
          key: "requestedDates",
          label: "Requested Dates",
          icon: Calendar,
          isPinned: false,
          isVisible: true,
          width: 180,
          minWidth: 160,
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
          icon: Settings,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 120,
        },
      ]

    default:
      return [
        ...baseColumns,
        {
          key: "location",
          label: "Location",
          icon: MapPin,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "discipline",
          label: "Discipline",
          icon: Activity,
          isPinned: false,
          isVisible: true,
          width: 140,
          minWidth: 120,
          sortable: true,
        },
        {
          key: "requestedDates",
          label: "Requested Dates",
          icon: Calendar,
          isPinned: false,
          isVisible: true,
          width: 180,
          minWidth: 160,
          sortable: true,
        },
        {
          key: "priority",
          label: "Priority",
          icon: AlertCircle,
          isPinned: false,
          isVisible: true,
          width: 100,
          minWidth: 80,
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
          icon: Settings,
          isPinned: false,
          isVisible: true,
          width: 120,
          minWidth: 120,
        },
      ]
  }
}

// Optimize the main component with React.memo
export function AvailabilityDetail({ availabilityId, onBack, onViewRequestDetails, onStageUpdate }: AvailabilityDetailProps) {
  const data = mockAvailabilityData
  const [selectedPipelineStage, setSelectedPipelineStage] = React.useState("School Request")
  const [viewType, setViewType] = React.useState<"table" | "cards">("table")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)

  // Get defaultTab from Zustand store
  const { defaultTab } = useAppStore()
  const navigateToSchoolProfile = useAppStore((state) => state.navigateToSchoolProfile)
  const navigateToStudentProfile = useAppStore((state) => state.navigateToStudentProfile)

  // Selection and bulk action states
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])
  const [bulkActionStage, setBulkActionStage] = React.useState<string>("")

  // Filter states for pipeline
  const [showPipelineFilters, setShowPipelineFilters] = React.useState(false)
  const [pipelineActiveFilters, setPipelineActiveFilters] = React.useState<ActiveFilter[]>([])

  // Search state for pipeline
  const [pipelineSearchQuery, setPipelineSearchQuery] = React.useState("")



  const selectedStageData = React.useMemo(() => 
    pipelineData.find(stage => stage.stage === selectedPipelineStage),
    [selectedPipelineStage]
  )
  
  const currentData = selectedStageData?.requests || []
  
  // Apply pipeline filters and search - optimized with useMemo
  const filteredPipelineData = React.useMemo(() => {
    let filtered = currentData
    
    // Apply search filter
    if (pipelineSearchQuery.trim()) {
      const query = pipelineSearchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.school.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.discipline.toLowerCase().includes(query) ||
        item.priority.toLowerCase().includes(query) ||
        item.requestedDates.toLowerCase().includes(query)
      )
    }
    
    // Apply other filters
    pipelineActiveFilters.forEach(filter => {
      if (filter.values.length > 0) {
        filtered = filtered.filter(item => 
          filter.values.includes(item[filter.key as keyof typeof item] as string)
        )
      }
    })
    
    return filtered
  }, [currentData, pipelineActiveFilters, pipelineSearchQuery])

  // Pagination info - optimized with useMemo
  const paginationInfo: PaginationInfo = React.useMemo(() => {
    const totalItems = filteredPipelineData.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0
    const endItem = Math.min(currentPage * pageSize, totalItems)

    return {
      currentPage,
      totalPages,
      pageSize,
      totalItems,
      startItem,
      endItem,
    }
  }, [filteredPipelineData, currentPage, pageSize])

  const [columns, setColumns] = React.useState<ColumnConfig[]>(() => getColumnsForStage("School Request"))
  
  // Update columns when stage changes
  React.useEffect(() => {
    setColumns(getColumnsForStage(selectedPipelineStage))
    // Clear selections when stage changes
    setSelectedItems([])
    setBulkActionStage(selectedPipelineStage)
  }, [selectedPipelineStage])
  
  // Pipeline filter handlers - optimized with useCallback
  const handleAddPipelineFilter = React.useCallback((filterKey: string) => {
    const newFilter: ActiveFilter = {
      id: `${filterKey}_${Date.now()}`,
      key: filterKey,
      label: pipelineFilterConfigs.find(config => config.key === filterKey)?.label || filterKey,
      values: [],
    }
    setPipelineActiveFilters(prev => [...prev, newFilter])
  }, [])

  const handleTogglePipelineFilterValue = React.useCallback((filterId: string, value: string) => {
    setPipelineActiveFilters(prev => 
      prev.map(filter => {
        if (filter.id === filterId) {
          const newValues = filter.values.includes(value)
            ? filter.values.filter(v => v !== value)
            : [...filter.values, value]
          return { ...filter, values: newValues }
        }
        return filter
      })
    )
    setCurrentPage(1)
  }, [])

  const handleRemovePipelineFilter = React.useCallback((filterId: string) => {
    setPipelineActiveFilters(prev => prev.filter(filter => filter.id !== filterId))
    setCurrentPage(1)
  }, [])

  const handleClearAllPipelineFilters = React.useCallback(() => {
    setPipelineActiveFilters([])
    setPipelineSearchQuery("")
    setCurrentPage(1)
  }, [])

  // Get current page data - optimized with useMemo
  const currentPaginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredPipelineData.slice(startIndex, endIndex)
  }, [filteredPipelineData, currentPage, pageSize])

  // Helper function to get compliance status color
  const getComplianceStatusColor = React.useCallback((status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-chart-2/10 text-chart-2'
      case 'Pending': return 'bg-chart-4/10 text-chart-4'
      case 'Missing Documents': return 'bg-destructive/10 text-destructive'
      case 'Expired': return 'bg-destructive/10 text-destructive'
      case 'Under Review': return 'bg-chart-1/10 text-chart-1'
      default: return 'bg-muted text-muted-foreground'
    }
  }, [])

  // Helper function to render school badges - optimized with useCallback
  const renderSchoolBadges = React.useCallback((schoolType: string, tier?: string) => {
    const badges = []
    
    if (schoolType === "partner" && tier) {
      badges.push(
        <Badge key="partner" className={`text-xs px-1.5 py-0.5 ${getTierColor(tier)}`}>
          {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </Badge>
      )
    }
    
    if (schoolType === "consortium") {
      badges.push(
        <Badge key="consortium" className="bg-chart-3/10 text-chart-3 text-xs px-1.5 py-0.5">
          Consortium
        </Badge>
      )
    }
    
    return badges
  }, [])

  // Render cell function for DataTable - optimized with useCallback
  const renderCell = React.useCallback((column: ColumnConfig, item: any, index: number) => {
    switch (column.key) {
      case "studentSchool":
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {item.studentName ? (
                <User className="h-4 w-4 text-chart-3" />
              ) : (
                <School className="h-4 w-4 text-chart-1" />
              )}
              <div className="flex flex-col">
                {item.studentName ? (
                  <>
                    <span className="font-medium text-base">{item.studentName}</span>
                    <span className="text-sm text-muted-foreground">at {item.school}</span>
                  </>
                ) : (
                  <span className="font-medium text-base">{item.school}</span>
                )}
              </div>
            </div>
            {(item.schoolType === "partner" || item.schoolType === "consortium") && (
              <div className="flex gap-1 ml-6">
                {renderSchoolBadges(item.schoolType, item.tier)}
              </div>
            )}
          </div>
        )

      case "students":
        return (
          <div className="space-y-1">
            {item.studentName ? (
              <div 
                className="cursor-pointer hover:text-chart-1 hover:underline font-medium text-base"
                onClick={() => navigateToStudentProfile(item.studentName)}
              >
                {item.studentName}
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">No student assigned</span>
            )}
          </div>
        )

      case "school":
        return (
          <div className="space-y-1">
            <div 
              className="cursor-pointer hover:text-chart-1 hover:underline font-medium text-base"
              onClick={() => navigateToSchoolProfile(item.school)}
            >
              {item.school}
            </div>
            {/* Show student name below school name if available AND not in Confirmed Students stage */}
            {item.studentName && selectedPipelineStage !== "Confirmed Students" && (
              <div 
                className="text-xs text-muted-foreground cursor-pointer hover:text-chart-1 hover:underline"
                onClick={() => navigateToStudentProfile(item.studentName)}
              >
                {item.studentName}
              </div>
            )}
            {/* Show consortium/partner badges */}
            {item.schoolType === "consortium" && (
              <Badge variant="secondary" className="bg-chart-1/10 text-chart-1 text-xs">
                Consortium
              </Badge>
            )}
            {item.tier && (
              <Badge variant="secondary" className={`text-xs ${getTierColor(item.tier)}`}>
                {item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}
              </Badge>
            )}
          </div>
        )
      
      case "slots":
        return (
          <div className="text-center">
            <span className="font-medium text-base">{item.slots}</span>
          </div>
        )
      
      case "location":
        return (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.location}</span>
          </div>
        )
      
      case "discipline":
        return (
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.discipline}</span>
          </div>
        )
      
      case "requestedDates":
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.requestedDates}</span>
          </div>
        )
      
      case "priority":
        return (
          <Badge className={getPriorityColor(item.priority)}>
            {item.priority}
          </Badge>
        )

      case "studentName":
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-chart-3" />
            <span className="font-medium text-base">{item.studentName}</span>
          </div>
        )

      case "complianceStatus":
        return (
          <Badge className={getComplianceStatusColor(item.complianceStatus)}>
            {item.complianceStatus}
          </Badge>
        )

      case "reviewerName":
        return (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.reviewerName}</span>
          </div>
        )

      case "reviewStartDate":
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.reviewStartDate}</span>
          </div>
        )

      case "estimatedDecision":
        return (
          <div className="flex items-center gap-1">
            <Timer className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.estimatedDecision}</span>
          </div>
        )

      case "approvalDate":
        return (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-chart-2" />
            <span className="font-medium text-base">{item.approvalDate}</span>
          </div>
        )

      case "approvedBy":
        return (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.approvedBy}</span>
          </div>
        )

      case "expirationDate":
        return (
          <div className="flex items-center gap-1">
            <Timer className="h-3 w-3 text-chart-5" />
            <span className="font-medium text-base">{item.expirationDate}</span>
          </div>
        )

      case "enrollmentDate":
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.enrollmentDate}</span>
          </div>
        )

      case "supervisorName":
        return (
          <div className="flex items-center gap-1">
            <UserCheck className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.supervisorName}</span>
          </div>
        )

      case "rejectionDate":
        return (
          <div className="flex items-center gap-1">
            <XCircle className="h-3 w-3 text-destructive" />
            <span className="font-medium text-base">{item.rejectionDate}</span>
          </div>
        )

      case "rejectionReason":
        return (
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.rejectionReason}</span>
          </div>
        )

      case "rejectedBy":
        return (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.rejectedBy}</span>
          </div>
        )

      case "progress":
        return (
          <div className="flex items-center gap-2">
            <div className="w-full bg-muted rounded-full h-2 max-w-[60px]">
              <div 
                className="bg-chart-1 h-2 rounded-full" 
                style={{ width: `${item.progressPercentage || 0}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-base">{item.progressPercentage || 0}%</span>
          </div>
        )

      case "currentWeek":
        return (
          <div className="text-center">
            <span className="font-medium text-base">{item.currentWeek || 1}</span>
            <span className="text-muted-foreground">/{item.totalWeeks || 8}</span>
          </div>
        )

      case "expectedEndDate":
        return (
          <div className="flex items-center gap-1">
            <Timer className="h-3 w-3 text-chart-5" />
            <span className="font-medium text-base">{item.expectedEndDate || "N/A"}</span>
          </div>
        )

      case "performanceRating":
        const getRatingColor = (rating: string) => {
          if (!rating) return "text-muted-foreground"
          switch (rating) {
            case "Excellent": return "text-chart-2"
            case "Good": return "text-chart-1"
            case "Satisfactory": return "text-chart-4"
            case "Needs Improvement": return "text-destructive"
            default: return "text-muted-foreground"
          }
        }
        return (
          <div className="flex items-center gap-1">
            <Star className={`h-3 w-3 ${getRatingColor(item.performanceRating || "")}`} />
            <span className={`font-medium text-base ${getRatingColor(item.performanceRating || "")}`}>{item.performanceRating || "N/A"}</span>
          </div>
        )

      case "lastCheckIn":
        return (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.lastCheckIn || "N/A"}</span>
          </div>
        )

      case "completionDate":
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-chart-2" />
            <span className="font-medium text-base">{item.completionDate || "N/A"}</span>
          </div>
        )

      case "finalGrade":
        const getGradeColor = (grade: string) => {
          if (!grade) return "text-muted-foreground"
          if (grade.startsWith("A")) return "text-chart-2"
          if (grade.startsWith("B")) return "text-chart-1"
          if (grade.startsWith("C")) return "text-chart-4"
          return "text-muted-foreground"
        }
        return (
          <div className="text-center">
            <span className={`font-medium text-base ${getGradeColor(item.finalGrade || "")}`}>{item.finalGrade || "N/A"}</span>
          </div>
        )

      case "finalEvaluation":
        const getEvaluationColor = (evaluation: string) => {
          if (!evaluation) return "text-muted-foreground"
          switch (evaluation) {
            case "Outstanding": return "text-chart-2"
            case "Excellent": return "text-chart-1"
            case "Good": return "text-chart-4"
            case "Satisfactory": return "text-muted-foreground"
            default: return "text-muted-foreground"
          }
        }
        return (
          <div className="flex items-center gap-1">
            <Star className={`h-3 w-3 ${getEvaluationColor(item.finalEvaluation || "")}`} />
            <span className={`font-medium text-base ${getEvaluationColor(item.finalEvaluation || "")}`}>{item.finalEvaluation || "N/A"}</span>
          </div>
        )

      case "totalHours":
        return (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{item.totalHours || "0"}</span>
          </div>
        )

      case "certificateStatus":
        return (
          <div className="flex items-center gap-1">
            <Award className={`h-3 w-3 ${item.certificateIssued ? 'text-chart-2' : 'text-muted-foreground'}`} />
            <span className={`font-medium text-base ${item.certificateIssued ? 'text-chart-2' : 'text-muted-foreground'}`}>
              {item.certificateIssued ? 'Issued' : 'Pending'}
            </span>
          </div>
        )

      case "date":
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-base">{new Date(item.date).toLocaleDateString()}</span>
          </div>
        )
      
      case "actions":
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewRequest(item.id)}>
              View
            </Button>
          </div>
        )
      
      default:
        return <span className="font-medium text-base">{item[column.key]}</span>
    }
  }, [getPriorityColor, getComplianceStatusColor, renderSchoolBadges, selectedPipelineStage, navigateToSchoolProfile, navigateToStudentProfile])

  const getItemId = React.useCallback((item: any) => item.id, [])

  // Selection handlers - optimized with useCallback
  const handleSelectionChange = React.useCallback((selectedIds: string[]) => {
    setSelectedItems(selectedIds)
  }, [])

  const handleClearSelection = React.useCallback(() => {
    setSelectedItems([])
  }, [])

  const handleBulkAction = React.useCallback((action: string, selectedIds: string[]) => {
    console.log(`Bulk action: ${action}`, selectedIds)
    // Here you would implement the actual bulk action logic
    // For now, just clear selection after action
    setSelectedItems([])
  }, [])

  // Request handler - navigate directly to detail page
  const handleViewRequest = React.useCallback((requestId: string) => {
    if (onViewRequestDetails) {
      onViewRequestDetails(requestId, selectedPipelineStage)
    }
  }, [onViewRequestDetails, selectedPipelineStage])

  // Recent Activity Content Component - memoized
  const RecentActivityContent = React.useMemo(() => (
    <div className="space-y-6">
      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.slice(0, 12).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border">
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-medium text-base">{activity.school}</span> {activity.description}
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.timeAgo}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ), [])

  return (
    <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-0 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold font-display">{data.name}</h1>
            <Badge className={getStatusColor(data.status.toLowerCase())}>
              {data.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {data.id} • Created {formatDate(data.createdDate)} • Last modified {formatDate(data.lastModified)}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View in Site
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Activity className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Key Metadata - Updated to show dates instead of duration */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Location
          </div>
          <div className="font-medium text-base">{data.location}</div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Activity className="h-3 w-3" />
            Discipline
          </div>
          <div className="font-medium text-base">{data.discipline}</div>
        </div>
        <div className="space-y-1 col-span-2 lg:col-span-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Schedule
          </div>
          <div className="space-y-1">
            <div className="font-medium text-base">
              {formatDateRange(data.startDate, data.endDate)}
            </div>
            <div className="font-medium text-base">
              M, T, W, T, F
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            Shift
          </div>
          <div className="font-medium text-base">Morning</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3 w-3" />
            Experience
          </div>
          <div className="font-medium text-base">{data.experienceType}</div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <DoorOpen className="h-3 w-3" />
            Available Slots
          </div>
          <div className="font-medium text-base">{data.availableSlots}/{data.totalSlots}</div>
        </div>
      </div>

      {/* Tabs using ShadCN - Use defaultTab from store */}
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="pipeline">
              <span className="flex items-center gap-2">
                Pipeline
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">1,560</Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger value="calendar">
              Calendar
            </TabsTrigger>
            <TabsTrigger value="reports">
              Reports
            </TabsTrigger>
            <TabsTrigger value="recent-activity">
              Recent Activity
            </TabsTrigger>
          </TabsList>
        
          {/* Stages and Automation Management */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-medium text-base">
                <Workflow className="h-4 w-4 mr-2" />
                Manage Stages & Automation
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Stage Management</DropdownMenuLabel>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configure Pipeline Stages
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Stage Requirements
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Timer className="mr-2 h-4 w-4" />
                Set Stage Timeouts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Automation Settings</DropdownMenuLabel>
              <DropdownMenuItem>
                <Zap className="mr-2 h-4 w-4" />
                Auto-Approval Rules
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Notification Templates
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertCircle className="mr-2 h-4 w-4" />
                Escalation Rules
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Automation Logs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TabsContent value="overview" className="space-y-8">
          {/* Improved Overview Layout for Location Admins */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Primary Information */}
            <div className="xl:col-span-2 space-y-6">
              {/* Availability Summary Card - Dashboard Style */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Availability Summary
                  </CardTitle>
                  <DoorOpen className="h-4 w-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-display">{data.availableSlots}/{data.totalSlots}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3 text-chart-2" />
                      <span className="text-chart-2">+12%</span>
                    </div>
                    <span>from last month</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Available slots vs total capacity
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Capacity Utilization</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(((data.totalSlots - data.availableSlots) / data.totalSlots) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={((data.totalSlots - data.availableSlots) / data.totalSlots) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Program Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-chart-1" />
                    Program Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Hospital Site</label>
                        <div className="mt-1 font-medium text-base">{data.site}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                        <div className="mt-1 font-medium text-base">{data.specialization}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Duration</label>
                        <div className="mt-1 font-medium text-base">{data.duration}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Schedule</label>
                        <div className="mt-1 font-medium text-base">{data.schedule.shifts}</div>
                        <div className="text-sm text-muted-foreground">{data.schedule.hoursPerWeek} hours/week</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Auto Approval</label>
                        <div className="mt-1">
                          <Badge variant={data.autoApproval ? "default" : "secondary"}>
                            {data.autoApproval ? "Enabled" : "Manual Review"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Roles & Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-chart-1" />
                    Roles & Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.rolesResponsibilities.map((role, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-chart-1 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{role}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Eligibility Criteria */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-chart-1" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.eligibilityCriteria.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Secondary Information */}
            <div className="space-y-6">
              {/* Coordinator Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-chart-1" />
                    Site Coordinator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <div className="mt-1 font-medium text-base">{data.coordinator.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <div className="mt-1 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${data.coordinator.email}`} className="text-chart-1 hover:underline text-sm">
                          {data.coordinator.email}
                        </a>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <div className="mt-1 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${data.coordinator.phone}`} className="text-chart-1 hover:underline text-sm">
                          {data.coordinator.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Publish Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-chart-1" />
                    Publication Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Published Date</label>
                    <div className="mt-1 font-medium text-base">{new Date(data.publishedDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Published By</label>
                    <div className="mt-1 font-medium text-base">{data.publishedBy}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Visibility</label>
                    <div className="mt-1">
                      <Badge variant="secondary">{data.visibility}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-chart-1" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-chart-5 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          {/* Pipeline Stage Cards */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {pipelineData.map((stage) => {
              const StageIcon = stage.icon
              const isSelected = selectedPipelineStage === stage.stage
              const isActive = stage.status === "active"
              const isCompleted = stage.status === "completed"
              const isRejected = stage.status === "rejected"

              return (
                <Card
                  key={stage.stage}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected 
                      ? "ring-2 ring-chart-1 shadow-md" 
                      : "hover:ring-1 hover:ring-border"
                  } ${
                    isRejected ? "border-destructive/20" : ""
                  }`}
                  onClick={() => setSelectedPipelineStage(stage.stage)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      {/* Icon with status color */}
                      <div className={`p-2 rounded-full ${
                        isRejected 
                          ? "bg-destructive/5" 
                          : isCompleted 
                            ? "bg-chart-2/5" 
                            : "bg-chart-1/5"
                      }`}>
                        <StageIcon className={`h-5 w-5 ${
                          isRejected 
                            ? "text-destructive" 
                            : isCompleted 
                              ? "text-chart-2" 
                              : "text-chart-1"
                        }`} />
                      </div>
                      
                      {/* Stage name */}
                      <div>
                        <h3 className="font-medium text-sm leading-tight">
                          {stage.stage}
                        </h3>
                      </div>
                      
                      {/* Count badge */}
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-1 ${
                          isSelected ? "bg-chart-1/10 text-chart-1" : ""
                        }`}
                      >
                        {formatCount(stage.count)}
                      </Badge>
                      
                      {/* Description */}
                      <div className="text-xs text-muted-foreground leading-tight">
                        {stage.description}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Selected Stage Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedStageData && (
                    <>
                      <selectedStageData.icon className={`h-5 w-5 ${selectedStageData.color}`} />
                      <div>
                        <CardTitle>{selectedStageData.stage}</CardTitle>
                        <div className="text-sm text-muted-foreground">{selectedStageData.description}</div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Search Input */}
                  <OutlineSearchInput
                    placeholder="Search requests..."
                    value={pipelineSearchQuery}
                    onChange={(e) => {
                      setPipelineSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="h-8 w-64"
                  />
                  <Button 
                    variant={showPipelineFilters ? "default" : "outline"} 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => setShowPipelineFilters(!showPipelineFilters)}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Filter Bar */}
            {showPipelineFilters && (
              <FilterBar
                filterConfigs={pipelineFilterConfigs}
                activeFilters={pipelineActiveFilters}
                onAddFilter={handleAddPipelineFilter}
                onToggleFilterValue={handleTogglePipelineFilterValue}
                onRemoveFilter={handleRemovePipelineFilter}
                onClearAll={handleClearAllPipelineFilters}
              />
            )}

            <CardContent className="p-0 pipeline-card-content" style={{ borderBottomLeftRadius: 'var(--radius)', borderBottomRightRadius: 'var(--radius)' }}>
              <DataTable
                data={currentPaginatedData}
                columns={columns}
                onColumnChange={setColumns}
                selectedItems={selectedItems}
                onSelectionChange={handleSelectionChange}
                renderCell={renderCell}
                getItemId={getItemId}
                showSelection={true}
                paginationInfo={paginationInfo}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize)
                  setCurrentPage(1)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <CalendarView />
        </TabsContent>

        <TabsContent value="reports" className="space-y-8">
          {/* Report Header with Export */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Performance Report</h2>
              <div className="text-sm text-muted-foreground">Comprehensive analytics for {data.name}</div>
            </div>
            <Button onClick={() => console.log('Export report')} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Key Insights */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-chart-1" />
                Key Insights & Recommendations
              </CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                AI-powered analysis of your availability performance and actionable recommendations
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Insight Cards Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <DashboardCard
                  data={createDashboardCardData(
                    "Strong Performance",
                    "Above Average",
                    TrendingUp,
                    "text-chart-2",
                    {
                      description: "Your 83% fill rate and 94.2% student completion rate are significantly above industry averages. The 2.3-day response time shows excellent operational efficiency."
                    }
                  )}
                  variant="insight"
                  className="bg-chart-2/5 border-chart-2/20"
                />
                
                <DashboardCard
                  data={createDashboardCardData(
                    "High Visibility",
                    "Excellent Exposure",
                    Eye,
                    "text-chart-1",
                    {
                      description: "With 2,847 views this month (+15%), your availability is getting excellent exposure. The 43.4% click rate indicates strong school interest."
                    }
                  )}
                  variant="insight"
                  className="bg-chart-1/5 border-chart-1/20"
                />
                
                <DashboardCard
                  data={createDashboardCardData(
                    "School Loyalty",
                    "High Satisfaction",
                    Users,
                    "text-chart-3",
                    {
                      description: "67% repeat booking rate shows excellent school satisfaction. Your 4.8/5 student rating confirms program quality."
                    }
                  )}
                  variant="insight"
                  className="bg-chart-3/5 border-chart-3/20"
                />
                
                <DashboardCard
                  data={createDashboardCardData(
                    "Optimization Opportunity",
                    "Growth Potential",
                    Target,
                    "text-chart-5",
                    {
                      description: "Consider increasing capacity utilization from 86% to 90%+ to maximize impact while maintaining quality standards."
                    }
                  )}
                  variant="insight"
                  className="bg-chart-5/5 border-chart-5/20"
                />
              </div>
              
              {/* Recommendations Section */}
              <div className="bg-muted/50 rounded-lg p-6 border border-border">
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-chart-4" />
                    Recommended Actions
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    Based on your performance data, here are specific steps to optimize your availability
                  </div>
                </div>
                
                <div className="grid gap-3 md:grid-cols-1">
                  <div className="flex items-start gap-3 p-3 bg-background rounded-md border border-border">
                    <div className="w-6 h-6 bg-chart-1/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-chart-1">1</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Promote Your Success Metrics</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Highlight your high completion rate and student ratings in availability descriptions to attract quality schools
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-background rounded-md border border-border">
                    <div className="w-6 h-6 bg-chart-2/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-chart-2">2</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Consider Capacity Expansion</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        With 487 requests this month, demand is strong. Evaluate adding 2-3 more slots to meet demand
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-background rounded-md border border-border">
                    <div className="w-6 h-6 bg-chart-3/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-chart-3">3</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Leverage Fast Response Time</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Market your 2.3-day response time as a competitive advantage to differentiate from slower competitors
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Performance Metrics</h3>
              <div className="text-sm text-muted-foreground">Core performance indicators for this availability</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {performanceMetrics.slice(0, 4).map((metric, index) => (
                <DashboardCard 
                  key={index} 
                  data={metric} 
                  variant="medium"
                />
              ))}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Engagement Metrics</h3>
              <div className="text-sm text-muted-foreground">School engagement and interaction data</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {performanceMetrics.slice(4, 8).map((metric, index) => (
                <DashboardCard 
                  key={index + 4} 
                  data={metric} 
                  variant="medium"
                />
              ))}
            </div>
          </div>

          {/* Success Metrics */}
          <div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Success Metrics</h3>
              <div className="text-sm text-muted-foreground">Long-term success and quality indicators</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {performanceMetrics.slice(8, 12).map((metric, index) => (
                <DashboardCard 
                  key={index + 8} 
                  data={metric} 
                  variant="medium"
                />
              ))}
            </div>
          </div>

          {/* Top Schools Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Requesting Schools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSchools.map((school, index) => (
                  <div key={school.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-base">{school.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {school.views} views • {school.clicks} clicks • {school.requests} requests
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 text-sm ${
                        school.trend === 'up' ? 'text-chart-2' : 'text-destructive'
                      }`}>
                        {school.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {school.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent-activity" className="space-y-6">
          {RecentActivityContent}
        </TabsContent>
      </Tabs>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedItems.length}
        selectedItems={selectedItems}
        actions={getPipelineActionsForStage(bulkActionStage)}
        onClearSelection={handleClearSelection}
        onBulkAction={handleBulkAction}
      />
    </div>
  )
}