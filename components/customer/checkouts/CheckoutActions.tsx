"use client";

interface Props {
  loading?: boolean;
  disabled?: boolean;
  onSubmit: () => void;
}

export default function CheckoutActions({
  loading,
  disabled,
  onSubmit,
}: Props) {
  return (
    <>
      <button
        onClick={onSubmit}
        disabled={disabled || loading}
        className="w-auto bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 rounded-lg p-2 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Traitement en cours...</span>
          </>
        ) : (
          <>
            <span>Finaliser </span>
            <span className="animate-bounce-right">→</span>
          </>
        )}
      </button>
    </>
  );
}
