/**
 * Loading Skeleton Component
 * Reusable skeleton loaders for different content types
 */

export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-900 rounded p-4 animate-pulse">
          <div className="h-4 bg-gray-800 rounded w-3/4 mb-3" />
          <div className="h-3 bg-gray-800 rounded w-1/2" />
        </div>
      ))}
    </>
  )
}

export const TableRowSkeleton = ({ columns = 4, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="bg-gray-900 rounded p-4 mb-2 animate-pulse flex gap-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="flex-1 h-4 bg-gray-800 rounded" />
          ))}
        </div>
      ))}
    </>
  )
}

export const TextSkeleton = ({ lines = 3 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-800 rounded ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export const AvatarSkeleton = () => {
  return <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse" />
}

export default {
  CardSkeleton,
  TableRowSkeleton,
  TextSkeleton,
  AvatarSkeleton,
}
