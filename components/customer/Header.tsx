"use client";

import { useAuthContext } from "@/contexte/AuthContext";
import { useCart } from "@/contexte/panier/CartContext";
import { Globe, LayoutDashboard, LogOut, Menu, Package, Search, Settings, ShoppingBag, User, UserCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [active, setActive] = useState("Accueil");
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { getTotalItems } = useCart();
  const { user, loading, logout } = useAuthContext();
  const cartItemCount = getTotalItems();
  const pathname = usePathname();

  const isAdmin = user?.role.includes("admin") ?? false;
  const isGestionnaire = user?.role.includes("gestionnaire") ?? false;
  const canAccessDashboard = isAdmin || isGestionnaire;

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Produits", path: "/produits" },
    { name: "Promotions", path: "/promotions" },
    { name: "À propos", path: "/about" },
  ];

  // Mettre à jour l'élément actif basé sur le chemin
  useEffect(() => {
    const currentLink = navLinks.find(link => link.path === pathname);
    if (currentLink) {
      setActive(currentLink.name);
    }
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen || isUserMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen, isUserMenuOpen]);

  // Fermer le dropdown menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const getUserInitials = () => {
    if (!user?.first_name) return "U";
    return `${user.first_name.charAt(0)}${user.last_name?.charAt(0) || ""}`.toUpperCase();
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      {/* Navbar avec effet de flou */}
      <nav className="sticky top-0 z-50 px-4 sm:px-6 md:px-7 py-3 sm:py-4 bg-white/60 backdrop-blur-md border-b border-stone-200/40 shadow-sm">
        {/* Container principal */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeAllMenus}>
            <div className="w-4 h-4 sm:w-8 sm:h-8 bg-amber-500 rounded-md flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-base">A</span>
            </div>
            <span className="text-base sm:text-[17px] font-semibold text-stone-800 tracking-tight">
              Atoum<span className="text-amber-600">-ra</span>
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <ul className="hidden md:flex items-center gap-1 ml-6 list-none">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  onClick={() => setActive(link.name)}
                  className={`text-sm font-medium px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap inline-block ${active === link.name
                    ? "bg-amber-500/10 text-amber-600"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Search Bar - Desktop */}
          <div className="hidden sm:flex flex-1 max-w-70 mx-3 md:mx-5">
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2 focus-within:bg-white focus-within:border-amber-400 focus-within:shadow-sm transition-all group w-full">
                <Search className="w-4 h-4 text-stone-400 shrink-0 group-focus-within:text-amber-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des produits..."
                  className="bg-transparent outline-none text-sm text-stone-700 placeholder:text-stone-400 focus:text-stone-800 w-full font-[inherit]"
                />
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Language */}
            <button className="flex items-center gap-1.5 text-sm font-medium text-stone-600 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">FR</span>
            </button>

            <div className="w-px h-5 bg-stone-200" />

            {/* Cart */}
            <Link
              href="/panier"
              className="relative p-2 text-stone-600 hover:text-amber-600 transition-colors"
              onClick={closeAllMenus}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* Historique */}
            {!loading && user && (
              <Link
                href="/historique"
                className="p-2 text-stone-600 hover:text-amber-600 transition-colors"
                onClick={closeAllMenus}
              >
                <Package className="w-5 h-5" />
              </Link>
            )}

            {/* User Section */}
            {!loading && (
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-stone-700 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-linear-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white text-xs font-semibold shadow-md">
                      {getUserInitials()}
                    </div>
                    <span className="hidden lg:inline text-stone-800">
                      {user.first_name || "Utilisateur"}
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="text-sm font-medium text-amber-600 px-3.5 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                    onClick={closeAllMenus}
                  >
                    Connexion
                  </Link>
                )}

                {/* User Dropdown Menu */}
                {isUserMenuOpen && user && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-stone-200 z-50 py-1">
                      <div className="px-4 py-3 border-b border-stone-200">
                        <p className="text-sm font-semibold text-stone-800 truncate">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-stone-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href="/profil"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircle className="w-4 h-4" />
                        Mon Profil
                      </Link>

                      {canAccessDashboard && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Tableau de bord
                        </Link>
                      )}

                      <Link
                        href="/parametres"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Paramètres
                      </Link>

                      <div className="border-t border-stone-200 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-stone-50 transition-colors flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Menu Burger Mobile - Correction du z-index */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden relative z-50 flex items-center justify-center w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 invisible scale-75" : "opacity-100 visible scale-100"
              }`}
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-stone-600" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Correction pour qu'il soit au-dessus de tout le contenu */}
      <div
        className={`
          fixed inset-0 z-100 md:hidden
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen
            ? "bg-black/60 backdrop-blur-sm opacity-100 visible"
            : "bg-black/0 backdrop-blur-none opacity-0 invisible pointer-events-none"
          }
        `}
        onClick={closeAllMenus}
      >
        {/* Mobile Menu Panel */}
        <div
          className={`
            fixed top-0 right-0 h-full w-64 
            bg-white z-101 md:hidden shadow-2xl 
            border-l border-stone-200
            transition-all duration-500 ease-out
            ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Fermeture */}
            <button
              onClick={closeAllMenus}
              className="absolute top-4 right-4 p-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors z-10"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-stone-600" />
            </button>

            {/* Section Utilisateur */}
            {!loading && user ? (
              <div
                className={`
                  relative pt-10 pb-6 px-4
                  border-b border-stone-200
                  transition-all duration-500 ease-out
                  ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}
                `}
                style={{ transitionDelay: isMobileMenuOpen ? "100ms" : "0ms" }}
              >
                <div className="relative flex justify-center">
                  <div className="absolute inset-0 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-amber-500/20 blur-xl"></div>
                  </div>
                  <div className="relative w-20 h-20 rounded-full bg-linear-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-amber-200">
                    {getUserInitials()}
                  </div>
                </div>

                <div className="text-center mt-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="h-px w-6 bg-linear-to-r from-transparent to-stone-300"></div>
                    <h3 className="text-stone-800 font-bold text-base">
                      {user.first_name} {user.last_name}
                    </h3>
                    <div className="h-px w-6 bg-linear-to-l from-transparent to-stone-300"></div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 mt-1.5">
                    <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-stone-500 text-xs truncate max-w-45">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`
                  pt-10 pb-6 px-4
                  border-b border-stone-200
                  transition-all duration-500 ease-out
                  ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}
                `}
                style={{ transitionDelay: isMobileMenuOpen ? "100ms" : "0ms" }}
              >
                <div className="relative flex justify-center">
                  <div className="absolute inset-0 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-amber-500/10 blur-xl"></div>
                  </div>
                  <div className="relative w-20 h-20 rounded-full bg-linear-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg ring-4 ring-amber-200">
                    <User className="w-10 h-10" />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-stone-800 font-bold text-base">Invité</h3>
                  <p className="text-stone-400 text-xs mt-1">
                    Connectez-vous pour accéder<br />à votre compte
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Mobile */}
            <div className="flex-1 px-4 py-4">
              <ul className="list-none space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      onClick={() => {
                        setActive(link.name);
                        closeAllMenus();
                      }}
                      className={`block text-sm font-medium px-3.5 py-2 rounded-lg transition-all w-full ${active === link.name
                        ? "bg-amber-50 text-amber-600"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                        }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div
                className={`
                  h-px bg-stone-200 my-3 transition-all duration-500
                  ${isMobileMenuOpen ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}
                `}
                style={{ transitionDelay: isMobileMenuOpen ? "400ms" : "0ms" }}
              />

              {/* Recherche Mobile */}
              <form onSubmit={handleSearch} className="mb-3">
                <div className="flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2">
                  <Search className="w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="bg-transparent outline-none text-sm text-stone-700 placeholder:text-stone-400 w-full"
                  />
                </div>
              </form>

              <button
                className={`
                  flex items-center gap-2 w-full px-4 py-3 rounded-lg 
                  text-stone-600 hover:bg-stone-100 transition-all duration-300 ease-out
                  ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
                `}
                style={{ transitionDelay: isMobileMenuOpen ? "460ms" : "0ms" }}
              >
                <Globe className="w-4 h-4" />
                <span className="text-base font-medium">Français (FR)</span>
              </button>

              {/* Actions pour utilisateur non connecté */}
              {!loading && !user && (
                <>
                  <Link
                    href="/login"
                    onClick={closeAllMenus}
                    className={`
                      w-full block px-4 py-3 rounded-lg text-amber-600 bg-amber-50
                      transition-all duration-300 ease-out text-center text-base font-medium
                      ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
                    `}
                    style={{ transitionDelay: isMobileMenuOpen ? "520ms" : "0ms" }}
                  >
                    Connexion
                  </Link>

                  <Link
                    href="/login?mode=register"
                    onClick={closeAllMenus}
                    className={`
                      w-full block px-4 py-3 mt-2 text-center text-white 
                      bg-linear-to-r from-amber-500 to-amber-600
                      transition-all duration-300 ease-out text-base font-semibold 
                      rounded-xl shadow-md
                      ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
                    `}
                    style={{ transitionDelay: isMobileMenuOpen ? "580ms" : "0ms" }}
                  >
                    Créer un compte
                  </Link>
                </>
              )}
            </div>

            {/* Liens pour utilisateur connecté */}
            {!loading && user && (
              <div className="border-t border-stone-200 pt-3 pb-6 px-4">
                <Link
                  href="/profil"
                  onClick={closeAllMenus}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-stone-700 hover:bg-stone-100 
                    transition-all duration-300 ease-out text-left text-sm font-medium group
                    ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
                  `}
                  style={{ transitionDelay: isMobileMenuOpen ? "640ms" : "0ms" }}
                >
                  <UserCircle className="w-4 h-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
                  <span>Mon Profil</span>
                </Link>

                <Link
                  href="/panier"
                  onClick={closeAllMenus}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-stone-700 hover:bg-stone-100 
                    transition-all duration-300 ease-out text-left text-sm font-medium group
                    ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
                  `}
                  style={{ transitionDelay: isMobileMenuOpen ? "700ms" : "0ms" }}
                >
                  <ShoppingBag className="w-4 h-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
                  <span>Mon Panier</span>
                  {cartItemCount > 0 && (
                    <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/historique"
                  onClick={closeAllMenus}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-stone-700 hover:bg-stone-100 
                    transition-all duration-300 ease-out text-left text-sm font-medium group
                    ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
                  `}
                  style={{ transitionDelay: isMobileMenuOpen ? "760ms" : "0ms" }}
                >
                  <Package className="w-4 h-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
                  <span>Mes Commandes</span>
                </Link>

                {canAccessDashboard && (
                  <Link
                    href="/admin"
                    onClick={closeAllMenus}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-stone-700 hover:bg-stone-100 
                      transition-all duration-300 ease-out text-left text-sm font-medium group
                      ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
                    `}
                    style={{ transitionDelay: isMobileMenuOpen ? "820ms" : "0ms" }}
                  >
                    <LayoutDashboard className="w-4 h-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
                    <span>Tableau de bord</span>
                  </Link>
                )}

                <div className="h-px bg-stone-200 my-2"></div>

                <button
                  onClick={() => {
                    handleLogout();
                    closeAllMenus();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 bg-red-50
                    transition-all duration-300 ease-out text-left text-sm font-medium group
                    ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
                  `}
                  style={{ transitionDelay: isMobileMenuOpen ? "880ms" : "0ms" }}
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}