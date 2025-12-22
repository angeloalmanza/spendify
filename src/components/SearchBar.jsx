const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Cerca Transazione..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full md:w-64 p-2 border border-gray-400 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
  );
};

export default SearchBar;
