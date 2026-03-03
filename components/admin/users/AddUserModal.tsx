import { useState } from "react";
import { userService } from "@/services/user.service";
import type { CreateUserPayload, User } from "@/types/user";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

/**
 * Modal pour ajouter un utilisateur
 * Props :
 * - isOpen : contrôle l'ouverture
 * - onClose : ferme le modal
 * - onUserAdded : callback après création
 * Bonnes pratiques :
 * - Focus sur premier champ
 * - aria-modal, role="dialog"
 */
export default function AddUserModal({
  isOpen,
  onClose,
  onUserAdded,
}: AddUserModalProps) {
  const initialForm: CreateUserPayload = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  };

  const [form, setForm] = useState<CreateUserPayload>(initialForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const ROLES = ["client"];

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true); // 🔹 start loading
      const newUser = await userService.create(form);
      onUserAdded(newUser);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      toast.error("Impossible de créer l'utilisateur"); // optionnel si toast est installé
    } finally {
      setLoading(false); // 🔹 stop loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend">
            <h2 className="font-bold text-lg">Ajouter un utilisateur</h2>
          </legend>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="floating-label w-full">
              <span>Prénom</span>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Prénom"
                className="input input-bordered outline-none rounded-lg w-full"
                required
              />
            </label>

            <label className="floating-label w-full">
              <span>Nom</span>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Nom"
                className="input input-bordered outline-none rounded-lg w-full"
                required
              />
            </label>

            <label className="floating-label w-full">
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="input input-bordered outline-none rounded-lg w-full"
                required
              />
            </label>

            <label className="floating-label w-full">
              <span>Téléphone</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Téléphone"
                className="input input-bordered outline-none rounded-lg w-full"
                required
              />
            </label>

            <label className="floating-label w-full">
              <span>Rôle</span>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="select select-bordered outline-none rounded-lg w-full"
                required
              >
                <option value="" disabled>
                  Attribuer un role
                </option>
                <option value="gestionnaire">
                  Gestionnaire
                </option>
                <option value="client">
                  Client
                </option>
              </select>
            </label>

            <label className="floating-label w-full">
              <span>Mot de passe</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                className="input input-bordered outline-none rounded-lg w-full"
                required
              />
            </label>

            <label className="floating-label w-full">
              <span>Confirmer le mot de passe</span>
              <input
                name="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Confirmer le mot de passe"
                className="input input-bordered outline-none rounded-lg w-full"
                required
              />
            </label>

            <div className="modal-action">
              <button
                type="submit"
                className="rounded-lg btn mb-4 text-white bg-slate-800"
              >
                {loading ? (
                  <DotSpinner size="20" speed="0.9" color="black" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loading ? "Creation..." : "Ajouter"}
                Ajouter
              </button>
              <button
                type="button"
                className="btn rounded-lg"
                onClick={onClose}
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
