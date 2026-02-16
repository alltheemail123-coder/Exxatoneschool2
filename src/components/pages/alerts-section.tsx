"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { alertsData } from "../../data/dashboard-data";

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
        {alertsData.map((alert) => (
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