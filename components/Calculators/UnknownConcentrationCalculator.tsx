'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, TestTube, Activity } from 'lucide-react';
import { calculateTitrationNormality, calculateBeerLambert } from '@/lib/calculations';
import { saveCalculation } from '@/lib/localStorage';
import { toast } from 'sonner';

export default function UnknownConcentrationCalculator() {
  // Titration state
  const [titrantNormality, setTitrantNormality] = useState('');
  const [titrantVolume, setTitrantVolume] = useState('');
  const [unknownVolume, setUnknownVolume] = useState('');
  const [stoichFactor, setStoichFactor] = useState('1');
  const [titrationResult, setTitrationResult] = useState<{
    normality: number;
    formula: string;
  } | null>(null);

  // Beer-Lambert state
  const [absorbance, setAbsorbance] = useState('');
  const [pathLength, setPathLength] = useState('1');
  const [molarAbsorptivity, setMolarAbsorptivity] = useState('');
  const [beerResult, setBeerResult] = useState<{
    concentration: number;
    formula: string;
  } | null>(null);

  const calculateTitration = () => {
    const ntNum = parseFloat(titrantNormality);
    const vtNum = parseFloat(titrantVolume);
    const vuNum = parseFloat(unknownVolume);
    const stoichNum = parseFloat(stoichFactor);

    if (!ntNum || !vtNum || !vuNum || !stoichNum) {
      toast.error('Please enter all titration values');
      return;
    }

    const normality = calculateTitrationNormality(ntNum, vtNum, vuNum, stoichNum);
    const formula = `N_unknown = (N_t × V_t) / (V_u × n) = (${ntNum} × ${vtNum}) / (${vuNum} × ${stoichNum}) = ${normality.toPrecision(6)} N`;

    const newResult = { normality, formula };
    setTitrationResult(newResult);

    // Save to localStorage
    saveCalculation({
      type: 'Titration',
      description: `${ntNum}N titrant, ${vtNum}mL used, ${vuNum}mL unknown`,
      formula,
      result: `${normality.toPrecision(6)} N`
    });
  };

  const calculateBeer = () => {
    const aNum = parseFloat(absorbance);
    const lNum = parseFloat(pathLength);
    const epsNum = parseFloat(molarAbsorptivity);

    if (!aNum && aNum !== 0 || !lNum || !epsNum) {
      toast.error('Please enter all Beer-Lambert values');
      return;
    }

    const concentration = calculateBeerLambert(aNum, epsNum, lNum);
    const formula = `A = ε × c × l\nc = A / (ε × l) = ${aNum} / (${epsNum} × ${lNum}) = ${concentration.toPrecision(6)} M`;

    const newResult = { concentration, formula };
    setBeerResult(newResult);

    // Save to localStorage
    saveCalculation({
      type: 'Beer-Lambert',
      description: `A=${aNum}, ε=${epsNum}, l=${lNum}cm`,
      formula,
      result: `${concentration.toPrecision(6)} M`
    });
  };

  const copyTitrationResult = () => {
    if (titrationResult) {
      const text = `Unknown Normality: ${titrationResult.normality.toPrecision(6)} N`;
      navigator.clipboard.writeText(text);
      toast.success('Result copied to clipboard');
    }
  };

  const copyBeerResult = () => {
    if (beerResult) {
      const text = `Concentration: ${beerResult.concentration.toPrecision(6)} M`;
      navigator.clipboard.writeText(text);
      toast.success('Result copied to clipboard');
    }
  };

  const clearTitration = () => {
    setTitrantNormality('');
    setTitrantVolume('');
    setUnknownVolume('');
    setStoichFactor('1');
    setTitrationResult(null);
  };

  const clearBeer = () => {
    setAbsorbance('');
    setPathLength('1');
    setMolarAbsorptivity('');
    setBeerResult(null);
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-orange-500" />
            Titration (Normality-based)
          </CardTitle>
          <div className="text-sm text-gray-600 dark:text-gray-300 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
            <strong>Formula:</strong> N₁V₁ = N₂V₂ → N_unknown = (N_titrant × V_titrant) / (V_unknown × stoich_factor)
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nt">Known Titrant Normality (N_t)</Label>
                <Input
                  id="nt"
                  type="number"
                  step="any"
                  value={titrantNormality}
                  onChange={(e) => setTitrantNormality(e.target.value)}
                  placeholder="e.g., 0.1"
                />
              </div>
              <div>
                <Label htmlFor="vt">Volume Titrant Used (mL)</Label>
                <Input
                  id="vt"
                  type="number"
                  step="any"
                  value={titrantVolume}
                  onChange={(e) => setTitrantVolume(e.target.value)}
                  placeholder="e.g., 25.3"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="vu">Volume Unknown Sample (mL)</Label>
                <Input
                  id="vu"
                  type="number"
                  step="any"
                  value={unknownVolume}
                  onChange={(e) => setUnknownVolume(e.target.value)}
                  placeholder="e.g., 10.0"
                />
              </div>
              <div>
                <Label htmlFor="stoich">Stoichiometric Factor</Label>
                <Input
                  id="stoich"
                  type="number"
                  step="any"
                  value={stoichFactor}
                  onChange={(e) => setStoichFactor(e.target.value)}
                  placeholder="e.g., 1"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={calculateTitration} className="bg-orange-500 hover:bg-orange-600">
              Calculate Unknown Normality
            </Button>
            <Button variant="outline" onClick={clearTitration}>
              Clear
            </Button>
          </div>

          {titrationResult && (
            <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      Result
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">
                      Unknown Normality: {titrationResult.normality.toPrecision(6)} N
                    </div>
                    <pre className="text-sm text-gray-600 dark:text-gray-300 mt-3 whitespace-pre-wrap">
                      {titrationResult.formula}
                    </pre>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyTitrationResult}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900"
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
            <Activity className="w-5 h-5 text-pink-500" />
            Beer-Lambert Law (A = εcl)
          </CardTitle>
          <div className="text-sm text-gray-600 dark:text-gray-300 bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
            <strong>Formula:</strong> A = ε × c × l → c = A / (ε × l)
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="absorbance">Absorbance (A)</Label>
                <Input
                  id="absorbance"
                  type="number"
                  step="any"
                  value={absorbance}
                  onChange={(e) => setAbsorbance(e.target.value)}
                  placeholder="e.g., 0.523"
                />
              </div>
              <div>
                <Label htmlFor="path">Path Length (cm)</Label>
                <Input
                  id="path"
                  type="number"
                  step="any"
                  value={pathLength}
                  onChange={(e) => setPathLength(e.target.value)}
                  placeholder="e.g., 1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="eps">Molar Absorptivity ε (L·mol⁻¹·cm⁻¹)</Label>
                <Input
                  id="eps"
                  type="number"
                  step="any"
                  value={molarAbsorptivity}
                  onChange={(e) => setMolarAbsorptivity(e.target.value)}
                  placeholder="e.g., 15200"
                />
              </div>
              <div>
                <Label>Calculated Concentration (M)</Label>
                <Input
                  type="number"
                  value={beerResult?.concentration.toPrecision(6) || ''}
                  readOnly
                  placeholder="Will be calculated"
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={calculateBeer} className="bg-pink-500 hover:bg-pink-600">
              Calculate Concentration
            </Button>
            <Button variant="outline" onClick={clearBeer}>
              Clear
            </Button>
          </div>

          {beerResult && (
            <div className="mt-6 p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg border border-pink-200 dark:border-pink-700 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                      Result
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">
                      Concentration: {beerResult.concentration.toPrecision(6)} M
                    </div>
                    <pre className="text-sm text-gray-600 dark:text-gray-300 mt-3 whitespace-pre-wrap">
                      {beerResult.formula}
                    </pre>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyBeerResult}
                  className="text-pink-600 hover:text-pink-700 hover:bg-pink-100 dark:hover:bg-pink-900"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}