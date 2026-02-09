const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modale */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-sm dark:bg-slate-900 dark:text-slate-100">
        <h2 className="text-xl font-semibold mb-2">Conferma eliminazione</h2>
        <p className="text-gray-600 mb-4 dark:text-slate-400">
          Sei sicuro di voler eliminare questa transazione?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
