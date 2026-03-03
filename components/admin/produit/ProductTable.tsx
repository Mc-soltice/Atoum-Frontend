"use client";

import Filter from "@/components/admin/Filter";
import ProductImage from "@/components/admin/produit/ProductImage";
import type { Product, ProductFilters } from "@/types/product";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onFilteredChange?: (filtered: Product[]) => void; // ✅ Nouvelle prop pour remonter les données filtrées
}

// ✅ Interface pour exposer les méthodes au parent
export interface ProductsTableRef {
  getFilteredData: () => Product[];
}
interface ExtendedFilters {
  search?: string;
  stock_status?: string;
  is_promotional?: string;
  dateFilter?: "all" | "exact" | "range";
  exactDate?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Composant pour afficher la table des produits
 * Gère le filtrage et l'affichage des données
 */
const ProductsTable = forwardRef<ProductsTableRef, ProductsTableProps>(
  ({ products, onEdit, onDelete, onFilteredChange }, ref) => {
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    const [statusFilter, setStatusFilter] = useState<string>("Tous");
    const [lowStockOnly, setLowStockOnly] = useState<boolean>(false);
    const [currentFilters, setCurrentFilters] = useState<any>({});


    // ✅ Options de filtre pour le statut
    const filterOptions = {
      stock_status: ["En stock", "Stock faible", "Rupture"],
      is_promotional: ["Promo", "Standard"],
    };

    // ✅ Synchronise les produits filtrés quand la liste change
    useEffect(() => {
      applyAllFilters(currentFilters);
    }, [products]);

    // ✅ Notifier le parent des changements de filtres
    useEffect(() => {
      onFilteredChange?.(filteredProducts);
    }, [filteredProducts, onFilteredChange]);

    // ✅ Exposer la méthode getFilteredData au parent via la ref
    useImperativeHandle(ref, () => ({
      getFilteredData: () => filteredProducts,
    }));

    // ✅ Fonction pour déterminer le statut du stock
    const getStockStatus = (product: Product) => {
      if (product.is_out_of_stock) return "Rupture";
      if ((product.stock ?? 0) < 20) return "Stock faible";
      return "En stock";
    };

    const applyAllFilters = (filters: any) => {
      let result = products;

      // Filtre de recherche
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.description?.toLowerCase().includes(searchTerm) ||
            p.category?.name.toLowerCase().includes(searchTerm),
        );
      }

      // Filtre statut stock
      if (filters?.stock_status) {
        result = result.filter((p) => getStockStatus(p) === filters.stock_status);
      }

      // Filtre promo/standard
      if (filters?.is_promotional === "Promo") {
        result = result.filter((p) => p.is_promotional === true);
      }
      if (filters?.is_promotional === "Standard") {
        result = result.filter((p) => p.is_promotional === false);
      }

      if (filters?.dateFilter && filters.dateFilter !== "all") {
        result = result.filter((product) => {

          const productDate = product.created_at ? new Date(product.created_at) : null;

          if (!productDate) return false;

          // Filtre date précise
          if (filters.dateFilter === "exact" && filters.exactDate) {
            const filterDate = new Date(filters.exactDate);
            return (
              productDate.getFullYear() === filterDate.getFullYear() &&
              productDate.getMonth() === filterDate.getMonth() &&
              productDate.getDate() === filterDate.getDate()
            );
          }

          // Filtre intervalle de dates
          if (filters.dateFilter === "range" && filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            // Mettre les dates à minuit pour une comparaison correcte
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            return productDate >= startDate && productDate <= endDate;
          }

          return true;
        });
      }

      // Filtres additionnels (status promo et stock faible)
      if (statusFilter === "Promo") {
        result = result.filter((p) => p.is_promotional === true);
      } else if (statusFilter === "Standard") {
        result = result.filter((p) => p.is_promotional === false);
      }

      if (lowStockOnly) {
        result = result.filter((p) => (p.stock ?? 0) < 20);
      }

      setFilteredProducts(result);
      setCurrentFilters(filters);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setStatusFilter(value);
      // ✅ Réappliquer tous les filtres avec le nouveau statut
      applyAllFilters({ ...currentFilters });
    };

    const handleLowStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setLowStockOnly(checked);
      // ✅ Réappliquer tous les filtres avec le nouveau filtre stock faible
      applyAllFilters({ ...currentFilters });
    };

    return (
      <>
        {/* Filtre générique */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-4">
            <Filter<ProductFilters>
              options={filterOptions}
              onFilterChange={(filters) => {
                setCurrentFilters(filters);
                applyAllFilters(filters);
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 mt-1 ">
              <label className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="
    appearance-none
    bg-white
    border border-gray-200
    rounded-xl
    px-4 py-2
    pr-10
    text-sm font-medium text-slate-700
    shadow-sm
    hover:border-slate-400
    transition
    outline-none
    focus:outline-none
    focus:border-slate-500
    ring-0
  "
                >
                  <optgroup label="— Statut produit —">
                    <option value="all">Tous</option>
                    <option value="Promo">Promo</option>
                    <option value="Standard">Standard</option>
                  </optgroup>
                </select>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lowStockOnly}
                  onChange={handleLowStockChange}
                  className="checkbox"
                />
                <span className="text-sm font-medium text-slate-900">Stock faible</span>
              </label>
            </div>
          </div>
        </div>

        {/* Table des produits */}
        <div className="mt-5 overflow-x-auto overflow-y-auto max-h-150 rounded-lg border border-gray-300">
          <table className="table table-zebra table-pin-rows table-pin-cols">
            <thead className="sticky top-0 bg-base-200 z-10 ">
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Nom</th>
                <th scope="col">Catégorie</th>
                <th scope="col">Prix</th>
                <th scope="col">Stock</th>
                <th scope="col">Statut</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => onEdit(product)}
                    className="cursor-pointer hover:bg-gray-50"
                    aria-label={`Éditer le produit ${product.name}`}
                  >
                    <td>
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <ProductImage
                            src={product.main_image}
                            alt={product.name}
                            width={48}
                            height={48}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline">
                        {product.category?.name || "Sans catégorie"}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span
                          className={`font-bold ${product.is_promotional ? "text-red-600" : ""}`}
                        >
                          {product.price.toFixed(2)}€
                        </span>
                        {product.is_promotional && product.original_price && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.original_price.toFixed(2)}€
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`font-medium ${getStockStatus(product) === "Rupture" ? "text-red-600" : getStockStatus(product) === "Stock faible" ? "text-orange-500" : "font-bold"}`}
                      >
                        {product.stock} (
                        {getStockStatus(product) === "Rupture"
                          ? "Rupture"
                          : getStockStatus(product) === "Stock faible"
                            ? "Stock faible"
                            : "En stock"}
                        )
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        {product.is_promotional ? "Promo" : "Standard"}
                      </div>
                    </td>
                    <td className="space-x-2">
                      <button
                        className="btn btn-sm bg-slate-800 text-white rounded-lg"
                        aria-label={`Supprimer le produit ${product.name}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Empêche le déclenchement de onEdit
                          onDelete(product);
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pied de tableau avec compteur */}
        <div className="mt-4 text-sm text-gray-600">
          Total: {filteredProducts.length} produit(s) sur {products.length}
        </div>
      </>
    );
  },
);

// ✅ Ajout du displayName pour le debugging
ProductsTable.displayName = "ProductsTable";

export default ProductsTable;