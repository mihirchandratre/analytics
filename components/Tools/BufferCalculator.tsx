'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Copy, TestTube2 } from 'lucide-react';
import { calculateBuffer } from '@/lib/calculations';
import { buffers } from '@/lib/constants';
import { saveCalculation } from '@/lib/localStorage';
import { toast } from 'sonner';

export default function BufferCalculator() {
  const [selectedBuffer, setSelectedBuffer] = useState('0');
  const [targetPh, setTargetPh] = useState([7]);
  const [totalConcentration, setTotalConcentration] = useState('0.05');
  const [volume, setVolume] = useState('1');
  const [result, setResult] = useState<{
    baseMoles: number;
    acidMoles: number;
    baseFraction: number;
    acidFraction: number;
    buffer: any;
    formula: string;
  } | null>(null);

  const selectedBuf = buffers[parseInt(selectedBuffer)];

  const calculate = () => {
    const totalC = parseFloat(totalConcentration);
    const vol = parseFloat(volume);
    const pH = targetPh[0];

    if (!selectedBuf || !totalC || !vol || pH === undefined) {
      toast.error('Please enter all values');
      return;
    }

    const bufferCalc = calculateBuffer(selectedBuf.pKa, pH, totalC, vol);
    const formula = `Henderson-Hasselbalch equation:
pH = pKa + log([A⁻]/[HA])
${pH} = ${selectedBuf.pKa} + log([${selectedBuf.base}]/[${selectedBuf.acid}])

Ratio = 10^(pH - pKa) = 10^(${pH} - ${selectedBuf.pKa}) = ${(Math.pow(10, pH - selectedBuf.pKa)).toPrecision(4)}
Base fraction: ${bufferCalc.baseFraction.toPrecision(4)}
Acid fraction: ${bufferCalc.acidFraction.toPrecision(4)}

For ${totalC} M buffer in ${vol} L:
${selectedBuf.base}: ${bufferCalc.baseMoles.toPrecision(4)} mol
${selectedBuf.acid}: ${bufferCalc.acidMoles.toPrecision(4)} mol`;

    const newResult = {
      ...bufferCalc,
      buffer: selectedBuf,
      formula
    };
    setResult(newResult);

    // Save to localStorage
    saveCalculation({
      type: 'Buffer Preparation',
      description: `${selectedBuf.name} buffer, pH ${pH}, ${totalC}M, ${vol}L`,
      formula,
      result: `${bufferCalc.baseMoles.toPrecision(4)} mol ${selectedBuf.base}, ${bufferCalc.acidMoles.toPrecision(4)} mol ${selectedBuf.acid}`
    });
  };

  const copyResult = () => {
    if (result) {
      const text = `Buffer: ${result.buffer.name}
Target pH: ${targetPh[0]} (pKa: ${result.buffer.pKa})
${result.buffer.base}: ${result.baseMoles.toPrecision(4)} mol
${result.buffer.acid}: ${result.acidMoles.toPrecision(4)} mol`;
      navigator.clipboard.writeText(text);
      toast.success('Result copied to clipboard');
    }
  };

  const clear = () => {
    setSelectedBuffer('0');
    setTargetPh([7]);
    setTotalConcentration('0.05');
    setVolume('1');
    setResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube2 className="w-5 h-5 text-teal-500" />
          Buffer Preparation Helper
        </CardTitle>
        <div className="text-sm text-gray-600 dark:text-gray-300 bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
          <strong>Henderson-Hasselbalch:</strong> pH = pKa + log([A⁻]/[HA])
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="buffer-system">Buffer System</Label>
              <Select value={selectedBuffer} onValueChange={setSelectedBuffer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {buffers.map((buffer, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {buffer.name} (pKa: {buffer.pKa})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>pKa</Label>
              <Input
                type="number"
                value={selectedBuf?.pKa || ''}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>

            <div>
              <Label>Target pH: {targetPh[0]}</Label>
              <Slider
                value={targetPh}
                onValueChange={setTargetPh}
                max={14}
                min={0}
                step={0.1}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>7</span>
                <span>14</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="total-conc">Total Buffer Concentration (M)</Label>
              <Input
                id="total-conc"
                type="number"
                step="any"
                value={totalConcentration}
                onChange={(e) => setTotalConcentration(e.target.value)}
                placeholder="e.g., 0.05"
              />
            </div>

            <div>
              <Label htmlFor="buffer-vol">Volume (L)</Label>
              <Input
                id="buffer-vol"
                type="number"
                step="any"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g., 1"
              />
            </div>

            {selectedBuf && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm">
                <p><strong>Acid:</strong> {selectedBuf.acid}</p>
                <p><strong>Base:</strong> {selectedBuf.base}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={calculate} className="bg-teal-500 hover:bg-teal-600">
            Calculate Buffer Recipe
          </Button>
          <Button variant="outline" onClick={clear}>
            Clear
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg border border-teal-200 dark:border-teal-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                    Buffer Recipe
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{result.buffer.name} Buffer</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Target pH: {targetPh[0]} (pKa: {result.buffer.pKa})
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                    <p className="font-medium">Prepare:</p>
                    <p>{result.acidMoles.toPrecision(4)} mol {result.buffer.acid}</p>
                    <p>{result.baseMoles.toPrecision(4)} mol {result.buffer.base}</p>
                  </div>
                  <pre className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    {result.formula}
                  </pre>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Adjust with acid/base to fine-tune pH after preparation.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyResult}
                className="text-teal-600 hover:text-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900"
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