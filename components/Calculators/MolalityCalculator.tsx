'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, Droplets } from 'lucide-react';
import { calculateMolality, solveMolalitySet } from '@/lib/calculations';
import { reagents } from '@/lib/constants';
import { saveCalculation } from '@/lib/localStorage';
import { toast } from 'sonner';

export default function MolalityCalculator() {
  const [massSolute, setMassSolute] = useState('');
  const [molarMass, setMolarMass] = useState('');
  const [massSolvent, setMassSolvent] = useState('');
  const [molalityInput, setMolalityInput] = useState('');
  const [result, setResult] = useState<{
    molality: number;
    formula: string;
  } | null>(null);

  const handleReagentSelect = (value: string) => {
    const reagent = reagents.find(r => r.mm.toString() === value);
    if (reagent) {
      setMolarMass(value);
    }
  };

  const calculate = () => {
    const massSoluteNum = massSolute ? parseFloat(massSolute) : undefined;
    const molarMassNum = molarMass ? parseFloat(molarMass) : undefined;
    const massSolventNum = massSolvent ? parseFloat(massSolvent) : undefined;
    const molalityNum = molalityInput ? parseFloat(molalityInput) : undefined;

    if ([massSoluteNum, molarMassNum, massSolventNum, molalityNum].filter(v => v !== undefined && !isNaN(v!)).length < 3) {
      toast.error('Provide any three of mass solute, molar mass, solvent mass, molality');
      return;
    }

    let solved;
    try {
      solved = solveMolalitySet({
        massSolute: massSoluteNum,
        molarMass: molarMassNum,
        massSolventKg: massSolventNum,
        molality: molalityNum
      });
    } catch (e:any) {
      toast.error(e.message);
      return;
    }

    let step: string;
    if (molalityNum === undefined) step = `m = (m_solute / Mr) / kg_solvent = (${solved.massSolute} / ${solved.molarMass}) / ${solved.massSolventKg} = ${solved.molality.toPrecision(6)} mol/kg`;
    else if (massSoluteNum === undefined) step = `m_solute = m × Mr × kg_solvent = ${solved.molality} × ${solved.molarMass} × ${solved.massSolventKg} = ${solved.massSolute.toPrecision(6)} g`;
    else if (molarMassNum === undefined) step = `Mr = m_solute / (m × kg_solvent) = ${solved.massSolute} / (${solved.molality} × ${solved.massSolventKg}) = ${solved.molarMass.toPrecision(6)} g/mol`;
    else if (massSolventNum === undefined) step = `kg_solvent = (m_solute / Mr) / m = (${solved.massSolute} / ${solved.molarMass}) / ${solved.molality} = ${solved.massSolventKg.toPrecision(6)} kg`;
    else step = `Check: m = (m_solute/Mr)/kg_solvent = (${solved.massSolute}/${solved.molarMass})/${solved.massSolventKg} = ${solved.molality.toPrecision(6)} mol/kg`;

    const formula = step;
    setResult({ molality: solved.molality, formula });

    saveCalculation({
      type: 'Molality',
      description: step,
      formula,
      result: `${solved.molality.toPrecision(6)} mol/kg`
    });

    setMassSolute(solved.massSolute.toString());
    setMolarMass(solved.molarMass.toString());
    setMassSolvent(solved.massSolventKg.toString());
    setMolalityInput(solved.molality.toString());
  };

  const copyResult = () => {
    if (result) {
      const text = `Molality: ${result.molality.toPrecision(6)} mol/kg`;
      navigator.clipboard.writeText(text);
      toast.success('Result copied to clipboard');
    }
  };

  const clear = () => {
    setMassSolute('');
    setMolarMass('');
    setMassSolvent('');
    setMolalityInput('');
    setResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-cyan-500" />
          Molality Calculator
        </CardTitle>
        <div className="text-sm text-gray-600 dark:text-gray-300 bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
          <strong>Formula:</strong> m = n<sub>solute</sub> / kg<sub>solvent</sub> (mol solute per kg solvent)
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="mass-solute">Mass of Solute (g)</Label>
              <Input
                id="mass-solute"
                type="number"
                step="any"
                value={massSolute}
                onChange={(e) => setMassSolute(e.target.value)}
                placeholder="e.g., 5.85"
              />
            </div>
            <div>
              <Label htmlFor="molar-mass-mol">Molar Mass (g/mol)</Label>
              <div className="flex gap-2">
                <Input
                  id="molar-mass-mol"
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
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="mass-solvent">Mass of Solvent (kg)</Label>
              <Input
                id="mass-solvent"
                type="number"
                step="any"
                value={massSolvent}
                onChange={(e) => setMassSolvent(e.target.value)}
                placeholder="e.g., 1.0"
              />
            </div>
            <div>
              <Label htmlFor="molality">Molality (mol/kg)</Label>
              <Input
                id="molality"
                type="number"
                step="any"
                value={molalityInput}
                onChange={(e) => setMolalityInput(e.target.value)}
                placeholder="leave blank to solve"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={calculate} className="bg-cyan-500 hover:bg-cyan-600">
            Calculate Molality
          </Button>
          <Button variant="outline" onClick={clear}>
            Clear
          </Button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Enter any three variables; leave the one to solve blank.
        </div>

        {result && (
          <div className="mt-6 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                    Result
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-semibold">
                    Molality: {result.molality.toPrecision(6)} mol/kg
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
                className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-100 dark:hover:bg-cyan-900"
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