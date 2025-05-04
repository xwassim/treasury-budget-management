export const MONTHS = [
  { id: 1, name: 'Janvier' },
  { id: 2, name: 'Février' },
  { id: 3, name: 'Mars' },
  { id: 4, name: 'Avril' },
  { id: 5, name: 'Mai' },
  { id: 6, name: 'Juin' },
  { id: 7, name: 'Juillet' },
  { id: 8, name: 'Août' },
  { id: 9, name: 'Septembre' },
  { id: 10, name: 'Octobre' },
  { id: 11, name: 'Novembre' },
  { id: 12, name: 'Décembre' }
];

export const formatMonth = (monthNumber: number): string => {
  const month = MONTHS.find(m => m.id === monthNumber);
  return month ? month.name : '';
};

export const getBudgetPeriodLabel = (startMonth: number, months: number, year: number): string => {
  if (months === 1) {
    return `${formatMonth(startMonth)} ${year}`;
  }
  
  // Calculate the end month (0-based calculation)
  const endMonthZeroBased = (startMonth - 1 + months - 1) % 12;
  const endMonth = endMonthZeroBased + 1;
  
  // Calculate if we need to increment the year
  const endYear = (startMonth - 1 + months) > 12 ? year + 1 : year;
  
  if (year === endYear) {
    return `${formatMonth(startMonth)} - ${formatMonth(endMonth)} ${year}`;
  } else {
    return `${formatMonth(startMonth)} ${year} - ${formatMonth(endMonth)} ${endYear}`;
  }
};
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getAvailableMonths = (
  startMonth: number | null = null,
  months: number | null = null
): number[] => {
  // If no specific range is provided, return all months
  if (startMonth === null || months === null) {
    return MONTHS.map(month => month.id);
  }
  
  // Otherwise, return the months in the specified range
  const monthsInRange: number[] = [];
  for (let i = 0; i < months; i++) {
    const monthId = ((startMonth - 1 + i) % 12) + 1;
    monthsInRange.push(monthId);
  }
  
  return monthsInRange;
};