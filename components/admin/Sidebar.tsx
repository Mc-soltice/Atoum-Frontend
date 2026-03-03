"use client";

/**
 * Sidebar Admin
 * - Navigation principale
 * - Chaque lien correspond à une page admin
 */

import {
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  TrendingUpDown,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: "Commandes",
    href: "/admin/orders",
    icon: <ClipboardList className="w-4 h-4" />,
  },

  {
    label: "Produits",
    href: "/admin/products",
    icon: <Package className="w-4 h-4" />,
  },
  {
    label: "Catégories",
    href: "/admin/categories",
    icon: <FolderTree className="w-4 h-4" />,
  },
  {
    label: "Utilisateurs",
    href: "/admin/users",
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: "Mouvements Stock",
    href: "/admin/stock-movements",
    icon: <TrendingUpDown className="w-4 h-4" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 border-r border-black/10 p-4 flex flex-col overflow-y-auto"
      aria-label="Navigation administration"
    >
      {/* Logo / Titre */}
      <header className="mb-8 flex flex-col items-center gap-2">
        <Image
          src="/images/Logo.png"
          alt="Logo Atoum-ra"
          className="fit-content"
          loading="eager"
          width={100}
          height={50}
        />
      </header>

      {/* Navigation principale */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-all duration-200
                ${isActive
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={`${isActive ? "text-white" : "text-gray-500"}`}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Section inférieure */}
      <div className="pt-6 border-t border-gray-200">
        <Link
          href="/admin/settings"
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            transition-all duration-200
            ${pathname === "/admin/settings"
              ? "bg-black text-white"
              : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }
          `}
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </Link>

        <button
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 mt-2"
          onClick={() => {
            /* Logique de déconnexion */
          }}
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
