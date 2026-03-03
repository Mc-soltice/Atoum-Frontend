// utils/imageUtils.ts
export const imageUtils = {
  validateImage(file: File): string | null {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      return "Type de fichier non supporté. Formats acceptés: JPG, PNG, WEBP, GIF";
    }

    if (file.size > maxSize) {
      return "L'image est trop volumineuse (max 5MB)";
    }

    return null;
  },

  createPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};
