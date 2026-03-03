import Link from "next/link";

/**
 * Type représentant un élément du fil d'Ariane
 */
export interface BreadcrumbItem {
  label: string;
  href?: string; // optionnel → dernier élément non cliquable
}

/**
 * Composant Breadcrumbs
 * Affiche le parcours de navigation de l'utilisateur
 * Compatible SEO et accessibilité
 */
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    /**
     * <nav> : élément sémantique pour la navigation
     * aria-label : aide les lecteurs d'écran
     */
    <nav aria-label="Fil d’ariane" className="breadcrumbs text-sm">
      <ul>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index}>
              {item.href && !isLast ? (
                /**
                 * Lien cliquable pour les étapes intermédiaires
                 */
                <Link
                  href={item.href}
                  className="hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                /**
                 * Dernier élément :
                 * - non cliquable
                 * - indique la page courante
                 */
                <span aria-current="page" className="font-medium">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
