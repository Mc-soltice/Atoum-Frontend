"use client";

import { useAuthContext } from "@/contexte/AuthContext";
import { useCategories } from "@/contexte/CategoryContext";
import { useOrders } from "@/contexte/OrderContext";
import { useProducts } from "@/contexte/ProductContext";
import { useUsers } from "@/contexte/UserContext";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo } from "react";

// Type guard pour vérifier la présence d'une adresse de livraison
function hasShippingAddress(
  o: unknown,
): o is { shipping_address: { first_name?: string; last_name?: string } } {
  return typeof o === "object" && o !== null && "shipping_address" in o;
}

// Composant de carte statistique
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: "blue" | "green" | "purple" | "orange" | "red";
}

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

  const iconClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div
      className={`rounded-xl border ${colorClasses[color]} p-6 transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`rounded-full p-3 ${iconClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

// Composant de tableau simplifié
interface SimpleTableProps {
  title: string;
  headers: string[];
  data: Array<Record<string, unknown>>;
  emptyMessage: string;
}

function SimpleTable({ title, headers, data, emptyMessage }: SimpleTableProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <BarChart3 className="h-5 w-5 text-gray-400" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="pb-3 text-left text-sm font-medium text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="py-8 text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                >
                  {headers.map((header, cellIndex) => (
                    <td key={cellIndex} className="py-4 text-sm">
                      {(row[
                        header.toLowerCase().replace(/\s+/g, "_")
                      ] as React.ReactNode) || (row[header] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Composant d'alerte
function Alert({
  type,
  message,
}: {
  type: "warning" | "info";
  message: string;
}) {
  const styles = {
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[type]}`}>
      <div className="flex items-center">
        <AlertCircle className="mr-3 h-5 w-5" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Contextes
  const { user: authUser } = useAuthContext();
  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategories();
  const {
    orders,
    loading: ordersLoading,
    getTotalRevenue,
    fetchOrders,
  } = useOrders();
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { users, loading: usersLoading, fetchUsers } = useUsers();

  // Charger les données au montage du composant
  useEffect(() => {
    fetchOrders();
    fetchCategories();
    fetchProducts();
    fetchUsers();
  }, [fetchOrders, fetchCategories, fetchProducts, fetchUsers]);

  // Données dérivées
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5)
      .map((order) => {
        let customer = "N/A";
        if (hasShippingAddress(order)) {
          const sa = order.shipping_address;
          if (sa && typeof sa === "object") {
            customer = `${sa.first_name} ${sa.last_name}`;
          }
        }

        return {
          référence: order.reference,
          client: customer,
          montant: `${order.total_amount.toFixed(2)} €`,
          statut: order.status.label,
          produits: order.items.length,
          date: new Date(order.created_at).toLocaleDateString(),
        };
      });
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return products
      .filter((product) => product.stock < 10 && !product.is_out_of_stock)
      .slice(0, 5)
      .map((product) => ({
        nom: product.name,
        catégorie: product.category?.name || "N/A",
        stock: product.stock,
        prix: `${product.price.toFixed(2)} €`,
        statut: "Stock faible",
      }));
  }, [products]);

  // Statistiques calculées
  const totalRevenue = getTotalRevenue();
  const pendingOrders = orders.filter(
    (order) => order.status.value === "pending",
  ).length;
  const outOfStockProducts = products.filter(
    (product) => product.is_out_of_stock,
  ).length;
  const activeUsers = users.filter((user) => !user.is_locked).length;

  const isLoading =
    categoriesLoading || ordersLoading || productsLoading || usersLoading;

  if (isLoading) {
    return (
      <div className="modal modal-open" role="dialog" aria-modal="true">
        <div className="modal-box">
          <div className="flex justify-center items-center h-64">
            <DotSpinner size="35" speed="0.9" color="black" />
            <span className="ml-3">Chargement du tableau de bord</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0">
      {/* En-tête */}
      <div className="mb-5">
        <p className="mt-2 text-gray-600">
          Bonjour {authUser?.email}, voici un aperçu de votre activité.
        </p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Calendar className="mr-2 h-4 w-4" />
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Alertes */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {outOfStockProducts > 0 && (
          <Alert
            type="warning"
            message={`${outOfStockProducts} produit(s) en rupture de stock`}
          />
        )}
        {pendingOrders > 0 && (
          <Alert
            type="info"
            message={`${pendingOrders} commande(s) en attente de traitement`}
          />
        )}
      </div>

      {/* Grille des statistiques */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenu total"
          value={`${totalRevenue.toFixed(2)} €`}
          icon={<DollarSign className="h-6 w-6" />}
          trend="+12% ce mois"
          color="green"
        />

        <StatCard
          title="Commandes"
          value={orders.length}
          icon={<ShoppingCart className="h-6 w-6" />}
          trend={`${pendingOrders} en attente`}
          color="blue"
        />

        <StatCard
          title="Produits"
          value={products.length}
          icon={<Package className="h-6 w-6" />}
          trend={`${outOfStockProducts} rupture`}
          color="purple"
        />

        <StatCard
          title="Utilisateurs"
          value={users.length}
          icon={<Users className="h-6 w-6" />}
          trend={`${activeUsers} actifs`}
          color="orange"
        />
      </div>

      {/* Tableaux */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SimpleTable
          title="Commandes récentes"
          headers={[
            "Référence",
            "Client",
            "Montant",
            "Statut",
            "Produits",
            "Date",
          ]}
          data={recentOrders}
          emptyMessage="Aucune commande récente"
        />

        <SimpleTable
          title="Produits en faible stock"
          headers={["Nom", "Catégorie", "Stock", "Prix", "Statut"]}
          data={lowStockProducts}
          emptyMessage="Aucun produit en faible stock"
        />
      </div>

      {/* Vue d'ensemble */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Catégories</h3>
          <div className="space-y-3">
            {categories.slice(0, 4).map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <span className="font-medium">{category.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(category.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-center text-gray-400">Aucune catégorie</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Statut des commandes</h3>
          <div className="space-y-4">
            {["pending", "processing", "delivered", "cancelled"].map(
              (status) => {
                const count = orders.filter(
                  (o) => o.status.value === status,
                ).length;
                const percentage =
                  orders.length > 0 ? (count / orders.length) * 100 : 0;

                return (
                  <div key={status}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="capitalize">{status}</span>
                      <span>
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Aperçu rapide</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Utilisateurs actifs</span>
              <span className="font-semibold">
                {activeUsers}/{users.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Produits promotionnels</span>
              <span className="font-semibold">
                {products.filter((p) => p.is_promotional).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Panier moyen</span>
              <span className="font-semibold">
                {orders.length > 0
                  ? (totalRevenue / orders.length).toFixed(2)
                  : 0}{" "}
                €
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer du dashboard */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Données mises à jour à{" "}
          {new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
