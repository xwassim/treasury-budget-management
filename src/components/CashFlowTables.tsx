import React, { useState } from 'react';
import { Budget } from '../types';
import { formatMonth, getAvailableMonths } from '../utils/dates';
import { formatCurrency } from '../utils/formatters';
import { PlusCircle, Trash } from 'lucide-react';
import EditableCell from './EditableCell';
import { useBudget } from '../context/BudgetContext';

interface CashFlowTablesProps {
  budget: Budget;
}

const CashFlowTables: React.FC<CashFlowTablesProps> = ({ budget }) => {
  const { 
    addIncomeItem, 
    addExpenseItem, 
    updateIncomeValue, 
    updateExpenseValue,
    removeIncomeItem,
    removeExpenseItem
  } = useBudget();
  
  const [newIncomeDesc, setNewIncomeDesc] = useState('');
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  
  const months = getAvailableMonths(budget.period.startMonth, budget.period.months);
  
  const handleAddIncome = () => {
    if (newIncomeDesc.trim()) {
      addIncomeItem(newIncomeDesc.trim());
      setNewIncomeDesc('');
    }
  };
  
  const handleAddExpense = () => {
    if (newExpenseDesc.trim()) {
      addExpenseItem(newExpenseDesc.trim());
      setNewExpenseDesc('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter') {
      callback();
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 ">
      <h3 className="text-xl font-semibold text-blue-800 mb-6">Tableaux des Encaissements & Décaissements</h3>
      
      {/* Incomes Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-medium text-blue-700">Encaissements</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newIncomeDesc}
              onChange={(e) => setNewIncomeDesc(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddIncome)}
              placeholder="Description"
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddIncome}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
            >
              <PlusCircle size={16} />
              <span>Ajouter</span>
            </button>
          </div>
        </div>
        
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
                <th className="px-4 py-2 w-10 border-b"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {budget.incomes.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800 border-r">{item.description}</td>
                  {months.map(month => (
                    <td key={month} className="px-2 py-2 border-r text-center">
                      <EditableCell
                        value={item.amounts[month] || 0}
                        onChange={(value) => updateIncomeValue(item.id, month, value)}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => removeIncomeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      title="Supprimer"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {budget.incomes.length === 0 && (
                <tr>
                  <td colSpan={months.length + 2} className="px-4 py-3 text-sm text-center text-gray-500 italic">
                    Aucun encaissement ajouté
                  </td>
                </tr>
              )}
              <tr className="bg-gray-50 font-medium">
                <td className="px-4 py-2 text-sm text-gray-800 border-r">Total des Encaissements</td>
                {months.map(month => (
                  <td key={month} className="px-4 py-2 text-sm text-center text-gray-800 border-r">
                    {formatCurrency(budget.summary[month]?.totalIncome || 0)}
                  </td>
                ))}
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Expenses Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-medium text-blue-700">Décaissements</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newExpenseDesc}
              onChange={(e) => setNewExpenseDesc(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddExpense)}
              placeholder="Description"
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddExpense}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
            >
              <PlusCircle size={16} />
              <span>Ajouter</span>
            </button>
          </div>
        </div>
        
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
                <th className="px-4 py-2 w-10 border-b"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {budget.expenses.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800 border-r">{item.description}</td>
                  {months.map(month => (
                    <td key={month} className="px-2 py-2 border-r text-center">
                      <EditableCell
                        value={item.amounts[month] || 0}
                        onChange={(value) => updateExpenseValue(item.id, month, value)}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => removeExpenseItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      title="Supprimer"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {budget.expenses.length === 0 && (
                <tr>
                  <td colSpan={months.length + 2} className="px-4 py-3 text-sm text-center text-gray-500 italic">
                    Aucun décaissement ajouté
                  </td>
                </tr>
              )}
              <tr className="bg-gray-50 font-medium">
                <td className="px-4 py-2 text-sm text-gray-800 border-r">Total des Décaissements</td>
                {months.map(month => (
                  <td key={month} className="px-4 py-2 text-sm text-center text-gray-800 border-r">
                    {formatCurrency(budget.summary[month]?.totalExpenses || 0)}
                  </td>
                ))}
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashFlowTables;