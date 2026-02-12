import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useTransactions from "./hook/useTransactions";
import { useAuthContext } from "./context/AuthContext";
import BalanceCard from "./components/BalanceCard";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import TransactionsChart from "./components/TransactionChart";
import InsightsPanel from "./components/InsightsPanel";
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
  const { user, logout } = useAuthContext();
  const [loggingOut, setLoggingOut] = useState(false);
  const { transactions, addTransaction, updateTransaction, removeTransaction } =
    useTransactions();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [highlightedId, setHighlightedId] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

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

  const handleExportJson = () => {
    if (transactions.length === 0) {
      toast.error("Nessuna transazione da esportare");
      return;
    }

    const jsonContent = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonContent], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `transactions-${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTransactionToDelete(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  const filteredTransactions = transactions
    .filter((t) => (filter === "all" ? true : t.type === filter))
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => {
      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;
      return true;
    });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortField) return 0;

    let valueA = a[sortField];
    let valueB = b[sortField];

    if (typeof valueA === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
  });

  const openDeleteModal = (id) => {
    setTransactionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await removeTransaction(transactionToDelete);
      toast.success("Transazione eliminata");
      closeDeleteModal();
    } catch {
      toast.error("Errore durante l'eliminazione");
    } finally {
      setDeleting(false);
    }
  };

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logout effettuato");
    } catch {
      toast.error("Errore durante il logout");
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen app-shell">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Dashboard personale
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-gradient">
              Spendify
            </h1>
            {user && (
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 mt-1.5 px-3 py-1.5 rounded-full btn-soft text-sm hover:border-indigo-400 transition-colors"
                title="Vai al profilo"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="text-slate-600 dark:text-slate-300">{user.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
              className="w-full sm:w-auto h-10 px-4 rounded-lg btn-soft transition-colors cursor-pointer"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="w-full sm:w-auto h-10 px-4 rounded-lg btn-primary transition-colors cursor-pointer"
            >
              Esporta CSV
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="w-full sm:w-auto h-10 px-4 rounded-lg btn-primary transition-colors cursor-pointer"
            >
              Esporta JSON
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full sm:w-auto h-10 px-4 rounded-lg btn-soft transition-colors cursor-pointer disabled:opacity-60"
            >
              {loggingOut ? "Uscita..." : "Logout"}
            </button>
          </div>
        </div>

        <BalanceCard transactions={filteredTransactions} />
        <TransactionsChart transactions={filteredTransactions} />
        <InsightsPanel transactions={transactions} />

        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Ricerca e filtri
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Affina per tipo, data o categoria
              </p>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
              <div className="lg:w-64">
                <SearchBar search={search} setSearch={setSearch} />
              </div>
              <FilterBar
                filter={filter}
                setFilter={setFilter}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setSortField={setSortField}
                setSortDirection={setSortDirection}
                setSearch={setSearch}
              />
            </div>
          </div>
        </div>

        <TransactionForm
          addTransaction={async (transaction) => {
            const saved = await addTransaction(transaction);
            setHighlightedId(saved.id);
          }}
        />

        <EditModal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <EditTransactionForm
            editingTransaction={editingTransaction}
            updateTransaction={async (updated) => {
              const saved = await updateTransaction(updated);
              setHighlightedId(saved.id);
            }}
            onClose={closeEditModal}
          />
        </EditModal>

        <TransactionList
          transactions={sortedTransactions}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          openDeleteModal={openDeleteModal}
          onEdit={openEditModal}
          highlightedId={highlightedId}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          loading={deleting}
        />
      </div>
    </div>
  );
};

export default App;
