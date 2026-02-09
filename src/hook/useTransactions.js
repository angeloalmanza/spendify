import { useState, useEffect } from "react";

const useTransactions = () => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [nextId, setNextId] = useState(() => {
    const saved = localStorage.getItem("transactions");
    if (!saved) return 1;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return 1;
      const maxId = parsed.reduce((max, t) => {
        const id = Number(t?.id);
        return Number.isFinite(id) ? Math.max(max, id) : max;
      }, 0);
      return maxId + 1;
    } catch {
      return 1;
    }
  });

  useEffect(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return;

    const normalized = transactions.map((transaction, index) => ({
      ...transaction,
      id: index + 1,
    }));

    const isAlreadyNormalized = transactions.every(
      (transaction, index) => transaction.id === index + 1,
    );

    if (!isAlreadyNormalized) {
      setTransactions(normalized);
      setNextId(normalized.length + 1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    const assignedId =
      transaction?.id !== undefined && transaction?.id !== null
        ? transaction.id
        : nextId;
    setTransactions((prev) => [...prev, { ...transaction, id: assignedId }]);
    if (assignedId === nextId) {
      setNextId((prev) => prev + 1);
    } else if (Number.isFinite(Number(assignedId))) {
      setNextId((prev) => Math.max(prev, Number(assignedId) + 1));
    }
  };

  const removeTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t,
      ),
    );
  };

  return { transactions, addTransaction, removeTransaction, updateTransaction };
};

export default useTransactions;
