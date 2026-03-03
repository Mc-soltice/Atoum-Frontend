"use client";

import ProductImage from "@/components/admin/produit/ProductImage";
import { useCart } from "@/contexte/panier/CartContext";
import { Product } from "@/types/product";
import { Minus, Plus, Trash } from "lucide-react";

interface Props {
  product: Product;
  quantity: number;
}

export default function CartItem({ product, quantity }: Props) {
  const { addToCart, removeFromCart, updateQuantity } = useCart();

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleIncrease = () => {
    addToCart(product, 1);
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm md:items-center md:gap-4 md:p-4 md:rounded-xl">
      {/* Image */}
      <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 md:h-20 md:w-20">
        {/* <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 64px, 80px"
        /> */}
        <ProductImage src={product.main_image} alt={product.name} />
      </div>

      {/* Infos */}
      <div className="flex-1 space-y-1.5 md:space-y-2">
        {/* Nom + prix total */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 md:text-sm">
            {product.name}
          </h3>

          <span className="text-xs font-bold text-red-600 whitespace-nowrap md:text-sm">
            {(product.price * quantity).toLocaleString()}€
          </span>
        </div>

        {/* Catégorie + prix unitaire */}
        <div className="flex justify-between text-xs text-gray-600">
          <span className="text-gray-500">{product.category?.name}</span>
          <span className="text-gray-500">
            {product.price.toLocaleString()}€ / unité
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-1">
          {/* Supprimer */}
          <button
            onClick={handleRemove}
            className="text-xs text-red-600 hover:text-red-700 active:text-red-800 
                       flex items-center gap-1.5 p-1 -ml-1 rounded-md transition-colors
                       hover:bg-red-50 active:bg-red-100"
            aria-label={`Supprimer ${product.name} du panier`}
          >
            <Trash size={14} />
            <span className="hidden xs:inline">Supprimer</span>
          </button>

          {/* Quantité */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={handleDecrease}
              className="h-8 w-8 rounded-full border flex items-center justify-center 
                         hover:bg-gray-100 active:bg-gray-200 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-400"
              aria-label={`Diminuer la quantité de ${product.name}`}
            >
              <Minus size={14} />
            </button>

            <span className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 min-w-10 text-center text-gray-500">
              {quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="h-8 w-8 rounded-full border flex items-center justify-center 
                         hover:bg-gray-100 active:bg-gray-200 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-400"
              aria-label={`Augmenter la quantité de ${product.name}`}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
