"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ─── Stats Cards Skeleton ───────────────────────────────────────
export function StatsCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Table Skeleton ─────────────────────────────────────────────
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex gap-3">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-[180px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex gap-4 pb-2 border-b border-border">
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton key={i} className="h-3 flex-1" />
            ))}
          </div>
          {/* Rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center py-2">
              {Array.from({ length: cols }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Chart Skeleton ─────────────────────────────────────────────
export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-end gap-2 pt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t-md"
              style={{ height: `${30 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Dashboard Full Skeleton ────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80 mt-2" />
      </div>
      {/* Stats */}
      <StatsCardsSkeleton />
      {/* Charts + Table */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartSkeleton />
          <TableSkeleton rows={5} cols={4} />
        </div>
        <div>
          <Card>
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-10 rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
