import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const INCOME_COLOR = "#22c55e";
const EXPENSE_COLOR = "#ef4444";
const NET_COLOR = "#2563eb";
const CATEGORY_COLORS = [
  "#60a5fa",
  "#f97316",
  "#34d399",
  "#f43f5e",
  "#a78bfa",
  "#facc15",
  "#0ea5e9",
  "#fb7185",
];
const INCOME_CATEGORY_COLORS = [
  "#22c55e",
  "#16a34a",
  "#4ade80",
  "#86efac",
  "#0f766e",
  "#14b8a6",
  "#2dd4bf",
  "#5eead4",
];

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

const formatCurrency = (value) => currencyFormatter.format(value || 0);

const formatMonthLabel = (date) =>
  new Intl.DateTimeFormat("it-IT", {
    month: "short",
    year: "2-digit",
  }).format(date);

const buildMonthlyData = (transactions) => {
  const map = new Map();

  transactions.forEach((transaction) => {
    if (!transaction.date) return;
    const parsedDate = new Date(transaction.date);
    if (Number.isNaN(parsedDate.getTime())) return;

    const monthKey = `${parsedDate.getFullYear()}-${String(
      parsedDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    if (!map.has(monthKey)) {
      map.set(monthKey, {
        monthKey,
        monthLabel: formatMonthLabel(parsedDate),
        income: 0,
        expense: 0,
        net: 0,
      });
    }

    const entry = map.get(monthKey);
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      entry.income += amount;
      entry.net += amount;
    } else {
      entry.expense += amount;
      entry.net -= amount;
    }
  });

  return Array.from(map.values()).sort((a, b) =>
    a.monthKey.localeCompare(b.monthKey),
  );
};

const buildCategoryData = (transactions) => {
  const map = new Map();

  transactions.forEach((transaction) => {
    const category = transaction.category || "Altro";
    const amount = Number(transaction.amount) || 0;

    if (!map.has(category)) {
      map.set(category, {
        category,
        income: 0,
        expense: 0,
        total: 0,
      });
    }

    const entry = map.get(category);
    if (transaction.type === "income") {
      entry.income += amount;
    } else {
      entry.expense += amount;
    }
    entry.total += amount;
  });

  return Array.from(map.values()).sort((a, b) => b.total - a.total);
};

const TransactionsChart = ({ transactions }) => {
  const incomeTotal = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const expenseTotal = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const monthlyData = buildMonthlyData(transactions);
  const categoryData = buildCategoryData(transactions);
  const expenseCategoryData = categoryData
    .filter((item) => item.expense > 0)
    .map((item) => ({
      name: item.category,
      value: item.expense,
      type: "Uscite",
    }));
  const incomeCategoryData = categoryData
    .filter((item) => item.income > 0)
    .map((item) => ({
      name: item.category,
      value: item.income,
      type: "Entrate",
    }));

  const monthlyHasData = monthlyData.length > 0;
  const hasExpenseCategories = expenseCategoryData.length > 0;
  const hasIncomeCategories = incomeCategoryData.length > 0;
  const categoryTitle =
    hasExpenseCategories && hasIncomeCategories
      ? "Categorie (Entrate e Uscite)"
      : hasExpenseCategories
        ? "Categorie di spesa"
        : "Categorie di entrata";
  const categoryHasData = hasExpenseCategories || hasIncomeCategories;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full h-72">
            <h2 className="text-lg font-semibold mb-2">
              Trend mensile (Entrate vs Uscite)
            </h2>
            {monthlyHasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyData}
                  margin={{ top: 10, bottom: 4 }}
                  tabIndex={-1}
                  className="outline-none focus:outline-none"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthLabel" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      formatCurrency(value),
                      name === "income"
                        ? "Entrate"
                        : name === "expense"
                          ? "Uscite"
                          : "Saldo",
                    ]}
                    cursor={{ fill: "rgba(15, 23, 42, 0.06)" }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: 4 }}
                  />
                  <Bar
                    dataKey="income"
                    name="Entrate"
                    fill={INCOME_COLOR}
                    radius={[4, 4, 0, 0]}
                    cursor="default"
                  />
                  <Bar
                    dataKey="expense"
                    name="Uscite"
                    fill={EXPENSE_COLOR}
                    radius={[4, 4, 0, 0]}
                    cursor="default"
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    name="Saldo"
                    stroke={NET_COLOR}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Nessun dato mensile disponibile
              </div>
            )}
          </div>

          <div className="w-full h-72">
            <h2 className="text-lg font-semibold mb-2">{categoryTitle}</h2>
            {(hasExpenseCategories || hasIncomeCategories) && (
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                {hasExpenseCategories && (
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[0] }}
                    />
                    Uscite (anello esterno)
                  </span>
                )}
                {hasIncomeCategories && (
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: INCOME_CATEGORY_COLORS[0] }}
                    />
                    Entrate (anello interno)
                  </span>
                )}
              </div>
            )}
            {categoryHasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart
                  tabIndex={-1}
                  className="outline-none focus:outline-none"
                >
                  {hasExpenseCategories && (
                    <Pie
                      data={expenseCategoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={hasIncomeCategories ? 60 : 0}
                      cursor="default"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell
                          key={`expense-cell-${index}`}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  )}
                  {hasIncomeCategories && (
                    <Pie
                      data={incomeCategoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={hasExpenseCategories ? 55 : 90}
                      cursor="default"
                    >
                      {incomeCategoryData.map((entry, index) => (
                        <Cell
                          key={`income-cell-${index}`}
                          fill={
                            INCOME_CATEGORY_COLORS[
                              index % INCOME_CATEGORY_COLORS.length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                  )}
                  <Tooltip
                    formatter={(value, name, props) => [
                      formatCurrency(value),
                      `${props?.payload?.type ?? ""} ${name}`.trim(),
                    ]}
                    separator=": "
                  />
                  <Legend verticalAlign="bottom" height={50} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Nessun dato per categorie
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-lg bg-green-50">
            <p className="text-sm text-gray-600">Entrate totali</p>
            <p className="text-xl font-semibold text-green-600">
              {formatCurrency(incomeTotal)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-red-50">
            <p className="text-sm text-gray-600">Uscite totali</p>
            <p className="text-xl font-semibold text-red-600">
              {formatCurrency(expenseTotal)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50">
            <p className="text-sm text-gray-600">Saldo netto</p>
            <p className="text-xl font-semibold text-blue-600">
              {formatCurrency(incomeTotal - expenseTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsChart;
