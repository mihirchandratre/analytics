'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, FlaskConical, SeparatorVertical as Separator } from 'lucide-react';
import { calculateStockVolume, generateSerialDilution } from '@/lib/calculations';
import { saveCalculation } from '@/lib/localStorage';
import { toast } from 'sonner';

export default function DilutionCalculator() {
  const [c1, setC1] = useState('');
  const [c2, setC2] = useState('');
  const [v2, setV2] = useState('');
  const [unit, setUnit] = useState('mL');
  const [result, setResult] = useState<{
    v1: number;
    formula: string;
  } | null>(null);

  // Serial dilution state
  const [startConc, setStartConc] = useState('');
  const [foldDilution, setFoldDilution] = useState('10');
  const [steps, setSteps] = useState('6');
  const [volPerTube, setVolPerTube] = useState('100');
  const [serialResults, setSerialResults] = useState<any[] | null>(null);

  const calculateDilution = () => {
    const c1Num = parseFloat(c1);
    const c2Num = parseFloat(c2);
    const v2Num = parseFloat(v2);

    if (!c1Num || !c2Num || !v2Num) {
      toast.error('Please enter all values');
      return;
    }

    const v1 = calculateStockVolume(c1Num, c2Num, v2Num);
    const addVolume = v2Num - v1;
    const formula = `C₁V₁ = C₂V₂\nV₁ = (C₂ × V₂) / C₁ = (${c2Num} × ${v2Num}) / ${c1Num} = ${v1.toPrecision(6)} ${unit}`;

    const newResult = { v1, formula };
    setResult(newResult);

    // Save to localStorage
    saveCalculation({
      type: 'Dilution',
      description: `From ${c1Num}M to ${c2Num}M, ${v2Num}${unit} final → take ${v1.toPrecision(6)}${unit} stock`,
      formula,
      result: `Take ${v1.toPrecision(6)} ${unit} stock + ${addVolume.toPrecision(6)} ${unit} diluent`
    });
  };

  const calculateSerial = () => {
    const startConcNum = parseFloat(startConc);
    const foldNum = parseFloat(foldDilution);
    const stepsNum = parseInt(steps);
    const volNum = parseFloat(volPerTube);

    if (!startConcNum || !foldNum || !stepsNum || !volNum) {
      toast.error('Please enter all serial dilution values');
      return;
    }

    const dilutions = generateSerialDilution(startConcNum, foldNum, stepsNum, volNum);
    setSerialResults(dilutions);

    // Save to localStorage
    saveCalculation({
      type: 'Serial Dilution',
      description: `${stepsNum} steps, ${foldNum}-fold each, starting at ${startConcNum}`,
      formula: `${stepsNum} tubes with ${foldNum}x dilution each`,
      result: `${stepsNum} dilutions generated`
    });
  };

  const copyResult = () => {
    if (result) {
      const text = `Stock volume needed: ${result.v1.toPrecision(6)} ${unit}\nAdd ${(parseFloat(v2) - result.v1).toPrecision(6)} ${unit} diluent`;
      navigator.clipboard.writeText(text);
      toast.success('Result copied to clipboard');
    }
  };

  const clear = () => {
    setC1('');
    setC2('');
    setV2('');
    setResult(null);
  };

  const clearSerial = () => {
    setStartConc('');
    setFoldDilution('10');
    setSteps('6');
    setVolPerTube('100');
    setSerialResults(null);
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-500" />
            Dilution Calculator (C₁V₁ = C₂V₂)
          </CardTitle>
          <div className="text-sm text-gray-600 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
            <strong>Formula:</strong> C₁V₁ = C₂V₂ → V₁ = (C₂ × V₂) / C₁
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="c1">Stock Concentration (C₁)</Label>
                <Input
                  id="c1"
                  type="number"
                  step="any"
                  value={c1}
                  onChange={(e) => setC1(e.target.value)}
                  placeholder="e.g., 1 (M)"
                />
              </div>
              <div>
                <Label htmlFor="unit">Volume Units</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mL">mL</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="μL">μL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="c2">Desired Concentration (C₂)</Label>
                <Input
                  id="c2"
                  type="number"
                  step="any"
                  value={c2}
                  onChange={(e) => setC2(e.target.value)}
                  placeholder="e.g., 0.1 (M)"
                />
              </div>
              <div>
                <Label htmlFor="v2">Final Volume (V₂)</Label>
                <Input
                  id="v2"
                  type="number"
                  step="any"
                  value={v2}
                  onChange={(e) => setV2(e.target.value)}
                  placeholder={`e.g., 100 (${unit})`}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={calculateDilution} className="bg-indigo-500 hover:bg-indigo-600">
              Calculate V₁
            </Button>
            <Button variant="outline" onClick={clear}>
              Clear
            </Button>
          </div>

          {result && (
            <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      Result
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">
                      Take: {result.v1.toPrecision(6)} {unit} of stock solution
                    </div>
                    <div className="text-lg font-semibold">
                      Add: {(parseFloat(v2) - result.v1).toPrecision(6)} {unit} of diluent
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
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-500" />
            Serial Dilution Wizard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="start-conc">Starting Concentration</Label>
                <Input
                  id="start-conc"
                  type="number"
                  step="any"
                  value={startConc}
                  onChange={(e) => setStartConc(e.target.value)}
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <Label htmlFor="fold">Fold Dilution Each Step</Label>
                <Input
                  id="fold"
                  type="number"
                  step="any"
                  value={foldDilution}
                  onChange={(e) => setFoldDilution(e.target.value)}
                  placeholder="e.g., 10"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="steps-num">Number of Steps</Label>
                <Input
                  id="steps-num"
                  type="number"
                  step="1"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="e.g., 6"
                />
              </div>
              <div>
                <Label htmlFor="vol-per">Final Volume per Tube (mL)</Label>
                <Input
                  id="vol-per"
                  type="number"
                  step="any"
                  value={volPerTube}
                  onChange={(e) => setVolPerTube(e.target.value)}
                  placeholder="e.g., 100"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={calculateSerial} className="bg-purple-500 hover:bg-purple-600">
              Generate Serial Dilution
            </Button>
            <Button variant="outline" onClick={clearSerial}>
              Clear
            </Button>
          </div>

          {serialResults && (
            <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <h4 className="font-semibold mb-4 text-lg">Serial Dilution Protocol</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Tube</th>
                      <th className="text-left p-2">Concentration</th>
                      <th className="text-left p-2">Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serialResults.map((dilution, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{dilution.tube}</td>
                        <td className="p-2">{dilution.concentration.toExponential(3)}</td>
                        <td className="p-2 text-xs">{dilution.instruction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}