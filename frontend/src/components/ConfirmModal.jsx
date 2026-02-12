const ConfirmModal = ({ isOpen, onClose, onConfirm, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={!loading ? onClose : undefined} />

      {/* Modale */}
      <div className="relative glass-card rounded-2xl p-6 w-full max-w-sm dark:text-slate-100">
        <h2 className="text-xl font-semibold mb-2">Conferma eliminazione</h2>
        <p className="text-gray-600 mb-4 dark:text-slate-400">
          Sei sicuro di voler eliminare questa transazione?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer disabled:opacity-50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer disabled:opacity-60 min-w-[80px]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Elimina
              </span>
            ) : (
              "Elimina"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
