"use client";

import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Edit2,
  LogOut,
  Mail,
  Package,
  Phone,
  Save,
  Settings,
  Truck,
  User,
  X,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import HistoriqueContent from "@/components/customer/historique/historique";
import { useAuthContext } from "@/contexte/AuthContext";
import { useOrders } from "@/contexte/OrderContext";
import { useUsers } from "@/contexte/UserContext";
import type { UpdateUserPayload } from "@/types/user";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";
import toast from "react-hot-toast";

export default function ModernProfilePage() {
  const { user, logout } = useAuthContext();
  const { updateUser, loading: contextLoading } = useUsers();
  const { orders, fetchMyOrders, loading: ordersLoading } = useOrders();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        password: "",
        password_confirmation: "",
      });
      setDirtyFields(new Set());
      setShowPasswordFields(false);
      setIsEditing(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "orders" && user) {
      fetchMyOrders();
    }
  }, [activeTab, user, fetchMyOrders]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setDirtyFields((prev) => {
      const newSet = new Set(prev);
      const originalValue = user?.[name as keyof typeof user] ?? "";
      if (value !== originalValue) {
        newSet.add(name);
      } else {
        newSet.delete(name);
      }
      return newSet;
    });
  };

  const handleSave = async (): Promise<void> => {
    if (!user) return;
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
      const updateData: UpdateUserPayload = {};
      dirtyFields.forEach((field) => {
        if (field !== "password" && field !== "password_confirmation") {
          // @ts-ignore - champs valides
          updateData[field] = form[field as keyof typeof form];
        }
      });
      if (form.password) {
        updateData.password = form.password;
      }
      if (Object.keys(updateData).length === 0) {
        toast.error("Aucune modification détectée");
        setLoading(false);
        return;
      }
      await updateUser(user.id, updateData);
      toast.success("Profil mis à jour avec succès !");
      setIsEditing(false);
      setShowPasswordFields(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  const resetField = (fieldName: string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: user?.[fieldName as keyof typeof user] ?? "",
    }));
    setDirtyFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fieldName);
      return newSet;
    });
  };

  const handleCancelPassword = () => {
    setShowPasswordFields(false);
    setForm((prev) => ({
      ...prev,
      password: "",
      password_confirmation: "",
    }));
    setDirtyFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete("password");
      newSet.delete("password_confirmation");
      return newSet;
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setShowPasswordFields(false);
    if (user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        password: "",
        password_confirmation: "",
      });
    }
    setDirtyFields(new Set());
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  const getStatusIcon = (statusValue: string): React.ReactElement => {
    switch (statusValue.toLowerCase()) {
      case "delivered":
      case "completed":
        return <CheckCircle className="text-amber-600" size={20} />;
      case "pending":
        return <Clock className="text-yellow-600" size={20} />;
      case "cancelled":
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Package className="text-blue-600" size={20} />;
    }
  };

  const getStatusColor = (statusValue: string): string => {
    switch (statusValue.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotSpinner size="35" speed="0.9" color="#f59e0b" />
        <span className="ml-3">Veuillez patienter...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* HEADER - responsive */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-amber-500 to-pink-500 flex items-center justify-center text-xl sm:text-3xl font-bold text-white">
                {user.first_name?.[0] || ""}
                {user.last_name?.[0] || ""}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-sm text-gray-500 truncate max-w-45 sm:max-w-none">
                  {user.email}
                </p>
                {user.role?.includes("admin") && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Administrateur
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition border border-red-200 sm:self-center"
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Onglets mobiles (scrollable) */}
          <div className="lg:hidden overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex gap-2 min-w-max">
              {[
                { id: "profile", label: "Profil", icon: <User size={18} /> },
                {
                  id: "orders",
                  label: "Commandes",
                  icon: <Package size={18} />,
                },
                {
                  id: "settings",
                  label: "Paramètres",
                  icon: <Settings size={18} />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar desktop */}
          <div className="hidden lg:block lg:w-64 bg-white rounded-2xl p-4 shadow-lg border border-gray-200 h-fit">
            {[
              { id: "profile", label: "Profil", icon: <User size={18} /> },
              { id: "orders", label: "Commandes", icon: <Package size={18} /> },
              {
                id: "settings",
                label: "Paramètres",
                icon: <Settings size={18} />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl capitalize transition flex items-center gap-3 mb-2 ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* CONTENU PRINCIPAL */}
          <div className="flex-1 bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
            {activeTab === "profile" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Informations personnelles
                  </h2>

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition w-full sm:w-auto"
                    >
                      <Edit2 size={16} /> Modifier
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleSave}
                        disabled={loading || contextLoading}
                        className="bg-amber-500 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-600 transition disabled:opacity-50"
                      >
                        <Save size={16} />{" "}
                        {loading || contextLoading
                          ? "Enregistrement..."
                          : "Enregistrer"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-700 transition"
                      >
                        <X size={16} /> Annuler
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <InputField
                    icon={<User size={16} />}
                    label="Prénom"
                    name="first_name"
                    value={form.first_name}
                    originalValue={user.first_name ?? ""}
                    editing={isEditing}
                    onChange={handleChange}
                    onReset={resetField}
                    dirty={dirtyFields.has("first_name")}
                  />
                  <InputField
                    icon={<User size={16} />}
                    label="Nom"
                    name="last_name"
                    value={form.last_name}
                    originalValue={user.last_name ?? ""}
                    editing={isEditing}
                    onChange={handleChange}
                    onReset={resetField}
                    dirty={dirtyFields.has("last_name")}
                  />
                  <InputField
                    icon={<Mail size={16} />}
                    label="Email"
                    name="email"
                    value={form.email}
                    originalValue={user.email ?? ""}
                    editing={isEditing}
                    type="email"
                    onChange={handleChange}
                    onReset={resetField}
                    dirty={dirtyFields.has("email")}
                  />
                  <InputField
                    icon={<Phone size={16} />}
                    label="Téléphone"
                    name="phone"
                    value={form.phone}
                    originalValue={user.phone ?? ""}
                    editing={isEditing}
                    type="tel"
                    onChange={handleChange}
                    onReset={resetField}
                    dirty={dirtyFields.has("phone")}
                  />
                </div>

                {/* Changement mot de passe */}
                {isEditing && (
                  <div className="mt-6">
                    {!showPasswordFields ? (
                      <button
                        onClick={() => setShowPasswordFields(true)}
                        className="text-amber-600 hover:text-amber-700 text-sm flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto py-2 border border-amber-200 rounded-lg bg-amber-50"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Changer le mot de passe
                      </button>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-sm font-medium text-gray-700">
                            Nouveau mot de passe
                          </label>
                          <button
                            onClick={handleCancelPassword}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="space-y-4">
                          <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Nouveau mot de passe"
                            className="w-full p-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-amber-500 text-gray-800"
                          />
                          <input
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            placeholder="Confirmer le mot de passe"
                            className="w-full p-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-amber-500 text-gray-800"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>
                      Membre depuis le{" "}
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <HistoriqueContent
                  orders={orders}
                  loading={ordersLoading}
                  getStatusIcon={getStatusIcon}
                  getStatusColor={getStatusColor}
                />
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-6 text-gray-800">
                  Paramètres
                </h2>
                <SettingItem icon={<Bell size={16} />} title="Notifications" />
                <SettingItem
                  icon={<CreditCard size={16} />}
                  title="Moyens de paiement"
                />
                <SettingItem
                  icon={<Truck size={16} />}
                  title="Adresses de livraison"
                />
                <SettingItem
                  icon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  }
                  title="Confidentialité et sécurité"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants internes
interface InputFieldProps {
  icon: React.ReactElement;
  label: string;
  name: string;
  value: string;
  originalValue: string;
  editing: boolean;
  type?: string;
  dirty?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: (fieldName: string) => void;
}

function InputField({
  icon,
  label,
  name,
  value,
  originalValue,
  editing,
  onChange,
  onReset,
  dirty = false,
  type = "text",
}: InputFieldProps) {
  const hasChanges = value !== originalValue;

  return (
    <div
      className={`bg-gray-50 p-3 sm:p-4 rounded-xl border transition ${
        dirty ? "border-amber-400 bg-amber-50/30" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <label className="text-xs sm:text-sm text-gray-500">{label}</label>
        {editing && hasChanges && (
          <button
            type="button"
            onClick={() => onReset(name)}
            className="text-xs text-gray-400 hover:text-red-500 transition"
            title="Réinitialiser"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {editing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full mt-1 sm:mt-2 p-2 rounded-lg bg-white border focus:outline-none focus:border-amber-500 text-gray-800 text-sm sm:text-base ${
            dirty ? "border-amber-400" : "border-gray-300"
          }`}
        />
      ) : (
        <div className="flex items-center gap-2 mt-1 sm:mt-2 text-gray-700 text-sm sm:text-base">
          {icon}
          <span>{value || "Non renseigné"}</span>
        </div>
      )}
    </div>
  );
}

interface SettingItemProps {
  icon: React.ReactElement;
  title: string;
}

function SettingItem({ icon, title }: SettingItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 hover:bg-gray-100 transition">
      <div className="flex items-center gap-3 text-gray-700">
        {icon}
        <span className="text-sm sm:text-base">{title}</span>
      </div>
      <button className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition text-sm w-full sm:w-auto">
        Gérer
      </button>
    </div>
  );
}
