// components/customer/users/EditProfileModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Save, X, Key } from "lucide-react";
import { useUsers } from "@/contexte/UserContext";
import { toast } from "react-hot-toast";
import type { UpdateUserPayload } from "@/types/user";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
}: Props) {
  const { updateUser, loading: contextLoading } = useUsers();
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // État pour suivre les champs modifiés
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());

  // Mettre à jour le formulaire quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        phone: user.phone ?? "",
        email: user.email ?? "",
        password: "",
        password_confirmation: "",
      });
      // Réinitialiser les champs modifiés et cacher les champs mot de passe
      setDirtyFields(new Set());
      setShowPasswordFields(false);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Mettre à jour la valeur
    setForm(prev => ({ ...prev, [name]: value }));

    // Marquer le champ comme modifié
    setDirtyFields(prev => {
      const newSet = new Set(prev);

      // Vérifier si la valeur est différente de la valeur originale
      const originalValue = user[name] ?? "";
      if (value !== originalValue) {
        newSet.add(name);
      } else {
        newSet.delete(name);
      }

      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation du mot de passe si présent
    if (form.password && form.password !== form.password_confirmation) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (form.password && form.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      // Construire l'objet avec seulement les champs modifiés
      const updateData: UpdateUserPayload = {};

      // Parcourir les champs modifiés (sauf password et password_confirmation)
      dirtyFields.forEach(field => {
        if (field !== 'password' && field !== 'password_confirmation') {
          // @ts-ignore - On sait que ces champs existent dans UpdateUserPayload
          updateData[field] = form[field as keyof typeof form];
        }
      });

      // Ajouter le mot de passe seulement s'il a été rempli
      if (form.password) {
        updateData.password = form.password;
      }

      // Vérifier qu'il y a au moins un champ à modifier
      if (Object.keys(updateData).length === 0) {
        toast.error("Aucune modification détectée");
        setLoading(false);
        return;
      }

      await updateUser(user.id, updateData);
      toast.success("Profil mis à jour avec succès !");
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour réinitialiser un champ à sa valeur originale
  const resetField = (fieldName: string) => {
    setForm(prev => ({ ...prev, [fieldName]: user[fieldName] ?? "" }));
    setDirtyFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(fieldName);
      return newSet;
    });
  };

  const handleCancelPassword = () => {
    setShowPasswordFields(false);
    setForm(prev => ({
      ...prev,
      password: "",
      password_confirmation: "",
    }));
    // Retirer le mot de passe des champs modifiés s'il y était
    setDirtyFields(prev => {
      const newSet = new Set(prev);
      newSet.delete('password');
      newSet.delete('password_confirmation');
      return newSet;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl border border-neutral-200 p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Modifier le profil
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-black transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Infos personnelles */}
          <div className="space-y-4">
            <Input
              label="Prénom"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              isDirty={dirtyFields.has('first_name')}
              onReset={() => resetField('first_name')}
              required
            />
            <Input
              label="Nom"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              isDirty={dirtyFields.has('last_name')}
              onReset={() => resetField('last_name')}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              isDirty={dirtyFields.has('email')}
              onReset={() => resetField('email')}
              required
            />
            <Input
              label="Téléphone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              isDirty={dirtyFields.has('phone')}
              onReset={() => resetField('phone')}
              placeholder="Ex: 06 12 34 56 78"
              required
            />
          </div>

          {/* Section mot de passe */}
          <div className="border-t border-neutral-200 pt-4">
            {!showPasswordFields ? (
              <button
                type="button"
                onClick={() => setShowPasswordFields(true)}
                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition"
              >
                <Key size={16} />
                Changer le mot de passe
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-700">
                    Nouveau mot de passe
                  </p>
                  <button
                    type="button"
                    onClick={handleCancelPassword}
                    className="text-xs text-neutral-500 hover:text-neutral-700"
                  >
                    Annuler
                  </button>
                </div>

                <Input
                  type="password"
                  label="Mot de passe"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  minLength={6}
                />

                <Input
                  type="password"
                  label="Confirmation"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="••••••••"
                  minLength={6}
                  error={form.password !== form.password_confirmation ? "Les mots de passe ne correspondent pas" : undefined}
                  success={form.password === form.password_confirmation && form.password.length >= 6 ? "✓ Mots de passe identiques" : undefined}
                />
              </div>
            )}
          </div>

          {/* Résumé des modifications */}
          {dirtyFields.size > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700 font-medium mb-2">
                {dirtyFields.size} champ(s) modifié(s) :
              </p>
              <ul className="text-xs text-blue-600 space-y-1">
                {Array.from(dirtyFields).map(field => (
                  <li key={field} className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    {field === 'first_name' && 'Prénom'}
                    {field === 'last_name' && 'Nom'}
                    {field === 'email' && 'Email'}
                    {field === 'phone' && 'Téléphone'}
                    {field === 'password' && 'Mot de passe'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 transition"
              disabled={loading || contextLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || contextLoading || dirtyFields.size === 0}
              className="px-4 py-2 bg-linear-to-r from-black to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={16} />
              {loading || contextLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Input component amélioré avec indicateur de modification
function Input({
  label,
  isDirty,
  onReset,
  error,
  success,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  isDirty?: boolean;
  onReset?: () => void;
  error?: string;
  success?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
        {isDirty && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-neutral-500 hover:text-neutral-700"
          >
            Réinitialiser
          </button>
        )}
      </div>
      <div className="relative">
        <input
          {...props}
          className={`w-full border rounded-lg px-4 py-2.5 text-sm transition ${isDirty
            ? 'border-amber-300 bg-amber-50/50 focus:ring-amber-500'
            : error
              ? 'border-red-300 focus:ring-red-500'
              : success
                ? 'border-green-300 focus:ring-green-500'
                : 'border-neutral-300 focus:ring-neutral-900'
            } focus:outline-none focus:ring-2 focus:border-transparent`}
        />
        {isDirty && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 text-xs">
            Modifié
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
      {success && !error && (
        <p className="mt-1 text-xs text-green-600">{success}</p>
      )}
    </div>
  );
}