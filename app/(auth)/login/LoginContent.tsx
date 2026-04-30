"use client";
export const dynamic = "force-dynamic";

import GoogleButton from "@/components/customer/users/AuthButtons";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Animation variants defined outside component to prevent recreation on each render
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
};

const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, staggerChildren: 0.1 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const INPUT_CLASS =
  "w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  minLength,
  icon,
  rightSlot,
  className,
}: InputFieldProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      <label className="block text-sm font-medium text-white/80 mb-2">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={`${INPUT_CLASS} ${icon ? "pl-10" : ""} ${rightSlot ? "pr-12" : ""}`}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightSlot}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface FormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  password_confirmation: string;
}

const EMPTY_FORM: FormData = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  password_confirmation: "",
};

export default function LoginContent() {
  const { login, register } = useAuth();
  const searchParams = useSearchParams();

  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.password_confirmation) {
          toast.error("Les mots de passe ne correspondent pas");
          return;
        }
        const { email, password, password_confirmation, first_name, last_name, phone } = formData;
        await register({ first_name, last_name, email, phone, password, password_confirmation });
      }
    } catch (error) {
      console.error("Erreur lors de l'authentification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setFormData(EMPTY_FORM);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="text-emerald-300 hover:text-emerald-200 transition-colors"
    >
      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/images/login.png"
          alt="Produits naturels"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-br from-emerald-900/80 via-teal-800/70 to-green-900/80 backdrop-blur-sm" />
      </motion.div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col p-8">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/" className="inline-block">
                <motion.h1
                  className="font-bold text-4xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-emerald-300">Atoumra</span>
                  <span className="text-white">Mbianga</span>
                </motion.h1>
              </Link>
              <motion.p
                className="text-white/70 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {isLogin
                  ? "Connectez-vous à votre compte"
                  : "Rejoignez notre communauté naturelle"}
              </motion.p>
            </motion.div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? "login" : "register"}
                onSubmit={handleSubmit}
                className="space-y-5"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Prénom"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="Prénom"
                        required
                        icon={<User className="h-5 w-5 text-emerald-300" />}
                      />
                      <InputField
                        label="Nom"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Nom"
                        required
                      />
                    </div>
                    <InputField
                      label="Téléphone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+237 6 XX XX XX XX"
                      required
                    />
                  </>
                )}

                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@exemple.com"
                  required
                  icon={<Mail className="h-5 w-5 text-emerald-300" />}
                />

                <InputField
                  label="Mot de passe"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  icon={<Lock className="h-5 w-5 text-emerald-300" />}
                  rightSlot={passwordToggle}
                />

                {!isLogin && (
                  <motion.div
                    variants={itemVariants}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <InputField
                      label="Confirmer le mot de passe"
                      name="password_confirmation"
                      type={showPassword ? "text" : "password"}
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      icon={<Lock className="h-5 w-5 text-emerald-300" />}
                    />
                  </motion.div>
                )}

                {/* Submit */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-600 rounded-xl" />
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative px-6 py-3 text-white font-semibold flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>{isLogin ? "Connexion..." : "Inscription..."}</span>
                        </>
                      ) : (
                        <>
                          <span>{isLogin ? "Se connecter" : "Créer un compte"}</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </motion.div>
                        </>
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              </motion.form>
            </AnimatePresence>

            {/* Google login */}
            {isLogin && (
              <motion.div
                className="mt-6 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GoogleButton />
              </motion.div>
            )}

            {/* Divider (register only) */}
            {!isLogin && (
              <motion.div
                className="mt-6 relative flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex-1 border-t border-white/10" />
                <span className="px-2 text-xs text-white/40">ou</span>
                <div className="flex-1 border-t border-white/10" />
              </motion.div>
            )}

            {/* Toggle login/register */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-white/60 text-sm">
                {isLogin ? "Pas encore de compte?" : "Déjà un compte?"}
                <motion.button
                  onClick={toggleAuthMode}
                  className="ml-2 text-emerald-300 font-semibold hover:text-emerald-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </motion.button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}