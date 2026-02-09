import { X } from "lucide-react";

const FilterBar = ({
  filter,
  setFilter,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setSortField,
  setSortDirection,
  setSearch,
}) => {
  const resetFilters = () => {
    setSearch("");
    setFilter("all");
    setStartDate("");
    setEndDate("");
    setSortField("date");
    setSortDirection("asc");
  };

  return (
    <div className="flex flex-wrap gap-2 items-end">
      {/* Filtro tipo */}
      <button
        onClick={() => setFilter("all")}
        className={`h-10 px-4 rounded-lg text-sm font-medium transition cursor-pointer ${
          filter === "all"
            ? "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        }`}
      >
        Tutte
      </button>
      <button
        onClick={() => setFilter("income")}
        className={`h-10 px-4 rounded-lg text-sm font-medium transition cursor-pointer ${
          filter === "income"
            ? "bg-emerald-600 text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        }`}
      >
        Entrate
      </button>
      <button
        onClick={() => setFilter("expense")}
        className={`h-10 px-4 rounded-lg text-sm font-medium transition cursor-pointer ${
          filter === "expense"
            ? "bg-rose-600 text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        }`}
      >
        Uscite
      </button>

      {/* Filtri data */}
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="h-10 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 bg-white cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        placeholder="Da"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="h-10 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 bg-white cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        placeholder="A"
      />

      {/* Pulsante reset */}
      <button
        onClick={resetFilters}
        className="h-10 flex items-center gap-2 px-4 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        title="Reset filtri"
      >
        <X className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
};

export default FilterBar;
