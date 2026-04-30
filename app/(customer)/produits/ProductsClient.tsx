// app/produits/ProductsClient.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import ProductCard from "@/components/customer/products/ProductCard";
import CartSlider from "@/components/customer/productCategorie/CartSlider";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Produits", href: "/produits" },
];

interface ProductsClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

// Variants d'animation
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

export default function ProductsClient({
  initialProducts,
  initialCategories,
}: ProductsClientProps) {
  // ================= ÉTATS =================
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>(
    [],
  );
  const [sortBy, setSortBy] = useState<string>("default");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isCartSliderOpen, setIsCartSliderOpen] = useState(false);

  // ================= MÉMOISATION DES DONNÉES =================
  const categoryCounts = useMemo(() => {
    const uniqueCategoryIds = Array.from(
      new Set(products.map((p) => p.category?.id).filter(Boolean) as number[]),
    );

    return uniqueCategoryIds
      .map((id) => {
        const category = categories.find((c) => c.id === id);
        const count = products.filter((p) => p.category?.id === id).length;

        return {
          id,
          name: category?.name || "Inconnu",
          count,
        };
      })
      .filter((item) => item.name !== "Inconnu");
  }, [products, categories]);

  // ================= FILTRAGE ET TRI =================
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.name.toLowerCase().includes(query),
      );
    }

    if (selectedCategoryIds.length > 0) {
      result = result.filter((product) =>
        selectedCategoryIds.includes(product.category?.id || 0),
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        result.sort((a, b) => (a.id > b.id ? -1 : 1));
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategoryIds, sortBy]);

  // ================= HANDLERS =================
  const handleCategoryToggle = useCallback(
    (categoryId: number, categoryName: string) => {
      setSelectedCategoryIds((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId],
      );

      setSelectedCategoryNames((prev) =>
        prev.includes(categoryName)
          ? prev.filter((name) => name !== categoryName)
          : [...prev, categoryName],
      );
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategoryIds([]);
    setSelectedCategoryNames([]);
    setSortBy("default");
  }, []);

  const openCartSlider = useCallback(() => {
    setIsCartSliderOpen(true);
  }, []);

  const closeCartSlider = useCallback(() => {
    setIsCartSliderOpen(false);
  }, []);

  // ================= RENDU =================
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white lg:px-50"
    >
      {/* En-tête avec fil d'ariane */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs items={breadcrumbs} />

          {/* Barre de recherche animée */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mt-4 relative"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                         transition-all duration-200"
              />
            </div>
          </motion.div>

          {/* Boutons actions mobile */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-4 flex items-center justify-between md:hidden"
          >
            <motion.button
              {...scaleOnHover}
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-lg
                       hover:bg-amber-600 transition-colors shadow-sm relative"
            >
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filtres</span>
              <AnimatePresence>
                {selectedCategoryIds.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-white text-amber-600 text-xs font-bold 
                               rounded-full h-5 w-5 flex items-center justify-center shadow"
                  >
                    {selectedCategoryIds.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              {...scaleOnHover}
              onClick={openCartSlider}
              className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 
                       text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-colors shadow-sm"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-medium">Voir panier</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600"
            >
              {filteredProducts.length} produit
              {filteredProducts.length > 1 ? "s" : ""}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ================= FILTRES LATÉRAUX (DESKTOP) ================= */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={slideInLeft}
            transition={{ duration: 0.4 }}
            className="hidden lg:block w-64 shrink-0"
          >
            <div className="sticky top-6 space-y-6">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filtres
                  </h2>
                  {(selectedCategoryIds.length > 0 || searchQuery) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClearFilters}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Tout effacer
                    </motion.button>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <motion.p
                    key={filteredProducts.length}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-medium"
                  >
                    {filteredProducts.length} produit
                    {filteredProducts.length > 1 ? "s" : ""} sur {products.length}
                  </motion.p>
                </div>

                <motion.button
                  {...scaleOnHover}
                  onClick={openCartSlider}
                  className="w-full py-2.5 bg-linear-to-r from-amber-500 to-amber-600 text-white 
                           font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 
                           transition-colors shadow-sm mt-3 cursor-pointer"
                >
                  Voir mon panier
                </motion.button>
              </motion.div>

              {/* Catégories */}
              {categoryCounts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-amber-500" />
                    Catégories
                  </h3>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2"
                  >
                    {categoryCounts.map(({ id, name, count }, index) => (
                      <motion.label
                        key={id}
                        variants={fadeInUp}
                        custom={index}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategoryIds.includes(id)}
                            onChange={() => handleCategoryToggle(id, name)}
                            className="checkbox checkbox-sm checkbox-amber rounded
                                     transition-all duration-200"
                          />
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                            {name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {count}
                        </span>
                      </motion.label>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Tri */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-3">Trier par</h3>
                <div className="space-y-2">
                  {[
                    { value: "default", label: "Recommandé" },
                    { value: "price-asc", label: "Prix croissant" },
                    { value: "price-desc", label: "Prix décroissant" },
                    { value: "name-asc", label: "Nom A-Z" },
                    { value: "name-desc", label: "Nom Z-A" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="radio radio-sm radio-amber transition-all duration-200"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Aperçu catégories sélectionnées */}
              <AnimatePresence>
                {selectedCategoryNames.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                  >
                    <h4 className="font-medium text-amber-900 mb-2">
                      Catégories sélectionnées :
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategoryNames.map((categoryName, index) => (
                        <motion.span
                          key={selectedCategoryIds[index]}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 
                                   px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {categoryName}
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleCategoryToggle(
                                selectedCategoryIds[index],
                                categoryName,
                              )
                            }
                            className="text-amber-600 hover:text-amber-800"
                            aria-label={`Retirer ${categoryName}`}
                          >
                            <X className="h-3 w-3" />
                          </motion.button>
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>

          {/* ================= CONTENU PRINCIPAL ================= */}
          <motion.main
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            transition={{ duration: 0.4 }}
            className="flex-1"
          >
            {/* En-tête produits desktop */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  Tous les produits
                </h2>
                <motion.p
                  key={filteredProducts.length}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-600 text-sm mt-1"
                >
                  {filteredProducts.length} produit
                  {filteredProducts.length > 1 ? "s" : ""} disponible
                  {filteredProducts.length > 1 ? "s" : ""}
                </motion.p>
              </motion.div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select select-bordered select-sm bg-white text-gray-700
                           transition-all duration-200 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="default">Recommandé</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="name-asc">Nom A-Z</option>
                  <option value="name-desc">Nom Z-A</option>
                </select>

                <motion.button
                  {...scaleOnHover}
                  onClick={openCartSlider}
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-amber-600 
                           text-white rounded-lg hover:from-amber-600 hover:to-amber-700 
                           transition-colors shadow-sm cursor-pointer"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="font-medium">Panier</span>
                </motion.button>
              </div>
            </div>

            {/* Grille de produits animée */}
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key="products-grid"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      variants={fadeInUp}
                      custom={index}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard
                        product={product}
                        onCartClick={openCartSlider}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl p-8 text-center border border-gray-200"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Search className="w-10 h-10 text-gray-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {products.length === 0
                      ? "Aucun produit disponible"
                      : "Aucun produit trouvé"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {products.length === 0
                      ? "Aucun produit n'est disponible pour le moment."
                      : "Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres."}
                  </p>
                  {(searchQuery || selectedCategoryIds.length > 0) && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClearFilters}
                      className="px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white 
                               font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 
                               transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      Réinitialiser les filtres
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.main>
        </div>
      </div>

      {/* ================= MODAL FILTRES MOBILE ================= */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileFiltersOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filtres
                  </h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {categoryCounts.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Catégories
                      </h3>
                      <div className="space-y-2">
                        {categoryCounts.map(({ id, name, count }) => (
                          <label
                            key={id}
                            className="flex items-center justify-between cursor-pointer group py-2"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedCategoryIds.includes(id)}
                                onChange={() => handleCategoryToggle(id, name)}
                                className="checkbox checkbox-sm checkbox-amber
                                         transition-all duration-200"
                              />
                              <span className="text-gray-700 group-hover:text-gray-900">
                                {name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">{count}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Trier par
                    </h3>
                    <div className="space-y-2">
                      {[
                        { value: "default", label: "Recommandé" },
                        { value: "price-asc", label: "Prix croissant" },
                        { value: "price-desc", label: "Prix décroissant" },
                        { value: "name-asc", label: "Nom A-Z" },
                        { value: "name-desc", label: "Nom Z-A" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer group py-2"
                        >
                          <input
                            type="radio"
                            name="sort-mobile"
                            value={option.value}
                            checked={sortBy === option.value}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="radio radio-sm radio-amber transition-all duration-200"
                          />
                          <span className="text-gray-700 group-hover:text-gray-900">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClearFilters}
                    className="w-full py-2.5 text-amber-600 font-medium border border-amber-600 
                             rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                  >
                    Réinitialiser
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full py-2.5 bg-linear-to-r from-amber-500 to-amber-600 
                             text-white font-medium rounded-lg hover:from-amber-600 
                             hover:to-amber-700 transition-colors cursor-pointer"
                  >
                    Voir les résultats
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= SLIDER DU PANIER ================= */}
      <CartSlider isOpen={isCartSliderOpen} onClose={closeCartSlider} />
    </motion.div>
  );
}