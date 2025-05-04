import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Budget, BudgetFormData } from '../types';
import {
  createNewBudget,
  addVATCollected,
  addVATDeductible,
  addIncome,
  addExpense,
  updateVATCollectedAmount,
  updateVATDeductibleAmount,
  updateIncomeAmount,
  updateExpenseAmount,
  removeVATCollected,
  removeVATDeductible,
  removeIncome,
  removeExpense,
  recalculateBudget
} from '../utils/budget';
import {
  getBudgets,
  getBudgetById,
  saveBudget,
  deleteBudget
} from '../utils/storage';

interface BudgetContextProps {
  budgets: Budget[];
  currentBudget: Budget | null;
  setCurrentBudget: (budget: Budget | null) => void;
  createBudget: (formData: BudgetFormData) => Budget;
  getBudget: (id: string) => Budget | null;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  addVATCollectedItem: (description: string) => void;
  addVATDeductibleItem: (description: string) => void;
  addIncomeItem: (description: string) => void;
  addExpenseItem: (description: string) => void;
  updateVATCollectedValue: (id: string, month: number, amount: number) => void;
  updateVATDeductibleValue: (id: string, month: number, amount: number) => void;
  updateIncomeValue: (id: string, month: number, amount: number) => void;
  updateExpenseValue: (id: string, month: number, amount: number) => void;
  removeVATCollectedItem: (id: string) => void;
  removeVATDeductibleItem: (id: string) => void;
  removeIncomeItem: (id: string) => void;
  removeExpenseItem: (id: string) => void;
}

const BudgetContext = createContext<BudgetContextProps | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);

  // Load budgets from localStorage on initial render
  useEffect(() => {
    const storedBudgets = getBudgets();
    setBudgets(storedBudgets);
  }, []);

  const createBudget = (formData: BudgetFormData): Budget => {
    const newBudget = createNewBudget(formData);
    const calculatedBudget = recalculateBudget(newBudget);
    
    setBudgets(prev => [...prev, calculatedBudget]);
    setCurrentBudget(calculatedBudget);
    saveBudget(calculatedBudget);
    
    return calculatedBudget;
  };

  const getBudget = (id: string): Budget | null => {
    return getBudgetById(id);
  };

  const updateBudget = (budget: Budget): void => {
    const updatedBudget = {
      ...budget,
      updatedAt: new Date().toISOString()
    };
    
    setBudgets(prev => 
      prev.map(b => b.id === updatedBudget.id ? updatedBudget : b)
    );
    
    if (currentBudget?.id === updatedBudget.id) {
      setCurrentBudget(updatedBudget);
    }
    
    saveBudget(updatedBudget);
  };

  const removeBudget = (id: string): void => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    
    if (currentBudget?.id === id) {
      setCurrentBudget(null);
    }
    
    deleteBudget(id);
  };

  // VAT Collected operations
  const addVATCollectedItem = (description: string): void => {
    if (!currentBudget) return;
    
    const updatedBudget = addVATCollected(currentBudget, description);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  // VAT Deductible operations
  const addVATDeductibleItem = (description: string): void => {
    if (!currentBudget) return;
    
    const updatedBudget = addVATDeductible(currentBudget, description);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  // Income operations
  const addIncomeItem = (description: string): void => {
    if (!currentBudget) return;
    
    const updatedBudget = addIncome(currentBudget, description);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  // Expense operations
  const addExpenseItem = (description: string): void => {
    if (!currentBudget) return;
    
    const updatedBudget = addExpense(currentBudget, description);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  // Update operations
  const updateVATCollectedValue = (id: string, month: number, amount: number): void => {
    if (!currentBudget) return;
    
    const updatedBudget = updateVATCollectedAmount(currentBudget, id, month, amount);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  const updateVATDeductibleValue = (id: string, month: number, amount: number): void => {
    if (!currentBudget) return;
    
    const updatedBudget = updateVATDeductibleAmount(currentBudget, id, month, amount);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  const updateIncomeValue = (id: string, month: number, amount: number): void => {
    if (!currentBudget) return;
    
    const updatedBudget = updateIncomeAmount(currentBudget, id, month, amount);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  const updateExpenseValue = (id: string, month: number, amount: number): void => {
    if (!currentBudget) return;
    
    const updatedBudget = updateExpenseAmount(currentBudget, id, month, amount);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  // Remove operations
  const removeVATCollectedItem = (id: string): void => {
    if (!currentBudget) return;
    
    const updatedBudget = removeVATCollected(currentBudget, id);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  const removeVATDeductibleItem = (id: string): void => {
    if (!currentBudget) return;
    
    const updatedBudget = removeVATDeductible(currentBudget, id);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  const removeIncomeItem = (id: string): void => {
    if (!currentBudget) return;
    
    const updatedBudget = removeIncome(currentBudget, id);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  const removeExpenseItem = (id: string): void => {
    if (!currentBudget) return;
    
    const updatedBudget = removeExpense(currentBudget, id);
    const calculatedBudget = recalculateBudget(updatedBudget);
    
    setCurrentBudget(calculatedBudget);
    updateBudget(calculatedBudget);
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        currentBudget,
        setCurrentBudget,
        createBudget,
        getBudget,
        updateBudget,
        deleteBudget: removeBudget,
        addVATCollectedItem,
        addVATDeductibleItem,
        addIncomeItem,
        addExpenseItem,
        updateVATCollectedValue,
        updateVATDeductibleValue,
        updateIncomeValue,
        updateExpenseValue,
        removeVATCollectedItem,
        removeVATDeductibleItem,
        removeIncomeItem,
        removeExpenseItem
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextProps => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};