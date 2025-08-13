'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, FlaskConical } from 'lucide-react';
import { calculateNormality } from '@/lib/calculations';
import { saveCalculation } from '@/lib/localStorage';
import { toast } from 'sonner';

export default function NormalityCalculator() {
  const [molarity, setMolarity] = useState('');
  const [equivalents, setEquivalents] = useState('1');
  const [result, setResult] = useState<{
    normality: number;
    formula: string;
  } | null>(null);

  const calculate = () => {
    const molarityNum = parseFloat(molarity);
    const equivalentsNum = parseFloat(equivalents);

    if (!molarityNum || !equivalentsNum) {
      toast.error('Please enter molarity and equivalents per mole');
      return;
    }

    const normality = calculateNormality(molarityNum, equivalentsNum);
    const formula = `N = M × n = ${molarityNum} × ${equivalentsNum} = ${normality.toPrecision(6)} N`;

    const newResult = { normality, formula };
    setResult(newResult);

    // Save to localStorage
    saveCalculation({
      type: 'Normality',
      description: `${molarityNum} M × ${equivalentsNum} equiv = ${normality.toPrecision(6)} N`,
      formula,
      result: `${normality.toPrecision(6)} N`
    });
  };

  const copyResult = () => {
    if (result) {
      const text = `Normality: ${result.normality.toPrecision(6)} N`;
      navigator.clipboard.writeText(text);
      toast.success('Result copied to clipboard');
    }
  };

  const clear = () => {
    setMolarity('');
    setEquivalents('1');
    setResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-purple-500" />
          Normality Calculator
        </CardTitle>
        <div className="text-sm text-gray-600 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
          <strong>Formula:</strong> N = M × n (where n = equivalents per mole)
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="molarity-input">Molarity (M)</Label>
              <Input
                id="molarity-input"
                type="number"
                step="any"
                value={molarity}
                onChange={(e) => setMolarity(e.target.value)}
                placeholder="e.g., 0.1"
              />
            </div>
            <div>
              <Label htmlFor="equivalents">Equivalents per mole (n)</Label>
              <Input
                id="equivalents"
                type="number"
                step="any"
                value={equivalents}
                onChange={(e) => setEquivalents(e.target.value)}
                placeholder="e.g., 1 or 2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Calculated Normality (N)</Label>
              <Input
                type="number"
                value={result?.normality.toPrecision(6) || ''}
                readOnly
                placeholder="Will be calculated"
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p><strong>Common equivalents:</strong></p>
              <p>• HCl, NaOH: 1 equiv/mol</p>
              <p>• H₂SO₄, Ca(OH)₂: 2 equiv/mol</p>
              <p>• H₃PO₄: 3 equiv/mol</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={calculate} className="bg-purple-500 hover:bg-purple-600">
            Calculate Normality
          </Button>
          <Button variant="outline" onClick={clear}>
            Clear
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Result
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-semibold">
                    Normality: {result.normality.toPrecision(6)} N
                  </div>
                  <pre className="text-sm text-gray-600 dark:text-gray-300 mt-3 whitespace-pre-wrap">
                    {result.formula}
                  </pre>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyResult}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}