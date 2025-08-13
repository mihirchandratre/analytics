'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Droplets } from 'lucide-react';
import { calculatePercent, convertDensity, calculateDilutionFactor } from '@/lib/calculations';
import { densities } from '@/lib/constants';
import { saveCalculation } from '@/lib/localStorage';
import { toast } from 'sonner';

export default function SimpleCalculators() {
  // Percentage calculator state
  const [percValue, setPercValue] = useState('');
  const [percType, setPercType] = useState('w/v');
  const [finalAmount, setFinalAmount] = useState('');
  const [percResult, setPercResult] = useState<string>('');

  // Density converter state
  const [densValue, setDensValue] = useState('');
  const [densType, setDensType] = useState('g2ml');
  const [selectedDensity, setSelectedDensity] = useState('');
  const [customDensity, setCustomDensity] = useState('');
  const [densResult, setDensResult] = useState<string>('');

  // Dilution factor state
  const [dfValue1, setDfValue1] = useState('');
  const [dfValue2, setDfValue2] = useState('');
  const [dfResult, setDfResult] = useState<string>('');

  const calculatePercentage = () => {
    const val = parseFloat(percValue);
    const final = parseFloat(finalAmount);

    if (!val || !final) {
      toast.error('Enter percentage and final amount');
      return;
    }

    const result = calculatePercent(val, final);
    let resultText = '';
    let units = '';

    switch (percType) {
      case 'w/v':
        resultText = `${result.toPrecision(6)} g solute in ${final} mL`;
        units = 'g/100mL';
        break;
      case 'w/w':
        resultText = `${result.toPrecision(6)} g solute in ${final} g total`;
        units = 'g/100g';
        break;
      case 'v/v':
        resultText = `${result.toPrecision(6)} mL solute in ${final} mL total`;
        units = 'mL/100mL';
        break;
    }

    setPercResult(resultText);

    saveCalculation({
      type: 'Percentage',
      description: `${val}% ${percType} in ${final} → ${resultText}`,
      formula: `${val}% ${percType} (${units})`,
      result: resultText
    });
  };

  const calculateDensityConversion = () => {
    const val = parseFloat(densValue);
    const density = parseFloat(customDensity) || parseFloat(selectedDensity) || 0;

    if (!val || !density) {
      toast.error('Enter value and density');
      return;
    }

    const result = convertDensity(val, density, densType === 'g2ml');
    const resultText = densType === 'g2ml' 
      ? `${result.toPrecision(6)} mL`
      : `${result.toPrecision(6)} g`;

    setDensResult(resultText);

    saveCalculation({
      type: 'Density Conversion',
      description: `${val} ${densType === 'g2ml' ? 'g' : 'mL'} @ density ${density} → ${resultText}`,
      formula: densType === 'g2ml' ? 'V = m / ρ' : 'm = V × ρ',
      result: resultText
    });
  };

  const calculateDF = () => {
    const val1 = parseFloat(dfValue1);
    const val2 = parseFloat(dfValue2);

    if (!val1 || !val2) {
      toast.error('Enter both values');
      return;
    }

    const df = calculateDilutionFactor(val1, val2);
    const resultText = `Dilution factor = ${df.toPrecision(6)}`;
    setDfResult(resultText);

    saveCalculation({
      type: 'Dilution Factor',
      description: `DF = ${val1} / ${val2} = ${df.toPrecision(6)}`,
      formula: 'DF = C₁ / C₂ or V₂ / V₁',
      result: resultText
    });
  };

  const handleDensitySelect = (value: string) => {
    setSelectedDensity(value);
    setCustomDensity(value);
  };

  const clearPercentage = () => {
    setPercValue('');
    setFinalAmount('');
    setPercResult('');
  };

  const clearDensity = () => {
    setDensValue('');
    setSelectedDensity('');
    setCustomDensity('');
    setDensResult('');
  };

  const clearDF = () => {
    setDfValue1('');
    setDfValue2('');
    setDfResult('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-500" />
            Percentage Calculator (w/v, w/w, v/v)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Percentage (%)</Label>
              <Input
                type="number"
                step="any"
                value={percValue}
                onChange={(e) => setPercValue(e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={percType} onValueChange={setPercType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="w/v">% w/v (g/100mL)</SelectItem>
                  <SelectItem value="w/w">% w/w (g/100g)</SelectItem>
                  <SelectItem value="v/v">% v/v (mL/100mL)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Final Volume/Mass</Label>
              <Input
                type="number"
                step="any"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                placeholder="e.g., 250"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={calculatePercentage} className="bg-green-500 hover:bg-green-600">
              Calculate
            </Button>
            <Button variant="outline" onClick={clearPercentage}>Clear</Button>
          </div>
          {percResult && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Badge variant="secondary" className="mb-2">Result</Badge>
              <p className="font-medium">{percResult}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            Density-based Conversion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Value</Label>
              <Input
                type="number"
                step="any"
                value={densValue}
                onChange={(e) => setDensValue(e.target.value)}
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label>Conversion Type</Label>
              <Select value={densType} onValueChange={setDensType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g2ml">g → mL</SelectItem>
                  <SelectItem value="ml2g">mL → g</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Select Substance</Label>
              <Select onValueChange={handleDensitySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick substance..." />
                </SelectTrigger>
                <SelectContent>
                  {densities.map((density) => (
                    <SelectItem key={density.name} value={density.d.toString()}>
                      {density.name} ({density.d} g/mL)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Or Enter Density (g/mL)</Label>
              <Input
                type="number"
                step="any"
                value={customDensity}
                onChange={(e) => setCustomDensity(e.target.value)}
                placeholder="Enter density"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={calculateDensityConversion} className="bg-blue-500 hover:bg-blue-600">
              Convert
            </Button>
            <Button variant="outline" onClick={clearDensity}>Clear</Button>
          </div>
          {densResult && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Badge variant="secondary" className="mb-2">Result</Badge>
              <p className="font-medium">{densResult}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-orange-500" />
            Dilution Factor Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Initial Concentration (C₁) or Final Volume (V₂)</Label>
              <Input
                type="number"
                step="any"
                value={dfValue1}
                onChange={(e) => setDfValue1(e.target.value)}
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <Label>Final Concentration (C₂) or Initial Volume (V₁)</Label>
              <Input
                type="number"
                step="any"
                value={dfValue2}
                onChange={(e) => setDfValue2(e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={calculateDF} className="bg-orange-500 hover:bg-orange-600">
              Calculate DF
            </Button>
            <Button variant="outline" onClick={clearDF}>Clear</Button>
          </div>
          {dfResult && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Badge variant="secondary" className="mb-2">Result</Badge>
              <p className="font-medium">{dfResult}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}