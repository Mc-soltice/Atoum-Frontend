"use client";

import { authService } from "@/services/auth.service";
import type { CreateUserPayload, User } from "@/types/user";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: CreateUserPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession(); // ← ajout
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role?.includes("admin") ?? false;

  useEffect(() => {
    if (status === "loading") return;

    const initializeUser = async () => {
      if (status === "authenticated" && session?.user) {
        setUser(session.user as User);
        if (session.accessToken) {
          localStorage.setItem("auth_token", session.accessToken as string);
        }
        setLoading(false);
        return;
      }

      // Récupérer l'utilisateur via le token stocké si la session NextAuth n'est pas active
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
          try {
            const me = await authService.me();
            setUser(me);
          } catch (error) {
            localStorage.removeItem("auth_token");
            setUser(null);
          } finally {
            setLoading(false);
          }
          return;
        }
      }

      setUser(null);
      setLoading(false);
    };

    initializeUser();
  }, [session, status]);

  const redirectAfterAuth = (user: User) => {
    const redirect = localStorage.getItem("redirect_after_login");
    localStorage.removeItem("redirect_after_login");

    if (redirect) {
      router.replace(redirect);
      return;
    }

    if (user.role.includes("admin")) {
      router.replace("/admin");
    } else {
      router.replace("/home");
    }
  };

  const login = async (email: string, password: string) => {
    const { token, user } = await authService.login(email, password);

    localStorage.setItem("auth_token", token);
    setUser(user);

    toast.success("Connexion réussie");
    redirectAfterAuth(user);
  };

  const register = async (payload: CreateUserPayload) => {
    const { token, user } = await authService.register(payload);

    localStorage.setItem("auth_token", token);
    setUser(user);

    toast.success("Compte créé avec succès");
    redirectAfterAuth(user);
  };

  const logout = async () => {
    try {
      await authService.logout(); // optionnel si API
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
      await signOut({ redirect: false });
      router.replace("/home");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return ctx;
};
