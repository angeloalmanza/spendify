import { Edit3, Trash2 } from "lucide-react";

const categoryColors = {
  Cibo: "bg-yellow-100 text-yellow-800",
  Affitto: "bg-blue-100 text-blue-800",
  Svago: "bg-pink-100 text-pink-800",
  Stipendio: "bg-emerald-100 text-emerald-800",
  Altro: "bg-slate-100 text-slate-700",
};

const TransactionList = ({
  transactions,
  onSort,
  sortField,
  sortDirection,
  openDeleteModal,
  onEdit,
  highlightedId,
}) => {
  const formatter = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  });

  if (transactions.length === 0)
    return (
      <div className="bg-white/90 border border-slate-100 rounded-xl p-8 text-center text-slate-500 shadow-sm">
        <p className="text-lg font-medium text-slate-700">
          Nessuna transazione
        </p>
        <p className="text-sm mt-1">
          Inizia aggiungendone una per vedere l’andamento.
        </p>
      </div>
    );

  return (
    <div className="bg-white/90 border border-slate-100 rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b bg-slate-50">
            <th
              onClick={() => onSort("name")}
              className="p-3 cursor-pointer select-none hover:text-slate-900 transition-colors"
            >
              Nome
              {sortField === "name" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>
            <th
              onClick={() => onSort("type")}
              className="p-3 cursor-pointer select-none hover:text-slate-900 transition-colors"
            >
              Tipo
              {sortField === "type" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>
            <th
              onClick={() => onSort("date")}
              className="p-3 cursor-pointer select-none hover:text-slate-900 transition-colors"
            >
              Data
              {sortField === "date" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>
            <th
              onClick={() => onSort("category")}
              className="p-3 cursor-pointer select-none hover:text-slate-900 transition-colors"
            >
              Categoria
              {sortField === "category" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>
            <th
              onClick={() => onSort("amount")}
              className="p-3 text-right cursor-pointer select-none hover:text-slate-900 transition-colors"
            >
              Importo
              {sortField === "amount" && (
                <span className="ml-1 inline-block">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>

            <th className="p-3 text-right">Azioni</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              className={`border-b last:border-none transition-colors ${
                highlightedId === t.id ? "bg-emerald-50" : "hover:bg-slate-50"
              }`}
            >
              <td className="p-3 font-medium text-slate-800">{t.name}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    t.type === "income"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {t.type === "income" ? "Entrata" : "Uscita"}
                </span>
              </td>
              <td className="p-3 text-slate-600">
                {t.date ? new Date(t.date).toLocaleDateString("it-IT") : "-"}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    categoryColors[t.category] || categoryColors.Altro
                  }`}
                >
                  {t.category || "Altro"}
                </span>
              </td>
              <td
                className={`p-3 text-right font-semibold tabular-nums ${
                  t.type === "income" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {formatter.format(t.amount)}
              </td>
              <td className="p-3 text-right">
                <button
                  onClick={() => onEdit(t)}
                  className="mr-2 text-slate-500 hover:text-slate-800 transition-colors duration-200"
                  title="Modifica"
                >
                  <Edit3 className="w-4 h-4 cursor-pointer" />
                </button>
                <button
                  onClick={() => openDeleteModal(t.id)}
                  className="text-rose-500 hover:text-rose-700 transition-colors duration-200"
                  title="Elimina"
                >
                  <Trash2 className="w-4 h-4 cursor-pointer" />
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
