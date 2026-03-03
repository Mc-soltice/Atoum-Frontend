
"use client";

import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";

export default function CartSkeleton() {
  // ================= FIL D'ARIANE SEO =================
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Accueil", href: "/" },
    { label: "Panier", href: "/Panier" },
  ];
  return (
    <div className="max-h-screen px-50 flex flex-col gap-4">
      {/* ================= FIL D'ARIANE DE NAVIGATION ================= */}
      <Breadcrumbs items={breadcrumbs} />
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4 bg-gray-100 p-6 rounded-lg">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 bg-white p-4 rounded-lg"
            >
              {/* Image */}
              <div className="h-20 w-20 bg-gray-200 rounded" />

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  {/* nom du produit */}
                  <div className="h-3 w-5/10 bg-gray-200 rounded" />
                  {/* prix de l'unite */}
                  <div className="h-4 w-1/10 bg-gray-200 rounded" />
                </div>

                <div className="flex justify-between">
                  {/* Categorie */}
                  <div className="h-3 w-3/10 bg-gray-200 rounded" />
                  {/* prix unique mutiplier par la quantité */}
                  <div className="h-4 w-2/10 bg-gray-200 rounded" />
                </div>

                <div className="flex flex-row justify-between">

                  {/* suprimer et suprimer quand la quantité est inferieure a 1 */}
                  <div className="h-3 w-1/10 bg-gray-200 rounded" />

                  {/* Actions incrementation et decrementation de la quantité */}
                  <div className="flex gap-2">

                    {/* bouton diminuer */}
                    <div className="h-6 w-6 bg-gray-200 rounded-full" />

                    {/* Quantité */}
                    <div className="h-6 w-15 bg-gray-200 rounded-lg" />

                    {/* bouton augmenter */}
                    <div className="h-6 w-6 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

          ))}
        </div>


        {/* Summary */}
        <div className="flex flex-col gap-2">
          {/* Container */}
          <div className="space-y-4 bg-gray-100 p-6 rounded-lg h-fit">

            {/* Montant total */}
            <div className="h-7 w-full bg-gray-200 rounded" />

            {/* Sous total */}
            <div className="h-4 w-full bg-gray-200 rounded" />

            <div className="flex flex-row gap-1 justify-start">
              {/* livraison? */}
              <div className="h-3 w-5/10 bg-gray-200 rounded" />
              {/* Checkbox*/}
              <div className="h-3 w-3 bg-gray-200 rounded-full" />
            </div>
            {/* lieu de la livraison si livraison coché */}
            <div className="h-4 w-full bg-gray-200 rounded" />

            {/* Methode de paiement toggle affichage en fonction de ce qui a été choisie */}
            <div className="h-4 w-4/10 bg-gray-200 rounded" />
            <div className="flex flex-row gap-1 justify-start">
              {/* paiement en ligne */}
              <div className="h-3 w-7/10 bg-gray-200 rounded" />
              {/* Checkbox */}
              <div className="h-3 w-3 bg-gray-200 rounded-full" />
            </div>
            <div className="flex flex-row gap-1 justify-start">
              {/* paiement a la reccuperation */}
              <div className="h-3 w-7/10 bg-gray-200 rounded" />
              {/* Checkbox */}
              <div className="h-3 w-3 bg-gray-200 rounded-full" />
            </div>
            {/* valider la commande: enregistrer la commande ou passer au paiement en fonction de ce qui aura eté choisis */}
            <div className="h-10 w-full bg-gray-300 rounded mt-4" />

          </div>
          {/* accroche */}
          <div className="flex flex-row gap-1">
            {/* Livraison en 48h */}
            <div className="h-15 w-1/3 bg-gray-200 rounded-lg" />
            {/* Paiement securisé */}
            <div className="h-15 w-1/3 bg-gray-200 rounded-lg" />
            {/* Service apres vente */}
            <div className="h-15 w-1/3 bg-gray-200 rounded-lg" />
          </div>
        </div>

      </div>
    </div>
  );
}
