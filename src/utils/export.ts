import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { Budget } from '../types';
import { formatMonth } from './dates';

export const exportToPDF = async (budgetId: string): Promise<void> => {
  const budgetElement = document.getElementById(`budget-${budgetId}`);
  if (!budgetElement) {
    throw new Error('Cannot find budget element to export');
  }

  // 1. Hide all interactive elements
  const elementsToHide = budgetElement.querySelectorAll(
    'button, input, select, textarea, .dropdown, [data-no-export]'
  );
  const originalStyles: { element: HTMLElement; display: string; visibility: string }[] = [];
  
  elementsToHide.forEach(el => {
    const htmlEl = el as HTMLElement;
    originalStyles.push({
      element: htmlEl,
      display: htmlEl.style.display,
      visibility: htmlEl.style.visibility
    });
    htmlEl.style.display = 'none';
  });

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 190; // mm
    const pageHeight = 277; // mm (A4 minus margins)
    const padding = 10; // mm
    
    // 2. Get all sections you want to export separately
    const sections = budgetElement.querySelectorAll<HTMLElement>('.pdf-section');
    
    if (sections.length > 0) {
      // Export each section separately with page control
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        
        // Add new page for each section (except first)
        if (i > 0) {
          pdf.addPage();
        }
        
        const canvas = await html2canvas(section, { 
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * pageWidth) / canvas.width;
        
        // Add section to current page
        pdf.addImage(imgData, 'PNG', padding, padding, pageWidth, imgHeight);
      }
    } else {
      // Fallback: Export entire element as single image
      const canvas = await html2canvas(budgetElement, { 
        scale: 2,
        ignoreElements: (element) => {
          return element.tagName === 'INPUT' || 
                 element.tagName === 'BUTTON' || 
                 element.classList.contains('no-export');
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let position = padding;
      let remainingHeight = imgHeight;
      
      // Split across pages if needed
      while (remainingHeight > 0) {
        const heightThisPage = Math.min(remainingHeight, pageHeight);
        pdf.addImage(imgData, 'PNG', padding, position, pageWidth, heightThisPage);
        remainingHeight -= pageHeight;
        
        if (remainingHeight > 0) {
          pdf.addPage();
          position = -((imgHeight - remainingHeight) - padding);
        }
      }
    }
    
    pdf.save(`budget-${budgetId}.pdf`);
  } finally {
    // 3. Restore original styles
    originalStyles.forEach(style => {
      style.element.style.display = style.display;
      style.element.style.visibility = style.visibility;
    });
  }
};

export const exportToExcel = (budget: Budget): void => {
  const { period, name } = budget;
  const { startMonth, months, year } = period;
  
  // Prepare workbook and worksheets
  const workbook = XLSX.utils.book_new();
  
  // Create an array of months for the current budget
  const budgetMonths = Array.from({ length: months }, (_, i) => 
    (startMonth + i - 1) % 12 + 1
  );
  
  // Create VAT worksheet
  const vatWorksheet = createVATWorksheet(budget, budgetMonths);
  XLSX.utils.book_append_sheet(workbook, vatWorksheet, 'VAT');
  
  // Create Income/Expenses worksheet
  const cashFlowWorksheet = createCashFlowWorksheet(budget, budgetMonths);
  XLSX.utils.book_append_sheet(workbook, cashFlowWorksheet, 'Income & Expenses');
  
  // Create Summary worksheet
  const summaryWorksheet = createSummaryWorksheet(budget, budgetMonths);
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
  
  // Export the file
  XLSX.writeFile(workbook, `${name}.xlsx`);
};

const createVATWorksheet = (budget: Budget, months: number[]): XLSX.WorkSheet => {
  const { vatCollected, vatDeductible, vatSummary } = budget;
  
  // Create headers
  const headers = ['Description', ...months.map(m => formatMonth(m))];
  
  // Prepare data for VAT collected
  const vatCollectedData = [
    ['VAT Collected', '', '', '', ''],
    headers,
    ...vatCollected.map(item => {
      return [
        item.description,
        ...months.map(month => item.amounts[month] || 0)
      ];
    }),
    ['Total VAT Collected', ...months.map(month => vatSummary[month]?.collected || 0)],
    [''],
    ['VAT Deductible', '', '', '', ''],
    headers,
    ...vatDeductible.map(item => {
      return [
        item.description,
        ...months.map(month => item.amounts[month] || 0)
      ];
    }),
    ['Total VAT Deductible', ...months.map(month => vatSummary[month]?.deductible || 0)],
    [''],
    ['VAT Summary', '', '', '', ''],
    ['Previous Month Credit', ...months.map(month => vatSummary[month]?.previousMonthCredit || 0)],
    ['VAT Collected', ...months.map(month => vatSummary[month]?.collected || 0)],
    ['VAT Deductible', ...months.map(month => vatSummary[month]?.deductible || 0)],
    ['VAT to Pay / Credit', ...months.map(month => {
      const vatToPay = vatSummary[month]?.toPay || 0;
      return vatToPay < 0 ? `Credit: ${Math.abs(vatToPay)}` : vatToPay;
    })]
  ];
  
  return XLSX.utils.aoa_to_sheet(vatCollectedData);
};

const createCashFlowWorksheet = (budget: Budget, months: number[]): XLSX.WorkSheet => {
  const { incomes, expenses } = budget;
  
  // Create headers
  const headers = ['Description', ...months.map(m => formatMonth(m))];
  
  // Prepare data for Income
  const cashFlowData = [
    ['Income', '', '', '', ''],
    headers,
    ...incomes.map(item => {
      return [
        item.description,
        ...months.map(month => item.amounts[month] || 0)
      ];
    }),
    ['Total Income', ...months.map(month => {
      return incomes.reduce((sum, item) => sum + (item.amounts[month] || 0), 0);
    })],
    [''],
    ['Expenses', '', '', '', ''],
    headers,
    ...expenses.map(item => {
      return [
        item.description,
        ...months.map(month => item.amounts[month] || 0)
      ];
    }),
    ['Total Expenses', ...months.map(month => {
      return expenses.reduce((sum, item) => sum + (item.amounts[month] || 0), 0);
    })]
  ];
  
  return XLSX.utils.aoa_to_sheet(cashFlowData);
};

const createSummaryWorksheet = (budget: Budget, months: number[]): XLSX.WorkSheet => {
  const { summary, initialTreasury } = budget;
  
  // Prepare data for Summary
  const summaryData = [
    ['Budget Summary', '', '', '', ''],
    ['Description', ...months.map(m => formatMonth(m))],
    ['Initial Balance', ...months.map((month, index) => 
      index === 0 ? initialTreasury : summary[month]?.initialBalance || 0
    )],
    ['Total Income', ...months.map(month => summary[month]?.totalIncome || 0)],
    ['Total Expenses', ...months.map(month => summary[month]?.totalExpenses || 0)],
    ['Monthly Cash Flow', ...months.map(month => summary[month]?.monthlyCashFlow || 0)],
    ['Final Balance', ...months.map(month => summary[month]?.finalBalance || 0)]
  ];
  
  return XLSX.utils.aoa_to_sheet(summaryData);
};