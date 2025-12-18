import { Trash2 } from "lucide-react";

const TransactionList = ({ transactions, removeTransaction }) => {
  if (transactions.length === 0)
    return (
      <p className="text-center text-gray-500">Nessuna transazione inserita</p>
    );

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="p-2">Nome</th>
            <th className="p-2">Tipo</th>
            <th className="p-2 text-right">Importo</th>
            <th className="p-2 text-right">Azioni</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b last:border-none">
              <td className="p-2">{t.name}</td>

              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    t.type === "income"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {t.type === "income" ? "Entrata" : "Uscita"}
                </span>
              </td>

              <td
                className={`p-2 text-right font-medium ${
                  t.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                € {t.amount}
              </td>

              <td className="p-2 text-right">
                <button
                  onClick={() => removeTransaction(t.id)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Elimina"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
