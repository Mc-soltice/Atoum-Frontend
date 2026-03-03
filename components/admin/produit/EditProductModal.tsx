"use client";

import ProductImage from "@/components/admin/produit/ProductImage";
import { useProducts } from "@/contexte/ProductContext";
import { categoryService } from "@/services/cat.service";
import type { Category } from "@/types/category";
import type { Product, UpdateProductPayload } from "@/types/product";
import { DotSpinner } from "ldrs/react";
import "ldrs/react/DotSpinner.css";
import { Save, Upload, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

interface EditProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onProductUpdated?: () => void;
}

/**
 * Modal pour éditer un produit existant
 * Envoie uniquement les champs modifiés
 */
export default function EditProductModal({
  isOpen,
  product,
  onClose,
}: EditProductModalProps) {
  // ✅ Utilisation du contexte Product
  const { updateProduct, loading: contextLoading } = useProducts();

  // Etat pour controller la fermeture differee
  const [shouldClose, setShouldClose] = useState(false);

  // ✅ États
  const [initialData, setInitialData] = useState<UpdateProductPayload | null>(
    null,
  );
  const [form, setForm] = useState<UpdateProductPayload>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isPromotional, setIsPromotional] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ États pour les images
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  // ✅ Références pour les inputs files
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // ✅ Fonction pour comparer les valeurs
  const isValueChanged = useCallback(
    (field: keyof UpdateProductPayload, newValue: any): boolean => {
      if (!initialData) return false;

      const oldValue = initialData[field];

      // Cas spécial pour les tableaux
      if (Array.isArray(oldValue) && Array.isArray(newValue)) {
        return (
          JSON.stringify([...oldValue].sort()) !==
          JSON.stringify([...newValue].sort())
        );
      }

      // Cas spécial pour les fichiers (toujours considéré comme modifié)
      if (newValue instanceof File) {
        return true;
      }

      // Comparaison simple pour les autres types
      return oldValue !== newValue;
    },
    [initialData],
  );

  // ✅ Fonction pour extraire uniquement les champs modifiés
  const getChangedFields = useCallback((): UpdateProductPayload => {
    if (!initialData) return {};

    const changedFields: UpdateProductPayload = {};

    Object.keys(form).forEach((key) => {
      const field = key as keyof UpdateProductPayload;
      const value = form[field];

      // Vérifier si la valeur a changé
      if (isValueChanged(field, value)) {
        (changedFields as any)[field] = value;
      }
    });

    return changedFields;
  }, [initialData, form, isValueChanged]);

  // ✅ Vérifier s'il y a des modifications (UNE SEULE DÉCLARATION ICI)
  const hasChanges = useMemo(() => {
    if (!initialData) return false;

    const changedFields = getChangedFields();
    return Object.keys(changedFields).length > 0;
  }, [initialData, getChangedFields]);

  // ✅ Initialise le formulaire avec les données du produit
  useEffect(() => {
    if (product && isOpen) {
      const ingredientsArray = Array.isArray(product.ingredients)
        ? product.ingredients
        : product.ingredients
          ? [product.ingredients]
          : [];

      const benefitsArray = Array.isArray(product.benefits)
        ? product.benefits
        : product.benefits
          ? [product.benefits]
          : [];

      const galleryUrls = product.gallery ?? []; // ✅ SIMPLE, STABLE

      const initialFormData: UpdateProductPayload = {
        name: product.name,
        category_id: product.category?.id,
        price: product.price,
        original_price: product.original_price,
        description: product.description || "",
        ingredients: ingredientsArray,
        benefits: benefitsArray,
        usage_instructions: product.usage_instructions || "",
        stock: product.stock,
        is_promotional: product.is_promotional,
        promo_end_date: product.promo_end_date || "",
        existing_gallery: galleryUrls,
      };

      setInitialData(initialFormData);
      setForm(initialFormData);
      setIsPromotional(product.is_promotional);
      setMainImagePreview(product.main_image || null);
      setExistingGallery(galleryUrls);
      setGalleryPreviews([]);
    }
  }, [product, isOpen]);

  // ✅ Charge les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await categoryService.getAll();
        setCategories(data);
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
      setInitialData(null);
      setMainImagePreview(null);
      setGalleryPreviews([]);
      setExistingGallery([]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // ✅ Gère les changements dans les champs du formulaire
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setIsPromotional(checked);
      setForm((prev) => ({
        ...prev,
        [name]: checked,
        original_price: checked ? prev.price || product?.price || 0 : null,
      }));
    } else if (type === "number") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ Gère les tableaux (ingrédients, bienfaits)
  const handleArrayChange = (
    field: "ingredients" | "benefits",
    value: string,
  ) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setForm((prev) => ({
      ...prev,
      [field]: items,
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

  // ✅ Gestion de la galerie d'images
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles: File[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} n'est pas une image valide`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} est trop volumineux`);
        return;
      }
      validFiles.push(file);
    });

    if (!validFiles.length) return;

    Promise.all(
      validFiles.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          }),
      ),
    ).then((previews) => {
      // ✅ UN SEUL setState
      setGalleryPreviews((prev) => [...prev, ...previews]);

      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...validFiles],
      }));
    });
  };

  // ✅ Supprimer une image de la galerie existante
  const removeExistingGalleryImage = (index: number) => {
    const newExistingGallery = [...existingGallery];
    newExistingGallery.splice(index, 1);

    setExistingGallery(newExistingGallery);
    setForm((prev) => ({
      ...prev,
      existing_gallery: newExistingGallery,
    }));
  };

  // ✅ Supprimer une nouvelle image de la galerie
  const removeNewGalleryImage = (index: number) => {
    const currentImages = form.images || [];
    const currentPreviews = [...galleryPreviews];

    const newImages = currentImages.filter((_, i) => i !== index);
    currentPreviews.splice(index, 1);

    setForm((prev) => ({
      ...prev,
      images: newImages,
    }));
    setGalleryPreviews(currentPreviews);
  };

  // ✅ Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // Récupérer uniquement les champs modifiés
    const changedFields = getChangedFields();

    // Validation spécifique aux champs modifiés
    if (changedFields.price !== undefined && changedFields.price <= 0) {
      toast.error("Le prix doit être supérieur à 0");
      return;
    }

    if (changedFields.stock !== undefined && changedFields.stock < 0) {
      toast.error("Le stock ne peut pas être négatif");
      return;
    }

    // Inclure la galerie existante si elle a été modifiée
    if (changedFields.existing_gallery !== undefined) {
      changedFields.existing_gallery = existingGallery;
    }

    try {
      setIsSubmitting(true);
      await updateProduct(product.id, changedFields);

      setShouldClose(true);

      // Réinitialisation
      setMainImagePreview(null);
      setGalleryPreviews([]);
      setExistingGallery([]);

      if (mainImageInputRef.current) mainImageInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";

      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    } finally {
      setIsSubmitting(false);
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
  if (!product || !isOpen) return null;

  const isLoading = contextLoading || isSubmitting || categoriesLoading;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box max-w-5xl">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend">
            <h2 className="font-bold text-lg">Éditer le produit</h2>
          </legend>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom du produit */}
              <label className="floating-label w-full">
                <span>Nom du produit *</span>
                <input
                  name="name"
                  value={form.name || product.name}
                  onChange={handleChange}
                  placeholder="Nom du produit"
                  className={`input input-bordered outline-none rounded-lg w-full ${isValueChanged("name", form.name)
                    ? "border-2 border-blue-500"
                    : ""
                    }`}
                  required
                  disabled={isLoading}
                />
                {isValueChanged("name", form.name) && (
                  <div className="text-xs text-blue-500 mt-1">Modifié</div>
                )}
              </label>

              {/* Catégorie */}
              <label className="floating-label w-full">
                <span>Catégorie *</span>
                <select
                  name="category_id"
                  value={form.category_id || product.category?.id || ""}
                  onChange={handleChange}
                  className={`select select-bordered outline-none rounded-lg w-full ${isValueChanged("category_id", form.category_id)
                    ? "border-2 border-blue-500"
                    : ""
                    }`}
                  required
                  disabled={isLoading}
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
                {isValueChanged("category_id", form.category_id) && (
                  <div className="text-xs text-blue-500 mt-1">Modifié</div>
                )}
                {categoriesLoading && (
                  <div className="text-xs text-gray-500 mt-1">
                    Chargement des catégories...
                  </div>
                )}
              </label>

              {/* Prix */}
              <label className="floating-label w-full">
                <span>Prix (€) *</span>
                <input
                  type="number"
                  name="price"
                  value={form.price !== undefined ? form.price : product.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`input input-bordered outline-none rounded-lg w-full ${isValueChanged("price", form.price)
                    ? "border-2 border-blue-500"
                    : ""
                    }`}
                  required
                  disabled={isLoading}
                />
                {isValueChanged("price", form.price) && (
                  <div className="text-xs text-blue-500 mt-1">Modifié</div>
                )}
              </label>

              {/* Stock */}
              <label className="floating-label w-full">
                <span>Stock *</span>
                <input
                  type="number"
                  name="stock"
                  value={form.stock !== undefined ? form.stock : product.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={`input input-bordered outline-none rounded-lg w-full ${isValueChanged("stock", form.stock)
                    ? "border-2 border-blue-500"
                    : ""
                    }`}
                  required
                  disabled={isLoading}
                />
                {isValueChanged("stock", form.stock) && (
                  <div className="text-xs text-blue-500 mt-1">Modifié</div>
                )}
              </label>

              {/* Produit promotionnel */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_promotional"
                  checked={isPromotional}
                  onChange={handleChange}
                  className={`checkbox ${isValueChanged("is_promotional", isPromotional) ? "checkbox-primary" : ""}`}
                  id="edit-promotional-checkbox"
                  disabled={isLoading}
                />
                <label
                  htmlFor="edit-promotional-checkbox"
                  className="cursor-pointer"
                >
                  Produit promotionnel
                  {isValueChanged("is_promotional", isPromotional) && (
                    <span className="text-xs text-blue-500 ml-2">Modifié</span>
                  )}
                </label>
              </div>

              {/* Prix original (si promo) */}
              {isPromotional && (
                <label className="floating-label w-full">
                  <span>Prix original (€)</span>
                  <input
                    type="number"
                    name="original_price"
                    value={
                      form.original_price !== undefined
                        ? form.original_price || ""
                        : product.original_price || ""
                    }
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`input input-bordered outline-none rounded-lg w-full ${isValueChanged("original_price", form.original_price)
                      ? "border-2 border-blue-500"
                      : ""
                      }`}
                    disabled={isLoading}
                  />
                  {isValueChanged("original_price", form.original_price) && (
                    <div className="text-xs text-blue-500 mt-1">Modifié</div>
                  )}
                </label>
              )}

              {/* Date fin promo */}
              {isPromotional && (
                <label className="floating-label w-full">
                  <span>Date fin promotion</span>
                  <input
                    type="date"
                    name="promo_end_date"
                    value={
                      form.promo_end_date !== undefined
                        ? form.promo_end_date || ""
                        : product.promo_end_date || ""
                    }
                    onChange={handleChange}
                    className={`input input-bordered outline-none rounded-lg w-full ${isValueChanged("promo_end_date", form.promo_end_date)
                      ? "border-2 border-blue-500"
                      : ""
                      }`}
                    disabled={isLoading}
                  />
                  {isValueChanged("promo_end_date", form.promo_end_date) && (
                    <div className="text-xs text-blue-500 mt-1">Modifié</div>
                  )}
                </label>
              )}
            </div>

            {/* Image principale */}
            <div className="space-y-2">
              <label className="block">
                <span>Image principale</span>
                <div className="mt-1">
                  <input
                    type="file"
                    ref={mainImageInputRef}
                    onChange={handleMainImageChange}
                    accept="image/*"
                    className="hidden"
                    id="edit-main-image-input"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="edit-main-image-input"
                    className={`cursor-pointer flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-lg transition-colors ${isLoading
                      ? "opacity-50 cursor-not-allowed border-gray-300"
                      : isValueChanged("main_image", form.main_image)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {mainImagePreview
                      ? "Changer l'image"
                      : "Sélectionner une image"}
                  </label>
                  {isValueChanged("main_image", form.main_image) && (
                    <div className="text-xs text-blue-500 mt-1">
                      Nouvelle image sélectionnée
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Formats supportés: JPG, PNG, WEBP. Max: 5MB
                  </p>
                </div>
              </label>

              {/* Preview image principale */}
              {(mainImagePreview || product.main_image) && (
                <div className="relative w-40 h-40 mt-2">
                  {mainImagePreview ? (
                    <div className="relative w-full h-full">
                      <ProductImage src={mainImagePreview} alt={product.name} />
                    </div>
                  ) : (
                    <div className="relative w-full h-full">

                      <ProductImage
                        src={product.main_image}
                        alt={product.name}
                        className="object-cover rounded-lg"
                        height={160}
                        width={160}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {isValueChanged("main_image", form.main_image)
                      ? "Nouvelle image"
                      : "Actuelle"}
                  </div>
                </div>
              )}
            </div>

            {/* Galerie d'images */}
            <div className="space-y-4">
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
                    id="edit-gallery-input"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="edit-gallery-input"
                    className={`cursor-pointer flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-lg transition-colors ${isLoading
                      ? "opacity-50 cursor-not-allowed border-gray-300"
                      : (form.images && form.images.length > 0) ||
                        isValueChanged(
                          "existing_gallery",
                          form.existing_gallery,
                        )
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Ajouter de nouvelles images à la galerie
                  </label>
                  {((form.images && form.images.length > 0) ||
                    isValueChanged(
                      "existing_gallery",
                      form.existing_gallery,
                    )) && (
                      <div className="text-xs text-blue-500 mt-1">
                        Modifications détectées
                      </div>
                    )}
                  <p className="text-xs text-gray-500 mt-1">
                    Vous pouvez sélectionner plusieurs images
                  </p>
                </div>
              </label>

              {/* Galerie existante */}
              {existingGallery.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Images existantes
                    {isValueChanged(
                      "existing_gallery",
                      form.existing_gallery,
                    ) && (
                        <span className="text-xs text-blue-500 ml-2">
                          (Modifiée)
                        </span>
                      )}
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {existingGallery.map((imageUrl, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative w-full h-35"
                      >
                        <div className="relative w-full h-full">
                          <ProductImage
                            src={imageUrl}
                            alt={`Image existante ${index + 1}`}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingGalleryImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nouvelles images */}
              {galleryPreviews.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Nouvelles images</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {galleryPreviews.map((preview, index) => (
                      <div key={preview + index} className="relative w-full h-35">
                        <ProductImage src={preview} alt="Nouvelle image" />
                        <button
                          type="button"
                          onClick={() => removeNewGalleryImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <label className="floating-label w-full">
              <span>Description</span>
              <textarea
                name="description"
                value={
                  form.description !== undefined
                    ? form.description
                    : product.description || ""
                }
                onChange={handleChange}
                placeholder="Description du produit"
                className={`textarea textarea-bordered outline-none rounded-lg w-full ${isValueChanged("description", form.description)
                  ? "border-2 border-blue-500"
                  : ""
                  }`}
                rows={3}
                disabled={isLoading}
              />
              {isValueChanged("description", form.description) && (
                <div className="text-xs text-blue-500 mt-1">Modifié</div>
              )}
            </label>

            {/* Ingrédients */}
            <label className="floating-label w-full">
              <span>Ingrédients (séparés par des virgules)</span>
              <input
                type="text"
                value={
                  Array.isArray(form.ingredients)
                    ? form.ingredients.join(", ")
                    : product.ingredients
                      ? Array.isArray(product.ingredients)
                        ? product.ingredients.join(", ")
                        : product.ingredients
                      : ""
                }
                onChange={(e) =>
                  handleArrayChange("ingredients", e.target.value)
                }
                placeholder="Ingrédient 1, Ingrédient 2, ..."
                className={`input input-bordered outline-none rounded-lg w-full ${isValueChanged("ingredients", form.ingredients)
                  ? "border-2 border-blue-500"
                  : ""
                  }`}
                disabled={isLoading}
              />
              {isValueChanged("ingredients", form.ingredients) && (
                <div className="text-xs text-blue-500 mt-1">Modifié</div>
              )}
            </label>

            {/* Bienfaits */}
            <label className="floating-label w-full">
              <span>Bienfaits (séparés par des virgules)</span>
              <input
                type="text"
                value={
                  Array.isArray(form.benefits)
                    ? form.benefits.join(", ")
                    : Array.isArray(product.benefits)
                      ? product.benefits.join(", ")
                      : product.benefits || ""
                }
                onChange={(e) => handleArrayChange("benefits", e.target.value)}
                placeholder="Bienfait 1, Bienfait 2, ..."
                className={`input input-bordered outline-none rounded-lg w-full ${isValueChanged("benefits", form.benefits)
                  ? "border-2 border-blue-500"
                  : ""
                  }`}
                disabled={isLoading}
              />
              {isValueChanged("benefits", form.benefits) && (
                <div className="text-xs text-blue-500 mt-1">Modifié</div>
              )}
            </label>

            {/* Mode d'utilisation */}
            <label className="floating-label w-full">
              <span>Mode d&apos;utilisation</span>
              <textarea
                name="usage_instructions"
                value={
                  form.usage_instructions !== undefined
                    ? form.usage_instructions
                    : product.usage_instructions || ""
                }
                onChange={handleChange}
                placeholder="Instructions d'utilisation"
                className={`textarea textarea-bordered outline-none rounded-lg w-full ${isValueChanged("usage_instructions", form.usage_instructions)
                  ? "border-2 border-blue-500"
                  : ""
                  }`}
                rows={2}
                disabled={isLoading}
              />
              {isValueChanged(
                "usage_instructions",
                form.usage_instructions,
              ) && <div className="text-xs text-blue-500 mt-1">Modifié</div>}
            </label>

            <div className="modal-action">
              <button
                type="submit"
                className="rounded-lg btn mb-4 text-white bg-slate-800 disabled:opacity-50"
                disabled={isLoading || !hasChanges}
              >
                {isSubmitting ? (
                  <DotSpinner size="20" speed="0.9" color="white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
              </button>
              <button
                type="button"
                className="btn rounded-lg disabled:opacity-50"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </button>
            </div>
          </form>
        </fieldset>
      </div>
    </div >
  );
}