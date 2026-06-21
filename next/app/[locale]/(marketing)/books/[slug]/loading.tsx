export default function Loading() {
  return (
    <div className="relative overflow-hidden py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12">
          {/* Cover Skeleton */}
          <div className="md:col-span-1">
            <div className="sticky top-20">
              {/* Cover Image */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-200 animate-pulse mb-6"></div>

              {/* Stats Skeleton */}
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-neutral-100 p-4 rounded-lg animate-pulse"
                  >
                    <div className="h-3 bg-neutral-300 rounded w-1/3 mb-3"></div>
                    <div className="h-6 bg-neutral-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="md:col-span-2">
            {/* Title and Author */}
            <div className="mb-8">
              <div className="h-12 bg-neutral-200 rounded-lg mb-3 animate-pulse"></div>
              <div className="h-6 bg-neutral-200 rounded-lg w-1/2 animate-pulse"></div>
            </div>

            {/* Genres */}
            <div className="mb-8">
              <div className="h-4 bg-neutral-200 rounded w-1/4 mb-3 animate-pulse"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-neutral-200 rounded-full w-20 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <div className="h-4 bg-neutral-200 rounded w-1/3 mb-3 animate-pulse"></div>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-neutral-200 rounded w-full mb-2 animate-pulse"
                ></div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="h-4 bg-neutral-200 rounded w-1/3 mb-3 animate-pulse"></div>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-neutral-200 rounded w-full mb-2 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
