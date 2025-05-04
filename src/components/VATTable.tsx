import React, { useState } from 'react';
import { Budget } from '../types';
import { formatMonth, getAvailableMonths } from '../utils/dates';
import { formatCurrency } from '../utils/formatters';
import { PlusCircle, Trash } from 'lucide-react';
import EditableCell from './EditableCell';
import { useBudget } from '../context/BudgetContext';

interface VATTableProps {
  budget: Budget;
}

const VATTable: React.FC<VATTableProps> = ({ budget }) => {
  const { 
    addVATCollectedItem, 
    addVATDeductibleItem, 
    updateVATCollectedValue, 
    updateVATDeductibleValue,
    removeVATCollectedItem,
    removeVATDeductibleItem
  } = useBudget();
  
  const [newVATCollectedDesc, setNewVATCollectedDesc] = useState('');
  const [newVATDeductibleDesc, setNewVATDeductibleDesc] = useState('');
  
  const months = getAvailableMonths(budget.period.startMonth, budget.period.months);
  
  const handleAddVATCollected = () => {
    if (newVATCollectedDesc.trim()) {
      addVATCollectedItem(newVATCollectedDesc.trim());
      setNewVATCollectedDesc('');
    }
  };
  
  const handleAddVATDeductible = () => {
    if (newVATDeductibleDesc.trim()) {
      addVATDeductibleItem(newVATDeductibleDesc.trim());
      setNewVATDeductibleDesc('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter') {
      callback();
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-blue-800 mb-6">Budget de la TVA</h3>
      
      {/* TVA Collectée Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-medium text-blue-700">TVA Collectée</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newVATCollectedDesc}
              onChange={(e) => setNewVATCollectedDesc(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddVATCollected)}
              placeholder="Description"
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddVATCollected}
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
              {budget.vatCollected.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800 border-r">{item.description}</td>
                  {months.map(month => (
                    <td key={month} className="px-2 py-2 border-r text-center">
                      <EditableCell
                        value={item.amounts[month] || 0}
                        onChange={(value) => updateVATCollectedValue(item.id, month, value)}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => removeVATCollectedItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      title="Supprimer"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {budget.vatCollected.length === 0 && (
                <tr>
                  <td colSpan={months.length + 2} className="px-4 py-3 text-sm text-center text-gray-500 italic">
                    Aucune TVA collectée ajoutée
                  </td>
                </tr>
              )}
              <tr className="bg-gray-50 font-medium">
                <td className="px-4 py-2 text-sm text-gray-800 border-r">Total TVA Collectée</td>
                {months.map(month => (
                  <td key={month} className="px-4 py-2 text-sm text-center text-gray-800 border-r">
                    {formatCurrency(budget.vatSummary[month]?.collected || 0)}
                  </td>
                ))}
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* TVA Déductible Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-medium text-blue-700">TVA Déductible</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newVATDeductibleDesc}
              onChange={(e) => setNewVATDeductibleDesc(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddVATDeductible)}
              placeholder="Description"
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddVATDeductible}
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
              {budget.vatDeductible.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800 border-r">{item.description}</td>
                  {months.map(month => (
                    <td key={month} className="px-2 py-2 border-r text-center">
                      <EditableCell
                        value={item.amounts[month] || 0}
                        onChange={(value) => updateVATDeductibleValue(item.id, month, value)}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => removeVATDeductibleItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      title="Supprimer"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {budget.vatDeductible.length === 0 && (
                <tr>
                  <td colSpan={months.length + 2} className="px-4 py-3 text-sm text-center text-gray-500 italic">
                    Aucune TVA déductible ajoutée
                  </td>
                </tr>
              )}
              <tr className="bg-gray-50 font-medium">
                <td className="px-4 py-2 text-sm text-gray-800 border-r">Total TVA Déductible</td>
                {months.map(month => (
                  <td key={month} className="px-4 py-2 text-sm text-center text-gray-800 border-r">
                    {formatCurrency(budget.vatSummary[month]?.deductible || 0)}
                  </td>
                ))}
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* TVA à payer / Crédit de TVA Section */}
      <div>
        <h4 className="text-lg font-medium text-blue-700 mb-3">TVA à payer / Crédit de TVA</h4>
        
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
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm text-gray-800 border-r">Crédit TVA (mois précédent)</td>
                {months.map(month => (
                  <td key={month} className="px-4 py-2 text-sm text-center text-gray-800 border-r">
                    {formatCurrency(budget.vatSummary[month]?.previousMonthCredit || 0)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-800 border-r">TVA Collectée</td>
                {months.map(month => (
                  <td key={month} className="px-4 py-2 text-sm text-center text-gray-800 border-r">
                    {formatCurrency(budget.vatSummary[month]?.collected || 0)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-800 border-r">TVA Déductible</td>
                {months.map(month => (
                  <td key={month} className="px-4 py-2 text-sm text-center text-gray-800 border-r">
                    {formatCurrency(budget.vatSummary[month]?.deductible || 0)}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2 text-sm text-gray-800 border-r">TVA à payer / Crédit de TVA</td>
                {months.map(month => {
                  const vatToPay = budget.vatSummary[month]?.toPay || 0;
                  const isCredit = vatToPay < 0;
                  return (
                    <td 
                      key={month} 
                      className={`px-4 py-2 text-sm text-center border-r ${
                        isCredit ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {isCredit 
                        ? `Crédit: ${formatCurrency(Math.abs(vatToPay))}` 
                        : formatCurrency(vatToPay)
                      }
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VATTable;