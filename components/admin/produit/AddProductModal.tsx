"use client";

import { useProducts } from "@/contexte/ProductContext";
import { categoryService } from "@/services/cat.service";
import type { Category } from "@/types/category";
import type { CreateProductPayload } from "@/types/product";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";
import { Save, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ProductImage from "./ProductImage";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded?: () => void; // ✅ Changé: optionnel et sans argument
  categories: Category[];
}

/**
 * Modal pour ajouter un nouveau produit
 */
export default function AddProductModal({
  isOpen,
  onClose,
  onProductAdded,
}: AddProductModalProps) {
  // ✅ Utilisation du contexte Product
  const { createProduct, loading: contextLoading } = useProducts();

  // ✅ État initial du formulaire
  const initialForm: CreateProductPayload = {
    name: "",
    category_id: 0,
    price: 0,
    original_price: null,
    description: "",
    ingredients: [],
    benefits: [],
    usage_instructions: "",
    stock: 0,
    is_promotional: false,
    promo_end_date: null,
    main_image: undefined,
    images: [],
  };

  // Etat pour controller la fermeture differee
  const [shouldClose, setShouldClose] = useState(false);

  const [form, setForm] = useState<CreateProductPayload>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isPromotional, setIsPromotional] = useState(false);

  // États pour les images
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // États séparés pour l'affichage des inputs
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [benefitsInput, setBenefitsInput] = useState("");

  // Références pour les inputs files
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // ✅ Charge les catégories au montage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await categoryService.getAll();
        setCategories(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, category_id: data[0].id }));
        }
      } catch (err) {
        console.error("Erreur chargement catégories:", err);
        toast.error("Erreur lors du chargement des catégories");
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // ✅ Nettoyer les previews quand le modal se ferme
  useEffect(() => {
    if (!isOpen) {
      setMainImagePreview(null);
      setGalleryPreviews([]);
      setIngredientsInput("");
      setBenefitsInput("");
    }
  }, [isOpen]);

  // ✅ Gère les tableaux (ingrédients, bienfaits) - version améliorée
  const handleIngredientsChange = (value: string) => {
    setIngredientsInput(value);

    // Convertir en tableau seulement si on a au moins un élément valide
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    setForm((prev) => ({
      ...prev,
      ingredients: items,
    }));
  };

  const handleBenefitsChange = (value: string) => {
    setBenefitsInput(value);

    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    setForm((prev) => ({
      ...prev,
      benefits: items,
    }));
  };

  // ✅ Gestion de l'image principale
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation du type de fichier
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner une image valide");
        return;
      }

      // Validation de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5MB");
        return;
      }

      setForm((prev) => ({ ...prev, main_image: file }));

      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Supprimer l'image principale
  const removeMainImage = () => {
    setForm((prev) => ({ ...prev, main_image: undefined }));
    setMainImagePreview(null);
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  };

  // 🔹 Gestion des changements sur tous les inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement; // for type safety
    const { name, type, value, files } = target;

    // 🔒 CAS SPÉCIAL : date de fin de promo
    if (name === "promo_end_date") {
      setForm(prev => ({
        ...prev,
        promo_end_date: value && value.trim() !== "" ? value : null,
      }));
      return;
    }

    // ✅ Checkbox
    if (type === "checkbox") {
      const checked = target.checked;
      setIsPromotional(checked);
      setForm(prev => ({
        ...prev,
        [name]: checked,
        original_price: checked ? prev.price : null,
      }));
      return;
    }

    // ✅ Number
    if (type === "number") {
      setForm(prev => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
      return;
    }

    // ✅ File (single file, ex: main_image)
    if (type === "file" && files && files.length > 0) {
      setForm(prev => ({
        ...prev,
        [name]: files.length === 1 ? files[0] : Array.from(files),
      }));
      return;
    }

    // ✅ Texte / select
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Gestion de la galerie (multiple images)
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // ✅ Validation des fichiers
    const validFiles: File[] = [];
    files.forEach(file => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} n'est pas une image valide`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} est trop volumineux (max 5MB)`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    // ✅ Ajouter uniquement des File dans le form
    setForm(prev => ({
      ...prev,
      images: validFiles, // ← MODIFICATION ICI : remplacer au lieu de concaténer
    }));

    // ✅ Générer les previews
    const previewPromises = validFiles.map(file =>
      new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      })
    );

    Promise.all(previewPromises).then(newPreviews => {
      setGalleryPreviews(newPreviews); // ← MODIFICATION ICI : remplacer au lieu de concaténer
    });

    // ✅ Réinitialiser input pour pouvoir re-sélectionner les mêmes fichiers
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  // ✅ Supprimer une image de la galerie
  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (form.category_id === 0) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }

    if (form.price <= 0) {
      toast.error("Le prix doit être supérieur à 0");
      return;
    }

    if (form.stock < 0) {
      toast.error("Le stock ne peut pas être négatif");
      return;
    }

    // Validation de l'image principale
    if (!form.main_image) {
      toast.error("Veuillez sélectionner une image principale");
      return;
    }

    try {
      await createProduct(form);

      setShouldClose(true);

      // Réinitialisation
      setForm(initialForm);
      setMainImagePreview(null);
      setGalleryPreviews([]);
      setIsPromotional(false);
      setIngredientsInput("");
      setBenefitsInput("");

      if (mainImageInputRef.current) mainImageInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";

      // Appeler le callback si fourni
      if (onProductAdded) {
        onProductAdded();
      }

      onClose();
      // ✅ REMOVED: Le toast est déjà géré par le contexte createProduct
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      // ✅ REMOVED: L'erreur est déjà gérée par le contexte
    }
  };

  // gestion de la fermeture differee
  useEffect(() => {
    if (!shouldClose) return;

    const timer = setTimeout(() => {
      onClose();
      setShouldClose(false);
    }, 1200); // ⏱️ durée de ton animation

    return () => clearTimeout(timer);
  }, [shouldClose, onClose]);

  if (!isOpen) return null;

  const isLoading = contextLoading || categoriesLoading;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box max-w-5xl">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend">
            <h2 className="font-bold text-lg">Ajouter un produit</h2>
          </legend>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom du produit */}
              <label className="floating-label w-full">
                <span>Nom du produit *</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nom du produit"
                  className="input input-bordered outline-none rounded-lg w-full"
                  required
                  aria-required="true"
                  disabled={isLoading}
                />
              </label>

              {/* Catégorie */}
              <label className="floating-label w-full">
                <span>Catégorie *</span>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="select select-bordered outline-none rounded-lg w-full"
                  required
                  aria-required="true"
                  disabled={isLoading || categories.length === 0}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoriesLoading ? (
                    <option value="" disabled>
                      Chargement des catégories...
                    </option>
                  ) : categories.length === 0 ? (
                    <option value="" disabled>
                      Aucune catégorie disponible
                    </option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
                {categoriesLoading && (
                  <div className="text-xs text-gray-500 mt-1">
                    Chargement des catégories...
                  </div>
                )}
                {!categoriesLoading && categories.length === 0 && (
                  <div className="text-xs text-red-500 mt-1">
                    Aucune catégorie disponible. Veuillez d&apos;abord créer une
                    catégorie.
                  </div>
                )}
              </label>

              {/* Prix */}
              <label className="floating-label w-full">
                <span>Prix (€) *</span>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="input input-bordered outline-none rounded-lg w-full"
                  required
                  aria-required="true"
                  disabled={isLoading}
                />
              </label>

              {/* Stock */}
              <label className="floating-label w-full">
                <span>Stock *</span>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="input input-bordered outline-none rounded-lg w-full"
                  required
                  aria-required="true"
                  disabled={isLoading}
                />
              </label>

              {/* Produit promotionnel */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_promotional"
                  checked={isPromotional}
                  onChange={handleChange}
                  className="checkbox"
                  id="promotional-checkbox"
                  disabled={isLoading}
                />
                <label
                  htmlFor="promotional-checkbox"
                  className="cursor-pointer"
                >
                  Produit promotionnel
                </label>
              </div>

              {/* Prix original (si promo) */}
              {isPromotional && (
                <label className="floating-label w-full">
                  <span>Prix original (€)</span>
                  <input
                    type="number"
                    name="original_price"
                    value={form.original_price || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="input input-bordered outline-none rounded-lg w-full"
                    disabled={isLoading}
                  />
                </label>
              )}

              {/* Date fin promo */}
              {isPromotional && (
                <label className="floating-label w-full">
                  <span>Date fin promotion</span>
                  <input
                    type="date"
                    name="promo_end_date"
                    value={form.promo_end_date ?? ""}
                    onChange={handleChange}
                    className="input input-bordered outline-none rounded-lg w-full"
                    disabled={isLoading}
                  />
                </label>
              )}
            </div>

            {/* Image principale */}
            <div className="space-y-2">
              <label className="block">
                <span>Image principale *</span>
                <div className="mt-1">
                  <input
                    type="file"
                    ref={mainImageInputRef}
                    onChange={handleMainImageChange}
                    accept="image/*"
                    className="hidden"
                    id="main-image-input"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="main-image-input"
                    className={`cursor-pointer flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg transition-colors ${isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-gray-400"
                      }`}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Sélectionner une image
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats supportés: JPG, PNG, WEBP. Max: 5MB
                  </p>
                </div>
              </label>

              {/* Preview image principale */}
              {mainImagePreview && (
                <div className="relative w-40 h-40 mt-2">
                  <ProductImage
                    src={mainImagePreview}
                    alt="Preview image principale"
                  />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Galerie d'images */}
            <div className="space-y-2">
              <label className="block">
                <span>Galerie d&apos;images</span>
                <div className="mt-1">
                  <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={handleGalleryChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="gallery-input"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="gallery-input"
                    className={`cursor-pointer flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg transition-colors ${isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-gray-400"
                      }`}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Ajouter des images à la galerie
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Vous pouvez sélectionner plusieurs images
                  </p>
                </div>
              </label>

              {/* Previews galerie */}
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="relative w-full h-24">
                      <ProductImage
                        src={preview}
                        alt={`Preview ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <label className="floating-label w-full">
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description du produit"
                className="textarea textarea-bordered outline-none rounded-lg w-full"
                rows={3}
                disabled={isLoading}
              />
            </label>

            {/* Ingrédients */}
            <label className="floating-label w-full">
              <span>Ingrédients (séparés par des virgules)</span>
              <input
                type="text"
                value={ingredientsInput}
                onChange={(e) => handleIngredientsChange(e.target.value)}
                onBlur={() => {
                  // Nettoyer les espaces en trop quand on quitte le champ
                  const cleaned = ingredientsInput
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0)
                    .join(", ");
                  setIngredientsInput(cleaned);
                }}
                placeholder="Ingrédient 1, Ingrédient 2, ..."
                className="input input-bordered outline-none rounded-lg w-full"
                disabled={isLoading}
              />
              <div className="text-xs text-gray-500 mt-1">
                Saisissez vos ingrédients séparés par des virgules
              </div>
            </label>

            {/* Bienfaits */}
            <label className="floating-label w-full">
              <span>Bienfaits (séparés par des virgules)</span>
              <input
                type="text"
                value={benefitsInput}
                onChange={(e) => handleBenefitsChange(e.target.value)}
                onBlur={() => {
                  const cleaned = benefitsInput
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0)
                    .join(", ");
                  setBenefitsInput(cleaned);
                }}
                placeholder="Bienfait 1, Bienfait 2, ..."
                className="input input-bordered outline-none rounded-lg w-full"
                disabled={isLoading}
              />
              <div className="text-xs text-gray-500 mt-1">
                Saisissez les bienfaits séparés par des virgules
              </div>
            </label>

            {/* Mode d'utilisation */}
            <label className="floating-label w-full">
              <span>Mode d&apos;utilisation</span>
              <textarea
                name="usage_instructions"
                value={form.usage_instructions}
                onChange={handleChange}
                placeholder="Instructions d'utilisation"
                className="textarea textarea-bordered outline-none rounded-lg w-full"
                rows={2}
                disabled={isLoading}
              />
            </label>

            <div className="modal-action">
              <button
                type="submit"
                className="rounded-lg btn mb-4 text-white bg-slate-800 disabled:opacity-50"
                disabled={
                  isLoading || categories.length === 0 || !form.main_image
                }
              >
                {contextLoading ? (
                  <DotSpinner size="20" speed="0.9" color="white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {contextLoading ? "Création..." : "Ajouter"}
              </button>
              <button
                type="button"
                className="btn rounded-lg disabled:opacity-50"
                onClick={onClose}
                disabled={contextLoading}
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
