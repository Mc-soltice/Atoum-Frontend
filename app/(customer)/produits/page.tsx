// app/produits/page.tsx
import { Metadata } from "next";
import { getProductsAndCategories } from "@/server/product.server";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Nos produits | Votre Boutique",
  description: "Découvrez tous nos produits naturels et bio",
};

export default async function ProductsPage() {
  // Récupération des données côté serveur
  const { products, categories } = await getProductsAndCategories();

  return (
    <ProductsClient
      initialProducts={products}
      initialCategories={categories}
    />
  );
}