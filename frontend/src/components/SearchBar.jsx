const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Cerca Transazione..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
    />
  );
};

export default SearchBar;
