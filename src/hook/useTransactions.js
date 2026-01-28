import { useState, useEffect } from "react";

const useTransactions = () => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
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
