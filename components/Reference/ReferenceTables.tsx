'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { labConstants, indicators, solubilities } from '@/lib/constants';

export default function ReferenceTables() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Common Lab Constants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold">Constant</th>
                  <th className="text-left p-3 font-semibold">Symbol</th>
                  <th className="text-left p-3 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {labConstants.map((constant, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-3">{constant.name}</td>
                    <td className="p-3 font-mono text-blue-600 dark:text-blue-400" dangerouslySetInnerHTML={{ __html: constant.symbol }} />
                    <td className="p-3 font-mono">{constant.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-500" />
            pH Indicator Color Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold">Indicator</th>
                  <th className="text-left p-3 font-semibold">pH Range</th>
                  <th className="text-left p-3 font-semibold">Color Change</th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((indicator, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-3 font-medium">{indicator.name}</td>
                    <td className="p-3 font-mono text-blue-600 dark:text-blue-400">{indicator.pHRange}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-900/30 dark:to-yellow-900/30 rounded text-sm">
                        {indicator.colorChange}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-500" />
            Solubility of Common Salts (25°C, g/100mL H₂O)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold">Salt</th>
                  <th className="text-left p-3 font-semibold">Solubility (g/100mL)</th>
                </tr>
              </thead>
              <tbody>
                {solubilities.map((solubility, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-3 font-mono text-blue-600 dark:text-blue-400" dangerouslySetInnerHTML={{ __html: solubility.salt }} />
                    <td className="p-3 font-mono">{solubility.solubility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
            <p className="text-sm text-cyan-700 dark:text-cyan-300">
              <strong>Note:</strong> Solubility values are approximate and can vary with temperature, 
              pH, and presence of other ions in solution.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}