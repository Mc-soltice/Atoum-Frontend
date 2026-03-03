'use client';

import { useOrders } from '@/contexte/OrderContext';
import { useOrderPDF } from '@/hooks/useOrderPDF';
import { CheckCircle, Download, Package, Store } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Interface pour l'affichage
interface DisplayOrder {
  id: string;
  reference: string;
  total_amount: number;
  status: { value: string; label: string };
  created_at: string;
  items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
  delivery?: {
    name: string;
    price: number;
  };
}

// Fonction utilitaire pour formater les prix
const formatPrice = (price: number) => {
  return price.toFixed(2);
};

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchOrderById, loading } = useOrders();
  const [order, setOrder] = useState<DisplayOrder | null>(null);

  const { downloadInvoice, previewInvoice } = useOrderPDF();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const fetchedOrder = await fetchOrderById(params.id as string);

        if (fetchedOrder) {
          setOrder({
            id: fetchedOrder.id,
            reference: fetchedOrder.reference,
            total_amount: fetchedOrder.total_amount,
            status: fetchedOrder.status,
            created_at: fetchedOrder.created_at,
            items: fetchedOrder.items.map(item => ({
              id: item.id,
              product_name: item.product_name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              subtotal: item.subtotal || item.unit_price * item.quantity
            })),
            delivery: fetchedOrder.delivery ? {
              name: fetchedOrder.delivery.name,
              price: fetchedOrder.delivery.price
            } : undefined
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la commande:', error);
      }
    };

    if (params.id) {
      loadOrder();
    }
  }, [params.id, fetchOrderById]);



  if (loading) {
    return (
      <div className="max-h-[50vh] bg-linear-to-b from-green-50 to-white py-10 px-4">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-linear-to-b from-green-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-gray-600">Commande non trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête de succès */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande Confirmée</h1>
          <p className="text-gray-600">Votre commande a été traitée avec succès</p>
        </div>


        <div >
          {/* Détails de la commande */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {/* En-tête avec les informations générales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-6 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Numéro de commande</p>
                <p className="text-xl font-semibold text-gray-900">{order.reference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <p className="text-xl font-semibold text-green-600 capitalize">
                  {order.status.label || order.status.value}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-lg text-gray-900">
                  {new Date(order.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Montant total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(order.total_amount)} €
                </p>
              </div>
            </div>

            {/* Articles commandés - Version tableau */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Articles commandés ({order.items.length})
              </h3>
              <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r border-gray-100">
                        Produit
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700 border-r border-gray-100">
                        Quantité
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700 border-r border-gray-100">
                        Prix unitaire
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">
                        Sous-total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr
                        key={item.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 border-r border-gray-100">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900">
                              {item.product_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right border-r border-gray-100 text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right border-r border-gray-100 text-gray-700">
                          {formatPrice(item.unit_price)} €
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          {formatPrice(item.subtotal)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-4 text-right font-semibold text-gray-700 border-r border-gray-200"
                      >
                        Total
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-lg text-gray-900">
                        {formatPrice(order.total_amount)} €
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Informations supplémentaires (livraison, etc.) */}
              {order.delivery && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Frais de livraison ({order.delivery.name})</span>
                    <span className="font-medium">{formatPrice(order.delivery.price)} €</span>
                  </div>
                </div>
              )}
            </div>

            {/* Message de confirmation */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-green-800 text-center">
                ✓ Un email de confirmation a été envoyé à votre adresse email avec tous les détails de votre commande.
              </p>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="relative overflow-hidden rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <div className="relative px-4 py-2 text-lg font-medium flex items-center gap-2 text-gray-900 group-hover:text-white transition-colors duration-300">
              <Store className="w-5 h-5" />
              <span>Retour à la boutique</span>
              <div className="absolute inset-0 bg-amber-500 -z-10 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </div>
          </button>
          <button
            onClick={() => downloadInvoice(order)}
            className="relative overflow-hidden rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <div className="relative px-4 py-2 text-lg font-medium flex items-center gap-2 text-gray-900 group-hover:text-white transition-colors duration-300">
              <Download className="w-5 h-5" />
              <span>Telecharger le bon de Commande</span>
              <div className="absolute inset-0 bg-amber-500 -z-10 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}