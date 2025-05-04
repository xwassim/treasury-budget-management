import React from 'react';
import { Budget } from '../types';
import { formatMonth, getAvailableMonths } from '../utils/dates';
import { formatCurrency } from '../utils/formatters';

interface SummaryTableProps {
  budget: Budget;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ budget }) => {
  const months = getAvailableMonths(budget.period.startMonth, budget.period.months);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-blue-800 mb-6">Budget de Trésorerie</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b w-60">Description</th>
              {months.map(month => (
                <th key={month} className="px-4 py-2 text-center text-sm font-semibold text-gray-600 border-b">
                  {formatMonth(month)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-800 border-r font-medium">Trésorerie initiale</td>
              {months.map((month, index) => (
                <td key={month} className="px-4 py-3 text-sm text-center text-gray-800 border-r">
                  {formatCurrency(index === 0 ? budget.initialTreasury : budget.summary[month]?.initialBalance || 0)}
                </td>
              ))}
            </tr>
            <tr className="border-b bg-blue-50">
              <td className="px-4 py-3 text-sm text-gray-800 border-r font-medium">Total des encaissements</td>
              {months.map(month => (
                <td key={month} className="px-4 py-3 text-sm text-center text-blue-700 border-r">
                  {formatCurrency(budget.summary[month]?.totalIncome || 0)}
                </td>
              ))}
            </tr>
            <tr className="border-b bg-red-50">
              <td className="px-4 py-3 text-sm text-gray-800 border-r font-medium">Total des décaissements</td>
              {months.map(month => (
                <td key={month} className="px-4 py-3 text-sm text-center text-red-700 border-r">
                  {formatCurrency(budget.summary[month]?.totalExpenses || 0)}
                </td>
              ))}
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-800 border-r font-medium">Solde mensuel</td>
              {months.map(month => {
                const monthlyCashFlow = budget.summary[month]?.monthlyCashFlow || 0;
                const isPositive = monthlyCashFlow >= 0;
                return (
                  <td
                    key={month}
                    className={`px-4 py-3 text-sm text-center border-r ${
                      isPositive ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {formatCurrency(monthlyCashFlow)}
                  </td>
                );
              })}
            </tr>
            <tr className="bg-blue-100 font-semibold">
              <td className="px-4 py-3 text-sm text-gray-800 border-r">Trésorerie finale</td>
              {months.map(month => {
                const finalBalance = budget.summary[month]?.finalBalance || 0;
                const isPositive = finalBalance >= 0;
                return (
                  <td
                    key={month}
                    className={`px-4 py-3 text-sm text-center border-r ${
                      isPositive ? 'text-green-700' : 'text-red-700'
                    } font-semibold`}
                  >
                    {formatCurrency(finalBalance)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;