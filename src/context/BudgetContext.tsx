import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

  const updateAndSaveBudget = useCallback((updatedBudget: Budget) => {
    const calculatedBudget = recalculateBudget(updatedBudget);
    const budgetWithTimestamp = {
      ...calculatedBudget,
      updatedAt: new Date().toISOString()
    };

    setBudgets(prev => 
      prev.map(b => b.id === budgetWithTimestamp.id ? budgetWithTimestamp : b)
    );
    
    if (currentBudget?.id === budgetWithTimestamp.id) {
      setCurrentBudget(budgetWithTimestamp);
    }
    
    saveBudget(budgetWithTimestamp);
    return budgetWithTimestamp;
  }, [currentBudget?.id]);

  const createBudget = useCallback((formData: BudgetFormData): Budget => {
    const newBudget = createNewBudget(formData);
    const calculatedBudget = updateAndSaveBudget(newBudget);
    setCurrentBudget(calculatedBudget);
    return calculatedBudget;
  }, [updateAndSaveBudget]);

  const getBudget = useCallback((id: string): Budget | null => {
    return getBudgetById(id);
  }, []);

  const updateBudget = useCallback((budget: Budget): void => {
    updateAndSaveBudget(budget);
  }, [updateAndSaveBudget]);

  const removeBudget = useCallback((id: string): void => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    
    if (currentBudget?.id === id) {
      setCurrentBudget(null);
    }
    
    deleteBudget(id);
  }, [currentBudget?.id]);

  // Common operation handler
  const handleBudgetOperation = useCallback(
    (operation: (budget: Budget, ...args: any[]) => Budget, 
    ...args: any[]
  ) => {
    if (!currentBudget) return;
    const updatedBudget = operation(currentBudget, ...args);
    updateAndSaveBudget(updatedBudget);
  },
  [currentBudget, updateAndSaveBudget]
  );

  // VAT Collected operations
  const addVATCollectedItem = useCallback((description: string): void => {
    handleBudgetOperation(addVATCollected, description);
  }, [handleBudgetOperation]);

  // VAT Deductible operations
  const addVATDeductibleItem = useCallback((description: string): void => {
    handleBudgetOperation(addVATDeductible, description);
  }, [handleBudgetOperation]);

  // Income operations
  const addIncomeItem = useCallback((description: string): void => {
    handleBudgetOperation(addIncome, description);
  }, [handleBudgetOperation]);

  // Expense operations
  const addExpenseItem = useCallback((description: string): void => {
    handleBudgetOperation(addExpense, description);
  }, [handleBudgetOperation]);

  // Update operations
  const updateVATCollectedValue = useCallback(
    (id: string, month: number, amount: number): void => {
      handleBudgetOperation(updateVATCollectedAmount, id, month, amount);
    },
    [handleBudgetOperation]
  );

  const updateVATDeductibleValue = useCallback(
    (id: string, month: number, amount: number): void => {
      handleBudgetOperation(updateVATDeductibleAmount, id, month, amount);
    },
    [handleBudgetOperation]
  );

  const updateIncomeValue = useCallback(
    (id: string, month: number, amount: number): void => {
      handleBudgetOperation(updateIncomeAmount, id, month, amount);
    },
    [handleBudgetOperation]
  );

  const updateExpenseValue = useCallback(
    (id: string, month: number, amount: number): void => {
      handleBudgetOperation(updateExpenseAmount, id, month, amount);
    },
    [handleBudgetOperation]
  );

  // Remove operations
  const removeVATCollectedItem = useCallback((id: string): void => {
    handleBudgetOperation(removeVATCollected, id);
  }, [handleBudgetOperation]);

  const removeVATDeductibleItem = useCallback((id: string): void => {
    handleBudgetOperation(removeVATDeductible, id);
  }, [handleBudgetOperation]);

  const removeIncomeItem = useCallback((id: string): void => {
    handleBudgetOperation(removeIncome, id);
  }, [handleBudgetOperation]);

  const removeExpenseItem = useCallback((id: string): void => {
    handleBudgetOperation(removeExpense, id);
  }, [handleBudgetOperation]);

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