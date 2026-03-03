"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexte/AuthContext";
import { useOrders } from "@/contexte/OrderContext";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone, Shield,
  Edit,
  Package, LogOut, Camera,
  Calendar, CheckCircle, Loader2, User2
} from "lucide-react";
import EditProfileModal from "@/components/customer/users/EditProfileModal";

export default function ProfilPage() {
  const { user, loading: authLoading, logout } = useAuthContext();
  const { orders, loading: ordersLoading, fetchOrders } = useOrders();
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("infos");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);


  if (authLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-neutral-800 mx-auto mb-4" />
          <p className="text-neutral-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;




  // Calculer le nombre de commandes
  const orderCount = orders?.length || 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100">
      {/* MODAL CONFIRMATION DECONNEXION */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900">Déconnexion</h3>
              <p className="text-neutral-600 mt-2">
                Êtes-vous sûr de vouloir vous déconnecter ?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-xl text-neutral-700 font-medium hover:bg-neutral-50 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT PROFIL */}
      <EditProfileModal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        user={user}
      />

      {/* HEADER AVEC BANNIERE */}
      <div className="relative h-48 md:h-64 bg-linear-to-r from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1200')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>

      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-20 pb-12">
        {/* CARTE PROFIL */}
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* AVATAR AVEC UPLOAD */}
            <div className="relative group">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-linear-to-br from-neutral-200 to-neutral-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">

                <User2 size={80} className="text-neutral-500" />
              </div>
              <button className="absolute bottom-0 right-0 bg-neutral-900 text-white p-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-neutral-800">
                <Camera size={16} />
              </button>
            </div>

            {/* INFOS RAPIDES */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                    {user.first_name} {user.last_name}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-sm text-neutral-600">
                      <Mail size={14} />
                      {user.email}
                    </span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                    <span className="flex items-center gap-1 text-sm">
                      <Shield size={14} className="text-green-500" />
                      <span className="text-green-600 font-medium">Compte vérifié</span>
                    </span>
                  </div>
                </div>

                {/* BADGE ROLE - Récupéré depuis l'utilisateur connecté */}
                <div className="flex items-center gap-3">


                  <button
                    onClick={() => setOpenEdit(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-white border-2 border-neutral-900 text-neutral-900 rounded-xl hover:bg-neutral-900 hover:text-white transition-all duration-300 group"
                  >
                    <Edit size={18} className="group-hover:rotate-12 transition-transform" />
                    Modifier
                  </button>
                </div>
              </div>

              {/* STATS RAPIDES - Nombre de commandes basé sur le contexte Order */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-neutral-50 rounded-xl p-3 text-center">
                  <Package className="h-5 w-5 text-neutral-600 mx-auto mb-1" />
                  <p className="text-sm text-neutral-600">Commandes</p>
                  <p className="font-semibold text-neutral-900">{orderCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "infos", label: "Informations", icon: User },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/25"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENU DES TABS */}
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-6 md:p-8">
          {activeTab === "infos" && (
            <div className="space-y-8">
              {/* INFORMATIONS PERSONNELLES */}
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <User size={20} />
                  Informations personnelles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    icon={<User className="text-blue-500" />}
                    label="Nom complet"
                    value={`${user.first_name} ${user.last_name}`}
                  />

                  <InfoCard
                    icon={<Mail className="text-green-500" />}
                    label="Email"
                    value={user.email}
                    verified
                  />

                  <InfoCard
                    icon={<Phone className="text-purple-500" />}
                    label="Téléphone"
                    value={user.phone || "Non renseigné"}
                    action="Ajouter"
                  />

                  <InfoCard
                    icon={<Calendar className="text-amber-500" />}
                    label="Membre depuis"
                    value={new Date(user.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  />
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// COMPOSANTS REUTILISABLES
function InfoCard({ icon, label, value, verified, action }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  verified?: boolean;
  action?: string;
}) {
  return (
    <div className="bg-neutral-50 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs text-neutral-500 uppercase tracking-wide">
            {label}
          </span>
        </div>
        {verified && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle size={12} />
            Vérifié
          </span>
        )}
      </div>
      <p className="text-neutral-900 font-medium">{value}</p>
      {action && (
        <button className="mt-2 text-xs text-blue-600 hover:text-blue-700">
          {action}
        </button>
      )}
    </div>
  );
}