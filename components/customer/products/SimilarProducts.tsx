// components/customer/product/SimilarProducts.tsx
import { Product } from "@/types/product";
import { productService } from "@/services/product.service";
import NaturePromoCarousel from "./SameProductCarousel";

interface SimilarProductsProps {
  currentProduct: Product;
}

export default async function SimilarProducts({ currentProduct }: SimilarProductsProps) {
  // Récupérer tous les produits
  const allProducts = await productService.getAll();

  // Filtrer les produits similaires (même catégorie, différent du produit courant)
  const similarProducts = allProducts.filter(
    product =>
      product.category?.id === currentProduct.category?.id &&
      product.id !== currentProduct.id
  );

  // Si pas assez de produits dans la même catégorie, ajouter d'autres produits aléatoires
  let finalProducts = [...similarProducts];

  if (finalProducts.length < 4) {
    const otherProducts = allProducts.filter(
      product =>
        product.category?.id !== currentProduct.category?.id &&
        product.id !== currentProduct.id
    );
    const needed = 4 - finalProducts.length;
    finalProducts = [...finalProducts, ...otherProducts.slice(0, needed)];
  }

  // Mélanger pour plus de variété
  const shuffled = [...finalProducts].sort(() => Math.random() - 0.5);

  if (shuffled.length === 0) return null;

  return <NaturePromoCarousel slides={shuffled} />;
}