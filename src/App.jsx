import React, { useState } from "react";
import useTransactions from "./hook/useTransactions";
import BalanceCard from "./components/BalanceCard";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import TransactionsChart from "./components/TransactionChart";
import ConfirmModal from "./components/ConfirmModal";
import EditModal from "./components/EditModal";
import EditTransactionForm from "./components/EditTransactionForm";

const App = () => {
  const { transactions, addTransaction, updateTransaction, removeTransaction } =
    useTransactions();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredTransactions = transactions
    .filter((t) => {
      if (filter === "all") return true;
      return t.type === filter;
    })
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const openDeleteModal = (id) => {
    setTransactionToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    removeTransaction(transactionToDelete);
    setIsModalOpen(false);
    setTransactionToDelete(null);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingTransaction(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Expense Tracker</h1>
      <BalanceCard transactions={filteredTransactions} />
      <TransactionsChart transactions={filteredTransactions} />
      <div className="flex flex-col md:flex-row md:items-end md:gap-4 mb-4">
        <SearchBar search={search} setSearch={setSearch} />
        <FilterBar filter={filter} setFilter={setFilter} />
      </div>
      <TransactionForm addTransaction={addTransaction} />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTransaction(null);
        }}
      >
        <EditTransactionForm
          editingTransaction={editingTransaction}
          updateTransaction={updateTransaction}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTransaction(null);
          }}
        />
      </EditModal>
      <TransactionList
        transactions={filteredTransactions}
        openDeleteModal={openDeleteModal}
        onEdit={openEditModal}
      />
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default App;
