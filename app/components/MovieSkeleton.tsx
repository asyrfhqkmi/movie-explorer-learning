'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function MovieSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image Skeleton */}
      <CardHeader className="p-0">
        <Skeleton className="h-64 w-full rounded-none" />
      </CardHeader>

      {/* Content Skeleton */}
      <CardContent className="p-4">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-full mb-3" />

        {/* Rating and Year Skeleton */}
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Description Skeleton */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />

        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}