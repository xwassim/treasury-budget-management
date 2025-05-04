import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatDate, getBudgetPeriodLabel } from '../utils/dates';
import { Trash, FileEdit, Eye } from 'lucide-react';

interface BudgetListProps {
  onSelectBudget: (id: string) => void;
  onCreateNew: () => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ onSelectBudget, onCreateNew }) => {
  const { budgets, deleteBudget } = useBudget();

  if (budgets.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-blue-800 mb-6">Liste des budgets</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Aucun budget n'a été créé</p>
          <button
            onClick={onCreateNew}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Créer un nouveau budget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-800">Liste des budgets</h2>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm"
        >
          Nouveau budget
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nom</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Période</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Créé le</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Dernière modification</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {budgets.map(budget => (
              <tr key={budget.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{budget.name}</td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {getBudgetPeriodLabel(
                    budget.period.startMonth,
                    budget.period.months,
                    budget.period.year
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(budget.createdAt)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(budget.updatedAt)}</td>
                <td className="px-4 py-3 text-sm text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onSelectBudget(budget.id)}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      title="Voir le budget"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onSelectBudget(budget.id)}
                      className="p-1 text-green-600 hover:text-green-800 transition-colors duration-200"
                      title="Modifier le budget"
                    >
                      <FileEdit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Êtes-vous sûr de vouloir supprimer ce budget ?")) {
                          deleteBudget(budget.id);
                        }
                      }}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                      title="Supprimer le budget"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetList;