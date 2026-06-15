"use client";

import { useCart } from "@/contexte/panier/CartContext";
import { Product } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle,
  CirclePlus,
  Package,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useState } from "react";

interface Props {
  product: Product;
  onCartClick?: () => void;
  priority?: boolean;
}

export default memo(function ProductCard({
  product,
  onCartClick,
  priority = false,
}: Props) {
  const isAvailable = product.stock > 0;
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = useCallback(async () => {
    if (!isAvailable || isAdding) return;

    setIsAdding(true);

    // Simulation d'une légère animation de chargement
    await new Promise((resolve) => setTimeout(resolve, 300));

    addToCart(product, 1);
    setShowSuccess(true);
    onCartClick?.();

    // Reset après 1.5 secondes
    setTimeout(() => {
      setShowSuccess(false);
      setIsAdding(false);
    }, 1500);
  }, [isAvailable, isAdding, product, addToCart, onCartClick]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
    >
      {/* Barre de progression */}
      <motion.div
        className="absolute top-0 left-0 h-0.5 bg-[#8BC34A] z-20"
        initial={{ width: "0%" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <Link
        href={`/produits/${product.id}`}
        className="relative aspect-square w-full overflow-hidden"
      >
        <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/5 transition-colors z-10" />

        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}

        <Image
          src={product.main_image}
          alt={product.name}
          width={400}
          height={400}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setImageLoaded(true)}
          className={`object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20">
          <div
            className={`flex items-center gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 backdrop-blur-sm rounded-full text-white shadow-lg ${
              isAvailable ? "bg-[#8BC34A]/70" : "bg-gray-600/95"
            }`}
          >
            {isAvailable ? (
              <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 animate-pulse" />
            ) : (
              <Package className="w-2 h-2 sm:w-3 sm:h-3" />
            )}
            <span className="text-[10px] sm:text-xs font-semibold">
              {isAvailable ? "Stock" : "Rupture"}
            </span>
          </div>
        </div>
      </Link>

      {/* Contenu */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
            <span className="w-4 h-px bg-[#8BC34A] group-hover:w-6 transition-all" />
            {product.category?.name}
          </p>

          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate group-hover:translate-x-1 transition">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-[#8BC34A] tabular-nums">
              {product.price.toLocaleString()}
            </span>
            <span className="text-base text-gray-400">€</span>
          </div>

          {/* Bouton amélioré */}
          <AnimatePresence mode="wait">
            {!isAvailable ? (
              <motion.button
                key="disabled"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                disabled
                className="rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 cursor-not-allowed"
              >
                <span className="text-xs sm:text-sm font-medium text-gray-500">
                  Indisponible
                </span>
              </motion.button>
            ) : showSuccess ? (
              <motion.button
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-full px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500 cursor-default"
              >
                <motion.div
                  initial={{ rotate: -180 }}
                  animate={{ rotate: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  <span className="text-xs sm:text-sm font-medium text-white">
                    Ajouté !
                  </span>
                </motion.div>
              </motion.button>
            ) : (
              <motion.button
                key="add"
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAdding}
                className="relative overflow-hidden rounded-full group/btn"
              >
                <motion.div
                  animate={isAdding ? { opacity: 0.7 } : { opacity: 1 }}
                  className={`relative px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
                    isAvailable
                      ? "text-white bg-linear-to-r from-[#8BC34A] to-[#7CB342] hover:shadow-md"
                      : "text-gray-400 bg-gray-100"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                      >
                        <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                      </motion.div>
                      <span>Ajout...</span>
                    </>
                  ) : (
                    <>
                      <CirclePlus className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/btn:rotate-90" />
                      <span>Ajouter</span>
                    </>
                  )}
                </motion.div>

                {/* Effet de ripple au clic */}
                {isAdding && (
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Indicateur de livraison rapide */}
        {isAvailable && product.stock > 10 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-green-600 flex items-center gap-1 mt-1"
          >
            <Check className="h-2 w-2" />
            Livraison express disponible
          </motion.p>
        )}
      </div>
    </motion.div>
  );
});
