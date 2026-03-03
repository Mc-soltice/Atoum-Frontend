"use client";

import {
  User,
  UserRoundPlus,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, JSX } from "react";
import { useAuthContext } from "@/contexte/AuthContext";

// Définition d'un type pour les liens
interface UserLink {
  label: string;
  href: string;
  icon: JSX.Element;
  adminOnly?: boolean; // ✅ Rendre adminOnly optionnel
}

// Définition des liens du dropdown avec le type explicite
const USER_LINKS: UserLink[] = [
  {
    label: "Mon Profil",
    href: "/profil",
    icon: <User size={18} />,
  },
  {
    label: "Paramètres",
    href: "/profil/parametres",
    icon: <Settings size={18} />,
  },
  {
    label: "Administration",
    href: "/admin",
    icon: <Settings size={18} />,
    adminOnly: true, // ✅ Maintenant adminOnly est reconnu
  },
];

interface UserAuthActionsProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
}

export default function UserAuthActions({
  className = "",
  iconSize = 20,
  showText = false,
}: UserAuthActionsProps) {
  const { user, loading, logout } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-auth-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className={`p-2 ${className}`}>
        <div className="h-5 w-5 animate-pulse bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={`
          flex items-center gap-2 p-2 rounded-md
          text-gray-700 hover:text-black 
          hover:bg-gray-100 active:bg-gray-200 
          transition-colors
          ${className}
        `}
        aria-label="Se connecter"
      >
        <UserRoundPlus size={iconSize} />
        {showText && <span className="text-sm font-medium">Connexion</span>}
      </Link>
    );
  }

  // Filtrer les liens selon les permissions
  const filteredLinks = USER_LINKS.filter(
    (link) => !link.adminOnly || user?.role === "admin", // ✅ Note: role (pas roles) d'après votre type User
  );

  return (
    <div className="user-auth-dropdown relative">
      {/* ===== BOUTON TOUJOURS VISIBLE ===== */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className={`
        flex items-center gap-2 p-2 rounded-md
        text-gray-700 hover:text-black
        hover:bg-gray-100 active:bg-gray-200
        transition-colors
        ${className}
      `}
        aria-label="Menu utilisateur"
      >
        <User size={iconSize} />

        {showText && (
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium leading-tight">
              {user.first_name || user.email?.split("@")[0] || "Mon compte"}
            </span>
            <span className="text-xs text-gray-500">
              {user.role === "admin" ? "Administrateur" : "Client"} {/* ✅ Note: role (pas roles) */}
            </span>
          </div>
        )}

        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* ===== DROPDOWN ===== */}
      {isDropdownOpen && (
        <ul
          className="
          absolute right-0 mt-2
          bg-white rounded-lg
          shadow-lg border border-gray-200
          w-64 p-2 z-50
          animate-in fade-in slide-in-from-top-2
        "
        >
          {/* Header */}
          <li className="px-3 py-2 mb-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-gray-700">
                  {user.first_name || user.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </li>

          {/* Liens */}
          {filteredLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsDropdownOpen(false)}
                className="
                flex items-center gap-3 px-3 py-3
                rounded-lg text-gray-700
                hover:bg-gray-50 active:bg-gray-100
                transition-colors
              "
              >
                <span className="text-gray-600">{link.icon}</span>
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            </li>
          ))}

          <div className="h-px bg-gray-100 my-2" />

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="
              flex items-center gap-3 w-full
              px-3 py-3 rounded-lg
              text-red-600 hover:bg-red-50
              transition-colors
            "
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Se déconnecter</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}