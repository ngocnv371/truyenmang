export default function Loading() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-pink-400 to-red-500 opacity-20 blur-3xl"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="py-10 md:pt-40 text-center mb-12">
          {/* Icon Skeleton */}
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-neutral-200 rounded-full animate-pulse"></div>
          </div>
          {/* Heading Skeleton */}
          <div className="h-10 bg-neutral-200 rounded-lg max-w-md mx-auto mb-4 animate-pulse"></div>
          {/* Subheading Skeleton */}
          <div className="h-6 bg-neutral-200 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
        </div>

        {/* Featured Books Skeleton */}
        <div className="py-12">
          <div className="h-8 bg-neutral-200 rounded-lg w-40 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden bg-neutral-100 animate-pulse"
              >
                <div className="aspect-[3/4] bg-neutral-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-neutral-300 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-300 rounded mb-4 w-2/3"></div>
                  <div className="h-3 bg-neutral-300 rounded mb-3"></div>
                  <div className="h-3 bg-neutral-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Books Skeleton */}
        <div className="py-12">
          <div className="h-8 bg-neutral-200 rounded-lg w-40 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden bg-neutral-100 animate-pulse"
              >
                <div className="aspect-[3/4] bg-neutral-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-neutral-300 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-300 rounded mb-4 w-2/3"></div>
                  <div className="h-3 bg-neutral-300 rounded mb-3"></div>
                  <div className="h-3 bg-neutral-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
