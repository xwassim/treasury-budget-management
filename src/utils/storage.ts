import { Budget } from '../types';

const BUDGETS_STORAGE_KEY = 'budgets';

export const getBudgets = (): Budget[] => {
  const storedBudgets = localStorage.getItem(BUDGETS_STORAGE_KEY);
  if (!storedBudgets) {
    return [];
  }
  
  try {
    return JSON.parse(storedBudgets);
  } catch (error) {
    console.error('Error parsing budgets from localStorage:', error);
    return [];
  }
};

export const getBudgetById = (id: string): Budget | null => {
  const budgets = getBudgets();
  return budgets.find(budget => budget.id === id) || null;
};

export const saveBudget = (budget: Budget): void => {
  const budgets = getBudgets();
  const existingIndex = budgets.findIndex(b => b.id === budget.id);
  
  if (existingIndex >= 0) {
    // Update existing budget
    budgets[existingIndex] = budget;
  } else {
    // Add new budget
    budgets.push(budget);
  }
  
  localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgets));
};

export const deleteBudget = (id: string): void => {
  const budgets = getBudgets();
  const updatedBudgets = budgets.filter(budget => budget.id !== id);
  localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(updatedBudgets));
};

export const deleteAllBudgets = (): void => {
  localStorage.removeItem(BUDGETS_STORAGE_KEY);
};