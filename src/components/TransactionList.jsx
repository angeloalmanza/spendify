import { Edit3, Trash2 } from "lucide-react";

const categoryColors = {
  Cibo: "bg-yellow-100 text-yellow-800",
  Affitto: "bg-blue-100 text-blue-800",
  Svago: "bg-pink-100 text-pink-800",
  Stipendio: "bg-green-100 text-green-800",
  Altro: "bg-gray-100 text-gray-800",
};

const TransactionList = ({ transactions, openDeleteModal, onEdit }) => {
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
            <th className="p-2">Categoria</th>
            <th className="p-2 text-right">Importo</th>
            <th className="p-2 text-right">Azioni</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="border-b last:border-none hover:bg-gray-50 transition-colors duration-200"
            >
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
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[t.category]}`}
                >
                  {t.category}
                </span>
              </td>
              <td
                className={`p-2 text-right font-medium ${t.type === "income" ? "text-green-600" : "text-red-600"}`}
              >
                € {t.amount}
              </td>
              <td className="p-2 text-right">
                <button
                  onClick={() => onEdit(t)}
                  className="mr-2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  title="Modifica"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(t.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
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
