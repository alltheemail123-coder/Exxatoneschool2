"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AlertCircle, Clock, FileWarning, UserX, ArrowRight } from "lucide-react";

const alerts = [
  {
    id: 1,
    icon: AlertCircle,
    iconColor: "text-destructive",
    bgColor: "bg-destructive/10",
    title: "15 Schedules Unconfirmed",
    description: "Schedules starting within 7 days need confirmation",
    action: "Review Now",
    urgency: "high",
  },
  {
    id: 2,
    icon: Clock,
    iconColor: "text-chart-4",
    bgColor: "bg-chart-4/10",
    title: "23 Overdue Requests",
    description: "Requests pending approval for over 30 days",
    action: "View Requests",
    urgency: "medium",
  },
  {
    id: 3,
    icon: FileWarning,
    iconColor: "text-chart-4",
    bgColor: "bg-chart-4/10",
    title: "95 Faculty Compliance Issues",
    description: "Faculty members with pending compliance items",
    action: "View Details",
    urgency: "medium",
  },
  {
    id: 4,
    icon: UserX,
    iconColor: "text-muted-foreground",
    bgColor: "bg-muted/50",
    title: "483 Pending First Login",
    description: "237 students and 246 faculty awaiting activation",
    action: "Send Reminder",
    urgency: "low",
  },
];

export function AlertsSection() {
  return (
    <div className="px-4 lg:px-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold">Alerts & Items Needing Attention</h3>
        <p className="text-muted-foreground mt-1">
          Critical items requiring immediate action
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className="group hover:shadow-md transition-all"
          >
            <CardContent className="p-5 flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg ${alert.bgColor} flex items-center justify-center`}
                >
                  <alert.icon className={`h-5 w-5 ${alert.iconColor}`} />
                </div>
              </div>
              <h4 className="font-semibold mb-2 text-[14px]">
                {alert.title}
              </h4>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed flex-1">
                {alert.description}
              </p>
              <Button
                size="sm"
                variant={alert.urgency === "high" ? "default" : "ghost"}
                className="w-full mt-auto"
              >
                {alert.action}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
