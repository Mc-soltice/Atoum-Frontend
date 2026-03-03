// components/admin/dashboard/RecentOrders.tsx
"use client";

import { ShoppingBag, MoreVertical } from "lucide-react";

const orders = [
  { id: '#ORD-001', customer: 'Marie Dubois', amount: '89,99 €', status: 'completed', date: '2024-01-15' },
  { id: '#ORD-002', customer: 'Jean Martin', amount: '149,50 €', status: 'processing', date: '2024-01-14' },
  { id: '#ORD-003', customer: 'Sophie Bernard', amount: '65,00 €', status: 'pending', date: '2024-01-14' },
  { id: '#ORD-004', customer: 'Pierre Petit', amount: '210,75 €', status: 'completed', date: '2024-01-13' },
  { id: '#ORD-005', customer: 'Lucie Robert', amount: '45,90 €', status: 'cancelled', date: '2024-01-13' },
];

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function RecentOrders() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
            <th className="pb-3 px-6">Commande</th>
            <th className="pb-3">Client</th>
            <th className="pb-3">Montant</th>
            <th className="pb-3">Statut</th>
            <th className="pb-3">Date</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="py-4 px-6">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900">{order.id}</span>
                </div>
              </td>
              <td className="py-4">
                <p className="font-medium">{order.customer}</p>
              </td>
              <td className="py-4">
                <p className="font-semibold">{order.amount}</p>
              </td>
              <td className="py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                  {order.status === 'completed' && 'Complété'}
                  {order.status === 'processing' && 'En traitement'}
                  {order.status === 'pending' && 'En attente'}
                  {order.status === 'cancelled' && 'Annulé'}
                </span>
              </td>
              <td className="py-4">
                <p className="text-gray-600">{order.date}</p>
              </td>
              <td className="py-4">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}