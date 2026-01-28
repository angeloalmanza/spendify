const EditModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-4">
        <h2 className="text-xl font-bold mb-4">Modifica transazione</h2>

        {children}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
