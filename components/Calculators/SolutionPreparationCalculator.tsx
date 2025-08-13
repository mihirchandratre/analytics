'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Beaker, Copy } from 'lucide-react';
import { reagents } from '@/lib/constants';
import { massForMolarSolution, massForNormalSolution } from '@/lib/calculations';
import { saveCalculation } from '@/lib/localStorage';
import { toast } from 'sonner';

export default function SolutionPreparationCalculator() {
  const [mode, setMode] = useState<'M' | 'N'>('N');
  const [target, setTarget] = useState('0.4'); // N or M
  const [volume, setVolume] = useState('1'); // numeric
  const [volUnit, setVolUnit] = useState<'L' | 'mL'>('L');
  const [molarMass, setMolarMass] = useState('');
  const [equivalents, setEquivalents] = useState('1');
  const [result, setResult] = useState<{ mass: number; formula: string } | null>(null);

  const handleReagent = (val: string) => {
    setMolarMass(val);
  };

  const calc = () => {
    const tgt = parseFloat(target);
    const vol = parseFloat(volume);
    const mm = parseFloat(molarMass);
    const eq = parseFloat(equivalents) || 1;
    if (!tgt || !vol || !mm) {
      toast.error('Enter target, volume and molar mass');
      return;
    }
    const volL = volUnit === 'mL' ? vol / 1000 : vol;
    let mass = 0;
    let formula = '';
    if (mode === 'M') {
      mass = massForMolarSolution(tgt, volL, mm);
      formula = `Mass = M × V × Mr = ${tgt} × ${volL}L × ${mm}g/mol = ${mass.toPrecision(6)} g`;
    } else {
      mass = massForNormalSolution(tgt, volL, mm, eq);
      const eqW = mm / eq;
      formula = `Eq wt = Mr / n = ${mm} / ${eq} = ${eqW.toPrecision(6)} g/eq\nMass = N × V × Eq wt = ${tgt} × ${volL}L × ${eqW.toPrecision(6)} = ${mass.toPrecision(6)} g`;
    }
    setResult({ mass, formula });
    saveCalculation({
      type: 'Solution Prep',
      description: `${mode === 'N' ? tgt + ' N' : tgt + ' M'} in ${volume}${volUnit} → ${mass.toPrecision(6)} g`,
      formula,
      result: `${mass.toPrecision(6)} g`
    });
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(`${result.mass.toPrecision(6)} g\n${result.formula}`);
      toast.success('Copied');
    }
  };

  const clear = () => {
    setResult(null);
    setTarget('');
    setVolume('');
    setMolarMass('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="w-5 h-5 text-teal-500" />
          Solution Preparation Calculator
        </CardTitle>
        <div className="text-xs text-gray-600 dark:text-gray-300 bg-teal-50 dark:bg-teal-900/20 p-3 rounded-md space-y-1">
          <p>Normality: mass = N × V(L) × (Mr / n)</p>
          <p>Molarity: mass = M × V(L) × Mr</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Mode</Label>
              <Select value={mode} onValueChange={(v: 'M' | 'N') => setMode(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="N">Normality (N)</SelectItem>
                  <SelectItem value="M">Molarity (M)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{mode === 'N' ? 'Target Normality (N)' : 'Target Molarity (M)'}</Label>
              <Input type="number" step="any" value={target} onChange={e => setTarget(e.target.value)} placeholder={mode === 'N' ? 'e.g., 0.4' : 'e.g., 0.1'} />
            </div>
            <div>
              <Label>Volume</Label>
              <div className="flex gap-2">
                <Input type="number" step="any" value={volume} onChange={e => setVolume(e.target.value)} placeholder="e.g., 1" className="flex-1" />
                <Select value={volUnit} onValueChange={(v: 'L' | 'mL') => setVolUnit(v)}>
                  <SelectTrigger className="w-[90px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="mL">mL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

            <div className="space-y-4">
              <div>
                <Label>Molar Mass (g/mol)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="any"
                    value={molarMass}
                    onChange={e => setMolarMass(e.target.value)}
                    placeholder="e.g., 40 (NaOH)"
                    className="flex-1"
                  />
                  <Select onValueChange={handleReagent}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Reagent" />
                    </SelectTrigger>
                    <SelectContent>
                      {reagents.map(r => (
                        <SelectItem key={r.name} value={r.mm.toString()}>
                          {r.name} ({r.mm})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {mode === 'N' && (
                <div>
                  <Label>Equivalents per mole (n)</Label>
                  <Input
                    type="number"
                    step="any"
                    value={equivalents}
                    onChange={e => setEquivalents(e.target.value)}
                    placeholder="e.g., 1"
                  />
                </div>
              )}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Example: 0.4 N NaOH, 1 L → 0.4 × 1 × (40/1) = 16 g
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Required Mass (g)</Label>
                <Input
                  readOnly
                  value={result?.mass.toPrecision(6) || ''}
                  placeholder="Will calculate"
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={calc} className="bg-teal-500 hover:bg-teal-600">Calculate</Button>
                <Button variant="outline" onClick={clear}>Clear</Button>
                {result && (
                  <Button variant="secondary" onClick={copyResult}>
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                )}
              </div>
            </div>
        </div>

        {result && (
          <div className="p-5 mt-4 bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 rounded-lg border border-teal-200 dark:border-teal-700">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">Result</Badge>
            </div>
            <pre className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">{result.formula}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
