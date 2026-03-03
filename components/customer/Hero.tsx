import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";

export default function Hero() {
  const benefits = [
    {
      icon: Star,
      title: "Qualité Traditionnelle",
      desc: "Plantes 100% naturelles sans additifs, récoltées dans le respect des traditions ancestrales.",
    },
    {
      icon: ShieldCheck,
      title: "Sagesse Ancestrale",
      desc: "Retour à la tradition authentique depuis la nuit des temps, guidé par la lumière immortelle.",
    },
    {
      icon: Zap,
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
          src="/images/Hero.jpg"
          alt="Collection Atoum-ra - Essence de la Nature"
          fill
          priority
          className="absolute inset-0 w-full h-full object-cover scale-105"
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
      <section className="container mx-auto px-4 grid md:grid-cols-3 gap-6 -mt-14 relative z-30">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white/95 backdrop-blur-sm px-8 py-2 rounded-2xl shadow-2xl shadow-stone-200/70 border border-amber-100 group hover:-translate-y-3 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="w-14 h-14 bg-linear-to-br from-amber-50 to-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:from-amber-500 group-hover:to-emerald-500 transition-all duration-500">
              <benefit.icon className="w-7 h-7 text-amber-700 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-stone-800">
              {benefit.title}
            </h3>
            <p className="text-stone-600 leading-relaxed">{benefit.desc}</p>

            {/* Séparateur décoratif */}
            <div className="mt-3 pt-3 border-t border-amber-100 group-hover:border-amber-300 transition-colors">
              <p className="text-sm text-stone-500 italic">
                {index === 0 &&
                  "Par des plantes, existence de notre âme et cœur"}
                {index === 1 && "Guidé par la volonté de l'universel"}
                {index === 2 && "Adoptons la pharmacopée verte et polyvalente"}
              </p>
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
