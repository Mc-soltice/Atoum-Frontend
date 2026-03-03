"use client";

import Filter from "@/components/admin/Filter";
import type { User } from "@/types/user";
import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";
import { useEffect, useState } from "react";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Synchronise filteredUsers à chaque changement de users
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // 🔹 Loader si on est en train de charger
  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Waveform size="35" stroke="3.5" speed="1" color="black" />
        <span className="ml-3 text-gray-700">
          Chargement des utilisateurs...
        </span>
      </div>
    );
  }

  return (
    <>
      <Filter<User>
        options={{ role: ["Verrouiller", "Actifs"] }}
        onFilterChange={(filters) => {
          // Exemple simple de filtrage côté front
          let result = users;
          if (filters.search) {
            result = result.filter(
              (u) =>
                u.first_name
                  .toLowerCase()
                  .includes(filters.search!.toLowerCase()) ||
                u.last_name
                  .toLowerCase()
                  .includes(filters.search!.toLowerCase()) ||
                u.email.toLowerCase().includes(filters.search!.toLowerCase()),
            );
          }
          if (filters.role) {
            result = result.filter((u) => u.role?.includes(filters.role!));
          }
          setFilteredUsers(result);
        }}
      />

      <div className="mt-5 overflow-x-auto overflow-y-auto max-h-150 rounded-lg border border-gray-300">
        <table className="table table-zebra table-pin-rows table-pin-cols">
          <thead className="sticky top-0 bg-base-200 z-10 ">
            <tr>
              <th scope="col">#ID</th>
              <th scope="col">Prénom</th>
              <th scope="col">Nom</th>
              <th scope="col">Email</th>
              <th scope="col">Téléphone</th>
              <th scope="col">Rôles</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  Aucun utilisateur
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => onEdit(user)}
                  aria-label={`Éditer ${user.first_name}`}
                >
                  <td>{user.id}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role || "-"}</td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-sm bg-slate-800 text-white rounded-lg"
                      aria-label={`Supprimer ${user.first_name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user);
                      }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pied de tableau avec compteur */}
      <div className="mt-4 text-sm text-gray-600">
        Total: {filteredUsers.length} utilisateur(s) sur {users.length}
      </div>
    </>
  );
}
