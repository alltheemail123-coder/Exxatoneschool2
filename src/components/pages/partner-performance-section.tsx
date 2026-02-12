"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AskLeoButton } from "../ask-leo-button";
import { Building2, TrendingUp, Clock, Star } from "lucide-react";

// Partner performance data
const partnerPerformanceData = [
  { name: "Mayo Clinic", placements: 45, responseRate: 92, satisfaction: 4.8 },
  { name: "Johns Hopkins", placements: 52, responseRate: 88, satisfaction: 4.7 },
  { name: "Cleveland Clinic", placements: 38, responseRate: 95, satisfaction: 4.9 },
  { name: "Mass General", placements: 41, responseRate: 85, satisfaction: 4.5 },
  { name: "Stanford Health", placements: 31, responseRate: 90, satisfaction: 4.6 },
  { name: "UCSF Medical", placements: 35, responseRate: 87, satisfaction: 4.4 },
];

// Response time data
const responseTimeData = [
  { name: "Mayo Clinic", avgDays: 2.1 },
  { name: "Johns Hopkins", avgDays: 3.4 },
  { name: "Cleveland Clinic", avgDays: 1.8 },
  { name: "Mass General", avgDays: 4.2 },
  { name: "Stanford Health", avgDays: 2.9 },
  { name: "UCSF Medical", avgDays: 3.1 },
];

export function PartnerPerformanceSection() {
  return (
    <div className="px-4 lg:px-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold">Site Partner Performance</h3>
        <p className="text-muted-foreground mt-1">
          How your top site partners are performing this cycle
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Placements by Partner */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Placements by Partner</CardTitle>
              <CardDescription>Active placements at top sites</CardDescription>
            </div>
            <AskLeoButton
              chartTitle="Placements by Partner"
              chartDescription="Active placements at top sites"
              chartData={partnerPerformanceData
                .map((d) => `${d.name}: ${d.placements}`)
                .join(", ")}
            />
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={partnerPerformanceData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="placements"
                    fill="var(--chart-1)"
                    radius={[0, 4, 4, 0]}
                    name="Placements"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Average Response Time */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Average Response Time</CardTitle>
              <CardDescription>Days to respond to placement requests</CardDescription>
            </div>
            <AskLeoButton
              chartTitle="Average Response Time"
              chartDescription="Days to respond to placement requests"
              chartData={responseTimeData
                .map((d) => `${d.name}: ${d.avgDays} days`)
                .join(", ")}
            />
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={responseTimeData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    unit=" days"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} days`, "Avg Response"]}
                  />
                  <Bar
                    dataKey="avgDays"
                    fill="var(--chart-2)"
                    radius={[0, 4, 4, 0]}
                    name="Avg Response Days"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sidebar flex items-center justify-center">
                <Building2 className="w-4 h-4 text-chart-1" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-bold">48</div>
                <div className="text-xs text-muted-foreground">Active Partners</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sidebar flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-chart-2" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-xs text-muted-foreground">Avg Response Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sidebar flex items-center justify-center">
                <Clock className="w-4 h-4 text-chart-4" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-bold">2.9d</div>
                <div className="text-xs text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sidebar flex items-center justify-center">
                <Star className="w-4 h-4 text-chart-3" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-bold">4.6</div>
                <div className="text-xs text-muted-foreground">Avg Satisfaction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
