import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const benefits = [
    {
      title: "Qualité Traditionnelle",
      desc: "Plantes 100% naturelles sans additifs, récoltées dans le respect des traditions ancestrales.",
    },
    {
      title: "Sagesse Ancestrale",
      desc: "Retour à la tradition authentique depuis la nuit des temps, guidé par la lumière immortelle.",
    },
    {
      title: "Énergie Guérisseuse",
      desc: "Propriétés médicinales aux multiples faveurs pour un bien-être radical et conscient.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[55vh] flex items-center overflow-hidden">
        {/* Overlay avec dégradé subtil */}
        <div className="absolute inset-0 bg-linear-to-br from-stone-900/50 via-amber-900/30 to-emerald-900/40 z-10"></div>

        {/* Image de fond */}
        <Image
          src="/images/Hero2.png"
          alt="Collection Atoum-ra - Essence de la Nature"
          fill
          priority
          className=" absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* Contenu principal */}
        <div className="container mx-auto px-4 relative z-20 text-white">
          <div className="max-w-3xl space-y-6 pt-20">
            <div className="flex flex-wrap  gap-4">
              <Link
                href="/about"
                className="bg-linear-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-amber-500/30"
              >
                Découvrir notre histoire <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/about"
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:shadow-lg"
              >
                Notre sagesse ancestrale
              </Link>
            </div>
          </div>
        </div>

        {/* Élément décoratif bas */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-white/50 to-transparent z-10"></div>
      </section>

      {/* Section Avantages */}
      <section className="container mx-auto px-4 grid md:grid-cols-3 gap-8 -mt-20 relative z-30">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="group relative"
          >
            {/* Effet de glow au survol */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-amber-500 to-stone-500 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500"></div>

            {/* Carte principale */}
            <div className="relative bg-linear-to-br from-amber-50/90 to-stone-50/90 backdrop-blur-md px-8 py-6 rounded-2xl shadow-xl shadow-stone-300/30 border border-white/40 group-hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-200/30">

              {/* Icône décorative (optionnelle) */}
              <div className="absolute top-4 right-4 text-amber-200/50 group-hover:text-amber-300/70 transition-colors duration-500">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-3 text-stone-800 relative z-10">
                {benefit.title}
              </h3>

              <p className="text-stone-600 leading-relaxed relative z-10">
                {benefit.desc}
              </p>

              {/* Séparateur décoratif avec gradient */}
              <div className="mt-4 pt-4 border-t border-gradient-to-r from-transparent via-amber-200/50 to-transparent">
                <p className="text-sm text-stone-500 italic text-center">
                  {index === 0 &&
                    "✨ Par des plantes, existence de notre âme et cœur"}
                  {index === 1 && "🌿 Guidé par la volonté de l'universel"}
                  {index === 2 && "🌸 Adoptons la pharmacopée verte et polyvalente"}
                </p>
              </div>

              {/* Petite décoration en bas */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-amber-200/0 group-hover:bg-amber-300/50 rounded-full transition-all duration-500 group-hover:w-16"></div>
            </div>
          </div>
        ))}
      </section>

      {/* Citation inspirante */}
      <section className="container mx-auto px-4 mt-16 mb-8">
        <div className="bg-linear-to-r from-amber-50/80 to-emerald-50/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-amber-200/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-amber-600 mb-4"></div>
            <p className="text-xl md:text-2xl font-serif text-stone-700 italic leading-relaxed mb-6">
              Gratitude à l&apos;univers pour ce nouveau cycle, l&apos;empire de
              la souveraineté terrestre en floraison. Je reçois avec ma maison
              les bénédictions des mânes supérieurs, aujourd&apos;hui, demain et
              dans l&apos;éternité immortelle.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-amber-400 to-emerald-400 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <p className="font-bold text-stone-800">Atoum-ra Collection</p>
                <p className="text-sm text-stone-600">
                  Essence de la nature en conscience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
