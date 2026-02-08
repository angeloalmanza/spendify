import { useState } from "react";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

const categories = ["Cibo", "Affitto", "Svago", "Stipendio", "Altro"];

const TransactionForm = ({ addTransaction }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Cibo");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    addTransaction({
      id: Date.now(),
      name,
      amount: Number(amount),
      type,
      category,
      date,
    });

    toast.success(`${type === "income" ? "Entrata" : "Spesa"} aggiunta`);

    setName("");
    setAmount("");
    setType("income");
    setCategory("Cibo");
    setDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-lg mb-4 flex flex-wrap items-end gap-3"
    >
      <input
        type="text"
        placeholder="Nome Transazione"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 min-w-37.5 border border-gray-400 p-2 rounded-lg"
      />

      <input
        type="number"
        placeholder="Importo"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="flex-1 min-w-37.5 border border-gray-400 p-2 rounded-lg"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="flex-1 min-w-37.5 border border-gray-400 p-2 rounded-lg cursor-pointer"
      >
        <option value="income">Entrata</option>
        <option value="expense">Uscita</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="flex-1 min-w-37.5 border border-gray-400 p-2 rounded-lg cursor-pointer"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-1 min-w-37.5 border border-gray-400 p-2 rounded-lg cursor-pointer"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={!name || !amount}
        className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <PlusCircle className="w-4 h-4" />
        Aggiungi
      </button>
    </form>
  );
};

export default TransactionForm;
