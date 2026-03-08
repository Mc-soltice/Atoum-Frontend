"use client";

import {
  Facebook,
  Instagram, Mail,
  MapPin,
  Phone,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const contactInfo = {
    address: "Akwa Nord à côté de Santa Lucia, Douala, Cameroon",
    phone: "+237 6 59  08 95 24",
    email: "atoummbianga.si.forever@gmail.com",
    social: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
  };

  const quickLinks = [
    { label: "Accueil", href: "/" },
    { label: "Nos Services", href: "/#services" },
    { label: "À Propos", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  const engagements = [
    {
      title: "100% naturel et biologique",
      description: "Certifié sans produits chimiques",
    },
    {
      title: "Sans conservateurs chimiques",
      description: "Conservation naturelle uniquement",
    },
    {
      title: "Production éthique et durable",
      description: "Respect des producteurs et de l'environnement",
    },
    {
      title: "Livraison rapide et gratuite",
      description: "À partir de 50€ d'achat",
    },
  ];

  return (
    <footer
      className="bg-linear-to-br from-amber-800 via-amber-500 to-amber-700 text-amber-50"
      role="contentinfo"
      aria-label="Pied de page"
    >
      <div className="px-4 py-10 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Version compacte : 2 colonnes sur desktop, 1 sur mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Colonne gauche : Logo + Réseaux + Contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden shrink-0 ring-2 ring-amber-300/30">
                  <Image
                    src="/images/Logo.png"
                    alt="Logo Atoum-ra"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <span className="font-bold text-2xl text-amber-50 block leading-tight drop-shadow-lg">
                    Atoum-ra
                  </span>
                  <span className="text-sm text-amber-200/90">
                    Excellence en bois
                  </span>
                </div>
              </div>

              <p className="text-amber-100/90 text-sm leading-relaxed max-w-sm drop-shadow">
                Solutions professionnelles de transformation et construction en bois pour des espaces impeccables et performants.
              </p>

              <div className="flex space-x-2">
                <SocialLink href={contactInfo.social.facebook} label="Facebook" ariaLabel="Facebook">
                  <Facebook size={18} />
                </SocialLink>
                <SocialLink href={contactInfo.social.twitter} label="Twitter" ariaLabel="X (Twitter)">
                  <X size={18} />
                </SocialLink>
                <SocialLink href={contactInfo.social.instagram} label="Instagram" ariaLabel="Instagram">
                  <Instagram size={18} />
                </SocialLink>

              </div>

              {/* Contacts compacts mais visibles */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-amber-100/90 hover:text-amber-50 transition-colors text-sm group">
                  <Phone size={16} className="group-hover:scale-110 transition-transform" />
                  <span>{contactInfo.phone}</span>
                </a>
                <a href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2 text-amber-100/90 hover:text-amber-50 transition-colors text-sm group">
                  <Mail size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="truncate">{contactInfo.email}</span>
                </a>
                <span className="flex items-center gap-2 text-amber-100/90 text-sm">
                  <MapPin size={16} />
                  <span className="truncate">Douala, Cameroon</span>
                </span>
              </div>
            </div>

            {/* Colonne droite : Liens rapides + Engagements en deux sous-colonnes */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Navigation */}
              <div>
                <h3 className="text-base font-semibold mb-3 text-amber-50 border-b border-amber-300/40 pb-1 drop-shadow">
                  Navigation
                </h3>
                <ul className="space-y-2" role="list">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <QuickLink href={link.href}>{link.label}</QuickLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engagements */}
              <div>
                <h3 className="text-base font-semibold mb-3 text-amber-50 border-b border-amber-300/40 pb-1 drop-shadow">
                  Engagements
                </h3>
                <ul className="space-y-3" role="list">
                  {engagements.map((engagement, index) => (
                    <li key={index}>
                      <EngagementItemCompact
                        title={engagement.title}
                        description={engagement.description}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Séparateur et copyright */}
          <div className="border-t border-amber-300/30 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-amber-100/80 text-sm order-2 md:order-1 drop-shadow">
                © {new Date().getFullYear()} <span className="font-semibold text-amber-50">Atoum-ra</span>. Tous droits réservés.
              </p>

              {/* Liens légaux */}
              <div className="flex gap-6 text-sm order-1 md:order-2">
                <LegalLink href="/mentions-legales">Mentions légales</LegalLink>
                <LegalLink href="/confidentialite">Confidentialité</LegalLink>
              </div>

              {/* Retour en haut compact */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-amber-100/80 font-medium text-lg  hover:text-amber-50 transition-colors flex items-center gap-1 order-3 group"
                aria-label="Retour en haut"
              >
                <span className="group-hover:-translate-y-1 transition-transform animate-bounce bounce-up ">↑</span> Retour en haut
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Composants réutilisables
function SocialLink({
  href,
  label,
  ariaLabel,
  children,
}: {
  href: string;
  label: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={ariaLabel}
      title={label}
      className="text-amber-100/90 hover:text-amber-50 transition-all duration-300 p-2 hover:bg-amber-600/40 rounded-full active:scale-95"
    >
      {children}
    </a>
  );
}

function QuickLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group text-amber-100/90 hover:text-amber-50 transition-all duration-300 block text-sm"
    >
      <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">
        → {children}
      </span>
    </Link>
  );
}

function EngagementItemCompact({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="group flex items-start text-amber-100/90 hover:text-amber-50 transition-colors duration-300">
      <span className="mr-2 text-amber-300 text-base shrink-0 drop-shadow">✓</span>
      <div className="transition-all duration-300 group-hover:translate-x-0.5">
        <span className="font-medium text-white block text-sm leading-tight drop-shadow">
          {title}
        </span>
        <p className="text-xs text-amber-200/90 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}

function LegalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="hover:text-amber-50 transition-colors duration-300 text-amber-100/80 text-sm drop-shadow"
    >
      {children}
    </Link>
  );
}

export default Footer;