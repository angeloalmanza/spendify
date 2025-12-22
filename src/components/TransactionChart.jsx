import { useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#4ade80", "#f87171"];

const TransactionsChart = ({ transactions }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const data = [
    { name: "Entrate", value: income },
    { name: "Uscite", value: expenses },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4 flex flex-col md:flex-row items-center gap-6">
      {/* Grafico */}
      <div className="w-full md:w-1/2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Box informazioni accanto */}
      <div className="flex flex-col gap-2 w-full md:w-1/2">
        {data.map((entry, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-2 rounded ${
              activeIndex === index ? "bg-gray-100" : ""
            }`}
          >
            {/* Indicatore colore */}
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="font-medium">
              {entry.name}: € {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsChart;
