import React from "react";
import useTransactions from "./hook/useTransactions";

const App = () => {
  const { transactions, addTransaction, removeTransaction } = useTransactions();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Expense Tracker</h1>
    </div>
  );
};

export default App;
