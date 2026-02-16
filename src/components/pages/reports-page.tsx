import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { ChartAreaInteractive } from "../shared/chart-area-interactive";
import { ImageManager } from "../features/image-manager";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building, 
  Calendar, 
  Award,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  LineChart,
  Images,
  FileText,
  Activity
} from "lucide-react";
import { Input } from "../ui/input";
import { AskLeoButton } from "../shared/ask-leo-button";
import { reportCards, recentReports, quickStats } from "../../data/reports-data";

export function ReportsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTimeRange, setSelectedTimeRange] = React.useState("30d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold font-display">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Monitor performance, track metrics, and manage system resources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Images className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 m-0">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportCards.map((card, index) => {
              const Icon = card.icon;
              const isPositive = card.trend === "up";
              const TrendIcon = isPositive ? TrendingUp : TrendingDown;
              
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-display">{card.value}</div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <TrendIcon className={`h-3 w-3 ${isPositive ? 'text-chart-2' : 'text-destructive'}`} />
                      <span className={isPositive ? 'text-chart-2' : 'text-destructive'}>
                        {card.change}
                      </span>
                      <span>from last month</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Real-time metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-semibold">{stat.value}</p>
                    <p className="text-xs text-chart-2">{stat.change}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Latest generated reports and analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.date} • {report.type}</p>
                    </div>
                    <Badge 
                      variant={report.status === "Ready" ? "default" : 
                               report.status === "Processing" ? "secondary" : "outline"}
                    >
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database Performance</span>
                    <span className="text-chart-2">98.2%</span>
                  </div>
                  <Progress value={98.2} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Response Time</span>
                    <span className="text-chart-2">142ms avg</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Usage</span>
                    <span className="text-chart-4">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>User Satisfaction</span>
                    <span className="text-chart-2">4.7/5</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 m-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search analytics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>Placement Trends</CardTitle>
                  <CardDescription>Student placement activity over time</CardDescription>
                </div>
                <AskLeoButton 
                  chartTitle="Placement Trends"
                  chartDescription="Student placement activity over time"
                />
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Advanced analytics charts would be displayed here</p>
                    <p className="text-sm">Integration with chart library required</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>Top Specializations</CardTitle>
                  <CardDescription>Most requested medical specialties</CardDescription>
                </div>
                <AskLeoButton 
                  chartTitle="Top Specializations"
                  chartDescription="Most requested medical specialties"
                  chartData="Internal Medicine: 87%, Emergency Medicine: 76%, Pediatrics: 65%, Surgery: 58%, Psychiatry: 43%"
                />
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Internal Medicine", value: 87, color: "bg-chart-1" },
                  { name: "Emergency Medicine", value: 76, color: "bg-chart-2" },
                  { name: "Pediatrics", value: 65, color: "bg-chart-3" },
                  { name: "Surgery", value: 58, color: "bg-chart-4" },
                  { name: "Psychiatry", value: 43, color: "bg-chart-5" }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6 m-0">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>Interactive Analytics Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive data visualization with interactive charts and real-time updates
                </CardDescription>
              </div>
              <AskLeoButton 
                chartTitle="Interactive Analytics Dashboard"
                chartDescription="Comprehensive data visualization with interactive charts and real-time updates"
              />
            </CardHeader>
            <CardContent>
              <ChartAreaInteractive />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6 m-0">
          <Card>
            <CardHeader>
              <CardTitle>Image Management</CardTitle>
              <CardDescription>
                Manage medical education images stored locally. Browse and organize your image library.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageManager 
                allowedCategories={['hero', 'educational', 'professional', 'modern', 'custom']}
                maxFileSize={10 * 1024 * 1024} // 10MB
                allowedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6 m-0">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
                <CardDescription>Create custom reports for different time periods and metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <select className="w-full p-2 border rounded-md bg-background">
                    <option>Placement Analytics</option>
                    <option>Student Performance</option>
                    <option>Partner Metrics</option>
                    <option>Financial Summary</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Period</label>
                  <select className="w-full p-2 border rounded-md bg-background">
                    <option>Last 30 Days</option>
                    <option>Last Quarter</option>
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Automatically generated reports and their schedules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Weekly Summary", schedule: "Every Monday", next: "12/23/2024" },
                  { name: "Monthly Analytics", schedule: "1st of Month", next: "01/01/2025" },
                  { name: "Quarterly Review", schedule: "End of Quarter", next: "03/31/2025" }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.schedule}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Next:</p>
                      <p className="text-sm font-medium">{report.next}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}