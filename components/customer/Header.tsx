"use client";

import { useAuthContext } from "@/contexte/AuthContext";
import { useCart } from "@/contexte/panier/CartContext";
import { LogOut, Menu, Package, Search, Settings, ShoppingBag, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { getTotalItems } = useCart();
  const { user, loading, logout } = useAuthContext();
  const cartItemCount = getTotalItems();
  const pathname = usePathname();

  // check du role de l'utilisateur connecter
  const isAdmin = user?.role.includes("admin") ?? false;
  const isGestionnaire = user?.role.includes("gestionnaire") ?? false;
  const canAccessDashboard = isAdmin || isGestionnaire;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen || isUserMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen, isUserMenuOpen]);

  // Fermer le menu utilisateur quand on clique n'importe où sur l'écran
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };

    if (isUserMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isUserMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Produits", path: "/produits" },
    { name: "Promotions", path: "/promotions" },
    { name: "À propos", path: "/about" },
  ];

  // Fermer tous les menus
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header
        className={`
    sticky top-0 z-50 w-full
    transition-all duration-300 ease-in-out
    ${scrolled
            ? "bg-white/70 backdrop-blur-xl shadow-sm"
            : "bg-white/50 backdrop-blur-lg"
          }
    border-b border-stone-200/40
  `}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo et Navigation Desktop */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={closeAllMenus}
            >
              <Image
                src="/images/Logo.png"
                alt="Logo Atoum-ra"
                className="fit-content"
                loading="eager"
                width={100}
                height={50}
              />
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-amber-600 ${pathname === link.path ? "text-amber-600" : "text-stone-600"
                    }`}
                  onClick={closeAllMenus}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions Droite */}
          <div className="flex items-center gap-4">
            {/* Search Bar Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:block relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="
                    w-64 px-4 py-2 pl-10 rounded-lg
                    border border-stone-300
                    focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500
                    bg-white text-sm text-stone-700
                    transition-colors
                  "
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </form>

            {/* Search Button Mobile */}
            <Link
              href="/recherche"
              className="lg:hidden p-2 text-stone-600 hover:text-amber-600 transition-colors"
              onClick={closeAllMenus}
            >
              <Search className="w-5 h-5" />
            </Link>
            {/* Cart */}
            <Link
              href="/panier"
              className="p-2 text-stone-600 hover:text-amber-600 transition-colors relative"
              onClick={closeAllMenus}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* Historique (visible uniquement pour utilisateurs authentifiés) */}
            {!loading && user && (
              <Link
                href="/historique"
                className="p-2 text-stone-600 hover:text-amber-600 transition-colors relative"
                onClick={closeAllMenus}
              >
                <Package className="w-5 h-5" />
              </Link>
            )}

            {/* User Menu */}
            {!loading && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 text-stone-600 hover:text-amber-600 transition-colors relative"
                  aria-label="Menu utilisateur"
                >
                  <User className="w-5 h-5" />
                  {user && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                {/* Dropdown Menu */}
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

                          {canAccessDashboard && (
                            <Link
                              href="/admin"
                              onClick={closeAllMenus}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50"
                            >
                              <Package className="w-4 h-4" />
                              Tableau de Bord
                            </Link>
                          )}

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
                          <Link
                            href="/register"
                            onClick={closeAllMenus}
                            className="block px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors text-center"
                          >
                            Créer un compte
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}



            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-stone-600 hover:text-amber-600 transition-colors"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsUserMenuOpen(false);
              }}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden border-t border-stone-100">
          <form onSubmit={handleSearch} className="px-4 py-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des produits..."
                className="
                  w-full px-4 py-2.5 pl-10 pr-4 rounded-lg
                  border border-stone-300
                  focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500
                  bg-white text-sm text-stone-700
                "
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
          </form>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30"
          onClick={closeAllMenus}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`
          md:hidden fixed top-0 left-0 z-50 h-full w-80 bg-white
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          shadow-2xl
        `}
      >
        <div className="h-full flex flex-col">
          {/* Menu Header */}
          <div className="p-6 border-b border-stone-100">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={closeAllMenus}
              >
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white">
                  <span className="font-bold text-xl">A</span>
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-800">
                  Atoum-ra
                </span>
              </Link>
              <button
                onClick={closeAllMenus}
                className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Info Mobile */}
            {!loading && user && (
              <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm font-medium text-stone-800">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-stone-500 mt-1">{user.email}</p>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={closeAllMenus}
                  className={`
                    block px-4 py-3.5 rounded-lg text-sm font-medium
                    transition-colors
                    ${pathname === link.path
                      ? "bg-amber-50 text-amber-600"
                      : "text-stone-600 hover:bg-stone-50"
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Additional Mobile Links */}
            <div className="mt-8 pt-4 border-t border-stone-100 space-y-1">
              {!loading && !user && (
                <>
                  <Link
                    href="/login"
                    onClick={closeAllMenus}
                    className="block px-4 py-3.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeAllMenus}
                    className="block px-4 py-3.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Créer un compte
                  </Link>
                </>
              )}

              {!loading && user && (
                <Link
                  href="/historique"
                  onClick={closeAllMenus}
                  className="block px-4 py-3.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Mes Commandes
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={closeAllMenus}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  Tableau de Bord Admin
                </Link>
              )}

              {user && (
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <Link
                    href="/logout"
                    onClick={closeAllMenus}
                    className="block px-4 py-3.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-center"
                  >
                    Déconnexion
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
