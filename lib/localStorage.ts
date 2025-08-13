import { Calculation } from '@/types';

const STORAGE_KEY = 'pharma-toolkit-calculations';
const DARK_MODE_KEY = 'pharma-toolkit-dark-mode';

export const saveCalculation = (calculation: Omit<Calculation, 'id' | 'timestamp'>): void => {
  try {
    const existing = getCalculations();
    const newCalculation: Calculation = {
      ...calculation,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    
    const updated = [newCalculation, ...existing].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving calculation:', error);
  }
};

export const getCalculations = (): Calculation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading calculations:', error);
    return [];
  }
};

export const clearCalculations = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing calculations:', error);
  }
};

export const exportCalculationsToCSV = (): string => {
  const calculations = getCalculations();
  if (calculations.length === 0) return '';
  
  const headers = ['Type', 'Description', 'Formula', 'Result', 'Date'];
  const csvContent = [
    headers.join(','),
    ...calculations.map(calc => [
      `"${calc.type.replace(/"/g, '""')}"`,
      `"${calc.description.replace(/"/g, '""')}"`,
      `"${(calc.formula || '').replace(/"/g, '""')}"`,
      `"${(calc.result || '').replace(/"/g, '""')}"`,
      `"${new Date(calc.timestamp).toLocaleString()}"`
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCalculationsAsExcel = (): void => {
  const csv = exportCalculationsToCSV();
  if (!csv) return;
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `pharma-calculations-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getDarkMode = (): boolean => {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) return stored === 'true';
    
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (error) {
    return false;
  }
};

export const setDarkMode = (isDark: boolean): void => {
  try {
    localStorage.setItem(DARK_MODE_KEY, isDark.toString());
  } catch (error) {
    console.error('Error saving dark mode preference:', error);
  }
};