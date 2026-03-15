
"use client";

import ProductImage from "@/components/admin/produit/ProductImage";
import { useCart } from "@/contexte/panier/CartContext";
import { ProductPromo } from "@/types/product";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface Props {
  product: ProductPromo;
  onCartClick?: () => void;
}

export default function PromoCard({ product, onCartClick }: Props) {
  const isAvailable = product.stock > 0;

  const hasDiscount =
    product.original_price && product.original_price > product.price;

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!isAvailable) return;

    addToCart(product, 1);

    if (onCartClick) {
      onCartClick();
    }
  };

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-xl
        bg-white/80
        backdrop-blur-xl
        shadow-lg
        transition-all
        duration-500
        hover:shadow-2xl
        flex
        flex-col
        w-full
        max-w-sm
        mx-auto
        border
        border-gray-100
      "
    >
      {/* Ligne principale : Image + Infos */}
      <div className="flex flex-row p-4 gap-4">

        {/* Image produit */}
        <div className="shrink-0">
          <Link
            href={`/produits/${product.id}`}
            aria-label={`Voir les détails de ${product.name}`}
            className="
              relative
              w-36
              h-36
              md:w-32
              md:h-32
              overflow-hidden
              rounded-lg
              cursor-pointer
              block
              shrink-0
            "
          >
            <ProductImage
              src={product.main_image}
              alt={product.name}
              className="
                object-cover
                transition-opacity
                duration-300
                group-hover:opacity-90
              "
            />

            {/* Badge promotion */}
            {hasDiscount && (
              <span
                className="
                  absolute
                  top-2
                  left-2
                  px-2
                  py-1
                  rounded-md
                  text-xs
                  font-bold
                  text-white
                  bg-red-500/90
                  backdrop-blur
                  shadow-sm
                  z-10
                "
              >
                PROMO
              </span>
            )}
          </Link>
        </div>

        {/* Informations produit */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h2>

          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>

          {/* Prix */}
          <div className="space-y-1">
            {hasDiscount ? (
              <>
                {/* Prix original */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-sm text-gray-500 line-through">
                    {product.original_price?.toLocaleString()} €
                  </span>

                  <span className="text-xs font-semibold px-1.5 py-0.5 bg-red-100 text-red-600 rounded">
                    -
                    {(
                      ((product.original_price! - product.price) /
                        product.original_price!) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </div>

                {/* Prix promo */}
                <div className="text-lg font-bold text-red-600">
                  {product.price.toLocaleString()} €
                </div>
              </>
            ) : (
              <div className="text-base font-bold text-gray-900">
                {product.price.toLocaleString()} €
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bouton Ajouter au panier */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          aria-disabled={!isAvailable}
          className={`
            w-full
            py-3
            rounded-lg
            text-sm
            font-medium
            transition-all
            duration-200
            flex
            items-center
            justify-center
            gap-2
            shadow-md
            hover:shadow-lg
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${isAvailable
              ? "bg-linear-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 active:scale-[0.98]"
              : "bg-gray-200 text-gray-600"
            }
          `}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>
            {isAvailable ? "Ajouter au panier" : "Indisponible"}
          </span>
        </button>
      </div>
    </div>
  );
}
