"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import { AskLeoButton } from "../shared/ask-leo-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { format } from "date-fns";
import { pipelineData, onboardingData } from "../../data/dashboard-data";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  // Hide label for segments with 0% or very small values
  if (percent < 0.01) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="oklch(1 0 0)" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="text-sm font-semibold"
      style={{
        textShadow: '0 1px 2px oklch(0 0 0 / 0.3)',
        pointerEvents: 'none'
      }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function PipelineOverviewSection() {
  const [dateRange, setDateRange] = React.useState("30");
  const [customStartDate, setCustomStartDate] = React.useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = React.useState<Date | undefined>();
  const [showCustomDatePicker, setShowCustomDatePicker] = React.useState(false);

  return (
    <div className="px-4 lg:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Pipeline Overview</h3>
          <p className="text-muted-foreground mt-1">
            Current status of schedules and student onboarding
          </p>
        </div>
        
        {/* Duration Filter */}
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(value) => {
            setDateRange(value);
            if (value !== "custom") {
              setShowCustomDatePicker(false);
            }
          }}>
            <SelectTrigger className="w-[180px] h-9 bg-transparent">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom date range</SelectItem>
            </SelectContent>
          </Select>
          
          {dateRange === "custom" && (
            <Popover open={showCustomDatePicker} onOpenChange={setShowCustomDatePicker}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Calendar className="h-4 w-4 mr-2" />
                  {customStartDate && customEndDate
                    ? `${format(customStartDate, "MM/dd/yyyy")} - ${format(customEndDate, "MM/dd/yyyy")}`
                    : "Pick dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Date</label>
                    <CalendarComponent
                      mode="single"
                      selected={customStartDate}
                      onSelect={setCustomStartDate}
                      initialFocus
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End Date</label>
                    <CalendarComponent
                      mode="single"
                      selected={customEndDate}
                      onSelect={setCustomEndDate}
                      disabled={(date) => customStartDate ? date < customStartDate : false}
                    />
                  </div>
                  <Button 
                    onClick={() => setShowCustomDatePicker(false)} 
                    className="w-full"
                    disabled={!customStartDate || !customEndDate}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Schedule Pipeline Overview */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Schedule Pipeline Overview</CardTitle>
              <CardDescription>Current schedule status breakdown</CardDescription>
            </div>
            <AskLeoButton 
              chartTitle="Schedule Pipeline Overview"
              chartDescription="Current schedule status breakdown"
              chartData="To Be Scheduled: 11, Confirmed: 2, Not Confirmed: 0, Cancelled: 0"
            />
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pipelineData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}:</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Onboarding Overview */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Student Onboarding Overview</CardTitle>
              <CardDescription>Compliance status breakdown</CardDescription>
            </div>
            <AskLeoButton 
              chartTitle="Student Onboarding Overview"
              chartDescription="Compliance status breakdown"
              chartData="Compliant: 745, Pending Documents: 186, Expired Credentials: 92, Not Started: 211"
            />
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={onboardingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {onboardingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {onboardingData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}:</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}