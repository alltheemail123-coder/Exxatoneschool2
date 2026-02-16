"use client"

import * as React from "react"
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Activity,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  MoreHorizontal,
  Edit,
  Share,
  Copy,
  Settings,
  Building2,
  Star,
  FileText
} from "lucide-react"

import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MetricCard, createMetricCardData } from "../shared/metric-card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Progress } from "../ui/progress"

// Mock student data
const getStudentData = (studentId: string) => ({
  id: studentId,
  name: "Sarah Johnson",
  email: "sarah.johnson@mayo.edu",
  phone: "(507) 555-0123",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b047?w=200&h=200&fit=crop&crop=face",
  school: {
    id: "mayo-clinic",
    name: "Mayo Clinic College of Medicine and Science",
    shortName: "Mayo Clinic"
  },
  program: {
    name: "Doctor of Medicine (MD)",
    year: "3rd Year",
    expectedGraduation: "May 2025",
    gpa: 3.87
  },
  status: "Active",
  location: "Rochester, MN",
  bio: "Dedicated medical student with a passion for internal medicine and patient care. Actively seeking clinical rotations to enhance practical skills and knowledge.",
  stats: {
    completedRotations: 8,
    currentRotation: "Internal Medicine",
    totalHours: 1240,
    averageRating: 4.8,
    certifications: 5
  },
  rotations: [
    {
      id: "1",
      name: "Internal Medicine",
      site: "Mayo Clinic - Rochester",
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      status: "In Progress",
      rating: null,
      supervisor: "Dr. Michael Thompson"
    },
    {
      id: "2",
      name: "Cardiology",
      site: "Mayo Clinic - Rochester", 
      startDate: "2023-10-01",
      endDate: "2023-12-01",
      status: "Completed",
      rating: 4.9,
      supervisor: "Dr. Jennifer Martinez"
    },
    {
      id: "3",
      name: "Emergency Medicine",
      site: "Rochester Methodist Hospital",
      startDate: "2023-07-01", 
      endDate: "2023-09-01",
      status: "Completed",
      rating: 4.7,
      supervisor: "Dr. Robert Kim"
    }
  ],
  achievements: [
    {
      title: "Dean's List",
      description: "Academic Excellence - Fall 2023",
      date: "2023-12-15",
      type: "academic"
    },
    {
      title: "Outstanding Clinical Performance",
      description: "Cardiology Rotation",
      date: "2023-12-01",
      type: "clinical"
    },
    {
      title: "Research Publication",
      description: "Co-author in Journal of Internal Medicine",
      date: "2023-08-15", 
      type: "research"
    }
  ]
})

const studentMetrics = [
  createMetricCardData(
    "Completed Rotations",
    "8",
    CheckCircle,
    "text-chart-2",
    {
      change: "+2",
      trend: "up",
      description: "This academic year",
    }
  ),
  createMetricCardData(
    "Clinical Hours",
    "1,240",
    Clock,
    "text-chart-1",
    {
      change: "+180",
      trend: "up", 
      description: "Total logged hours",
    }
  ),
  createMetricCardData(
    "Average Rating",
    "4.8/5.0",
    Star,
    "text-chart-4",
    {
      change: "+0.2",
      trend: "up",
      description: "Supervisor evaluations",
    }
  ),
  createMetricCardData(
    "Certifications",
    "5",
    Award,
    "text-chart-3",
    {
      change: "+1",
      trend: "up",
      description: "Active certifications",
    }
  ),
]

interface StudentProfileProps {
  studentId: string
  onBack: () => void
  onSchoolClick?: (schoolId: string) => void
}

export function StudentProfile({ studentId, onBack, onSchoolClick }: StudentProfileProps) {
  const student = getStudentData(studentId)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20"
      case "Completed":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20"
      case "Pending":
        return "bg-chart-5/10 text-chart-5 border-chart-5/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "academic":
        return <GraduationCap className="h-4 w-4" />
      case "clinical":
        return <Activity className="h-4 w-4" />
      case "research":
        return <FileText className="h-4 w-4" />
      default:
        return <Award className="h-4 w-4" />
    }
  }

  return (
    <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="mt-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-medium font-display">{student.name}</h1>
                <Badge 
                  variant="secondary" 
                  className="bg-chart-1/10 text-chart-1 border-chart-1/20"
                >
                  {student.program.year}
                </Badge>
                <Badge 
                  variant={student.status === "Active" ? "default" : "secondary"}
                  className={
                    student.status === "Active" 
                      ? "bg-chart-2/10 text-chart-2 border-chart-2/20" 
                      : "bg-muted text-muted-foreground border-border"
                  }
                >
                  {student.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span 
                    className="cursor-pointer hover:text-chart-1 hover:underline"
                    onClick={() => onSchoolClick?.(student.school.id)}
                  >
                    {student.school.shortName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {student.program.name}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {student.location}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground max-w-2xl">
                {student.bio}
              </p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
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
              Share Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Contact & Program Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="text-sm text-muted-foreground">{student.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Phone</div>
                <div className="text-sm text-muted-foreground">{student.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">School</div>
                <div 
                  className="text-sm text-muted-foreground cursor-pointer hover:text-chart-1 hover:underline"
                  onClick={() => onSchoolClick?.(student.school.id)}
                >
                  {student.school.name}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Academic Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Program</span>
              <span className="text-sm text-muted-foreground">{student.program.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Year</span>
              <Badge variant="secondary" className="bg-chart-1/10 text-chart-1">
                {student.program.year}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Expected Graduation</span>
              <span className="text-sm text-muted-foreground">{student.program.expectedGraduation}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">GPA</span>
                <span className="text-sm font-medium">{student.program.gpa}/4.0</span>
              </div>
              <Progress value={(student.program.gpa / 4.0) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {studentMetrics.map((metric, index) => (
          <MetricCard 
            key={index} 
            data={metric} 
            variant="small"
            className="p-4"
          />
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="rotations" className="space-y-0">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="rotations">Rotations</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="rotations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clinical Rotations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.rotations.map((rotation) => (
                <div key={rotation.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{rotation.name}</h4>
                      <p className="text-sm text-muted-foreground">{rotation.site}</p>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={getStatusColor(rotation.status)}
                    >
                      {rotation.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(rotation.startDate).toLocaleDateString()} - {new Date(rotation.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Supervisor:</span>
                      <div className="mt-1">{rotation.supervisor}</div>
                    </div>
                  </div>
                  
                  {rotation.rating && (
                    <div className="mt-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-chart-4" />
                      <span className="text-sm font-medium">{rotation.rating}/5.0</span>
                      <span className="text-sm text-muted-foreground">Final Rating</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements & Awards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-chart-4/10 text-chart-4 rounded-full flex items-center justify-center flex-shrink-0">
                    {getAchievementIcon(achievement.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="text-lg font-medium mb-2">Evaluation History</h3>
              <p className="text-muted-foreground">
                View detailed supervisor evaluations and feedback from clinical rotations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}