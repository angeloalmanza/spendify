const FilterBar = ({ filter, setFilter }) => {
  return (
    <div className="flex gap-2 mb-4">
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
    </div>
  );
};

export default FilterBar;
