"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AskLeoButton } from "../ask-leo-button";

// Pending Items by Age
const requestsAgeData = [
  { age: "<7 days", count: 142 },
  { age: "7-15 days", count: 98 },
  { age: "16-30 days", count: 123 },
  { age: ">30 days", count: 123 },
];

const schedulesAgeData = [
  { age: "<7 days", count: 28 },
  { age: "7-15 days", count: 15 },
  { age: "16-30 days", count: 8 },
  { age: ">30 days", count: 5 },
];

export function PendingItemsSection() {
  return (
    <div className="px-4 lg:px-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold">Pending Items by Age</h3>
        <p className="text-muted-foreground mt-1">
          How long items have been waiting for action
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Requests Pending Approval</CardTitle>
              <CardDescription>Age distribution of pending requests</CardDescription>
            </div>
            <AskLeoButton 
              chartTitle="Requests Pending Approval"
              chartDescription="Age distribution of pending requests"
              chartData="<7 days: 142, 7-15 days: 98, 16-30 days: 123, >30 days: 123"
            />
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestsAgeData} barCategoryGap="30%">
                  <XAxis 
                    dataKey="age" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: '12px'
                    }}
                    cursor={{ fill: 'var(--muted)' }}
                  />
                  <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Schedules Pending Confirmation</CardTitle>
              <CardDescription>Age distribution of unconfirmed schedules</CardDescription>
            </div>
            <AskLeoButton 
              chartTitle="Schedules Pending Confirmation"
              chartDescription="Age distribution of unconfirmed schedules"
              chartData="<7 days: 28, 7-15 days: 15, 16-30 days: 8, >30 days: 5"
            />
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={schedulesAgeData} barCategoryGap="30%">
                  <XAxis 
                    dataKey="age" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: '12px'
                    }}
                    cursor={{ fill: 'var(--muted)' }}
                  />
                  <Bar dataKey="count" fill="var(--chart-4)" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
