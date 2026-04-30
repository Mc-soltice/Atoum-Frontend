"use client";

import ProductImage from "@/components/admin/produit/ProductImage";
import { useCart } from "@/contexte/panier/CartContext";
import { useProducts } from "@/contexte/ProductContext";
import { Product } from "@/types/product";
import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";
import { Heart, Share2, Shield, ShoppingCart, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductClientProps {
  productId: string;
}

export default function ProductClient({ productId }: ProductClientProps) {
  const { fetchProductById, fetchProducts, currentProduct, products, loading } = useProducts();
  const { addToCart } = useCart();

  // Déclarez tous les hooks en haut
  const [hasFetched, setHasFetched] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProductById(productId).finally(() => setHasFetched(true));
    fetchProducts(); // Charger tous les produits
  }, [productId, fetchProductById, fetchProducts]);

  // Calculer les produits similaires
  useEffect(() => {
    if (currentProduct && products.length > 0) {
      const similar = products
        .filter(
          (p) =>
            p.category?.id === currentProduct.category?.id && p.id !== currentProduct.id
        )
        .slice(0, 6); // Limiter à 6 produits
      setSimilarProducts(similar);
    }
  }, [currentProduct, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Waveform size="35" stroke="3.5" speed="1" color="#f59e0b" />
        <span className="ml-3 text-gray-700">Chargement...</span>
      </div>
    );
  }

  console.log("currentProduct:", currentProduct);
  console.log("loading:", loading);

  if (hasFetched && !currentProduct) {
    notFound();
  }

  // Vérifiez que currentProduct existe avant de l'utiliser
  if (!currentProduct) {
    return null; // ou un loader
  }

  const product = currentProduct;

  // Images de galerie (remplacer par tes vraies images)
  const productImages =
    product?.gallery?.length > 0
      ? product.gallery
      : [product?.main_image || ""];

  // Vérifie s'il y a des images secondaires (plus d'une image)
  const hasGalleryImages = product?.gallery?.length > 0;

  // Image actuellement sélectionnée
  const currentImage = productImages[selectedImage] || product.main_image;

  // Fonction de partage
  const handleShare = async () => {
    if (!product) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Découvrez ${product.name} sur Atoum-ra, nos produits naturels authentiques`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Erreur de partage :", error);
      }
    } else {
      // Fallback: copier dans le presse-papier
      navigator.clipboard.writeText(window.location.href);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 3000);
    }
  };

  // Fonction ajout panier
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
    }
  };

  return (
    <>
      {/* Galerie d'images */}
      <div className="w-full space-y-4">
        {/* Image principale */}
        <div className="aspect-square w-full bg-linear-to-br from-emerald-50 to-amber-50 rounded-lg flex items-center justify-center border border-emerald-100 overflow-hidden">
          <ProductImage
            src={product.main_image}
            alt={product.name}
            width={520}
            height={520}
          />
        </div>

        {/* Miniatures - Seulement si galerie existante */}
        {hasGalleryImages && (
          <div className="grid grid-cols-3 gap-3">
            {productImages.slice(0, 3).map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === index
                  ? "border-amber-400 ring-2 ring-amber-200"
                  : "border-amber-100 hover:border-amber-300"
                  }`}
              >
                <ProductImage
                  src={imageUrl}
                  alt={`${product.name} - Miniature ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </button>
            ))}

            {/* Si on a plus de 3 images, montrer un indicateur */}
            {productImages.length > 3 && (
              <div className="aspect-square rounded-lg border border-amber-100 bg-amber-50 flex items-center justify-center">
                <span className="text-sm font-medium text-amber-700">
                  +{productImages.length - 3}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Bouton de partage */}
        <button
          onClick={handleShare}
          className="btn btn-outline w-full relative mt-4 rounded-lg"
          aria-label="Partager ce produit"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Partager ce produit
          {showShareSuccess && (
            <span className="absolute -top-2 -right-2 badge badge-success text-xs">
              Lien copié !
            </span>
          )}
        </button>
      </div>

      {/* Informations produit */}
      <div className="w-full space-y-6">
        {/* En-tête */}
        <header>
          <div className="mb-2">
            <span className="inline-block px-2.5 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
              {product.category?.name || "Sans catégorie"}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
        </header>

        {/* Prix et stock */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-2xl font-bold text-amber-700">
                {product.price.toLocaleString()} €
              </span>
              {product.original_price &&
                product.original_price > product.price && (
                  <span className="ml-2 text-lg text-gray-400 line-through">
                    {product.original_price.toLocaleString()} €
                  </span>
                )}
            </div>

            <div className="text-sm">
              {product.stock > 10 ? (
                <span className="flex items-center text-emerald-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  En stock
                </span>
              ) : product.stock > 0 ? (
                <span className="flex items-center text-amber-600">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Plus que {product.stock}
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Rupture
                </span>
              )}
            </div>
          </div>

          {product.original_price && product.original_price > product.price && (
            <div className="inline-block px-3 py-1 bg-linear-to-r from-orange-500 to-amber-500 text-white text-sm font-bold rounded-full mt-2">
              Économisez{" "}
              {Math.round((1 - product.price / product.original_price) * 100)}%
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Caractéristiques */}
        {(product.ingredients ||
          product.benefits ||
          product.usage_instructions) && (
            <div className="rounded-lg p-4 border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Détails
              </h3>

              {product.ingredients?.slice(0, 3).map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center text-gray-700 mb-2 last:mb-0"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3"></span>
                  <span className="text-sm">{ingredient}</span>
                </div>
              ))}

              {product.benefits?.[0] && (
                <div className="flex items-center text-gray-700 mt-3 pt-3 border-t border-emerald-100">
                  <Heart className="w-4 h-4 mr-3 text-rose-500" />
                  <span className="text-sm">Aport : {product.benefits[0]}</span>
                </div>
              )}

              {product.usage_instructions && (
                <div className="flex items-center text-gray-700 mt-3 pt-3 border-t border-emerald-100">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                  <span className="text-sm">
                    Prise: {product.usage_instructions}
                  </span>
                </div>
              )}
            </div>
          )}

        {/* Bouton d'action */}
        <div>
          <button
            onClick={handleAddToCart}
            className="btn rounded-lg bg-linear-to-r from-orange-500 to-amber-500 text-white w-full py-3 text-base hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-sm hover:shadow"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="inline-block mr-2 w-5 h-5" />
            {product.stock === 0 ? "Rupture" : "Ajouter au panier"}
          </button>
        </div>

        {/* Garanties */}
        <div className="border-t border-gray-300 pt-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <Shield className="w-4 h-4 mr-2 text-emerald-500" />
              <span>Garantie 30 jours</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Truck className="w-4 h-4 mr-2 text-blue-500" />
              <span>Livraison 48h</span>
            </div>
          </div>
        </div>

        {/* Sections détaillées */}
        <div className="pt-6 border-t border-gray-100">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Ingrédients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Ingrédients
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>• {ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bienfaits */}
              {product.benefits && product.benefits.length > 0 && (
                <>
                  <div className="divider lg:divider-horizontal" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Bienfaits
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {product.benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Mode d'utilisation */}
              {product.usage_instructions && (
                <>
                  <div className="divider lg:divider-horizontal" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Mode d&apos;utilisation
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {product.usage_instructions}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>


    </>
  );
}
