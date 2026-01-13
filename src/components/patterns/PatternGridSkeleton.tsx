'use client'

export function PatternGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-zinc-200 rounded-lg overflow-hidden bg-white animate-pulse"
        >
          <div className="aspect-square w-full bg-zinc-100" />
          <div className="p-4">
            <div className="h-5 bg-zinc-200 rounded mb-2 w-3/4" />
            <div className="h-4 bg-zinc-100 rounded mb-1 w-full" />
            <div className="h-4 bg-zinc-100 rounded mb-4 w-2/3" />
            <div className="flex items-center justify-between">
              <div className="h-4 bg-zinc-200 rounded w-16" />
              <div className="h-6 bg-zinc-200 rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
