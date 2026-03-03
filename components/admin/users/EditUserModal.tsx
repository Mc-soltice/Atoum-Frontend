"use client";
import { useState, useEffect } from "react";
import type { UpdateUserPayload, User } from "@/types/user";
import { userService } from "@/services/user.service";
import { Save } from "lucide-react";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";

interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onOpen?: () => void;
  onUserUpdated: (user: User) => void;
}

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onUserUpdated,
}: EditUserModalProps) {
  const [form, setForm] = useState<UpdateUserPayload>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    is_locked: false,
  });
  const [loading, setLoading] = useState(false);

  // Initialiser le formulaire avec les données de l'utilisateur
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        phone: user.phone ?? "",
        email: user.email ?? "",
        password: "",
        is_locked: user.is_locked ?? false,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: UpdateUserPayload = {};

    // Vérifier les modifications pour chaque champ individuellement
    // (approche plus verbeuse mais 100% type-safe)

    // Prénom
    if (form.first_name !== undefined && form.first_name !== user.first_name) {
      payload.first_name = form.first_name;
    }

    // Nom
    if (form.last_name !== undefined && form.last_name !== user.last_name) {
      payload.last_name = form.last_name;
    }

    // Email
    if (form.email !== undefined && form.email !== user.email) {
      payload.email = form.email;
    }

    // Téléphone
    if (form.phone !== undefined && form.phone !== user.phone) {
      payload.phone = form.phone;
    }

    // Statut verrouillé
    if (form.is_locked !== undefined && form.is_locked !== user.is_locked) {
      payload.is_locked = form.is_locked;
    }

    // Mot de passe (toujours optionnel)
    if (form.password && form.password.trim() !== "") {
      payload.password = form.password;
    }

    // Vérifier s'il y a des modifications
    if (Object.keys(payload).length === 0) {
      console.log("Aucune modification détectée");
      onClose();
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await userService.update(user.id, payload);
      onUserUpdated(updatedUser);
      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isOpen) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend">
            <h2 className="font-bold text-lg">Éditer un utilisateur</h2>
          </legend>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="Prénom"
              className="input input-bordered outline-none rounded-lg w-full"
              required
            />
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Nom"
              className="input input-bordered outline-none rounded-lg w-full"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="input input-bordered outline-none rounded-lg w-full"
              required
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Téléphone"
              className="input input-bordered outline-none rounded-lg w-full"
              required
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nouveau mot de passe (optionnel)"
              className="input input-bordered outline-none rounded-lg w-full"
            />

            <div className="form-control">
              <label className="cursor-pointer label">
                <span className="label-text">Compte verrouillé</span>
                <input
                  type="checkbox"
                  name="is_locked"
                  checked={form.is_locked}
                  onChange={handleChange}
                  className="checkbox"
                />
              </label>
            </div>
            <div className="modal-action">
              <button
                type="submit"
                className="rounded-lg btn mb-4 text-white bg-slate-800"
                disabled={loading}
              >
                {loading ? (
                  <DotSpinner size="20" speed="0.9" color="white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </button>
              <button
                type="button"
                className="btn rounded-lg"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
}