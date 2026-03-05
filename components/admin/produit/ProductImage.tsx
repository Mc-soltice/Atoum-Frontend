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

  // Image absente
  if (!src || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
        <span className="text-xs text-gray-500">No image</span>
      </div>
    );
  }

// Version avec configuration centralisée
const TUNNEL_DOMAINS = [
  "trycloudflare.com",
];

const isTunnelImage = TUNNEL_DOMAINS.some(domain => src.includes(domain));

return (
  <div className="relative w-full h-full">
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      unoptimized={isTunnelImage}
      onError={() => setHasError(true)}
      loading="lazy"
      quality={75}
    />
  </div>
);
