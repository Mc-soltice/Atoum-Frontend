import ProductCardSkeleton from "@/components/customer/products/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Skeletons des bulles de navigation */}
      <div className="flex justify-center gap-4 md:gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="relative">
          <div className="flex items-center gap-3 px-6 py-3 bg-gray-200 rounded-full shadow-lg w-40 h-12 animate-pulse"></div>
        </div>
      ))}
    </div>

    {/* Grille de skeletons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  </div>
);
  }