import { v4 as uuidv4 } from 'uuid';
import { Budget, BudgetFormData, BudgetSummary, Income, Expense, VATCollected, VATDeductible, VATSummary } from '../types';
import { getAvailableMonths } from './dates';

export const createNewBudget = (formData: BudgetFormData): Budget => {
  const { name, startMonth, months, year, initialTreasury, initialVATCredit } = formData;
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const vatSummary: Record<number, VATSummary> = {};
  const summary: Record<number, BudgetSummary> = {};
  
  // Initialize the VAT summary for each month
  for (let i = 0; i < months; i++) {
    const month = (startMonth + i - 1) % 12 + 1; // To ensure it's between 1-12
    
    // For the first month, use initialVATCredit, otherwise 0
    vatSummary[month] = {
      previousMonthCredit: i === 0 ? initialVATCredit : 0,
      collected: 0,
      deductible: 0,
      toPay: 0,
      isCredit: false
    };
    
    // Initialize the budget summary for each month
    summary[month] = {
      initialBalance: i === 0 ? initialTreasury : 0,
      totalIncome: 0,
      totalExpenses: 0,
      monthlyCashFlow: 0,
      finalBalance: 0
    };
  }
  
  return {
    id,
    name,
    createdAt: now,
    updatedAt: now,
    initialTreasury,
    period: {
      startMonth,
      months,
      year
    },
    vatCollected: [],
    vatDeductible: [],
    vatSummary,
    incomes: [],
    expenses: [],
    summary
  };
};

export const addVATCollected = (budget: Budget, description: string): Budget => {
  const newItem: VATCollected = {
    id: uuidv4(),
    description,
    amounts: {}
  };
  
  // Initialize amounts for each month in the budget period
  const months = getAvailableMonths(budget.period.startMonth, budget.period.months);
  months.forEach(month => {
    newItem.amounts[month] = 0;
  });
  
  return {
    ...budget,
    vatCollected: [...budget.vatCollected, newItem],
    updatedAt: new Date().toISOString()
  };
};

export const addVATDeductible = (budget: Budget, description: string): Budget => {
  const newItem: VATDeductible = {
    id: uuidv4(),
    description,
    amounts: {}
  };
  
  // Initialize amounts for each month
  const months = getAvailableMonths(budget.period.startMonth, budget.period.months);
  months.forEach(month => {
    newItem.amounts[month] = 0;
  });
  
  return {
    ...budget,
    vatDeductible: [...budget.vatDeductible, newItem],
    updatedAt: new Date().toISOString()
  };
};

export const addIncome = (budget: Budget, description: string): Budget => {
  const newItem: Income = {
    id: uuidv4(),
    description,
    amounts: {}
  };
  
  // Initialize amounts for each month
  for (let i = 0; i < budget.period.months; i++) {
    const month = (budget.period.startMonth + i - 1) % 12 + 1;
    newItem.amounts[month] = 0;
  }
  
  return {
    ...budget,
    incomes: [...budget.incomes, newItem],
    updatedAt: new Date().toISOString()
  };
};

export const addExpense = (budget: Budget, description: string): Budget => {
  const newItem: Expense = {
    id: uuidv4(),
    description,
    amounts: {}
  };
  
  // Initialize amounts for each month
  for (let i = 0; i < budget.period.months; i++) {
    const month = (budget.period.startMonth + i - 1) % 12 + 1;
    newItem.amounts[month] = 0;
  }
  
  return {
    ...budget,
    expenses: [...budget.expenses, newItem],
    updatedAt: new Date().toISOString()
  };
};

export const updateVATCollectedAmount = (
  budget: Budget, 
  id: string, 
  month: number, 
  amount: number
): Budget => {
  const updatedItems = budget.vatCollected.map(item => {
    if (item.id === id) {
      return {
        ...item,
        amounts: {
          ...item.amounts,
          [month]: amount
        }
      };
    }
    return item;
  });
  
  return {
    ...budget,
    vatCollected: updatedItems,
    updatedAt: new Date().toISOString()
  };
};

export const updateVATDeductibleAmount = (
  budget: Budget, 
  id: string, 
  month: number, 
  amount: number
): Budget => {
  const updatedItems = budget.vatDeductible.map(item => {
    if (item.id === id) {
      return {
        ...item,
        amounts: {
          ...item.amounts,
          [month]: amount
        }
      };
    }
    return item;
  });
  
  return {
    ...budget,
    vatDeductible: updatedItems,
    updatedAt: new Date().toISOString()
  };
};

export const updateIncomeAmount = (
  budget: Budget, 
  id: string, 
  month: number, 
  amount: number
): Budget => {
  const updatedItems = budget.incomes.map(item => {
    if (item.id === id) {
      return {
        ...item,
        amounts: {
          ...item.amounts,
          [month]: amount
        }
      };
    }
    return item;
  });
  
  return {
    ...budget,
    incomes: updatedItems,
    updatedAt: new Date().toISOString()
  };
};

export const updateExpenseAmount = (
  budget: Budget, 
  id: string, 
  month: number, 
  amount: number
): Budget => {
  const updatedItems = budget.expenses.map(item => {
    if (item.id === id) {
      return {
        ...item,
        amounts: {
          ...item.amounts,
          [month]: amount
        }
      };
    }
    return item;
  });
  
  return {
    ...budget,
    expenses: updatedItems,
    updatedAt: new Date().toISOString()
  };
};

export const removeVATCollected = (budget: Budget, id: string): Budget => {
  return {
    ...budget,
    vatCollected: budget.vatCollected.filter(item => item.id !== id),
    updatedAt: new Date().toISOString()
  };
};

export const removeVATDeductible = (budget: Budget, id: string): Budget => {
  return {
    ...budget,
    vatDeductible: budget.vatDeductible.filter(item => item.id !== id),
    updatedAt: new Date().toISOString()
  };
};

export const removeIncome = (budget: Budget, id: string): Budget => {
  return {
    ...budget,
    incomes: budget.incomes.filter(item => item.id !== id),
    updatedAt: new Date().toISOString()
  };
};

export const removeExpense = (budget: Budget, id: string): Budget => {
  return {
    ...budget,
    expenses: budget.expenses.filter(item => item.id !== id),
    updatedAt: new Date().toISOString()
  };
};

export const calculateVATSummary = (budget: Budget): Budget => {
  const { vatCollected, vatDeductible, period } = budget;
  const { startMonth, months } = period;
  
  const vatSummary: Record<number, VATSummary> = {};
  
  for (let i = 0; i < months; i++) {
    const month = (startMonth + i - 1) % 12 + 1;
    
    // Calculate total VAT collected for this month
    const totalVATCollected = vatCollected.reduce((sum, item) => {
      return sum + (item.amounts[month] || 0);
    }, 0);
    
    // Calculate total VAT deductible for this month
    const totalVATDeductible = vatDeductible.reduce((sum, item) => {
      return sum + (item.amounts[month] || 0);
    }, 0);
    
    // Get previous month's credit, if any
    let previousMonthCredit = 0;
    if (i > 0) {
      const prevMonth = (startMonth + i - 2) % 12 + 1;
      previousMonthCredit = budget.vatSummary[prevMonth]?.isCredit 
        ? -budget.vatSummary[prevMonth].toPay 
        : 0;
    } else {
      // For the first month, use the initial VAT credit from the budget
      previousMonthCredit = budget.vatSummary[month]?.previousMonthCredit || 0;
    }
    
    // Calculate VAT to pay
    const toPay = totalVATCollected - totalVATDeductible - previousMonthCredit;
    
    vatSummary[month] = {
      previousMonthCredit,
      collected: totalVATCollected,
      deductible: totalVATDeductible,
      toPay,
      isCredit: toPay < 0
    };
  }
  
  return {
    ...budget,
    vatSummary,
    updatedAt: new Date().toISOString()
  };
};

export const calculateBudgetSummary = (budget: Budget): Budget => {
  const { incomes, expenses, period, initialTreasury, vatSummary } = budget;
  const { startMonth, months: monthsCount } = period;
  
  const summary: Record<number, BudgetSummary> = {};
  const months = getAvailableMonths(startMonth, monthsCount);
  
  let runningBalance = initialTreasury;
  
  months.forEach(month => {
    // Calculate total income for this month
    const totalIncome = incomes.reduce((sum, item) => {
      return sum + (item.amounts[month] || 0);
    }, 0);
    
    // Calculate total expenses for this month
    const totalExpenses = expenses.reduce((sum, item) => {
      return sum + (item.amounts[month] || 0);
    }, 0);
    
    // Add VAT payment or credit to expenses or income
    const vatAmount = vatSummary[month]?.toPay || 0;
    let adjustedTotalExpenses = totalExpenses;
    
    if (vatAmount > 0) {
      // VAT to pay: add to expenses
      adjustedTotalExpenses += vatAmount;
    }
    
    // Calculate monthly cash flow
    const monthlyCashFlow = totalIncome - adjustedTotalExpenses;
    
    // Update running balance
    const initialBalance = runningBalance;
    runningBalance += monthlyCashFlow;
    
    summary[month] = {
      initialBalance,
      totalIncome,
      totalExpenses: adjustedTotalExpenses,
      monthlyCashFlow,
      finalBalance: runningBalance
    };
  });
  
  return {
    ...budget,
    summary,
    updatedAt: new Date().toISOString()
  };
};

export const recalculateBudget = (budget: Budget): Budget => {
  // First calculate VAT summary
  const updatedBudget = calculateVATSummary(budget);
  // Then calculate the budget summary based on the updated VAT summary
  return calculateBudgetSummary(updatedBudget);
};