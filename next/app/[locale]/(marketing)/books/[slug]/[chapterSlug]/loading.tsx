export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 animate-pulse">
      <div className="container mx-auto px-4 py-12">
        {/* Header skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
          <div className="h-8 w-2/3 bg-gray-700 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-700 rounded"></div>
          <div className="h-4 w-full bg-gray-700 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
          <div className="h-4 w-full bg-gray-700 rounded"></div>
          <div className="h-4 w-4/5 bg-gray-700 rounded"></div>
        </div>

        {/* Footer skeleton */}
        <div className="mt-12 flex justify-between">
          <div className="h-10 w-24 bg-gray-700 rounded"></div>
          <div className="h-10 w-24 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
