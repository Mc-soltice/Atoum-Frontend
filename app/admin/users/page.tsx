"use client";

import { useState, useEffect } from "react";
import UsersTable from "@/components/admin/users/UserTable";
import AddUserModal from "@/components/admin/users/AddUserModal";
import EditUserModal from "@/components/admin/users/EditUserModal";
import DeleteUserModal from "@/components/admin/users/DeleteUserModal";
import type { User } from "@/types/user";
import { PlusCircle } from "lucide-react";
import { userService } from "@/services/user.service";
import { DotPulse } from "ldrs/react";

/**
 * Page Admin Users
 * Affiche la liste des utilisateurs et permet de gérer CRUD via des modals
 * Bonnes pratiques SEO : titre de page, heading h1, aria labels
 */
export default function UsersPage() {
  // ✅ State modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ✅ Stocke l'utilisateur actuellement sélectionné pour édition ou suppression
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ✅ // État local qui contient la liste des utilisateurs
  const [users, setUsers] = useState<User[]>([]);

  // État qui indique si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);

  // ✅ useEffect : déclenché au montage du composant
  // - Appelle l'API pour récupérer les utilisateurs
  // - Met à jour l'état `users` avec les données reçues
  // - Gère les erreurs éventuelles
  // - Passe `loading` à false une fois terminé
  useEffect(() => {
    userService
      .getAll()
      .then((data) => setUsers(data)) // succès → on stocke les utilisateurs
      .catch((err) => console.error("Erreur lors du chargement :", err)) // erreur → log
      .finally(() => setLoading(false)); // fin → on arrête le loader
  }, []);

  // ✅ Si `loading` est true → on affiche le loader DotPulse centré
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotPulse size="43" speed="1.3" color="black" />
      </div>
    );
  }
  return (
    <div className="p-6">
      {/* Titre de la page */}
      <h1 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h1>

      {/* Bouton d'ajout utilisateur */}
      <button
        className="flex items-center justify-center gap-2 mb-6 px-6 py-2 rounded-lg font-medium text-white bg-linear-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 transition-all"
        onClick={() => setIsAddOpen(true)}
        aria-label="Ajouter un utilisateur"
      >
        <PlusCircle className="w-5 h-5" />
        Ajouter un utilisateur
      </button>

      {/* Table des utilisateurs */}
      <UsersTable
        users={users}
        onEdit={(user) => {
          setSelectedUser(user);
          setIsEditOpen(true);
        }}
        onDelete={(user) => {
          setSelectedUser(user);
          setIsDeleteOpen(true);
        }}
      />

      {/* Modals */}
      <AddUserModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onUserAdded={(newUser) => setUsers([...users, newUser])}
      />

      <EditUserModal
        isOpen={isEditOpen}
        user={selectedUser}
        onClose={() => setIsEditOpen(false)}
        onUserUpdated={(updatedUser) =>
          setUsers(
            users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
          )
        }
      />

      <DeleteUserModal
        isOpen={isDeleteOpen}
        user={selectedUser}
        onClose={() => setIsDeleteOpen(false)}
        onUserDeleted={(id) => setUsers(users.filter((u) => u.id !== id))}
      />
    </div>
  );
}
