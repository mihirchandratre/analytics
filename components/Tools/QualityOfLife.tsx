'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Printer, History, Trash2 } from 'lucide-react';
import { getCalculations, clearCalculations, downloadCalculationsAsExcel } from '@/lib/localStorage';
import { Calculation } from '@/types';
import { toast } from 'sonner';

export default function QualityOfLife() {
  const [calculations, setCalculations] = useState<Calculation[]>([]);

  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = () => {
    const saved = getCalculations();
    setCalculations(saved);
  };

  const handleClearHistory = () => {
    clearCalculations();
    setCalculations([]);
    toast.success('Calculation history cleared');
  };

  const handleDownloadExcel = () => {
    downloadCalculationsAsExcel();
    toast.success('Calculations exported to CSV/Excel format');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Export Data</h3>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">Download calculations as Excel/CSV</p>
              </div>
              <Button onClick={handleDownloadExcel} className="bg-blue-500 hover:bg-blue-600">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">Print Worksheet</h3>
                <p className="text-sm text-green-600 dark:text-green-300 mt-1">Print-friendly format</p>
              </div>
              <Button onClick={handlePrint} className="bg-green-500 hover:bg-green-600">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">Clear History</h3>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">Remove all saved calculations</p>
              </div>
              <Button 
                onClick={handleClearHistory} 
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-500" />
            Recent Calculations ({calculations.length})
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Auto-saved in browser storage. Last 50 calculations are kept.
          </p>
        </CardHeader>
        <CardContent>
          {calculations.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No calculations yet</p>
              <p className="text-sm">Start using the calculators to see your history here!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {calculations.map((calc) => (
                <div
                  key={calc.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {calc.type}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(calc.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {calc.description}
                      </p>
                      {calc.result && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Result:</strong> {calc.result}
                        </p>
                      )}
                      {calc.formula && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                            Show formula
                          </summary>
                          <pre className="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap bg-gray-100 dark:bg-gray-700 p-2 rounded">
                            {calc.formula}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
        <CardContent className="p-6">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
              All calculations are automatically saved to your browser's local storage
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
              Export your data regularly to keep a backup of important calculations
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
              Use the print function to create physical worksheets for lab documentation
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
              Toggle dark mode in the header for comfortable viewing in different lighting
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}