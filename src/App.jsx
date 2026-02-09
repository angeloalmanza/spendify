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

const buildCsv = (rows) => {
  const headers = ["id", "name", "amount", "type", "category", "date"];
  const escapeCsv = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    const escaped = stringValue.replace(/"/g, '""');
    return `="${escaped}"`;
  };

  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsv(row[header])).join(","),
    ),
  ];

  return csvRows.join("\n");
};

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

  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleExportCsv = () => {
    if (transactions.length === 0) {
      toast.error("Nessuna transazione da esportare");
      return;
    }

    const csvContent = buildCsv(transactions);
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `transactions-${timestamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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

  //Transazioni ordinate
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortField) return 0;

    let valueA = a[sortField];
    let valueB = b[sortField];

    // stringhe
    if (typeof valueA === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // numeri / date
    return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
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

  //Funzione che ordina i campi delle colonne
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-bold mb-4 text-center">Expense Tracker</h1>

      <BalanceCard transactions={filteredTransactions} />
      <TransactionsChart transactions={filteredTransactions} />

      <div className="flex flex-col md:flex-row md:items-end md:gap-4 gap-3 mb-4">
        <SearchBar search={search} setSearch={setSearch} />
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setSortField={setSortField}
          setSortDirection={setSortDirection}
        />
        <button
          type="button"
          onClick={handleExportCsv}
          className="w-full md:w-auto h-10 bg-gray-900 text-white px-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Esporta CSV
        </button>
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
        transactions={sortedTransactions}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
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
