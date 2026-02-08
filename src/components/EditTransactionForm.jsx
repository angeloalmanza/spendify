import { useState, useEffect, useRef } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

const categories = ["Cibo", "Affitto", "Svago", "Stipendio", "Altro"];

const EditTransactionForm = ({
  editingTransaction,
  updateTransaction,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Cibo");
  const [date, setDate] = useState("");

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (editingTransaction) {
      setName(editingTransaction.name);
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);

      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 0);
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !amount || Number(amount) <= 0) return;

    updateTransaction({
      ...editingTransaction,
      name,
      amount: Number(amount),
      type,
      category,
      date,
    });

    toast.success(`${type === "income" ? "Entrata" : "Spesa"} modificata`);

    onClose();
  };

  const isDisabled = !name || !amount || Number(amount) <= 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
      <input
        type="text"
        value={name}
        ref={nameInputRef}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 border border-gray-400 p-2 rounded-lg"
      />

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="flex-1 border border-gray-400 p-2 rounded-lg"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="flex-1 border border-gray-400 p-2 rounded-lg"
      >
        <option value="income">Entrata</option>
        <option value="expense">Uscita</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="flex-1 border border-gray-400 p-2 rounded-lg"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-1 border border-gray-400 p-2 rounded-lg"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="flex justify-end w-full gap-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Annulla
        </button>

        <button
          type="submit"
          disabled={isDisabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition
            ${
              isDisabled
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }
            text-white
          `}
        >
          <Save className="w-4 h-4" />
          Salva modifiche
        </button>
      </div>
    </form>
  );
};

export default EditTransactionForm;
