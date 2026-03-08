import { categoryService } from "@/services/cat.service";
import { productService } from "@/services/product.service";

export async function getProducts() {
  try {
    const products = await productService.getAll();
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled;
  } catch (error) {
    console.error("Erreur SSR produits:", error);
    return [];
  }
}

export async function getProductsAndCategories() {
  try {
    const [products, categories] = await Promise.all([
      productService.getAll(),
      categoryService.getAll(),
    ]);

    return { products, categories };
  } catch (error) {
    console.error("Erreur SSR produits et catégories:", error);
    return { products: [], categories: [] };
  }
}