"use client";

import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";

export default function ProductCardSkeleton() {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-pulse">
      {/* Barre de progression fantôme */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-100 z-20">
        <div className="h-full bg-gray-200 w-0" />
      </div>

      {/* Zone image skeleton */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
        {/* Badge skeleton */}
        <div className="absolute top-3 left-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gray-300 rounded-full blur-md opacity-50" />
            <div className="relative px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-400 border border-gray-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span className="bg-gray-300 h-3 w-16 rounded"></span>
            </div>
          </div>
        </div>

        {/* Indicateur de swipe skeleton */}
        <div className="absolute bottom-3 right-3 opacity-30">
          <div className="bg-gray-100 rounded-full p-2 shadow-lg">
            <div className="w-4 h-4 bg-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* Contenu skeleton */}
      <div className="p-4 flex flex-col gap-3">
        {/* Catégorie skeleton */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-4 h-px bg-gray-200" />
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>

          {/* Nom du produit skeleton (2 lignes) */}
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Prix et bouton skeleton */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1">
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
            <div className="h-3 w-3 bg-gray-200 rounded"></div>
          </div>

          {/* Bouton skeleton */}
          <div className="relative overflow-hidden rounded-full opacity-50">
            <div className="relative px-4 py-2 text-sm font-medium flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay de chargement optionnel */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <Waveform size="30" stroke="3" speed="1" color="#f59e0b" />
      </div>
    </div>
  );
}