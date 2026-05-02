/**
 * Loading Skeleton Components — OpsPulse Theme
 * Reusable skeleton loaders matching the dark theme
 */

/** Card skeleton with OpsPulse styling */
export const CardSkeleton = ({ count = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-4 animate-pulse"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-white/[0.06] rounded w-1/3" />
            <div className="h-2 bg-white/[0.04] rounded w-1/2" />
          </div>
          <div className="w-16 h-5 bg-white/[0.06] rounded-full" />
        </div>
      </div>
    ))}
  </div>
)

/** Stat card skeleton */
export const StatSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-4 animate-pulse"
      >
        <div className="w-8 h-8 rounded-lg bg-white/[0.06] mb-3" />
        <div className="h-8 bg-white/[0.06] rounded w-1/2 mb-2" />
        <div className="h-2 bg-white/[0.04] rounded w-2/3 mb-2" />
        <div className="h-2 bg-white/[0.04] rounded w-1/3" />
      </div>
    ))}
  </div>
)

/** Full page skeleton */
export const PageSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-2">
        <div className="h-6 bg-white/[0.06] rounded w-48" />
        <div className="h-3 bg-white/[0.04] rounded w-32" />
      </div>
      <div className="flex gap-2">
        <div className="w-28 h-8 bg-white/[0.06] rounded-full" />
        <div className="w-28 h-8 bg-white/[0.06] rounded-full" />
      </div>
    </div>
    <StatSkeleton />
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <div className="h-64 bg-[#0b0d18] border border-white/[0.07] rounded-lg" />
      <div className="h-64 bg-[#0b0d18] border border-white/[0.07] rounded-lg" />
    </div>
  </div>
)

export default CardSkeleton
