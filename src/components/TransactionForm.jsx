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
    if (!name || !amount || !date) return;

    addTransaction({
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
      className="glass-card p-4 rounded-2xl mb-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Aggiungi transazione
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          I campi con * sono obbligatori
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Nome *
          </label>
          <input
            type="text"
            placeholder="Es. Stipendio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Importo *
          </label>
          <input
            type="number"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Tipo
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 text-slate-700 bg-white cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="income">Entrata</option>
            <option value="expense">Uscita</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Data *
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 text-slate-700 bg-white cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 dark:text-slate-400">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 text-slate-700 bg-white cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!name || !amount}
          className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-10 px-4 rounded-lg transition-colors cursor-pointer btn-primary"
        >
          <PlusCircle className="w-4 h-4" />
          Aggiungi
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
