export type Month = {
  id: number;
  name: string;
};

export type VATCollected = {
  id: string;
  description: string;
  amounts: Record<number, number>;
};

export type VATDeductible = {
  id: string;
  description: string;
  amounts: Record<number, number>;
};

export type VATSummary = {
  previousMonthCredit: number;
  collected: number;
  deductible: number;
  toPay: number; // If positive: VAT to pay, if negative: VAT credit
  isCredit: boolean;
};

export type Income = {
  id: string;
  description: string;
  amounts: Record<number, number>;
};

export type Expense = {
  id: string;
  description: string;
  amounts: Record<number, number>;
};

export type BudgetSummary = {
  initialBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyCashFlow: number;
  finalBalance: number;
};

export type Budget = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  initialTreasury: number;
  period: {
    startMonth: number;
    months: number;
    year: number;
  };
  vatCollected: VATCollected[];
  vatDeductible: VATDeductible[];
  vatSummary: Record<number, VATSummary>;
  incomes: Income[];
  expenses: Expense[];
  summary: Record<number, BudgetSummary>;
  forecasts: ForecastItem[];
};

export type BudgetFormData = {
  name: string;
  startMonth: number;
  months: number;
  year: number;
  initialTreasury: number;
  initialVATCredit: number;
};

// Make amounts required and not undefined
export type ForecastItem = {
  id: string;
  type: 'sales' | 'purchases' | 'investments';
  vatRates: Record<number, number>;
  amounts: Record<number, {
    ht: number;
    vat: number;
    ttc: number;
  }>; // Removed the | undefined
};