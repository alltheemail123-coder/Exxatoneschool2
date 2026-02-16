import * as React from "react"
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Share,
  Copy,
  Settings,
  GraduationCap,
  UserCheck,
  DoorOpen
} from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MetricCard, createMetricCardData } from "../shared/metric-card"
import { DataTable, type ColumnConfig } from "../shared/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface SchoolProfileProps {
  schoolId: string
  onBack: () => void
  onStudentClick?: (studentId: string) => void
}

// Mock data - in a real app, this would come from an API
const schoolData = {
  id: "johns-hopkins",
  name: "Johns Hopkins University",
  shortName: "JHU",
  type: "Private Research University",
  location: "Baltimore, Maryland",
  tier: "Gold",
  status: "Active",
  partnerSince: "2018",
  description: "Johns Hopkins University is a private research university founded in 1876. Known for its medical school and research facilities.",
  contact: {
    email: "partnerships@jhu.edu",
    phone: "+1 (410) 516-8000",
    website: "https://www.jhu.edu"
  },
  stats: {
    totalStudents: 28847,
    medicalStudents: 485,
    activeRotations: 156,
    completedRotations: 2340,
    pendingRotations: 12,
    averageRating: 4.8
  },
  requirements: {
    insurance: true,
    backgroundCheck: true,
    immunizations: true,
    drugScreening: true
  }
}

const studentsData = [
  {
    id: "1",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@jhu.edu",
    year: "MS4",
    gpa: "3.85",
    status: "Active",
    rotations: "12",
    completedHours: "480",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b150c4eb?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "2", 
    name: "Michael Chen",
    email: "michael.chen@jhu.edu",
    year: "MS3",
    gpa: "3.92",
    status: "On Rotation", 
    rotations: "8",
    completedHours: "320",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah.johnson@jhu.edu", 
    year: "MS4",
    gpa: "3.78",
    status: "Pending",
    rotations: "11",
    completedHours: "440",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "4",
    name: "David Wilson", 
    email: "david.wilson@jhu.edu",
    year: "MS3",
    gpa: "3.69",
    status: "Active",
    rotations: "7",
    completedHours: "280",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "jessica.martinez@jhu.edu",
    year: "MS4", 
    gpa: "3.88",
    status: "On Rotation",
    rotations: "13",
    completedHours: "520",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
  }
]

const rotationsData = [
  {
    id: "1",
    specialty: "Internal Medicine",
    student: "Emily Rodriguez",
    startDate: "03/15/2024",
    endDate: "05/10/2024",
    status: "Active",
    hours: "40",
    supervisor: "Dr. Smith"
  },
  {
    id: "2",
    specialty: "Surgery",
    student: "Michael Chen", 
    startDate: "02/01/2024",
    endDate: "03/28/2024",
    status: "Completed",
    hours: "60",
    supervisor: "Dr. Johnson"
  },
  {
    id: "3",
    specialty: "Pediatrics",
    student: "Sarah Johnson",
    startDate: "04/01/2024", 
    endDate: "05/30/2024",
    status: "Pending",
    hours: "35",
    supervisor: "Dr. Brown"
  },
  {
    id: "4",
    specialty: "Emergency Medicine",
    student: "David Wilson",
    startDate: "01/15/2024",
    endDate: "03/15/2024", 
    status: "Completed",
    hours: "45",
    supervisor: "Dr. Davis"
  },
  {
    id: "5",
    specialty: "Cardiology", 
    student: "Jessica Martinez",
    startDate: "03/01/2024",
    endDate: "04/25/2024",
    status: "Active",
    hours: "50",
    supervisor: "Dr. Wilson"
  }
]

export function SchoolProfile({ schoolId, onBack, onStudentClick }: SchoolProfileProps) {
  const [activeTab, setActiveTab] = React.useState("overview")

  const renderStudentCell = (column: ColumnConfig, item: any, index: number) => {
    if (column.key === 'name') {
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.avatar} alt={item.name} />
            <AvatarFallback className="text-xs">
              {item.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div 
              className="font-medium cursor-pointer hover:text-chart-1 hover:underline"
              onClick={() => onStudentClick?.(item.id)}
            >
              {item.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {item.email}
            </div>
          </div>
        </div>
      )
    }

    if (column.key === 'status') {
      const statusColors = {
        'Active': 'bg-chart-2 text-white',
        'On Rotation': 'bg-chart-4 text-foreground',
        'Pending': 'bg-chart-1 text-white',
        'Inactive': 'bg-muted text-muted-foreground'
      }
      return (
        <Badge className={statusColors[item[column.key] as keyof typeof statusColors] || 'bg-muted text-muted-foreground'}>
          {item[column.key]}
        </Badge>
      )
    }

    return item[column.key]
  }

  const studentsColumns: ColumnConfig[] = [
    { 
      key: 'name', 
      label: 'Student Name', 
      sortable: true,
      render: renderStudentCell
    },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'gpa', label: 'GPA', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: renderStudentCell
    },
    { key: 'rotations', label: 'Rotations', sortable: true },
    { key: 'completedHours', label: 'Hours', sortable: true }
  ]

  const renderRotationCell = (column: ColumnConfig, item: any, index: number) => {
    if (column.key === 'status') {
      const statusColors = {
        'Active': 'bg-chart-2 text-white',
        'Completed': 'bg-chart-3 text-white', 
        'Pending': 'bg-chart-4 text-foreground',
        'Cancelled': 'bg-destructive text-destructive-foreground'
      }
      return (
        <Badge className={statusColors[item[column.key] as keyof typeof statusColors] || 'bg-muted text-muted-foreground'}>
          {item[column.key]}
        </Badge>
      )
    }

    if (column.key === 'student') {
      return (
        <div 
          className="font-medium cursor-pointer hover:text-chart-1 hover:underline"
          onClick={() => onStudentClick?.(item.id)}
        >
          {item[column.key]}
        </div>
      )
    }

    return item[column.key]
  }

  const rotationsColumns: ColumnConfig[] = [
    { key: 'specialty', label: 'Specialty', sortable: true },
    { 
      key: 'student', 
      label: 'Student', 
      sortable: true,
      render: renderRotationCell
    },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: renderRotationCell
    },
    { key: 'hours', label: 'Hours/Week', sortable: true },
    { key: 'supervisor', label: 'Supervisor', sortable: true }
  ]

  // Item ID getters for drag and drop functionality
  const getStudentItemId = (item: any) => item.id
  const getRotationItemId = (item: any) => item.id

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-1 -ml-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold font-display">{schoolData.name}</h1>
            <Badge variant="secondary" className="bg-chart-4 text-foreground">
              {schoolData.tier} Partner
            </Badge>
            <Badge 
              className={schoolData.status === 'Active' ? 'bg-chart-2 text-white' : 'bg-muted text-muted-foreground'}
            >
              {schoolData.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {schoolData.type}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {schoolData.location}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Partner since {schoolData.partnerSince}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          data={createMetricCardData("Total Students", schoolData.stats.totalStudents.toLocaleString(), Users)}
          variant="small"
        />
        <MetricCard
          data={createMetricCardData("Medical Students", schoolData.stats.medicalStudents.toString(), GraduationCap)}
          variant="small"
        />
        <MetricCard
          data={createMetricCardData("Active Rotations", schoolData.stats.activeRotations.toString(), Activity)}
          variant="small"
        />
        <MetricCard
          data={createMetricCardData("Avg Rating", schoolData.stats.averageRating.toString(), CheckCircle)}
          variant="small"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="rotations">Rotations</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tab Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="overview" className="m-0">
          <div className="space-y-6">
            {/* School Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">School Information</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{schoolData.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium cursor-pointer hover:text-chart-1 hover:underline">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium cursor-pointer hover:text-chart-1 hover:underline">{schoolData.contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium cursor-pointer hover:text-chart-1 hover:underline">{schoolData.contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium cursor-pointer hover:text-chart-1 hover:underline">{schoolData.contact.website}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium cursor-pointer hover:text-chart-1 hover:underline">Partnership Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium cursor-pointer hover:text-chart-1 hover:underline">Completed Rotations:</span>
                          <span>{schoolData.stats.completedRotations}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium cursor-pointer hover:text-chart-1 hover:underline">Pending Rotations:</span>
                          <span>{schoolData.stats.pendingRotations}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium cursor-pointer hover:text-chart-1 hover:underline">Success Rate:</span>
                          <span>98.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="m-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Students</h3>
                <Badge variant="secondary">{studentsData.length} Total</Badge>
              </div>
              <DataTable
                columns={studentsColumns}
                data={studentsData}
                searchable={true}
                searchPlaceholder="Search students..."
                pageSize={10}
                getItemId={getStudentItemId}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rotations" className="m-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Rotations</h3>
                <Badge variant="secondary">{rotationsData.length} Total</Badge>
              </div>
              <DataTable
                columns={rotationsColumns}
                data={rotationsData}
                searchable={true}
                searchPlaceholder="Search rotations..."
                pageSize={10}
                getItemId={getRotationItemId}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="m-0">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">School Requirements</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className={`h-5 w-5 ${schoolData.requirements.insurance ? 'text-chart-2' : 'text-muted-foreground'}`} />
                      <div>
                        <div className="font-medium cursor-pointer hover:text-chart-1 hover:underline">Liability Insurance</div>
                        <div className="text-sm text-muted-foreground">Required for all rotations</div>
                      </div>
                    </div>
                    <Badge className={schoolData.requirements.insurance ? 'bg-chart-2 text-white' : 'bg-muted text-muted-foreground'}>
                      {schoolData.requirements.insurance ? 'Required' : 'Optional'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserCheck className={`h-5 w-5 ${schoolData.requirements.backgroundCheck ? 'text-chart-2' : 'text-muted-foreground'}`} />
                      <div>
                        <div className="font-medium cursor-pointer hover:text-chart-1 hover:underline">Background Check</div>
                        <div className="text-sm text-muted-foreground">Criminal background verification</div>
                      </div>
                    </div>
                    <Badge className={schoolData.requirements.backgroundCheck ? 'bg-chart-2 text-white' : 'bg-muted text-muted-foreground'}>
                      {schoolData.requirements.backgroundCheck ? 'Required' : 'Optional'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className={`h-5 w-5 ${schoolData.requirements.immunizations ? 'text-chart-2' : 'text-muted-foreground'}`} />
                      <div>
                        <div className="font-medium cursor-pointer hover:text-chart-1 hover:underline">Immunizations</div>
                        <div className="text-sm text-muted-foreground">Up-to-date vaccination records</div>
                      </div>
                    </div>
                    <Badge className={schoolData.requirements.immunizations ? 'bg-chart-2 text-white' : 'bg-muted text-muted-foreground'}>
                      {schoolData.requirements.immunizations ? 'Required' : 'Optional'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className={`h-5 w-5 ${schoolData.requirements.drugScreening ? 'text-chart-2' : 'text-muted-foreground'}`} />
                      <div>
                        <div className="font-medium cursor-pointer hover:text-chart-1 hover:underline">Drug Screening</div>
                        <div className="text-sm text-muted-foreground">Pre-rotation drug test</div>
                      </div>
                    </div>
                    <Badge className={schoolData.requirements.drugScreening ? 'bg-chart-2 text-white' : 'bg-muted text-muted-foreground'}>
                      {schoolData.requirements.drugScreening ? 'Required' : 'Optional'}
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-chart-4 mt-0.5" />
                    <div>
                      <div className="font-medium cursor-pointer hover:text-chart-1 hover:underline">Important Note</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        All requirements must be completed and verified before students can begin their rotations. 
                        Contact the school's clinical coordinator for specific documentation requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}