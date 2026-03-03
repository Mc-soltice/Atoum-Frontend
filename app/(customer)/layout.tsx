import ClientLayout from "@/components/providers/ClientLayout";

/**
 * Métadonnées SEO (SERVER SIDE ✅)
 */
export const metadata = {
  title: {
    default: "Atoum-ra | Produits naturels authentiques",
    template: "%s | Atoum-ra",
  },
  description: "Atoum-ra propose des produits naturels africains de qualité.",
  keywords: [
    "produits naturels",
    "bien-être",
    "plantes africaines",
    "Atoum-ra",
  ],
  openGraph: {
    title: "Atoum-ra",
    description: "Produits naturels authentiques",
    siteName: "Atoum-ra",
    locale: "fr_FR",
    type: "website",
  },
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
