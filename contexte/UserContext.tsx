"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";
import type { User, CreateUserPayload, UpdateUserPayload } from "@/types/user";
import { userService } from "@/services/user.service";

interface UserContextType {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  createUser: (payload: CreateUserPayload) => Promise<void>;
  updateUser: (id: number, payload: UpdateUserPayload) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  toggleLockUser: (id: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Récupérer tous les utilisateurs

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Créer un utilisateur
  const createUser = async (payload: CreateUserPayload) => {
    setLoading(true);
    try {
      const newUser = await userService.create(payload); // ✅ Passer le payload
      setUsers((prev) => [...prev, newUser]);
      toast.success("Utilisateur créé avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la création de l'utilisateur");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mettre à jour un utilisateur
  const updateUser = async (id: number, payload: UpdateUserPayload) => {
    setLoading(true);
    try {
      const updated = await userService.update(id, payload);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success("Utilisateur mis à jour !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Supprimer un utilisateur
  const deleteUser = async (id: number) => {
    setLoading(true);
    try {
      await userService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Utilisateur supprimé !");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verrouiller / déverrouiller un utilisateur
  const toggleLockUser = async (id: number) => {
    setLoading(true);
    try {
      const updated = await userService.toggleLock(id);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(
        updated.is_locked
          ? "Utilisateur verrouillé"
          : "Utilisateur déverrouillé",
      );
    } catch (error) {
      toast.error("Erreur lors du verrouillage/déverrouillage");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        toggleLockUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// 🔹 Hook pratique pour utiliser le context
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
