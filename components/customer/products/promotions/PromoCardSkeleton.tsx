"use client";

export default function PromoCardSkeleton() {
  return (
    <div
      className="
      skeleton
      relative h-105 w-75 rounded-xl bg-gray-200/50 
      animate-pulse flex flex-col overflow-hidden
    "
    >
      {/* Image */}
      <div className="h-[60%] w-full bg-gray-300 rounded-xl"></div>

      {/* Contenu */}
      <div className="flex flex-col flex-1 min-h-0 p-5">
        {/* Nom */}
        <div className="h-5 w-3/4 bg-gray-300 rounded mb-2"></div>

        {/* Description */}
        <div className="h-4 w-full bg-gray-300 rounded mb-1"></div>
        <div className="h-4 w-5/6 bg-gray-300 rounded mb-3"></div>

        {/* Prix */}
        <div className="h-5 w-1/2 bg-gray-300 rounded mb-3"></div>

        {/* Bouton */}
        <div className="mt-auto">
          <div className="h-10 w-full bg-gray-300 rounded-xl flex items-center justify-center gap-2"></div>
        </div>
      </div>
    </div>
  );
}
