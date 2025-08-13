'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, Beaker } from 'lucide-react';
import { calculateMoles, calculateMolarity, solveMolesSet, solveMolaritySet } from '@/lib/calculations';
import { reagents } from '@/lib/constants';
import { saveCalculation } from '@/lib/localStorage';
import { toast } from 'sonner';

export default function MolesCalculator() {
  const [mass, setMass] = useState('');
  const [molarMass, setMolarMass] = useState('');
  const [volume, setVolume] = useState('');
  const [molesInput, setMolesInput] = useState('');
  const [molarityInput, setMolarityInput] = useState('');
  const [result, setResult] = useState<{
    moles: number;
    molarity?: number;
    formula: string;
  } | null>(null);

  const handleReagentSelect = (value: string) => {
    const reagent = reagents.find(r => r.mm.toString() === value);
    if (reagent) {
      setMolarMass(value);
    }
  };

  const calculate = () => {
    const massNum = mass ? parseFloat(mass) : undefined;
    const mmNum = molarMass ? parseFloat(molarMass) : undefined;
    const molesNum = molesInput ? parseFloat(molesInput) : undefined;

    let primary;
    try {
      if ([massNum, mmNum, molesNum].filter(v => v !== undefined && !isNaN(v!)).length < 2) {
        toast.error('Provide any two of mass, molar mass, moles');
        return;
      }
      primary = solveMolesSet({ mass: massNum, molarMass: mmNum, moles: molesNum });
    } catch (e:any) {
      toast.error(e.message);
      return;
    }

    // Second relation (molarity) among moles, volume, molarity
    const volNum = volume ? parseFloat(volume) : undefined;
    const molarityNum = molarityInput ? parseFloat(molarityInput) : undefined;
    let molarity: number | undefined = undefined;
    let solvedMolaritySet;
    let molarityFormula = '';
    if ([primary.moles, volNum, molarityNum].filter(v => v !== undefined && !isNaN(v!)).length >= 2) {
      try {
        solvedMolaritySet = solveMolaritySet({ moles: primary.moles, volumeL: volNum, molarity: molarityNum });
        molarity = solvedMolaritySet.molarity;
        molarityFormula = `M = n / V → ${solvedMolaritySet.molarity.toPrecision(6)} = ${solvedMolaritySet.moles.toPrecision(6)} / ${solvedMolaritySet.volumeL}`;
      } catch {
        // ignore if unsatisfied
      }
    }

    // Build formula explanation
    let formula = '';
    if (molesNum === undefined) formula += `n = m / Mr = ${primary.mass} / ${primary.molarMass} = ${primary.moles.toPrecision(6)} mol`;
    else if (massNum === undefined) formula += `m = n × Mr = ${primary.moles} × ${primary.molarMass} = ${primary.mass.toPrecision(6)} g`;
    else if (mmNum === undefined) formula += `Mr = m / n = ${primary.mass} / ${primary.moles} = ${primary.molarMass.toPrecision(6)} g/mol`;
    else formula += `Checked: n = m / Mr = ${massNum} / ${mmNum} = ${primary.moles.toPrecision(6)} mol`;

    if (molarity) formula += `\n${molarityFormula}`;

    setResult({ moles: primary.moles, molarity, formula });

    saveCalculation({
      type: 'Moles/Molarity',
      description: formula.split('\n')[0],
      formula,
      result: `${primary.moles.toPrecision(6)} mol${molarity ? `, ${molarity.toPrecision(6)} M` : ''}`
    });

    // reflect solved values back into inputs
    setMass(primary.mass.toString());
    setMolarMass(primary.molarMass.toString());
    setMolesInput(primary.moles.toString());
    if (molarity) setMolarityInput(molarity.toString());
  };

  const copyResult = () => {
    if (result) {
      const text = `Moles: ${result.moles.toPrecision(6)} mol${result.molarity ? `\nMolarity: ${result.molarity.toPrecision(6)} M` : ''}`;
      navigator.clipboard.writeText(text);
      toast.success('Result copied to clipboard');
    }
  };

  const clear = () => {
    setMass('');
    setMolarMass('');
    setVolume('');
    setMolesInput('');
    setMolarityInput('');
    setResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="w-5 h-5 text-blue-500" />
          Moles & Molarity Calculator
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <span><strong>Moles:</strong> n = m / M<sub>r</sub></span>
          <span className="text-gray-400">|</span>
          <span><strong>Molarity:</strong> M = n / V</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="mass">Mass (g)</Label>
              <Input
                id="mass"
                type="number"
                step="any"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
                placeholder="e.g., 1.25"
              />
            </div>
            <div>
              <Label htmlFor="molar-mass">Molar Mass (g/mol)</Label>
              <div className="flex gap-2">
                <Input
                  id="molar-mass"
                  type="number"
                  step="any"
                  value={molarMass}
                  onChange={(e) => setMolarMass(e.target.value)}
                  placeholder="e.g., 58.44"
                  className="flex-1"
                />
                <Select onValueChange={handleReagentSelect}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Pick reagent" />
                  </SelectTrigger>
                  <SelectContent>
                    {reagents.map((reagent) => (
                      <SelectItem key={reagent.name} value={reagent.mm.toString()}>
                        {reagent.name} ({reagent.mm})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="moles">Moles (mol)</Label>
              <Input
                id="moles"
                type="number"
                step="any"
                value={molesInput}
                onChange={(e) => setMolesInput(e.target.value)}
                placeholder="leave blank to solve"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="volume">Volume (L)</Label>
              <Input
                id="volume"
                type="number"
                step="any"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g., 0.25 (optional)"
              />
            </div>
            <div>
              <Label htmlFor="molarity">Molarity (M)</Label>
              <Input
                id="molarity"
                type="number"
                step="any"
                value={molarityInput}
                onChange={(e) => setMolarityInput(e.target.value)}
                placeholder="leave blank to solve"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={calculate} className="bg-blue-500 hover:bg-blue-600">
            Calculate
          </Button>
          <Button variant="outline" onClick={clear}>
            Clear
          </Button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Enter any two of (mass, molar mass, moles) and optionally one of (moles, volume, molarity). Leave the one you want solved blank.
        </div>

        {result && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Result
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-semibold">
                    Moles: {result.moles.toPrecision(6)} mol
                  </div>
                  {result.molarity && (
                    <div className="text-lg font-semibold">
                      Molarity: {result.molarity.toPrecision(6)} M
                    </div>
                  )}
                  <pre className="text-sm text-gray-600 dark:text-gray-300 mt-3 whitespace-pre-wrap">
                    {result.formula}
                  </pre>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyResult}
                className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900"
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