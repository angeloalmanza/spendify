import React, { useState, useEffect } from "react";
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
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const App = () => {
  const { transactions, addTransaction, updateTransaction, removeTransaction } =
    useTransactions();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [highlightedId, setHighlightedId] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- Funzioni riutilizzabili per chiudere modali ---
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTransactionToDelete(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  // --- Filter + Search ---
  const filteredTransactions = transactions
    .filter((t) => (filter === "all" ? true : t.type === filter))
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => {
      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;
      return true;
    });

  // --- Delete ---
  const openDeleteModal = (id) => {
    setTransactionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    removeTransaction(transactionToDelete);
    toast.success("Transazione eliminata");
    closeDeleteModal();
  };

  // --- Edit ---
  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (!highlightedId) return;

    const timer = setTimeout(() => {
      setHighlightedId(null);
    }, 1500);

    return () => clearTimeout(timer);
  }, [highlightedId]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-bold mb-4 text-center">Expense Tracker</h1>

      <BalanceCard transactions={filteredTransactions} />
      <TransactionsChart transactions={filteredTransactions} />

      <div className="flex flex-col md:flex-row md:items-end md:gap-4 mb-4">
        <SearchBar search={search} setSearch={setSearch} />
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>

      {/* Form aggiunta */}
      <TransactionForm
        addTransaction={(transaction) => {
          addTransaction(transaction);
          setHighlightedId(transaction.id);
        }}
      />

      {/* Modale edit */}
      <EditModal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <EditTransactionForm
          editingTransaction={editingTransaction}
          updateTransaction={(updated) => {
            updateTransaction(updated);
            setHighlightedId(updated.id);
          }}
          onClose={closeEditModal}
        />
      </EditModal>

      {/* Lista transazioni */}
      <TransactionList
        transactions={filteredTransactions}
        openDeleteModal={openDeleteModal}
        onEdit={openEditModal}
        highlightedId={highlightedId}
      />

      {/* Modale conferma delete */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default App;
