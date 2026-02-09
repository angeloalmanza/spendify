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
}) => {
  const resetFilters = () => {
    setFilter("all");
    setStartDate("");
    setEndDate("");
    setSortField("date");
    setSortDirection("asc");
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-end">
      {/* Filtro tipo */}
      <button
        onClick={() => setFilter("all")}
        className={`px-4 py-2 rounded-lg transition cursor-pointer ${
          filter === "all" ? "bg-blue-500 text-white" : "bg-gray-400"
        }`}
      >
        Tutte
      </button>
      <button
        onClick={() => setFilter("income")}
        className={`px-4 py-2 rounded-lg transition cursor-pointer ${
          filter === "income" ? "bg-green-500 text-white" : "bg-gray-400"
        }`}
      >
        Entrate
      </button>
      <button
        onClick={() => setFilter("expense")}
        className={`px-4 py-2 rounded-lg transition cursor-pointer ${
          filter === "expense" ? "bg-red-500 text-white" : "bg-gray-400"
        }`}
      >
        Uscite
      </button>

      {/* Filtri data */}
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border border-gray-400 rounded-lg px-2 py-2 cursor-pointer"
        placeholder="Da"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border border-gray-400 rounded-lg px-2 py-2 cursor-pointer"
        placeholder="A"
      />

      {/* Pulsante reset */}
      <button
        onClick={resetFilters}
        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
        title="Reset filtri"
      >
        <X className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
};

export default FilterBar;
