"use client";
export const dynamic = "force-dynamic";


import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function AuthPage() {
  const { login, register } = useAuth();
  const searchParams = useSearchParams();

  const [isLogin, setIsLogin] = useState(
    searchParams.get("mode") !== "register"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    password_confirmation: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        // Validation des mots de passe
        if (formData.password !== formData.password_confirmation) {
          toast.error("Les mots de passe ne correspondent pas");
          setIsLoading(false);
          return;
        }

        const payload = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        };

        await register(payload);
      }
    } catch (error) {
      // Les erreurs sont déjà gérées dans le hook et le service
      console.error("Erreur lors de l'authentification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      password_confirmation: "",
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100">
        <div className="animate-pulse bg-white/80 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/login.png"
          alt="Produits naturels"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-br from-emerald-900/70 via-teal-800/60 to-green-900/70"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 overflow-hidden animate-fade-in-up">
          <div className="p-8">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <h1 className="font-bold text-4xl text-emerald-300">
                  Atoumra<span className=" text-white mb-2">Mbianga</span>
                </h1>
              </Link>
              <p className="text-white/80">
                {isLogin
                  ? "Connectez-vous à votre compte"
                  : "Rejoignez notre communauté naturelle"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champs pour l'inscription */}
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4 animate-slide-down">
                    <div>
                      <label className="label">
                        <span className="label-text text-white">Prénom</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-emerald-300" />
                        </div>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          placeholder="Prénom"
                          className=" outline-none input input-bordered w-full pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/60"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-white">Nom</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Nom"
                        className="outline-none input input-bordered w-full bg-white/10 border-white/30 text-white placeholder:text-white/60"
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  <div className="animate-slide-down">
                    <label className="label">
                      <span className="label-text text-white">Téléphone</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+33 1 23 45 67 89"
                      className="outline-none input input-bordered w-full bg-white/10 border-white/30 text-white placeholder:text-white/60"
                      required={!isLogin}
                    />
                  </div>
                </>
              )}

              {/* Champ email */}
              <div>
                <label className="label">
                  <span className="label-text text-white">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-emerald-300" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@exemple.com"
                    className="outline-none input input-bordered w-full pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    required
                  />
                </div>
              </div>

              {/* Champ mot de passe */}
              <div>
                <label className="label">
                  <span className="label-text text-white">Mot de passe</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="label-text-alt text-emerald-300 hover:text-emerald-200"
                  >
                    {showPassword ? (
                      <span className="flex items-center gap-1">
                        <EyeOff className="h-4 w-4" /> Masquer
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> Afficher
                      </span>
                    )}
                  </button>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-emerald-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="outline-none input input-bordered w-full pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Confirmation mot de passe pour inscription */}
              {!isLogin && (
                <div className="animate-slide-down">
                  <label className="label">
                    <span className="label-text text-white">
                      Confirmer le mot de passe
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-emerald-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="outline-none input input-bordered w-full pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/60"
                      required={!isLogin}
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn w-full bg-linear-to-r from-emerald-500 to-teal-600 border-none text-white hover:from-emerald-600 hover:to-teal-700"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span className="ml-2">
                      {isLogin ? "Connexion..." : "Inscription..."}
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    {isLogin ? "Se connecter" : "Créer un compte"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </button>
            </form>

            {/* Lien pour basculer entre login/register */}
            <div className="text-center mt-8">
              <p className="text-white/80">
                {isLogin ? "Pas encore de compte?" : "Déjà un compte?"}
                <button
                  onClick={toggleAuthMode}
                  className="ml-2 text-emerald-300 font-semibold hover:text-emerald-200"
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
