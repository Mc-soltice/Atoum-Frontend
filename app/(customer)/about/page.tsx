// app/about/page.tsx
// Page "À propos" avec galerie de cartes modernes et ambiance chaude

"use client";

import { AnimatePresence, backOut, motion } from "framer-motion";

import {
  ArrowRight,
  Droplets,
  Flower2,
  Gem,
  Globe,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkle,
  Sparkles,
  Star,
  Sun,
  Trees,
} from "lucide-react";
import { useState } from "react";

export default function AboutPage() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  /**
   * Données des cartes pour la galerie
   * Chaque carte représente un aspect de la thématique
   */
  const cards = [
    {
      id: 1,
      title: "Thérapie Élémentale",
      description:
        "Soins par les plantes médicinales biologiques, harmonie avec les 4 éléments suprêmes.",
      icon: <Leaf className="h-10 w-10" />,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      rotation: -3,
      delay: 0.1,
      content:
        "Atoum-Râ Mbianga est une herboriste qui soigne avec les plantes médicinales biologiques, en harmonie avec les éléments naturels.",
    },
    {
      id: 2,
      title: "Mémoire Ancestrale",
      description: "Culture noble Bantou, sagesse vivante depuis des siècles.",
      icon: <Trees className="h-10 w-10" />,
      color: "from-amber-600 to-orange-500",
      bgColor: "bg-amber-500/10",
      rotation: 2,
      delay: 0.2,
      content:
        "Notre culture africaine Bantou conserve une mémoire ancestrale vivante, en connexion avec l'esprit de la nature.",
    },
    {
      id: 3,
      title: "Pierre & Énergie",
      description: "Pierres de protection, énergétiques et purification.",
      icon: <Gem className="h-10 w-10" />,
      color: "from-purple-600 to-indigo-500",
      bgColor: "bg-purple-500/10",
      rotation: -1,
      delay: 0.3,
      content:
        "Pierres de protection, bijoux énergétiques et amulettes chargées de lumière divine.",
    },
    {
      id: 4,
      title: "Rituels Sacrés",
      description: "Cérémonies de purification et connexion spirituelle.",
      icon: <Sparkles className="h-10 w-10" />,
      color: "from-blue-600 to-cyan-500",
      bgColor: "bg-blue-500/10",
      rotation: 1,
      delay: 0.4,
      content:
        "Rituels de purification, encens consacrés et cérémonies pour harmoniser l'énergie vitale.",
    },
    {
      id: 5,
      title: "Guérison Divine",
      description: "La lumière Imana, principe divin manifesté.",
      icon: <Sun className="h-10 w-10" />,
      color: "from-yellow-500 to-orange-400",
      bgColor: "bg-yellow-500/10",
      rotation: -2,
      delay: 0.5,
      content:
        "Ici, nous guérissons par la lumière Imana, principe divin manifesté sur la terre mère sacrée de Foumbot.",
    },
    {
      id: 6,
      title: "Produits Naturels",
      description: "Encens, lotions, bracelets et sels consacrés.",
      icon: <Flower2 className="h-10 w-10" />,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-500/10",
      rotation: 3,
      delay: 0.6,
      content:
        "Encens naturels, lotions biologiques, bracelets de protection et sels consacrés par la prêtresse de lumière.",
    },
    {
      id: 7,
      title: "Protection",
      description: "Amulettes et sels noirs de protection spirituelle.",
      icon: <Shield className="h-10 w-10" />,
      color: "from-gray-700 to-gray-900",
      bgColor: "bg-gray-700/10",
      rotation: -1,
      delay: 0.7,
      content:
        "Amulettes de protection, sels noirs énergétiques et boucliers spirituels contre les influences négatives.",
    },
    {
      id: 8,
      title: "Élixirs",
      description: "Mélanges sacrés et mixtures médicinales.",
      icon: <Droplets className="h-10 w-10" />,
      color: "from-teal-500 to-emerald-400",
      bgColor: "bg-teal-500/10",
      rotation: 2,
      delay: 0.8,
      content:
        "Élixirs floraux, mixtures médicinales personnalisées et remèdes ancestraux pour chaque besoin.",
    },
  ];

  /**
   * Animation d'entrée pour les cartes
   */
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: custom * 0.1,
        duration: 0.6,
        ease: backOut,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50/80 via-orange-50/60 to-rose-50/80">
      {/* Header Hero avec effet de particules */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* En-tête principal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <Sparkle className="h-8 w-8 text-amber-500 mr-3" />
              <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-amber-700 via-orange-600 to-rose-700 bg-clip-text text-transparent">
                Atoum-Râ Mbianga
              </h1>
              <Sparkle className="h-8 w-8 text-rose-500 ml-3" />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-amber-800/80 mb-6 max-w-3xl mx-auto font-serif italic"
            >
              La vérité n&apos;a pas peur d&apos;être vérifiée
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-linear-to-r from-amber-400/20 to-rose-400/20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-amber-300/30"
            >
              <p className="text-lg text-amber-900/90 leading-relaxed">
                Dans cette réincarnation, l&apos;honnêteté en conscience et
                l&apos;amour sont le socle de ma devise terrienne.
                <span className="block mt-4 text-amber-700 font-semibold">
                  Que la lumière engendre éternellement la lumière pure sur
                  vous.
                </span>
              </p>
            </motion.div>
          </motion.div>

          {/* Galerie de cartes */}
          <div className="relative mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    whileHover={{
                      scale: 1.05,
                      rotate: card.rotation * 1.5,
                      transition: { duration: 0.3 },
                    }}
                    className={`relative cursor-pointer ${card.bgColor} rounded-2xl p-6 border border-white/50 backdrop-blur-sm shadow-lg`}
                    style={{
                      transform: `rotate(${card.rotation}deg)`,
                    }}
                    onClick={() =>
                      setActiveCard(activeCard === card.id ? null : card.id)
                    }
                  >
                    {/* Effet de bordure gradient */}
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                    />

                    <div className="relative z-10">
                      <div
                        className={`inline-flex p-3 rounded-xl bg-linear-to-br ${card.color} mb-4`}
                      >
                        <div className="text-white">{card.icon}</div>
                      </div>

                      <h3 className="text-xl font-bold text-amber-900 mb-2">
                        {card.title}
                      </h3>

                      <p className="text-amber-800/80 mb-4">
                        {card.description}
                      </p>

                      <div className="flex items-center text-sm text-amber-600">
                        <span>En savoir plus</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Carte détaillée (s'affiche quand on clique) */}
            <AnimatePresence>
              {activeCard && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                  onClick={() => setActiveCard(null)}
                >
                  <motion.div
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    className="bg-linear-to-br from-amber-50 to-rose-50 rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-amber-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {cards.find((c) => c.id === activeCard) && (
                      <>
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center">
                            <div
                              className={`p-3 rounded-xl bg-linear-to-br ${cards.find((c) => c.id === activeCard)?.color} mr-4`}
                            >
                              {cards.find((c) => c.id === activeCard)?.icon}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-amber-900">
                                {cards.find((c) => c.id === activeCard)?.title}
                              </h3>
                              <p className="text-amber-600">
                                {
                                  cards.find((c) => c.id === activeCard)
                                    ?.description
                                }
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveCard(null)}
                            className="text-amber-500 hover:text-amber-700"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-4 text-amber-800/90">
                          <p>
                            {cards.find((c) => c.id === activeCard)?.content}
                          </p>

                          {activeCard === 1 && (
                            <div className="bg-amber-100/50 rounded-xl p-4 border border-amber-200">
                              <h4 className="font-semibold text-amber-900 mb-2">
                                📍 Domaine d&apo;intervention :
                              </h4>
                              <p>
                                Arrondissement de Foumbot • Région de
                                l&apo;Ouest • Département du Noun • Lieu-dit
                                Mangoum
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section informations de contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-linear-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 backdrop-blur-sm rounded-3xl p-8 border border-amber-300/30 mb-12"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center">
                  <Heart className="h-8 w-8 mr-3 text-rose-500" />
                  Contact & Localisation
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-amber-600 mr-4 mt-1" />
                    <div>
                      <h4 className="font-semibold text-amber-800">
                        Localisation Sacrée
                      </h4>
                      <p className="text-amber-700/90">
                        Yawoum, terre mère sacrée lumière Imana
                        <br />
                        Arrondissement de Foumbot, Région de l&apo;Ouest
                        <br />
                        Département du Noun, Lieu-dit Mangoum
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-6 w-6 text-amber-600 mr-4" />
                    <div>
                      <h4 className="font-semibold text-amber-800">
                        Téléphone Sacré
                      </h4>
                      <a
                        href="tel:+237659089524"
                        className="text-amber-700 hover:text-amber-900 transition-colors"
                      >
                        +237 6 59 08 95 24
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-6 w-6 text-amber-600 mr-4" />
                    <div>
                      <h4 className="font-semibold text-amber-800">
                        Courrier Divin
                      </h4>
                      <a
                        href="mailto:atoummbianga.si.forever@gmail.com"
                        className="text-amber-700 hover:text-amber-900 transition-colors break-all"
                      >
                        atoummbianga.si.forever@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center">
                  <Globe className="h-8 w-8 mr-3 text-teal-500" />
                  Philosophie & Mission
                </h2>

                <div className="space-y-4">
                  <div className="bg-white/50 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-800 mb-2">
                      🌿 Pharma-Coupé
                    </h4>
                    <p className="text-amber-700/90">
                      Terre Fertilité Floraison - Mémoire ancestrale et culture
                      vivante depuis des siècles avec l&apo;esprit de la nature.
                    </p>
                  </div>

                  <div className="bg-white/50 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-800 mb-2">
                      ✨ Notre Mission
                    </h4>
                    <p className="text-amber-700/90">
                      Guérir les maux quotidiens par des mélanges et mixtures
                      spécifiques, chaque problème médical avec sa plante
                      appropriée.
                    </p>
                  </div>

                  <div className="bg-white/50 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-800 mb-2">
                      🛡️ Produits Sacrés
                    </h4>
                    <p className="text-amber-700/90">
                      Rituels, amulettes, produits de purification, pierres de
                      protection énergétiques, sel noir consacré.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section appel à l'action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <div className="bg-linear-to-r from-amber-400 to-rose-500 rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-4">
                Rejoignez Notre Communauté Lumineuse
              </h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Abonnez-vous à notre page professionnelle ésotérique pour
                découvrir les puissantes vertus des plantes médicinales
                biologiques
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <button className="btn bg-white text-amber-700 hover:bg-amber-50 border-none px-8">
                  <Star className="h-5 w-5 mr-2" />
                  Voir les Avis Clients
                </button>

                <button className="btn bg-amber-900 text-white hover:bg-amber-800 border-none px-8">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Découvrir les Produits
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Styles d'animation */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        /* Effet de brillance sur les cartes */
        @keyframes shine {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .shine-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 200% 100%;
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
}
