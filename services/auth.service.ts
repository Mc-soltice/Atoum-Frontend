import api from "@/lib/axios";
import type { User, CreateUserPayload } from "@/types/user";

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>("/login", {
        email,
        password,
      });

      // 🔐 STOCKAGE DU TOKEN
      localStorage.setItem("auth_token", data.token);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },


  async register(payload: CreateUserPayload): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>("/register", payload);
      return data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // async me(): Promise<User> {
  //   try {
  //     const { data } = await api.get<User>("users/me");
  //     return data;
  //   } catch (error) {
  //     console.error("Get user error:", error);
  //     throw error;
  //   }
  // },

  async logout(): Promise<void> {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("auth_token");
    } catch (error) {
      console.error("Logout error:", error);
      // Même en cas d'erreur, on nettoie le token localement
      localStorage.removeItem("auth_token");
      throw error;
    }
  },
};
