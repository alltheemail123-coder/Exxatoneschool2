"use client"

import * as React from "react"
import {
  ArrowLeft,
  Users,
  User,
  MapPin,
  Calendar,
  Clock,
  Activity,
  CheckCircle,
  AlertCircle,
  Timer,
  FileText,
  Star,
  Eye,
  Edit,
  Copy,
  Share,
  MoreHorizontal,
  XCircle,
  School,
  Hash,
  Shield,
  UserCheck,
  AlertTriangle,
  Phone,
  Mail,
  ExternalLink,
  Crown,
  Award,
  Target,
  BookOpen,
  GraduationCap,
  Building2,
  Download,
  MessageCircle,
  History,
  Plus,
  Paperclip,
  Send,
  RefreshCw,
  Save,
  Edit3,
} from "lucide-react"

import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { DashboardCard, createDashboardCardData } from "./dashboard-card"

interface RequestDetailPageProps {
  requestId: string
  stage: string
  onBack: () => void
  onStageUpdate?: (requestId: string, newStage: string) => void
  onSchoolClick?: (schoolId: string) => void
  onStudentClick?: (studentId: string) => void
}

// Extended mock request data generator - regular function without React.cache
const generateFullRequestData = (requestId: string, stage: string) => {
  const baseData = {
    id: requestId,
    school: "Johns Hopkins University",
    schoolType: "partner",
    tier: "gold",
    studentName: stage === "Confirmed Students" ? "Sarah Johnson" : null,
    slots: 2,
    location: "Rochester, MN",
    discipline: "Internal Medicine",
    requestedDates: "Apr 15 - Jun 10, 2024",
    startDate: "2024-04-15",
    endDate: "2024-06-10",
    priority: "High",
    submittedBy: "Dr. Michael Chen",
    submittedDate: "2024-03-28",
    lastUpdated: "2024-04-02",
    requestDetails: "Looking for high-quality internal medicine rotation opportunities for our top medical students. Preference for hands-on clinical experience with direct patient contact. Students should be involved in patient rounds, case discussions, and have opportunities to practice clinical skills under supervision.",
    requestNotes: "This is a priority placement for our honor students program. Please prioritize this request. Students are highly motivated and have excellent academic records.",
    availability: {
      name: "Internal Medicine Rotation - Mayo Clinic",
      site: "Mayo Clinic",
      totalSlots: 12,
      availableSlots: 7,
      coordinator: "Dr. Sarah Mitchell",
    },
    schoolDetails: {
      fullName: "Johns Hopkins University School of Medicine",
      address: "733 N Broadway, Baltimore, MD 21205",
      accreditation: "LCME Accredited",
      website: "https://www.hopkinsmedicine.org/som/",
      established: "1893",
    },
    activityLog: [
      {
        id: "1",
        action: "Request Submitted",
        user: "Dr. Michael Chen",
        timestamp: "2024-03-28T10:30:00Z",
        details: "Initial request submitted for 2 rotation slots",
        type: "system",
      },
      {
        id: "2", 
        action: "Request Reviewed",
        user: "Dr. Sarah Mitchell",
        timestamp: "2024-04-01T14:15:00Z",
        details: "Started initial review of request requirements",
        type: "review",
      },
      {
        id: "3",
        action: "Documentation Requested",
        user: "Dr. Sarah Mitchell", 
        timestamp: "2024-04-02T09:45:00Z",
        details: "Requested additional student transcripts and recommendations",
        type: "request",
      },
    ],
    attachments: [
      {
        id: "1",
        name: "Student_Transcripts.pdf",
        size: "2.4 MB",
        uploadedBy: "Dr. Michael Chen",
        uploadedDate: "2024-03-28T10:30:00Z",
        type: "document",
      },
      {
        id: "2",
        name: "Recommendation_Letters.pdf", 
        size: "1.8 MB",
        uploadedBy: "Dr. Michael Chen",
        uploadedDate: "2024-03-29T14:15:00Z",
        type: "document",
      },
    ],
    comments: [
      {
        id: "1",
        user: "Dr. Sarah Mitchell",
        timestamp: "2024-04-01T14:15:00Z",
        message: "This looks like a strong request. The student profiles are impressive. I need to verify our capacity for the requested dates before proceeding with approval.",
        type: "internal",
      },
      {
        id: "2",
        user: "Dr. Michael Chen",
        timestamp: "2024-04-03T16:20:00Z", 
        message: "Thank you for the quick review! The student Sarah Johnson has completed her core rotations with honors and is particularly interested in cardiology. She would benefit greatly from the Mayo Clinic experience.",
        type: "external",
        school: "Johns Hopkins University",
      },
    ],
  }

  // Add stage-specific data
  switch (stage) {
    case "Under Review":
      return {
        ...baseData,
        reviewerName: "Dr. Sarah Mitchell",
        reviewStartDate: "2024-04-01",
        estimatedDecision: "2024-04-08",
        reviewNotes: "Initial review looks positive. Need to verify capacity and scheduling alignment.",
        reviewStatus: "In Progress",
      }
    
    case "Approved":
      return {
        ...baseData,
        approvalDate: "2024-04-05",
        approvedBy: "Dr. Sarah Mitchell",
        expirationDate: "2024-05-05",
        approvalNotes: "Approved for 2 slots. Students must complete all pre-arrival requirements by April 30th.",
        nextSteps: [
          "Complete background checks by April 20th",
          "Submit immunization records by April 25th", 
          "Attend virtual orientation session on April 28th",
        ],
      }
    
    case "Confirmed Students":
      return {
        ...baseData,
        studentName: "Sarah Johnson",
        complianceStatus: "Compliant",
        enrollmentDate: "2024-04-10",
        supervisorName: "Dr. Emily Rodriguez",
        supervisorEmail: "e.rodriguez@mayoclinic.org",
        studentEmail: "s.johnson@jhmi.edu",
        studentDetails: {
          year: "4th Year Medical Student",
          gpa: "3.92",
          interests: ["Cardiology", "Internal Medicine", "Research"],
        },
      }
    
    case "Ongoing":
      return {
        ...baseData,
        studentName: "Sarah Johnson",
        startDate: "2024-04-15",
        expectedEndDate: "2024-06-10",
        supervisorName: "Dr. Emily Rodriguez",
        supervisorEmail: "e.rodriguez@mayoclinic.org",
        currentWeek: 4,
        totalWeeks: 8,
        progressPercentage: 50,
        lastCheckIn: "2024-05-01",
        performanceRating: "Excellent",
        weeklyHours: 40,
        attendanceRate: 98,
        midtermEvaluation: "Outstanding performance, excellent clinical skills",
      }

    case "Complete":
      return {
        ...baseData,
        studentName: "Sarah Johnson", 
        completionDate: "2024-06-10",
        supervisorName: "Dr. Emily Rodriguez",
        finalGrade: "A",
        finalEvaluation: "Outstanding",
        feedbackSubmitted: true,
        certificateIssued: true,
        totalHours: 320,
        attendanceRate: 98,
        finalComments: "Exceptional student with strong clinical skills and professional demeanor. Highly recommended for future rotations.",
      }
    
    case "Rejected":
      return {
        ...baseData,
        rejectionDate: "2024-04-03",
        rejectionReason: "Capacity full for requested dates",
        rejectedBy: "Dr. Sarah Mitchell",
        rejectionNotes: "Unfortunately, we are at full capacity for the requested dates. The student profiles are excellent and we would welcome them for alternative dates.",
      }
    
    default:
      return baseData
  }
}

// Available stages for request progression
const availableStages = [
  "School Request",
  "Under Review", 
  "Approved",
  "Confirmed Students",
  "Ongoing",
  "Complete",
  "Rejected"
]

// Helper functions - regular functions
const getTierColor = (tier: string) => {
  switch (tier) {
    case 'gold': return 'bg-chart-4/10 text-chart-4'
    case 'silver': return 'bg-muted text-muted-foreground'
    case 'bronze': return 'bg-chart-5/10 text-chart-5'
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

const getComplianceStatusColor = (status: string) => {
  switch (status) {
    case 'Compliant': return 'bg-chart-2/10 text-chart-2'
    case 'Pending': return 'bg-chart-4/10 text-chart-4'
    case 'Missing Documents': return 'bg-destructive/10 text-destructive'
    case 'Expired': return 'bg-destructive/10 text-destructive'
    case 'Under Review': return 'bg-chart-1/10 text-chart-1'
    default: return 'bg-muted text-muted-foreground'
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'system': return <History className="h-4 w-4 text-chart-1" />
    case 'review': return <Eye className="h-4 w-4 text-chart-5" />
    case 'request': return <AlertCircle className="h-4 w-4 text-chart-4" />
    case 'comment': return <MessageCircle className="h-4 w-4 text-chart-2" />
    default: return <Activity className="h-4 w-4 text-muted-foreground" />
  }
}

export function RequestDetailPage({ requestId, stage, onBack, onStageUpdate, onSchoolClick, onStudentClick }: RequestDetailPageProps) {
  const [newComment, setNewComment] = React.useState("")
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [isStageDialogOpen, setIsStageDialogOpen] = React.useState(false)
  const [selectedStage, setSelectedStage] = React.useState(stage)

  // Memoize the data generation to prevent infinite re-renders
  const data = React.useMemo(() => generateFullRequestData(requestId, stage), [requestId, stage])
  
  // Use separate state for form data to avoid re-creating data on every render
  const [formData, setFormData] = React.useState(() => data)

  // Only update formData when data actually changes (not on every render)
  React.useEffect(() => {
    setFormData(data)
  }, [data])

  // Update selectedStage when stage prop changes
  React.useEffect(() => {
    setSelectedStage(stage)
  }, [stage])

  // Memoize callbacks to prevent re-renders
  const handleFieldEdit = React.useCallback((fieldName: string) => {
    setEditingField(fieldName)
  }, [])

  const handleFieldSave = React.useCallback((fieldName: string) => {
    console.log(`Saving ${fieldName}:`, formData[fieldName])
    setEditingField(null)
    // Here you would implement actual field save logic
  }, [formData])

  const handleStageUpdate = React.useCallback(() => {
    if (onStageUpdate && selectedStage !== stage) {
      onStageUpdate(data.id, selectedStage)
      console.log(`Updating request ${data.id} from ${stage} to ${selectedStage}`)
    }
    setIsStageDialogOpen(false)
  }, [onStageUpdate, selectedStage, stage, data.id])

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

  const renderEditableField = React.useCallback((fieldName: string, value: string, label: string, type: 'input' | 'textarea' | 'date' | 'number' = 'input') => {
    const isCurrentlyEditing = editingField === fieldName

    if (isCurrentlyEditing) {
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{label}</Label>
          <div className="flex gap-2">
            {type === 'textarea' ? (
              <Textarea
                value={formData[fieldName] || ""}
                onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                className="flex-1"
                rows={3}
              />
            ) : type === 'number' ? (
              <Input
                type="number"
                value={formData[fieldName] || ""}
                onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                className="flex-1"
              />
            ) : type === 'date' ? (
              <Input
                type="date"
                value={formData[fieldName] || ""}
                onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                className="flex-1"
              />
            ) : (
              <Input
                value={formData[fieldName] || ""}
                onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                className="flex-1"
              />
            )}
            <Button size="sm" onClick={() => handleFieldSave(fieldName)}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditingField(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center justify-between group">
          <span className="text-sm text-muted-foreground">{value}</span>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleFieldEdit(fieldName)}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }, [editingField, formData, handleFieldEdit, handleFieldSave])

  const handleAddComment = React.useCallback(() => {
    if (newComment.trim()) {
      console.log("Adding comment:", newComment)
      setNewComment("")
      // Here you would implement actual comment adding logic
    }
  }, [newComment])

  return (
    <div className="px-4 lg:px-6 pt-4 lg:pt-6 space-y-6 max-w-full overflow-hidden">
      {/* Header - Following availability header pattern */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-medium font-display">{data.school}</h1>
            <Badge className={getPriorityColor(data.priority)}>{data.priority}</Badge>
            <Badge variant="outline">{stage}</Badge>
            {(data.schoolType === "partner" || data.schoolType === "consortium") && (
              <div className="flex gap-1">
                {renderSchoolBadges(data.schoolType, data.tier)}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Hash className="h-4 w-4" />
              Request #{data.id}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Submitted {new Date(data.submittedDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Updated {new Date(data.lastUpdated).toLocaleDateString()}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground max-w-2xl">
            {data.discipline} rotation • {data.slots} slot{data.slots > 1 ? 's' : ''} requested • {data.requestedDates}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Stage Update Dialog with proper accessibility */}
          <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Stage
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" aria-describedby="update-stage-description">
              <DialogHeader>
                <DialogTitle>Update Request Stage</DialogTitle>
                <DialogDescription id="update-stage-description">
                  Change the current stage of this request to move it through the approval workflow. This action will update the request status and notify relevant stakeholders.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-sm font-medium">Current Stage</Label>
                  <p className="text-sm text-muted-foreground mt-1">{stage}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">New Stage</Label>
                  <Select value={selectedStage} onValueChange={setSelectedStage}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStages.map((availableStage) => (
                        <SelectItem key={availableStage} value={availableStage}>
                          {availableStage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsStageDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleStageUpdate}>
                    Update Stage
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share Request
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Request
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <DashboardCard
          data={createDashboardCardData(
            "Requested Slots",
            data.slots.toString(),
            Hash,
            "text-chart-1"
          )}
          variant="medium"
        />
        
        <DashboardCard
          data={createDashboardCardData(
            "Location",
            data.location,
            MapPin,
            "text-chart-2"
          )}
          variant="medium"
        />
        
        <DashboardCard
          data={createDashboardCardData(
            "Discipline",
            data.discipline,
            Activity,
            "text-chart-3"
          )}
          variant="medium"
        />
        
        <DashboardCard
          data={createDashboardCardData(
            "Duration",
            data.requestedDates.split(' - ').length > 1 ? '8 weeks' : 'TBD',
            Calendar,
            "text-chart-5"
          )}
          variant="medium"
        />

        <DashboardCard
          data={createDashboardCardData(
            "Shift",
            "Morning",
            Clock,
            "text-chart-1"
          )}
          variant="medium"
        />

        <DashboardCard
          data={createDashboardCardData(
            "Days",
            "Monday - Friday",
            Calendar,
            "text-chart-2"
          )}
          variant="medium"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Request Details</TabsTrigger>
          <TabsTrigger value="activity">Activity & Comments</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          {(stage === "Confirmed Students" || stage === "Ongoing" || stage === "Complete") && (
            <TabsTrigger value="student">Student Info</TabsTrigger>
          )}
          {stage === "Ongoing" && (
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          )}
          {stage === "Complete" && (
            <TabsTrigger value="completion">Completion Summary</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6 m-0">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Primary Information */}
            <div className="xl:col-span-2 space-y-6">
              {/* Request Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">School</Label>
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4 text-chart-1" />
                          <span 
                            className="font-medium cursor-pointer hover:text-chart-1 hover:underline"
                            onClick={() => onSchoolClick?.('johns-hopkins')}
                          >
                            {data.school}
                          </span>
                        </div>
                        {(data.schoolType === "partner" || data.schoolType === "consortium") && (
                          <div className="flex gap-1 ml-6">
                            {renderSchoolBadges(data.schoolType, data.tier)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Submitted By</Label>
                      <p className="font-medium mt-1">{data.submittedBy}</p>
                    </div>
                    
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {renderEditableField('slots', data.slots.toString(), 'Requested Slots', 'number')}
                      {renderEditableField('startDate', data.startDate, 'Start Date', 'date')}
                      {renderEditableField('endDate', data.endDate, 'End Date', 'date')}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Priority Level</Label>
                      <div className="mt-1">
                        <Badge className={getPriorityColor(data.priority)}>{data.priority}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {renderEditableField('requestDetails', data.requestDetails, 'Request Details', 'textarea')}
                  {renderEditableField('requestNotes', data.requestNotes, 'Additional Notes', 'textarea')}
                </CardContent>
              </Card>

              {/* Student Information for Confirmed Students, Ongoing, and Complete stages */}
              {(stage === "Confirmed Students" || stage === "Ongoing" || stage === "Complete") && data.studentName && (
                <Card>
                  <CardHeader>
                    <CardTitle>Confirmed Student</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Student Name</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-chart-1" />
                          <span 
                            className="font-medium cursor-pointer hover:text-chart-1 hover:underline"
                            onClick={() => onStudentClick?.('sarah-johnson')}
                          >
                            {data.studentName}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Compliance Status</Label>
                        <div className="mt-1">
                          <Badge className={getComplianceStatusColor(data.complianceStatus)}>
                            {data.complianceStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm text-muted-foreground mt-1">{data.studentEmail}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Enrollment Date</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(data.enrollmentDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {data.studentDetails && (
                        <>
                          <div>
                            <Label className="text-sm font-medium">Academic Year</Label>
                            <p className="text-sm text-muted-foreground mt-1">{data.studentDetails.year}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">GPA</Label>
                            <p className="text-sm text-muted-foreground mt-1">{data.studentDetails.gpa}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Secondary Information */}
            <div className="space-y-6">
              {/* Availability Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Availability Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Rotation Name</Label>
                    <p className="font-medium mt-1">{data.availability.name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Site</Label>
                    <p className="text-sm text-muted-foreground mt-1">{data.availability.site}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Coordinator</Label>
                    <p className="text-sm text-muted-foreground mt-1">{data.availability.coordinator}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Capacity</Label>
                    <div className="mt-1 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{data.availability.availableSlots} available</span>
                        <span>{data.availability.totalSlots} total</span>
                      </div>
                      <Progress 
                        value={((data.availability.totalSlots - data.availability.availableSlots) / data.availability.totalSlots) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* School Information */}
              <Card>
                <CardHeader>
                  <CardTitle>School Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="text-sm text-muted-foreground mt-1">{data.schoolDetails.fullName}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Address</Label>
                    <p className="text-sm text-muted-foreground mt-1">{data.schoolDetails.address}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Accreditation</Label>
                    <p className="text-sm text-muted-foreground mt-1">{data.schoolDetails.accreditation}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Established</Label>
                    <p className="text-sm text-muted-foreground mt-1">{data.schoolDetails.established}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Website</Label>
                    <a 
                      href={data.schoolDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-chart-1 hover:underline mt-1 flex items-center gap-1"
                    >
                      View Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Stage-specific Information */}
              {stage === "Under Review" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Reviewer</Label>
                      <p className="text-sm text-muted-foreground mt-1">{data.reviewerName}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Review Started</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(data.reviewStartDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Estimated Decision</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(data.estimatedDecision).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge variant="outline" className="mt-1">
                        {data.reviewStatus}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Review Notes</Label>
                      <p className="text-sm text-muted-foreground mt-1">{data.reviewNotes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {stage === "Approved" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Approval Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Approved By</Label>
                      <p className="text-sm text-muted-foreground mt-1">{data.approvedBy}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Approval Date</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(data.approvalDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Expires</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(data.expirationDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Next Steps</Label>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        {data.nextSteps?.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-chart-2 mt-0.5 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Approval Notes</Label>
                      <p className="text-sm text-muted-foreground mt-1">{data.approvalNotes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {stage === "Rejected" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rejection Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Rejected By</Label>
                      <p className="text-sm text-muted-foreground mt-1">{data.rejectedBy}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Rejection Date</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(data.rejectionDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Reason</Label>
                      <Badge variant="destructive" className="mt-1">
                        {data.rejectionReason}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Notes</Label>
                      <p className="text-sm text-muted-foreground mt-1">{data.rejectionNotes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6 m-0">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {renderEditableField('discipline', data.discipline, 'Discipline')}
                  {renderEditableField('location', data.location, 'Location')}
                  {renderEditableField('slots', data.slots.toString(), 'Requested Slots', 'number')}
                  {renderEditableField('priority', data.priority, 'Priority Level')}
                </div>
                
                <div className="space-y-4">
                  {renderEditableField('startDate', data.startDate, 'Start Date', 'date')}
                  {renderEditableField('endDate', data.endDate, 'End Date', 'date')}
                  {renderEditableField('submittedBy', data.submittedBy, 'Submitted By')}
                  
                  <div>
                    <Label className="text-sm font-medium">Submitted Date</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(data.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {renderEditableField('requestDetails', data.requestDetails, 'Request Details', 'textarea')}
                {renderEditableField('requestNotes', data.requestNotes, 'Additional Notes', 'textarea')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 m-0">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Activity Log */}
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.activityLog.map((activity) => (
                      <div key={activity.id} className="flex gap-3 p-3 rounded-lg border">
                        <div className="flex-shrink-0 mt-0.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{activity.action}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                          <p className="text-xs text-muted-foreground">by {activity.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comments Section */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Comments */}
                  <div className="space-y-3">
                    {data.comments.map((comment) => (
                      <div key={comment.id} className="p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{comment.user}</span>
                          <div className="flex items-center gap-2">
                            {comment.type === 'external' && comment.school && (
                              <Badge variant="outline" className="text-xs">
                                {comment.school}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="space-y-3 pt-3 border-t">
                    <Label className="text-sm font-medium">Add Comment</Label>
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      size="sm"
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-6 m-0">
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-chart-1" />
                      <div>
                        <h4 className="font-medium text-sm">{attachment.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {attachment.size} • Uploaded by {attachment.uploadedBy} • {new Date(attachment.uploadedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Upload new attachment */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Paperclip className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Attachment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {stage === "Confirmed Students" && (
          <TabsContent value="student" className="space-y-6 m-0">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Student Details */}
              <div className="xl:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Full Name</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-chart-1" />
                          <span 
                            className="font-medium cursor-pointer hover:text-chart-1 hover:underline"
                            onClick={() => onStudentClick?.('sarah-johnson')}
                          >
                            {data.studentName}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-chart-2" />
                          <a href={`mailto:${data.studentEmail}`} className="text-sm text-chart-1 hover:underline">
                            {data.studentEmail}
                          </a>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Academic Year</Label>
                        <p className="text-sm text-muted-foreground mt-1">{data.studentDetails?.year}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">GPA</Label>
                        <p className="text-sm text-muted-foreground mt-1">{data.studentDetails?.gpa}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Enrollment Date</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(data.enrollmentDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Supervisor</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <UserCheck className="h-4 w-4 text-chart-3" />
                          <span className="text-sm text-muted-foreground">{data.supervisorName}</span>
                        </div>
                      </div>
                    </div>
                    
                    {data.studentDetails?.interests && (
                      <div>
                        <Label className="text-sm font-medium">Areas of Interest</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {data.studentDetails.interests.map((interest, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Compliance & Status */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance & Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Compliance Status</Label>
                      <div className="mt-1">
                        <Badge className={getComplianceStatusColor(data.complianceStatus)}>
                          {data.complianceStatus}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Supervisor Contact</Label>
                      <div className="space-y-1 mt-1">
                        <p className="text-sm text-muted-foreground">{data.supervisorName}</p>
                        <a href={`mailto:${data.supervisorEmail}`} className="text-sm text-chart-1 hover:underline flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {data.supervisorEmail}
                        </a>
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Profile
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Student
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}

        {/* Progress Tracking Tab for Ongoing stage */}
        {stage === "Ongoing" && (
          <TabsContent value="progress" className="space-y-6 m-0">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Rotation Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Week {data.currentWeek} of {data.totalWeeks}</span>
                      <span>{data.progressPercentage}% Complete</span>
                    </div>
                    <Progress value={data.progressPercentage} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label className="text-sm font-medium">Weekly Hours</Label>
                      <p className="text-2xl font-bold">{data.weeklyHours}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Attendance Rate</Label>
                      <p className="text-2xl font-bold text-chart-2">{data.attendanceRate}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Performance Rating</Label>
                    <div className="mt-1">
                      <Badge className="bg-chart-2/10 text-chart-2">{data.performanceRating}</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Last Check-in</Label>
                    <p className="text-sm text-muted-foreground mt-1">{data.lastCheckIn}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Supervisor Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Supervisor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="font-medium mt-1">{data.supervisorName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground mt-1">{data.supervisorEmail}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Midterm Evaluation</Label>
                    <p className="text-sm text-muted-foreground mt-1">{data.midtermEvaluation}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Completion Summary Tab for Complete stage */}
        {stage === "Complete" && (
          <TabsContent value="completion" className="space-y-6 m-0">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Final Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Final Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Final Grade</Label>
                      <p className="text-3xl font-bold text-chart-2">{data.finalGrade}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Evaluation</Label>
                      <p className="text-xl font-semibold">{data.finalEvaluation}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label className="text-sm font-medium">Total Hours</Label>
                      <p className="text-2xl font-bold">{data.totalHours}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Final Attendance</Label>
                      <p className="text-2xl font-bold text-chart-2">{data.attendanceRate}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Completion Date</Label>
                    <p className="font-medium mt-1">{data.completionDate}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Completion Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Completion Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Feedback Submitted</span>
                      <Badge className={data.feedbackSubmitted ? "bg-chart-2/10 text-chart-2" : "bg-destructive/10 text-destructive"}>
                        {data.feedbackSubmitted ? "Complete" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Certificate Issued</span>
                      <Badge className={data.certificateIssued ? "bg-chart-2/10 text-chart-2" : "bg-destructive/10 text-destructive"}>
                        {data.certificateIssued ? "Issued" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Final Comments</Label>
                    <p className="text-sm text-muted-foreground mt-1">{data.finalComments}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Supervisor</Label>
                    <p className="font-medium mt-1">{data.supervisorName}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

      </Tabs>
    </div>
  )
}