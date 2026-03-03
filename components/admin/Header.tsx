"use client";


import { useAuthContext } from "@/contexte/AuthContext";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  Store,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout } = useAuthContext();

  /**
   * Détermine le titre à afficher dans le header
   * en fonction de la route active
   */
  const getPageTitle = () => {
    if (pathname === "/admin") return "Tableau de bord";
    if (pathname.startsWith("/admin/users")) return "Gestion des utilisateurs";
    if (pathname.startsWith("/admin/categories"))
      return "Catégories de produits";
    if (pathname.startsWith("/admin/products")) return "Gestion des produits";
    if (pathname.startsWith("/admin/settings")) return "Paramètres";
    return "Administration";
  };
  // Fermer tous les menus
  const closeAllMenus = () => {
    setIsUserMenuOpen(false);
  };

  /**
   * Détermine le sous-titre (chemin de navigation)
   */
  const getBreadcrumb = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length <= 1) return "Accueil";

    const lastPart = parts[parts.length - 1];
    if (lastPart === "admin") return "Dashboard";

    return parts
      .slice(1)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" / ");
  };

  return (
    <header
      className="sticky top-0 z-40 h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between"
      role="banner"
    >
      {/* Côté gauche : Titre et navigation */}
      <div className="flex items-center gap-4">
        {/* Bouton menu mobile (caché sur desktop) */}
        <button
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
          aria-label="Menu principal"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Titre principal */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-xs text-gray-500">{getBreadcrumb()}</p>
        </div>
      </div>

      {/* Côté droit : Actions et utilisateur */}
      <div className="flex items-center gap-4">
        {/* Barre de recherche */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-64"
            aria-label="Rechercher dans l'administration"
          />
        </div>

        {/* Bouton recherche mobile */}
        <button className="md:hidden p-2 hover:bg-gray-100 rounded-md">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 hover:bg-gray-100 rounded-md"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Dropdown notifications */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="font-medium text-sm">Notifications</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-50">
                  <p className="text-sm font-medium">Nouveau produit ajouté</p>
                  <p className="text-xs text-gray-500 mt-1">Il y a 5 minutes</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50">
                  <p className="text-sm font-medium">
                    Nouvel utilisateur inscrit
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Il y a 1 heure</p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-sm text-blue-600 hover:text-blue-800 w-full text-left">
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Séparateur */}
        <div className="h-6 w-px bg-gray-300"></div>

        {/* Profil utilisateur */}
        <div className="relative ">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded-lg"
            aria-label="Menu utilisateur"
          >
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">
                {user?.first_name || user?.email?.split("@")[0] || "Mon compte"}
              </p>
              <p className="text-xs text-gray-500"> {user?.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Dropdown utilisateur */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div
                className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="border-t border-gray-100 my-1"></div>

                    <Link
                      href="/home"
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <Store className="w-4 h-4" />
                      Boutique
                    </Link>

                    <Link
                      href="/profil"
                      onClick={closeAllMenus}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Paramètres
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <Link
                      href="/home"
                      onClick={logout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={closeAllMenus}
                      className="block px-4 py-3 text-sm font-medium text-amber-600 hover:bg-amber-50 text-center transition-colors"
                    >
                      Se connecter
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
