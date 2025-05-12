import React, { useState, useEffect } from 'react';
import { Budget, ForecastItem } from '../types';
import { formatMonth, getAvailableMonths } from '../utils/dates';
import { formatCurrency } from '../utils/formatters';
import { useBudget } from '../context/BudgetContext';
import EditableCell from './EditableCell';

interface ForecastTableProps {
  budget: Budget;
}

const ForecastTable: React.FC<ForecastTableProps> = ({ budget }) => {
  const { updateBudget } = useBudget();
  const months = getAvailableMonths(budget.period.startMonth, budget.period.months);

  // Initialize forecasts with proper month data
  const [forecasts, setForecasts] = useState<ForecastItem[]>(() => {
    const initialForecasts = budget.forecasts || [
      {
        id: 'sales',
        type: 'sales',
        vatRates: {},
        amounts: {}
      },
      {
        id: 'purchases',
        type: 'purchases',
        vatRates: {},
        amounts: {}
      },
      {
        id: 'investments',
        type: 'investments',
        vatRates: {},
        amounts: {}
      }
    ];
    
    // Initialize all months with default values
    return initialForecasts.map(forecast => {
      const newAmounts = {...forecast.amounts};
      const newVatRates = {...forecast.vatRates};
      
      months.forEach(month => {
        if (!newAmounts[month]) {
          newAmounts[month] = { ht: 0, vat: 0, ttc: 0 };
        }
        if (!newVatRates[month]) {
          newVatRates[month] = 0;
        }
      });
      
      return {
        ...forecast,
        amounts: newAmounts,
        vatRates: newVatRates
      };
    });
  });

  // Update budget when forecasts change
  useEffect(() => {
    updateBudget({ ...budget, forecasts });
  }, [forecasts, budget, updateBudget]);

  const updateVATRate = (type: string, month: number, rate: number) => {
    setForecasts(prev => prev.map(forecast => {
      if (forecast.type === type) {
        const vatRate = Number(rate);
        const ht = forecast.amounts[month].ht;
        const vat = ht * (vatRate / 100);
        
        return {
          ...forecast,
          vatRates: { ...forecast.vatRates, [month]: vatRate },
          amounts: {
            ...forecast.amounts,
            [month]: {
              ht,
              vat,
              ttc: ht + vat
            }
          }
        };
      }
      return forecast;
    }));
  };

  const updateAmount = (type: string, month: number, field: 'ht' | 'vat' | 'ttc', value: number) => {
    setForecasts(prev => prev.map(forecast => {
      if (forecast.type === type) {
        const current = forecast.amounts[month];
        const vatRate = forecast.vatRates[month] || 0;
        let newAmount = { ...current };

        if (field === 'ht') {
          const ht = Number(value);
          const vat = ht * (vatRate / 100);
          newAmount = { ht, vat, ttc: ht + vat };
        } 
        else if (field === 'vat') {
          const ht = current.ht;
          const vat = Number(value);
          newAmount = { ht, vat, ttc: ht + vat };
        }
        else if (field === 'ttc') {
          const ttc = Number(value);
          const ht = vatRate > 0 ? ttc / (1 + vatRate / 100) : ttc;
          const vat = ttc - ht;
          newAmount = { ht, vat, ttc };
        }

        return {
          ...forecast,
          amounts: {
            ...forecast.amounts,
            [month]: newAmount
          }
        };
      }
      return forecast;
    }));
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sales':
        return 'Ventes';
      case 'purchases':
        return 'Achats';
      case 'investments':
        return 'Investissements';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-blue-800 mb-6">Prévisions d'achats et ventes</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th rowSpan={2} className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b">Éléments</th>
              {months.map(month => (
                <th key={month} colSpan={4} className="px-4 py-2 text-center text-sm font-semibold text-gray-600 border-b">
                  {formatMonth(month)}
                </th>
              ))}
            </tr>
            <tr>
              {months.map(month => (
                <React.Fragment key={`header-${month}`}>
                  <th className="px-2 py-2 text-center text-sm font-semibold text-gray-600 border-b">TVA %</th>
                  <th className="px-2 py-2 text-center text-sm font-semibold text-gray-600 border-b">HT</th>
                  <th className="px-2 py-2 text-center text-sm font-semibold text-gray-600 border-b">TVA</th>
                  <th className="px-2 py-2 text-center text-sm font-semibold text-gray-600 border-b">TTC</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {forecasts.map(forecast => (
              <tr key={forecast.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800 border-r font-medium">
                  {getTypeLabel(forecast.type)}
                </td>
                {months.map(month => {
                  const amount = forecast.amounts[month];
                  const vatRate = forecast.vatRates[month] || 0;
                  
                  return (
                    <React.Fragment key={`${forecast.id}-${month}`}>
                      <td className="px-2 py-2 border-r text-center">
                        <EditableCell
                          value={vatRate}
                          onChange={(value) => updateVATRate(forecast.type, month, value)}
                          
                        />
                      </td>
                      <td className="px-2 py-2 border-r text-center">
                        <EditableCell
                          value={amount.ht}
                          onChange={(value) => updateAmount(forecast.type, month, 'ht', value)}
                          
                        />
                      </td>
                      <td className="px-2 py-2 border-r text-center bg-gray-100">
                        {formatCurrency(amount.vat)}
                      </td>
                      <td className="px-2 py-2 border-r text-center bg-gray-100">
                        {/* <EditableCell
                          value={amount.ttc}
                          onChange={(value) => updateAmount(forecast.type, month, 'ttc', value)}
                          
                        /> */}
                        {formatCurrency(amount.ttc)}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForecastTable;