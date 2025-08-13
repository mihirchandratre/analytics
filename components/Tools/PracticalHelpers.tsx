'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Pill, Activity } from 'lucide-react';
import { 
  calculateMoistureContent, 
  calculateTabletAssay, 
  absorbanceToTransmittance, 
  transmittanceToAbsorbance 
} from '@/lib/calculations';
import { saveCalculation } from '@/lib/localStorage';
import { toast } from 'sonner';

export default function PracticalHelpers() {
  // Moisture content state
  const [wetMass, setWetMass] = useState('');
  const [dryMass, setDryMass] = useState('');
  const [moistureResult, setMoistureResult] = useState<string>('');

  // Tablet assay state
  const [totalMass, setTotalMass] = useState('');
  const [activeMass, setActiveMass] = useState('');
  const [assayResult, setAssayResult] = useState<string>('');

  // Spectroscopy converter state
  const [specValue, setSpecValue] = useState('');
  const [specType, setSpecType] = useState('a2t');
  const [specResult, setSpecResult] = useState<string>('');

  const calculateMoisture = () => {
    const wet = parseFloat(wetMass);
    const dry = parseFloat(dryMass);

    if (!wet || !dry) {
      toast.error('Enter both wet and dry masses');
      return;
    }

    if (wet <= dry) {
      toast.error('Wet mass must be greater than dry mass');
      return;
    }

    const moisture = calculateMoistureContent(wet, dry);
    const resultText = `Moisture content: ${moisture.toPrecision(4)}%`;
    setMoistureResult(resultText);

    saveCalculation({
      type: 'Moisture Content',
      description: `Wet: ${wet}g, Dry: ${dry}g`,
      formula: 'Moisture% = ((Wet - Dry) / Wet) × 100',
      result: resultText
    });
  };

  const calculateAssay = () => {
    const total = parseFloat(totalMass);
    const active = parseFloat(activeMass);

    if (!total || !active) {
      toast.error('Enter both total and active masses');
      return;
    }

    if (active > total) {
      toast.error('Active mass cannot exceed total mass');
      return;
    }

    const assay = calculateTabletAssay(active, total);
    const resultText = `Active ingredient: ${assay.toPrecision(4)}%`;
    setAssayResult(resultText);

    saveCalculation({
      type: 'Tablet Assay',
      description: `Total: ${total}mg, Active: ${active}mg`,
      formula: 'Assay% = (Active / Total) × 100',
      result: resultText
    });
  };

  const calculateSpectroscopy = () => {
    const val = parseFloat(specValue);

    if (val === undefined || val === null || (val === 0 && specType === 't2a')) {
      toast.error('Enter a valid value');
      return;
    }

    let result = 0;
    let resultText = '';

    if (specType === 'a2t') {
      result = absorbanceToTransmittance(val);
      resultText = `%Transmittance: ${result.toPrecision(5)}%`;
    } else {
      if (val <= 0 || val > 100) {
        toast.error('Transmittance must be between 0 and 100%');
        return;
      }
      result = transmittanceToAbsorbance(val);
      resultText = `Absorbance: ${result.toPrecision(5)}`;
    }

    setSpecResult(resultText);

    saveCalculation({
      type: 'Spectroscopy Conversion',
      description: `${val} ${specType === 'a2t' ? 'Abs' : '%T'} → ${resultText}`,
      formula: specType === 'a2t' ? '%T = 10^(-A) × 100' : 'A = -log₁₀(%T/100)',
      result: resultText
    });
  };

  const clearMoisture = () => {
    setWetMass('');
    setDryMass('');
    setMoistureResult('');
  };

  const clearAssay = () => {
    setTotalMass('');
    setActiveMass('');
    setAssayResult('');
  };

  const clearSpec = () => {
    setSpecValue('');
    setSpecResult('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-blue-500" />
            Gravimetric Moisture Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Wet Mass (g)</Label>
              <Input
                type="number"
                step="any"
                value={wetMass}
                onChange={(e) => setWetMass(e.target.value)}
                placeholder="e.g., 5.234"
              />
            </div>
            <div>
              <Label>Dry Mass (g)</Label>
              <Input
                type="number"
                step="any"
                value={dryMass}
                onChange={(e) => setDryMass(e.target.value)}
                placeholder="e.g., 4.987"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={calculateMoisture} className="bg-blue-500 hover:bg-blue-600">
              Calculate
            </Button>
            <Button variant="outline" onClick={clearMoisture}>Clear</Button>
          </div>
          {moistureResult && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Badge variant="secondary" className="mb-2">Result</Badge>
              <p className="font-medium">{moistureResult}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Formula: Moisture% = ((Wet - Dry) / Wet) × 100
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-green-500" />
            Tablet Assay Helper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Total Tablet Mass (mg)</Label>
              <Input
                type="number"
                step="any"
                value={totalMass}
                onChange={(e) => setTotalMass(e.target.value)}
                placeholder="e.g., 250.5"
              />
            </div>
            <div>
              <Label>Active Ingredient Mass (mg)</Label>
              <Input
                type="number"
                step="any"
                value={activeMass}
                onChange={(e) => setActiveMass(e.target.value)}
                placeholder="e.g., 25.3"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={calculateAssay} className="bg-green-500 hover:bg-green-600">
              Calculate
            </Button>
            <Button variant="outline" onClick={clearAssay}>Clear</Button>
          </div>
          {assayResult && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Badge variant="secondary" className="mb-2">Result</Badge>
              <p className="font-medium">{assayResult}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Formula: Assay% = (Active Mass / Total Mass) × 100
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Spectroscopy: Absorbance ↔ Transmittance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Value</Label>
              <Input
                type="number"
                step="any"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label>Conversion Type</Label>
              <Select value={specType} onValueChange={setSpecType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a2t">Absorbance → %Transmittance</SelectItem>
                  <SelectItem value="t2a">%Transmittance → Absorbance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={calculateSpectroscopy} className="bg-purple-500 hover:bg-purple-600">
              Convert
            </Button>
            <Button variant="outline" onClick={clearSpec}>Clear</Button>
          </div>
          {specResult && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Badge variant="secondary" className="mb-2">Result</Badge>
              <p className="font-medium">{specResult}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {specType === 'a2t' 
                  ? 'Formula: %T = 10^(-A) × 100' 
                  : 'Formula: A = -log₁₀(%T/100)'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}