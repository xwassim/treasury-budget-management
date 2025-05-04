import React from "react";
import { Budget } from "../types";
import { getAvailableMonths, formatMonth } from "../utils/dates";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CashFlowChartProps {
  budget: Budget;
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ budget }) => {
  const months = getAvailableMonths(
    budget.period.startMonth,
    budget.period.months
  );
  const monthLabels = months.map((month) => formatMonth(month));

  const balanceData: number[] = [];
  const cashFlowData: number[] = [];
  const incomeData: number[] = [];
  const expenseData: number[] = [];

  months.forEach((month) => {
    balanceData.push(budget.summary[month]?.finalBalance || 0);
    cashFlowData.push(budget.summary[month]?.monthlyCashFlow || 0);
    incomeData.push(budget.summary[month]?.totalIncome || 0);
    expenseData.push(budget.summary[month]?.totalExpenses || 0);
  });

  const lineChartData: ChartData<"line"> = {
    labels: monthLabels,
    datasets: [
      {
        label: "Solde de trésorerie",
        data: balanceData,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgb(59, 130, 246)",
      },
    ],
  };

  const barChartData: ChartData<"bar"> = {
    labels: monthLabels,
    datasets: [
      {
        label: "Encaissements",
        data: incomeData,
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
      {
        label: "Décaissements",
        data: expenseData,
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
      },
      {
        label: "Solde mensuel",
        data: cashFlowData,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Évolution de la trésorerie",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Montant (DA)",
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Encaissements et Décaissements par mois",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Montant (DA)",
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 ">
      <h3 className="text-xl font-semibold text-blue-800 mb-6">
        Visualisation graphique
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-4 border rounded-lg shadow-sm">
          <Line data={lineChartData} options={lineOptions} />
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <Bar data={barChartData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default CashFlowChart;
