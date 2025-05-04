import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BudgetFormData } from '../types';
import { MONTHS, getCurrentYear } from '../utils/dates';
import { useBudget } from '../context/BudgetContext';

const BudgetForm: React.FC = () => {
  const { createBudget } = useBudget();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const currentYear = getCurrentYear();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<BudgetFormData>({
    defaultValues: {
      name: '',
      startMonth: new Date().getMonth() + 1, // Current month
      months: 12,
      year: currentYear,
      initialTreasury: 0,
      initialVATCredit: 0
    }
  });
  
  const selectedMonths = watch('months');
  
  const onSubmit = (data: BudgetFormData) => {
    createBudget(data);
    setFormSubmitted(true);
  };
  
  if (formSubmitted) {
    return null; // Form disappears after submission
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-blue-800 mb-6">Création d'un nouveau budget</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du budget
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('name', { required: 'Le nom du budget est requis' })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mois de début
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('startMonth', { required: true })}
            >
              {MONTHS.map(month => (
                <option key={month.id} value={month.id}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de mois
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('months', { 
                required: true,
                min: { value: 2, message: 'Le nombre de mois doit être entre 2 et 12' },
                max: { value: 12, message: 'Le nombre de mois doit être entre 2 et 12' }
              })}
            >
              {Array.from({ length: 11 }, (_, i) => i + 2).map(number => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
            {errors.months && (
              <p className="mt-1 text-sm text-red-600">{errors.months.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('year', { required: true })}
            >
              {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trésorerie initiale (DZD)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('initialTreasury', { 
                required: 'Le montant de la trésorerie initiale est requis',
                valueAsNumber: true
              })}
            />
            {errors.initialTreasury && (
              <p className="mt-1 text-sm text-red-600">{errors.initialTreasury.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crédit TVA initial (DZD)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('initialVATCredit', { 
                required: 'Le montant du crédit TVA initial est requis',
                valueAsNumber: true
              })}
            />
            {errors.initialVATCredit && (
              <p className="mt-1 text-sm text-red-600">{errors.initialVATCredit.message}</p>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <p className="text-sm text-gray-500 mb-2">
            Aperçu de la période : {selectedMonths} mois
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Créer le budget
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;