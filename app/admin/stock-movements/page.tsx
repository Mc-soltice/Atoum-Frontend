// app/admin/stock-movements/page.tsx
"use client";

import "ldrs/react/Waveform.css";
import { Waveform } from "ldrs/react";
import { Download, Package, AlertCircle, RefreshCw, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import type { StockMovement } from "@/types/stock-movement";
import StockMovementsTable from "@/components/admin/stock-movement/StockMovementsTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useOrders } from "@/contexte/OrderContext";
import { useAuthContext } from "@/contexte/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/**
 * Page Consultation des Mouvements de Stock
 * Accessible uniquement aux administrateurs
 * Affiche la liste des mouvements en lecture seule avec filtres et export PDF
 * Intègre les mouvements de stock liés aux commandes
 */
export default function StockMovementsPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuthContext();

  // ✅ Récupération des fonctions du contexte Order
  const { fetchStockMovements: fetchOrderStockMovements, orders } = useOrders();

  // ✅ État local pour la liste complète des mouvements
  const [movements, setMovements] = useState<StockMovement[]>([]);

  // ✅ UNE SEULE source de vérité pour les mouvements filtrés
  const [filteredMovements, setFilteredMovements] = useState<StockMovement[]>([]);

  // ✅ État pour le chargement des données
  const [loading, setLoading] = useState(true);

  // ✅ État pour les erreurs
  const [error, setError] = useState<string | null>(null);

  // ✅ Vérification des droits d'accès
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("Accès non autorisé");
      router.replace("/admin");
    }
  }, [isAdmin, authLoading, router]);

  /**
   * ✅ Fonction pour charger tous les mouvements de stock
   * Combine les mouvements généraux et ceux liés aux commandes
   */
  const loadAllStockMovements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const allMovements: StockMovement[] = [];

      // 1. Charger les mouvements depuis l'API des mouvements de stock
      try {
        const response = await fetch('/api/orders/report/stock-movements');
        if (!response.ok) throw new Error('Erreur chargement mouvements');
        const data = await response.json();
        allMovements.push(...data);
      } catch (err) {
        console.warn("Impossible de charger les mouvements généraux:", err);
      }

      // 2. Charger les mouvements liés aux commandes récentes
      // Limiter aux 10 dernières commandes pour éviter trop de requêtes
      const recentOrders = orders.slice(0, 10);

      await Promise.all(
        recentOrders.map(async (order) => {
          try {
            const orderMovements = await fetchOrderStockMovements(order.id);
            allMovements.push(...orderMovements);
          } catch (err) {
            console.warn(`Impossible de charger les mouvements pour la commande ${order.id}:`, err);
          }
        })
      );

      // Supprimer les doublons potentiels (basé sur l'ID)
      const uniqueMovements = Array.from(
        new Map(allMovements.map(m => [m.id, m])).values()
      );

      // Trier par date décroissante (plus récent en premier)
      const sortedMovements = uniqueMovements.sort((a, b) =>
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      setMovements(sortedMovements);
      setFilteredMovements(sortedMovements);

    } catch (err) {
      console.error("❌ Erreur lors du chargement global:", err);
      setError("Impossible de charger les mouvements de stock");
    } finally {
      setLoading(false);
    }
  }, [orders, fetchOrderStockMovements]);

  // ✅ useEffect : Récupère les mouvements si l'utilisateur est admin
  useEffect(() => {
    if (isAdmin) {
      loadAllStockMovements();
    }
  }, [isAdmin, loadAllStockMovements]);

  // ✅ Callback pour mettre à jour filteredMovements depuis la table
  const handleFilteredChange = useCallback((filtered: StockMovement[]) => {
    console.log("🔍 filteredMovements mis à jour:", filtered.length); // Debug
    setFilteredMovements(filtered);
  }, []);

  // ✅ FONCTION D'EXPORT OPTIMISÉE - Utilise filteredMovements directement
  const exportToPDF = () => {
    try {
      console.log("📊 filteredMovements au moment de l'export:", filteredMovements.length); // Debug

      // ✅ filteredMovements est TOUJOURS synchronisé avec les filtres
      if (filteredMovements.length === 0) {
        toast.error("Aucune donnée à exporter");
        return;
      }

      // ✅ Utilisation DIRECTE de filteredMovements (toujours synchronisé)
      const dataToExport = filteredMovements;

      const doc = new jsPDF();

      // Titre
      doc.setFontSize(16);
      doc.text("Mouvements de Stock", 14, 15);
      doc.setFontSize(10);
      doc.text(`Exporté le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`, 14, 22);
      doc.text(`Total: ${dataToExport.length} mouvement(s)`, 14, 28);

      // Indicateur de filtrage
      if (dataToExport.length !== movements.length) {
        doc.setTextColor(100, 100, 255);
        doc.text(`(Données filtrées - ${movements.length} au total)`, 14, 34);
        doc.setTextColor(0, 0, 0);
      }

      // Calcul des statistiques pour le résumé (basé sur les données filtrées)
      const entries = dataToExport.filter(m => m.movement_type === 'in').length;
      const exits = dataToExport.filter(m => m.movement_type === 'out').length;
      const totalQuantity = dataToExport.reduce((sum, m) => sum + m.quantity, 0);

      // Période concernée
      const dates = dataToExport
        .map(m => m.created_at ? new Date(m.created_at) : null)
        .filter((d): d is Date => d !== null);

      const oldestDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
      const newestDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;

      // Ajout d'un résumé statistique
      doc.setFontSize(9);
      doc.text(`Entrées: ${entries} | Sorties: ${exits}`, 14, 40);
      doc.text(`Quantité totale mouvementée: ${totalQuantity} unités`, 14, 46);
      if (oldestDate && newestDate) {
        doc.text(`Période: du ${oldestDate.toLocaleDateString()} au ${newestDate.toLocaleDateString()}`, 14, 52);
      }

      // Configuration du tableau avec gestion d'erreurs pour chaque champ
      autoTable(doc, {
        startY: 59,
        head: [['ID', 'Produit', 'Type', 'Quantité', 'Raison', 'Stock ancien', 'Stock nouveau', 'Référence', 'Date']],
        body: dataToExport.map(m => {
          // ✅ Gestion sécurisée de l'ID
          let idDisplay = 'N/A';
          if (m.id) {
            try {
              const idStr = String(m.id); // Convertir en string si ce n'est pas déjà le cas
              idDisplay = idStr.length > 8 ? idStr.substring(0, 8) + '...' : idStr;
            } catch (e) {
              idDisplay = 'ID invalide';
            }
          }

          // ✅ Gestion sécurisée du nom du produit
          const productName = m.product?.name || 'N/A';

          // ✅ Gestion sécurisée du type de mouvement
          const movementType = m.movement_type === 'in' ? 'Entrée' : 'Sortie';

          // ✅ Gestion sécurisée de la quantité
          const quantity = m.quantity?.toString() || '0';

          // ✅ Gestion sécurisée de la raison
          const reason = m.reason || '-';

          // ✅ Gestion sécurisée des stocks
          const oldStock = m.old_stock?.toString() || '-';
          const newStock = m.new_stock?.toString() || '-';

          // ✅ Gestion sécurisée de la référence
          let reference = '-';
          if (m.order_id) {
            try {
              const orderIdStr = String(m.order_id);
              reference = `CMD-${orderIdStr.substring(0, 8)}`;
            } catch (e) {
              reference = 'CMD-invalide';
            }
          } else if (m.metadata) {
            reference = String(m.metadata).substring(0, 15);
          }

          // ✅ Gestion sécurisée de la date
          let dateDisplay = '-';
          if (m.created_at) {
            try {
              dateDisplay = new Date(m.created_at).toLocaleString('fr-FR');
            } catch (e) {
              dateDisplay = 'Date invalide';
            }
          }

          return [
            idDisplay,
            productName,
            movementType,
            quantity,
            reason,
            oldStock,
            newStock,
            reference,
            dateDisplay
          ];
        }),
        styles: { fontSize: 7 },
        headStyles: { fillColor: [41, 37, 36] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 59 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 35 },
          2: { cellWidth: 18 },
          3: { cellWidth: 15 },
          4: { cellWidth: 25 },
          5: { cellWidth: 18 },
          6: { cellWidth: 18 },
          7: { cellWidth: 20 },
          8: { cellWidth: 'auto' }
        }
      });

      doc.save(`mouvements-stock-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success(`✅ PDF exporté avec ${dataToExport.length} mouvement(s)`);
    } catch (error) {
      console.error("❌ Erreur lors de l'export PDF:", error);
      toast.error("Erreur lors de l'export PDF");
    }
  };

  // ✅ Fonction pour rafraîchir les données
  const handleRefresh = () => {
    loadAllStockMovements();
    toast.success("Données actualisées");
  };

  // ✅ Affichage pendant la vérification d'auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Waveform size="35" stroke="3.5" speed="1" color="black" />
        <span className="ml-3 text-gray-700">Vérification des droits d'accès...</span>
      </div>
    );
  }

  // ✅ Si pas admin, ne rien afficher (la redirection est déjà faite)
  if (!isAdmin) {
    return null;
  }

  // ✅ Affiche un loader pendant le chargement des données
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Waveform size="35" stroke="3.5" speed="1" color="black" />
        <span className="ml-3 text-gray-700">Chargement des mouvements de stock...</span>
      </div>
    );
  }

  // ✅ Affiche une erreur si nécessaire
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">❌ Erreur de chargement</p>
          </div>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête de la page */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Consultation des Mouvements de Stock</h1>
          <p className="text-sm text-gray-500 mt-1">
            {movements.length} mouvement(s) au total -
            {filteredMovements.length !== movements.length && (
              <span className="ml-1 text-blue-600">
                ({filteredMovements.length} affiché(s))
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
            disabled={filteredMovements.length === 0}
            className={`relative flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium overflow-hidden group ${filteredMovements.length === 0
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'text-gray-700 bg-gray-100 hover:text-white transition-colors duration-300'
              }`}
            aria-label="Exporter en PDF"
            title={
              filteredMovements.length !== movements.length
                ? `Exporter les ${filteredMovements.length} mouvements filtrés`
                : "Exporter tous les mouvements"
            }
          >
            <span className="relative z-10 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exporter PDF
              {filteredMovements.length > 0 && (
                <span className="font-bold">({filteredMovements.length})</span>
              )}
              {filteredMovements.length !== movements.length && filteredMovements.length > 0 && (
                <span className="text-xs font-normal ml-1">filtrés</span>
              )}
            </span>
            {filteredMovements.length > 0 && (
              <div className="absolute inset-0 bg-slate-800 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            )}
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
              <p className="text-sm text-gray-500">Mouvements affichés</p>
              <p className="text-xl font-bold">{filteredMovements.length}</p>
              {filteredMovements.length !== movements.length && (
                <p className="text-xs text-gray-400">sur {movements.length} total</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Entrées</p>
              <p className="text-xl font-bold">
                {filteredMovements.filter(m => m.movement_type === 'in').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sorties</p>
              <p className="text-xl font-bold">
                {filteredMovements.filter(m => m.movement_type === 'out').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantité totale</p>
              <p className="text-xl font-bold">
                {filteredMovements.reduce((sum, m) => sum + m.quantity, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table des mouvements de stock avec gestion des filtres */}
      <StockMovementsTable
        movements={movements}
        onFilteredChange={handleFilteredChange} // ✅ Mise à jour du state local
      />
    </div>
  );
}