import type { User } from "@/types/user";

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onUserDeleted: (id: number) => void;
}

/**
 * Modal pour confirmer la suppression d'un utilisateur
 * Bonnes pratiques :
 * - role="dialog" et aria-modal
 * - Boutons clairement étiquetés pour accessibilité
 * - Attention à l'action destructive
 */
export default function DeleteUserModal({
  isOpen,
  user,
  onClose,
  onUserDeleted,
}: DeleteUserModalProps) {
  const handleDelete = () => {
    if (!user) return;
    // TODO : Appeler API DELETE /users/{id}
    onUserDeleted(user.id);
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <h2 className="font-bold text-lg mb-4">Supprimer l&apos;utilisateur</h2>
        <p className="mb-4">
          Êtes-vous sûr de vouloir supprimer{" "}
          <strong>
            {user.first_name} {user.last_name}
          </strong>{" "}
          ? Cette action est irréversible.
        </p>
        <div className="modal-action">
          <button
            className="btn  bg-slate-800 text-white rounded-lg"
            onClick={handleDelete}
          >
            Supprimer
          </button>
          <button className="btn" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
