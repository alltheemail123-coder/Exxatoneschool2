"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { AskLeoButton } from "./ask-leo-button"

// Enhanced mock data for healthcare placements
const generateMockData = () => {
  const data = []
  const now = new Date()
  const startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  
  for (let i = 0; i < 365; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    
    const baseCompleted = Math.floor(Math.random() * 15) + 5
    const baseActive = Math.floor(Math.random() * 25) + 10
    const basePending = Math.floor(Math.random() * 8) + 2
    
    const month = currentDate.getMonth()
    const seasonalMultiplier = (month >= 8 && month <= 11) || (month >= 0 && month <= 4) ? 1.3 : 0.8
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      completed: Math.floor(baseCompleted * seasonalMultiplier),
      active: Math.floor(baseActive * seasonalMultiplier),
      pending: Math.floor(basePending * seasonalMultiplier),
      location: getRandomLocation(),
      discipline: getRandomDiscipline(),
    })
  }
  
  return data
}

const getRandomLocation = () => {
  const locations = ["mayo-clinic", "johns-hopkins", "cleveland-clinic", "stanford-medical", "ucla-medical", "mount-sinai", "boston-children"]
  return locations[Math.floor(Math.random() * locations.length)]
}

const getRandomDiscipline = () => {
  const disciplines = ["internal-medicine", "surgery", "pediatrics", "cardiology", "neurology", "emergency-medicine", "radiology", "anesthesiology"]
  return disciplines[Math.floor(Math.random() * disciplines.length)]
}

const locationMultipliers = {
  "mayo-clinic": { completed: 1.4, active: 1.5, pending: 1.2 },
  "johns-hopkins": { completed: 1.3, active: 1.4, pending: 1.1 },
  "cleveland-clinic": { completed: 1.2, active: 1.3, pending: 1.0 },
  "stanford-medical": { completed: 1.1, active: 1.2, pending: 0.9 },
  "ucla-medical": { completed: 1.0, active: 1.1, pending: 0.8 },
  "mount-sinai": { completed: 0.9, active: 1.0, pending: 0.7 },
  "boston-children": { completed: 0.8, active: 0.9, pending: 0.6 },
}

const disciplineMultipliers = {
  "internal-medicine": { completed: 1.5, active: 1.6, pending: 1.3 },
  "surgery": { completed: 1.2, active: 1.3, pending: 1.4 },
  "pediatrics": { completed: 1.1, active: 1.2, pending: 1.1 },
  "cardiology": { completed: 1.0, active: 1.1, pending: 1.2 },
  "neurology": { completed: 0.9, active: 1.0, pending: 1.0 },
  "emergency-medicine": { completed: 1.3, active: 1.4, pending: 1.1 },
  "radiology": { completed: 0.8, active: 0.9, pending: 0.8 },
  "anesthesiology": { completed: 0.7, active: 0.8, pending: 0.7 },
}

const chartData = generateMockData()

const chartConfig = {
  placements: {
    label: "Placement Requests",
  },
  completed: {
    label: "Approved Placements",
    color: "hsl(var(--chart-2))",
  },
  active: {
    label: "Students in Rotation",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending Approvals",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

const locationOptions = [
  { value: "all", label: "All Locations" },
  { value: "mayo-clinic", label: "Mayo Clinic" },
  { value: "johns-hopkins", label: "Johns Hopkins" },
  { value: "cleveland-clinic", label: "Cleveland Clinic" },
  { value: "stanford-medical", label: "Stanford Medical" },
  { value: "ucla-medical", label: "UCLA Medical Center" },
  { value: "mount-sinai", label: "Mount Sinai Hospital" },
  { value: "boston-children", label: "Boston Children's Hospital" },
]

const disciplineOptions = [
  { value: "all", label: "All Disciplines" },
  { value: "internal-medicine", label: "Internal Medicine" },
  { value: "surgery", label: "Surgery" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "emergency-medicine", label: "Emergency Medicine" },
  { value: "radiology", label: "Radiology" },
  { value: "anesthesiology", label: "Anesthesiology" },
]

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [location, setLocation] = React.useState("all")
  const [discipline, setDiscipline] = React.useState("all")

  const filteredData = React.useMemo(() => {
    let data = chartData.filter((item) => {
      const date = new Date(item.date)
      const now = new Date()
      let daysToSubtract = 90
      if (timeRange === "30d") {
        daysToSubtract = 30
      } else if (timeRange === "7d") {
        daysToSubtract = 7
      } else if (timeRange === "12m") {
        daysToSubtract = 365
      }
      const startDate = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000)
      return date >= startDate
    })

    return data.map(item => {
      let multiplier = { completed: 1, active: 1, pending: 1 }
      
      if (location !== "all" && locationMultipliers[location as keyof typeof locationMultipliers]) {
        const locMult = locationMultipliers[location as keyof typeof locationMultipliers]
        multiplier.completed *= locMult.completed
        multiplier.active *= locMult.active
        multiplier.pending *= locMult.pending
      }
      
      if (discipline !== "all" && disciplineMultipliers[discipline as keyof typeof disciplineMultipliers]) {
        const discMult = disciplineMultipliers[discipline as keyof typeof disciplineMultipliers]
        multiplier.completed *= discMult.completed
        multiplier.active *= discMult.active
        multiplier.pending *= discMult.pending
      }
      
      const shouldInclude = 
        (location === "all" || Math.random() > 0.3) &&
        (discipline === "all" || Math.random() > 0.4)
      
      if (!shouldInclude) {
        return {
          ...item,
          completed: Math.floor(item.completed * 0.2),
          active: Math.floor(item.active * 0.2),
          pending: Math.floor(item.pending * 0.2),
        }
      }
      
      return {
        ...item,
        completed: Math.floor(item.completed * multiplier.completed),
        active: Math.floor(item.active * multiplier.active),
        pending: Math.floor(item.pending * multiplier.pending),
      }
    })
  }, [timeRange, location, discipline])

  const totalCompleted = filteredData.reduce((sum, item) => sum + item.completed, 0)
  const totalActive = filteredData.reduce((sum, item) => sum + item.active, 0)
  const totalPending = filteredData.reduce((sum, item) => sum + item.pending, 0)

  return (
    <Card className="bg-card">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Student Placements Overview</CardTitle>
          <CardDescription>
            Showing placement trends and completion rates
            {(location !== "all" || discipline !== "all") && (
              <span className="block mt-1 text-chart-1">
                {totalCompleted} completed • {totalActive} active • {totalPending} pending
              </span>
            )}
          </CardDescription>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:ml-auto">
          <AskLeoButton 
            chartTitle="Interactive Analytics Dashboard"
            chartDescription="Healthcare placement volumes across locations and disciplines"
          />

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Select location"
            >
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {locationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-lg">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={discipline} onValueChange={setDiscipline}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Select discipline"
            >
              <SelectValue placeholder="All Disciplines" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {disciplineOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-lg">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="12m" className="rounded-lg">
                Last 12 months
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={4}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                indicator="dot" 
                labelFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                }}
              />}
            />
            <Area
              dataKey="pending"
              type="natural"
              fill="var(--color-pending)"
              fillOpacity={0.4}
              stroke="var(--color-pending)"
              stackId="a"
            />
            <Area
              dataKey="active"
              type="natural"
              fill="var(--color-active)"
              fillOpacity={0.4}
              stroke="var(--color-active)"
              stackId="a"
            />
            <Area
              dataKey="completed"
              type="natural"
              fill="var(--color-completed)"
              fillOpacity={0.4}
              stroke="var(--color-completed)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
