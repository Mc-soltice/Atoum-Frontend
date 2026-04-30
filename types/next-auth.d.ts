import "next-auth";
import type { User as AppUser } from "@/types/user";

declare module "next-auth" {
  interface User {
    user: AppUser;   // ← l'objet user imbriqué de ton backend
    token: string;   // ← le token Laravel
  }

  interface Session {
    user: AppUser;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: AppUser;
    accessToken: string;
  }
}