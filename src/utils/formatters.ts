export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};


export const parseFormattedCurrency = (formattedValue: string): number => {
  // Remove currency symbol, spaces, and replace comma with period
  const numericString = formattedValue
    .replace(/[^\d,-]/g, '')
    .replace(',', '.');
    
  return parseFloat(numericString) || 0;
};