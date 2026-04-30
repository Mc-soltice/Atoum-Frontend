"use client";

import { useProducts } from "@/contexte/ProductContext";
import { Product } from "@/types/product";
import SameProductCarousel from "@/components/customer/products/SameProductCarousel";
import { useEffect, useState } from "react";

interface SimilarProductsWrapperProps {
  productId: string;
}

export default function SimilarProductsWrapper({ productId }: SimilarProductsWrapperProps) {
  const { currentProduct, products, loading, fetchProductById, fetchProducts } = useProducts();
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Charger le produit actuel et tous les produits
    fetchProductById(productId);
    fetchProducts();
  }, [productId, fetchProductById, fetchProducts]);

  // Calculer les produits similaires quand les données sont chargées
  useEffect(() => {
    if (currentProduct && products.length > 0) {
      const similar = products
        .filter(
          (p) =>
            p.category?.id === currentProduct.category?.id &&
            p.id !== currentProduct.id
        )
        .slice(0, 6); // Limiter à 6 produits
      setSimilarProducts(similar);
    }
  }, [currentProduct, products]);

  // Ne rien afficher pendant le chargement ou s'il n'y a pas de produits similaires
  if (loading || similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-12 pt-8 border-t border-gray-200">
      <SameProductCarousel
        slides={similarProducts}
        title="Consultez nos produits similaires"
      />
    </div>
  );
}