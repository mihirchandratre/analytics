'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Scale, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function UnitsConverter() {
  const [massMg, setMassMg] = useState('');
  const [massG, setMassG] = useState('');
  const [massUg, setMassUg] = useState('');
  const [volMl, setVolMl] = useState('');
  const [volL, setVolL] = useState('');

  const updateMass = (value: string, from: 'mg' | 'g' | 'ug') => {
    const val = parseFloat(value) || 0;
    
    if (from === 'mg') {
      setMassMg(value);
      setMassG(val ? (val / 1000).toString() : '');
      setMassUg(val ? (val * 1000).toString() : '');
    } else if (from === 'g') {
      setMassG(value);
      setMassMg(val ? (val * 1000).toString() : '');
      setMassUg(val ? (val * 1e6).toString() : '');
    } else if (from === 'ug') {
      setMassUg(value);
      setMassMg(val ? (val / 1000).toString() : '');
      setMassG(val ? (val / 1e6).toString() : '');
    }
  };

  const updateVolume = (value: string, from: 'ml' | 'l') => {
    const val = parseFloat(value) || 0;
    
    if (from === 'ml') {
      setVolMl(value);
      setVolL(val ? (val / 1000).toString() : '');
    } else if (from === 'l') {
      setVolL(value);
      setVolMl(val ? (val * 1000).toString() : '');
    }
  };

  const copyValue = (value: string) => {
    if (value) {
      navigator.clipboard.writeText(value);
      toast.success('Value copied to clipboard');
    }
  };

  const clearAll = () => {
    setMassMg('');
    setMassG('');
    setMassUg('');
    setVolMl('');
    setVolL('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-green-500" />
          Units Converter
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Enter a value in any box; others update automatically. Click 'Copy' to copy value.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Mass Conversions</Label>
            
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="any"
                value={massMg}
                onChange={(e) => updateMass(e.target.value, 'mg')}
                placeholder="Milligrams (mg)"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyValue(massMg)}
                className="px-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="any"
                value={massG}
                onChange={(e) => updateMass(e.target.value, 'g')}
                placeholder="Grams (g)"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyValue(massG)}
                className="px-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="any"
                value={massUg}
                onChange={(e) => updateMass(e.target.value, 'ug')}
                placeholder="Micrograms (μg)"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyValue(massUg)}
                className="px-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Volume Conversions</Label>
            
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="any"
                value={volMl}
                onChange={(e) => updateVolume(e.target.value, 'ml')}
                placeholder="Milliliters (mL)"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyValue(volMl)}
                className="px-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="any"
                value={volL}
                onChange={(e) => updateVolume(e.target.value, 'l')}
                placeholder="Liters (L)"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyValue(volL)}
                className="px-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>

            <div className="pt-4">
              <Button variant="outline" onClick={clearAll} className="w-full">
                Clear All
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Conversion References</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>Mass:</strong> 1 g = 1,000 mg = 1,000,000 μg</p>
            <p><strong>Volume:</strong> 1 L = 1,000 mL</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}