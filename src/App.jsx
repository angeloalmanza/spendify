import React, { useState } from "react";
import useTransactions from "./hook/useTransactions";
import BalanceCard from "./components/BalanceCard";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";

const App = () => {
  const { transactions, addTransaction, removeTransaction } = useTransactions();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions
    .filter((t) => {
      if (filter === "all") return true;
      return t.type === filter;
    })
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Expense Tracker</h1>
      <BalanceCard transactions={transactions} />
      <div className="flex flex-col md:flex-row md:items-end md:gap-4 mb-4">
        <SearchBar search={search} setSearch={setSearch} />
        <FilterBar filter={filter} setFilter={setFilter} />
      </div>
      <TransactionForm addTransaction={addTransaction} />
      <TransactionList
        transactions={filteredTransactions}
        removeTransaction={removeTransaction}
      />
    </div>
  );
};

export default App;
