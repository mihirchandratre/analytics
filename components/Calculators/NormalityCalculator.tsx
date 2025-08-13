'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, FlaskConical } from 'lucide-react';
import { calculateNormality, solveNormalitySet } from '@/lib/calculations';
import { saveCalculation } from '@/lib/localStorage';
import { toast } from 'sonner';

export default function NormalityCalculator() {
  const [molarity, setMolarity] = useState('');
  const [equivalents, setEquivalents] = useState('1');
  const [normalityInput, setNormalityInput] = useState('');
  const [result, setResult] = useState<{
    normality: number;
    formula: string;
  } | null>(null);

  const calculate = () => {
    const N = normalityInput ? parseFloat(normalityInput) : undefined;
    const M = molarity ? parseFloat(molarity) : undefined;
    const n = equivalents ? parseFloat(equivalents) : undefined;

    if ([N, M, n].filter(v => v !== undefined && !isNaN(v!)).length < 2) {
      toast.error('Provide any two of Normality, Molarity, Equivalents');
      return;
    }
    let solved;
    try {
      solved = solveNormalitySet({ normality: N, molarity: M, equivalents: n });
    } catch (e:any) {
      toast.error(e.message);
      return;
    }

    let formula: string;
    if (N === undefined) formula = `N = M × n = ${solved.molarity} × ${solved.equivalents} = ${solved.normality.toPrecision(6)} N`;
    else if (M === undefined) formula = `M = N / n = ${solved.normality} / ${solved.equivalents} = ${solved.molarity.toPrecision(6)} M`;
    else if (n === undefined) formula = `n = N / M = ${solved.normality} / ${solved.molarity} = ${solved.equivalents.toPrecision(6)} equiv/mol`;
    else formula = `Check: N = M × n = ${solved.molarity} × ${solved.equivalents} = ${solved.normality.toPrecision(6)} N`;

    setResult({ normality: solved.normality, formula });

    saveCalculation({
      type: 'Normality',
      description: formula,
      formula,
      result: `${solved.normality.toPrecision(6)} N`
    });

    setNormalityInput(solved.normality.toString());
    setMolarity(solved.molarity.toString());
    setEquivalents(solved.equivalents.toString());
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
    setNormalityInput('');
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
              <Label htmlFor="normality-input">Normality (N)</Label>
              <Input
                id="normality-input"
                type="number"
                step="any"
                value={normalityInput}
                onChange={(e) => setNormalityInput(e.target.value)}
                placeholder="leave blank to solve"
              />
            </div>
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
              <Label>Hint</Label>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Enter any two of (Normality, Molarity, Equivalents). Leave the one to solve blank.
              </div>
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