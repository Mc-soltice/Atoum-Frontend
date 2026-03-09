"use client";

import OrderDetailsModal from "@/components/admin/order/OrderDetailModal";
import OrdersTable, { OrdersTableRef } from "@/components/admin/order/OrdersTable";
import UpdateOrderStatusModal from "@/components/admin/order/UpdateOrderStatusModal";
import { useOrders } from "@/contexte/OrderContext";
import type { Order, OrderStatus } from "@/types/order";
import { shouldCountAmount } from "@/utils/orderStatusFlow";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";
import { Download, Filter, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

/**
 * Page Admin Orders
 * Affiche la liste des commandes et permet de gérer les statuts
 * avec export PDF des données filtrées
 */
export default function OrdersPage() {
  // ✅ Utilisation du contexte Order
  const { orders, loading, fetchOrders, updateOrderStatus } = useOrders();

  // ✅ State pour gérer l'ouverture des modals
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // ✅ Stocke la commande actuellement sélectionnée
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ✅ État pour les commandes filtrées (utilisé pour l'export et l'affichage)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  // ✅ Référence vers la table pour accès direct si nécessaire
  const tableRef = useRef<OrdersTableRef>(null);

  // ✅ État pour les filtres (gérés localement ou via l'API)
  const [filters, setFilters] = useState<{
    status?: OrderStatus;
    search?: string;
  }>({});

  // Montant des commandes calculee sur celle livrees
  const totalAmount = filteredOrders.reduce((sum, order) => {
    return shouldCountAmount(order.status.value)
      ? sum + order.total_amount
      : sum;
  }, 0);

  // ✅ useEffect : Récupère les commandes via le contexte
  useEffect(() => {
    const apiFilters = {
      ...filters,
      reference: filters.search,
    };
    fetchOrders(apiFilters);
  }, [filters, fetchOrders]);

  // ✅ Initialisation des commandes filtrées
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  // ✅ Callback pour mettre à jour filteredOrders depuis la table
  const handleFilteredChange = useCallback((filtered: Order[]) => {
    setFilteredOrders(filtered);
  }, []);

  // ✅ Fonction pour mettre à jour le statut d'une commande
  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, { status });
      toast.success(`✅ Statut mis à jour avec succès`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      toast.error("Erreur lors de la mise à jour du statut");
      throw error;
    }
  };

  // ✅ Fonction de rafraîchissement
  const handleRefresh = () => {
    fetchOrders(filters);
    toast.success("Données actualisées");
  };

  // ✅ Fonction de réinitialisation des filtres
  const handleResetFilters = () => {
    setFilters({});
    toast.success("Filtres réinitialisés");
  };

  // ✅ FONCTION D'EXPORT PDF
  const exportToPDF = () => {
    try {
      // ✅ Utilisation DIRECTE de filteredOrders (toujours synchronisé)
      const dataToExport = filteredOrders || [];

      if (dataToExport.length === 0) {
        toast.error("Aucune donnée à exporter");
        return;
      }

      // ✅ Configuration avec support UTF-8
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true,
        precision: 16 // Pour améliorer la qualité du texte
      });

      // ✅ Définir la police pour les accents (Helvetica supporte l'UTF-8)
      doc.setFont('helvetica', 'normal');

      // Titre
      doc.setFontSize(16);
      doc.text("Commandes", 14, 15);

      doc.setFontSize(10);
      // Utiliser toLocaleDateString avec le locale français
      const exportDate = new Date().toLocaleDateString('fr-FR');
      const exportTime = new Date().toLocaleTimeString('fr-FR');
      doc.text(`Exporté le ${exportDate} à ${exportTime}`, 14, 22);
      doc.text(`Total: ${dataToExport.length} commande(s)`, 14, 28);

      // Indicateur de filtrage
      if (dataToExport.length !== orders.length) {
        doc.setTextColor(100, 100, 255);
        doc.text(`(Données filtrées - ${orders.length} au total)`, 14, 34);
        doc.setTextColor(0, 0, 0);
      }

      // Calcul des statistiques
      const totalAmount = dataToExport.reduce((sum, order) => {
        return shouldCountAmount(order.status.value)
          ? sum + order.total_amount
          : sum;
      }, 0);

      const pendingOrders = dataToExport.filter(o => o.status.value === "pending").length;
      const processingOrders = dataToExport.filter(o => o.status.value === "processing").length;
      const deliveredOrders = dataToExport.filter(o => o.status.value === "delivered").length;
      const cancelledOrders = dataToExport.filter(o => o.status.value === "cancelled").length;

      // Résumé statistique avec gestion des nombres
      doc.setFontSize(9);
      doc.text(`Montant total: ${totalAmount.toLocaleString('fr-FR')} €`, 14, 40);
      doc.text(`En attente: ${pendingOrders}`, 14, 46);
      doc.text(`En traitement: ${processingOrders}`, 14, 52);
      doc.text(`Livrées: ${deliveredOrders}`, 14, 58);
      doc.text(`Annulées: ${cancelledOrders}`, 14, 64);

      // ✅ Fonction utilitaire pour nettoyer le texte
      const sanitizeText = (text: string): string => {
        if (!text) return '-';

        // Solution 1: Garder les accents (recommandée)
        return text
          .normalize('NFC') // Normalisation Unicode
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Enlever les caractères de contrôle
          .trim();

        // Solution 2: Enlever les accents (si les problèmes persistent)
        // return text
        //   .normalize('NFD')
        //   .replace(/[\u0300-\u036f]/g, '') // Enlève les accents
        //   .replace(/[^a-zA-Z0-9\s\-_,.:;]/g, '') // Garde seulement les caractères sûrs
        //   .trim();
      };

      // ✅ Préparation des données avec gestion UTF-8
      const tableData = dataToExport.map(order => {
        return [
          sanitizeText(order.reference || order.id.substring(0, 8)),
          order.items.length.toString(),
          order.items.reduce((sum, item) => sum + item.quantity, 0).toString(),
          new Date(order.created_at).toLocaleDateString('fr-FR'),
          order.total_amount.toLocaleString('fr-FR'),
          sanitizeText(order.status.label),
        ];
      });

      // Configuration du tableau avec support UTF-8
      autoTable(doc, {
        startY: 71,
        head: [
          [
            sanitizeText('Référence'),
            sanitizeText('Articles'),
            sanitizeText('Qté totale'),
            sanitizeText('Date'),
            sanitizeText('Total (€)'),
            sanitizeText('Statut')
          ]
        ],
        body: tableData,
        styles: {
          fontSize: 8,
          font: 'helvetica',
          fontStyle: 'normal',
          cellPadding: 2,
          overflow: 'linebreak',
          halign: 'left',
          valign: 'middle',
          textColor: [0, 0, 0],
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [41, 37, 36],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 71, left: 10, right: 10 },
        columnStyles: {
          0: { cellWidth: 30, halign: 'left' },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 25, halign: 'center' },
          4: { cellWidth: 30, halign: 'right' },
          5: { cellWidth: 25, halign: 'center' },
        },
        // ✅ Hook pour traiter les cellules avant affichage
        didParseCell: (data) => {
          // S'assurer que le texte est bien encodé
          if (data.cell.raw && typeof data.cell.raw === 'string') {
            // Utiliser le texte tel quel, il sera correctement affiché
            data.cell.text = [data.cell.raw];
          }
        },
        // ✅ Hook après génération pour vérifier
        didDrawPage: (data) => {
          // Numéro de page
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(
            `Page ${data.pageNumber}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        }
      });

      // ✅ Nom du fichier sans caractères spéciaux
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `commandes-${dateStr}.pdf`;

      doc.save(fileName);
      toast.success(`✅ PDF exporté avec ${dataToExport.length} commande(s)`);

    } catch (error) {
      console.error("❌ Erreur lors de l'export PDF:", error);
      toast.error("Erreur lors de l'export PDF");
    }
  };

  // ✅ Fonction pour obtenir le label d'un statut
  const getStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pending: "En attente",
      confirmed: "Confirmée",
      processing: "En traitement",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée",
    };
    return labels[status] || status;
  };

  // ✅ Affiche un loader pendant le chargement
  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Waveform size="35" stroke="3.5" speed="1" color="black" />
        <span className="ml-3 text-gray-700">Chargement des commandes...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête de la page */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Commandes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders.length} commande(s) au total -
            {filteredOrders.length !== orders.length && (
              <span className="ml-1 text-blue-600">
                ({filteredOrders.length} affichée(s))
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-3">
          {/* Bouton de réinitialisation des filtres */}
          {(filters.status || filters.search) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
              aria-label="Réinitialiser les filtres"
            >
              <Filter className="w-5 h-5" />
              Réinitialiser
            </button>
          )}

          {/* Bouton de rafraîchissement */}
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
            aria-label="Rafraîchir"
          >
            <RefreshCw className="w-5 h-5" />
            Rafraîchir
          </button>

          {/* Bouton d'export PDF */}
          <button
            onClick={exportToPDF}
            disabled={filteredOrders.length === 0}
            className={`relative flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium overflow-hidden group ${filteredOrders.length === 0
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'text-gray-700 bg-gray-100 hover:text-white transition-colors duration-300'
              }`}
            aria-label="Exporter en PDF"
            title={filteredOrders.length !== orders.length
              ? `Exporter les ${filteredOrders.length} commandes filtrées`
              : "Exporter toutes les commandes"}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exporter PDF
              {filteredOrders.length !== orders.length && (
                <span className="font-bold">({filteredOrders.length} filtrées)</span>
              )}
            </span>
            {filteredOrders.length > 0 && (
              <div className="absolute inset-0 bg-slate-800 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            )}
          </button>
        </div>
      </div>

      {/* Statistiques rapides basées sur les commandes filtrées */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Commandes affichées</p>
          <p className="text-2xl font-bold">{filteredOrders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Montant total</p>
          <p className="text-2xl font-bold">
            {totalAmount.toLocaleString()} €
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold">
            {filteredOrders.filter(o => o.status.value === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">En traitement</p>
          <p className="text-2xl font-bold">
            {filteredOrders.filter(o => o.status.value === "processing").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Livrées</p>
          <p className="text-2xl font-bold">
            {filteredOrders.filter(o => o.status.value === "delivered").length}
          </p>
        </div>
      </div>

      {/* Table des commandes avec gestion des filtres */}
      <OrdersTable
        ref={tableRef}
        orders={orders}
        onFilteredChange={handleFilteredChange}
        onViewDetails={(order) => {
          setSelectedOrder(order);
          setIsDetailsOpen(true);
        }}
        onChangeStatus={(order) => {
          setSelectedOrder(order);
          setIsStatusOpen(true);
        }}
      />

      {/* Modal de détails de la commande - à adapter pour accepter Order ou FullOrder */}
      <OrderDetailsModal
        isOpen={isDetailsOpen}
        orderId={selectedOrder?.id}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedOrder(null); // 🔹 reset pour éviter la persistance
        }}
        onStatusChange={(orderId, status) => {
          handleStatusUpdate(orderId, status as OrderStatus);
        }}
      />

      {/* Modal de mise à jour du statut */}
      <UpdateOrderStatusModal
        isOpen={isStatusOpen}
        order={selectedOrder}
        onClose={() => setIsStatusOpen(false)}
        onStatusUpdated={(orderId, status) => {
          handleStatusUpdate(orderId, status);
        }}
      />
    </div>
  );
}