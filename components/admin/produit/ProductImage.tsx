"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function ProductImage({
  src,
  alt,
  className = "object-cover rounded",
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  // Configuration centralisée des domaines qui nécessitent unoptimized=true
  const UNOPTIMIZED_DOMAINS = [
    "trycloudflare.com",
    "localhost",
    "127.0.0.1"
  ];

  // Image absente
  if (!src || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
        <span className="text-xs text-gray-500">No image</span>
      </div>
    );
  }

  // Vérification si l'image provient d'un domaine nécessitant unoptimized
  const needsUnoptimized =
    src.startsWith("http://localhost") ||
    src.startsWith("http://127.0.0.1") ||
    src.includes("trycloudflare.com");

  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        unoptimized={needsUnoptimized}
        onError={() => setHasError(true)}
        loading="lazy"
        quality={75}
      />
    </div>
  );
}