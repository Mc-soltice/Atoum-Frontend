"use client";

import AddProductModal from "@/components/admin/produit/AddProductModal";
import DeleteProductModal from "@/components/admin/produit/DeleteProductModal";
import EditProductModal from "@/components/admin/produit/EditProductModal";
import ProductsTable, { ProductsTableRef } from "@/components/admin/produit/ProductTable";
import { CategoryProvider, useCategories } from "@/contexte/CategoryContext";
import { ProductProvider, useProducts } from "@/contexte/ProductContext";
import type { Product } from "@/types/product";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";
import { AlertCircle, AlertTriangle, Download, Package, PlusCircle, RefreshCw, Wallet } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

/**
 * Page Admin Produits
 * Affiche la liste des produits et permet de gérer CRUD via des modals
 * avec export PDF des données filtrées
 */
function ProductsContent() {
  // ✅ Utilisation des contextes
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  // ✅ State pour gérer l'ouverture des modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ✅ Stocke le produit actuellement sélectionné pour édition/suppression
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ✅ UNE SEULE source de vérité pour les produits filtrés
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);


  // ✅ Référence vers la table (uniquement pour forcer une mise à jour si nécessaire)
  const tableRef = useRef<ProductsTableRef>(null);

  // ✅ useEffect : Récupère les produits au montage du composant
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Initialisation des produits filtrés quand les produits chargent
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // ✅ Callback pour mettre à jour filteredProducts depuis la table
  const handleFilteredChange = useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered);
  }, []);

  // ✅ FONCTION D'EXPORT OPTIMISÉE - Toujours utilise filteredProducts directement

  const exportToPDF = () => {
    try {
      // ✅ filteredProducts est TOUJOURS synchronisé avec les filtres
      if (filteredProducts.length === 0) {
        toast.error("Aucune donnée à exporter");
        return;
      }
      // ✅ Utilisation DIRECTE de filteredProducts (toujours synchronisé)
      const dataToExport = filteredProducts;

      if (dataToExport.length === 0) {
        toast.error("Aucune donnée à exporter");
        return;
      }

      const doc = new jsPDF();

      // Titre
      doc.setFontSize(16);
      doc.text("Catalogue Produits", 14, 15);
      doc.setFontSize(10);
      doc.text(`Exporté le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`, 14, 22);
      doc.text(`Total: ${dataToExport.length} produit(s)`, 14, 28);

      // Indicateur de filtrage
      if (dataToExport.length !== products.length) {
        doc.setTextColor(100, 100, 255);
        doc.text(`(Données filtrées - ${products.length} au total)`, 14, 34);
        doc.setTextColor(0, 0, 0);
      }

      // Calcul des statistiques pour le résumé (basé sur les données filtrées)
      const totalValue = dataToExport.reduce((sum, p) => sum + (p.price * p.stock), 0);
      const outOfStock = dataToExport.filter(p => p.stock === 0).length;
      const lowStock = dataToExport.filter(p => p.stock > 0 && p.stock < 10).length;

      // Ajout d'un résumé statistique
      doc.setFontSize(9);
      doc.text(`Valeur totale du stock: ${totalValue} €`, 14, 40);
      doc.text(`Produits en rupture: ${outOfStock}`, 14, 46);
      doc.text(`Produit dont le stock est faible: ${lowStock}`, 14, 52);

      // Configuration du tableau
      autoTable(doc, {
        startY: 59,
        head: [['ID', 'Nom', 'Catégorie', 'Prix (€)', 'Stock', 'Statut', 'Description']],
        body: dataToExport.map(p => [
          p.id.substring(0, 8) + '...',
          p.name,
          p.category?.name || 'N/A',
          p.price.toLocaleString(),
          p.stock.toString(),
          p.stock === 0 ? '❌ Rupture' : p.stock < 10 ? '⚠️ Faible' : '✅ OK',
          p.description ? (p.description.length > 50 ? p.description.substring(0, 50) + '...' : p.description) : '-'
        ]),
        styles: { fontSize: 7 },
        headStyles: { fillColor: [41, 37, 36] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 59 },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 30 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 15 },
          5: { cellWidth: 20 },
          6: { cellWidth: 'auto' }
        }
      });

      doc.save(`produits-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success(`✅ PDF exporté avec ${dataToExport.length} produit(s)`);
    } catch (error) {
      console.error("❌ Erreur lors de l'export PDF:", error);
      toast.error("Erreur lors de l'export PDF");
    }
  };

  // ✅ Fonction pour rafraîchir les données
  const handleRefresh = () => {
    fetchProducts();
    toast.success("Données actualisées");
  };

  // ✅ Affiche un loader pendant le chargement
  const isLoading = productsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Waveform size="35" stroke="3.5" speed="1" color="black" />
        <span className="ml-3 text-gray-700">Chargement des produits...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête de la page */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Produits</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} produit(s) au total -
            {filteredProducts.length !== products.length && (
              <span className="ml-1 text-blue-600">
                ({filteredProducts.length} affiché(s))
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-3">
          {/* Bouton de rafraîchissement */}
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
            aria-label="Rafraîchir"
          >
            <RefreshCw className="w-5 h-5" />
            Rafraîchir
          </button>

          {/* ✅ BOUTON D'EXPORT AMÉLIORÉ - Indique clairement ce qui est exporté */}
          <button
            onClick={exportToPDF}
            disabled={filteredProducts.length === 0}
            className={`relative flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium overflow-hidden group ${filteredProducts.length === 0
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'text-gray-700 bg-gray-100 hover:text-white transition-colors duration-300'
              }`}
            aria-label="Exporter en PDF"
            title={filteredProducts.length !== products.length
              ? `Exporter les ${filteredProducts.length} produits filtrés`
              : "Exporter tous les produits"}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exporter PDF
              {filteredProducts.length !== products.length && (
                <span className="font-bold">({filteredProducts.length} filtrés)</span>
              )}
            </span>
            {filteredProducts.length > 0 && (
              <div className="absolute inset-0 bg-slate-800 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            )}
          </button>

          {/* Bouton d'ajout d'un produit */}
          <button
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium text-white bg-linear-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 transition-all"
            onClick={() => setIsAddOpen(true)}
            aria-label="Ajouter un produit"
          >
            <PlusCircle className="w-5 h-5" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Statistiques rapides (basées sur les données filtrées) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Produits affichés</p>
              <p className="text-xl font-bold">{filteredProducts.length}</p>
              {filteredProducts.length !== products.length && (
                <p className="text-xs text-gray-400">sur {products.length} total</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Valeur stock</p>
              <p className="text-xl font-bold">
                {filteredProducts.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()} €
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock faible</p>
              <p className="text-xl font-bold">
                {filteredProducts.filter(p => p.stock > 0 && p.stock < 10).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rupture</p>
              <p className="text-xl font-bold">
                {filteredProducts.filter(p => p.stock === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table des produits avec gestion des filtres */}
      <ProductsTable
        ref={tableRef}
        products={products}
        onFilteredChange={handleFilteredChange}
        onEdit={(product) => { setSelectedProduct(product); setIsEditOpen(true); }}
        onDelete={(product) => { setSelectedProduct(product); setIsDeleteOpen(true); }}
      />

      {/* Modals pour CRUD */}
      <AddProductModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onProductAdded={() => {
          fetchProducts();
          toast.success("✅ Produit ajouté avec succès");
        }}
        categories={categories}
      />

      <EditProductModal
        isOpen={isEditOpen}
        product={selectedProduct}
        onClose={() => setIsEditOpen(false)}
        onProductUpdated={() => {
          fetchProducts();
          toast.success("✅ Produit modifié avec succès");
        }}
      />

      <DeleteProductModal
        isOpen={isDeleteOpen}
        product={selectedProduct}
        onClose={() => setIsDeleteOpen(false)}
        onProductDeleted={() => {
          fetchProducts();
          toast.success("✅ Produit supprimé avec succès");
        }}
      />
    </div>
  );
}

/**
 * Page principale enveloppée dans les providers
 */
export default function ProductsPage() {
  return (
    <ProductProvider>
      <CategoryProvider>
        <ProductsContent />
      </CategoryProvider>
    </ProductProvider>
  );
}