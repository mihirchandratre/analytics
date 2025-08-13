'use client';

import Header from '@/components/Layout/Header';
import FeatureSummary from '@/components/Layout/FeatureSummary';
import TabNavigation, { Tab } from '@/components/Layout/TabNavigation';
import { Toaster } from '@/components/ui/sonner';

// Calculator components
import MolesCalculator from '@/components/Calculators/MolesCalculator';
import NormalityCalculator from '@/components/Calculators/NormalityCalculator';
import MolalityCalculator from '@/components/Calculators/MolalityCalculator';
import DilutionCalculator from '@/components/Calculators/DilutionCalculator';
import UnknownConcentrationCalculator from '@/components/Calculators/UnknownConcentrationCalculator';

// Tool components
import UnitsConverter from '@/components/Tools/UnitsConverter';
import BufferCalculator from '@/components/Tools/BufferCalculator';
import SimpleCalculators from '@/components/Tools/SimpleCalculators';
import PracticalHelpers from '@/components/Tools/PracticalHelpers';
import QualityOfLife from '@/components/Tools/QualityOfLife';

// Reference components
import ReferenceTables from '@/components/Reference/ReferenceTables';

export default function Home() {
  const tabs: Tab[] = [
    {
      id: 'moles-molarity',
      label: 'Moles / Molarity',
      component: MolesCalculator,
    },
    {
      id: 'normality',
      label: 'Normality',
      component: NormalityCalculator,
    },
    {
      id: 'molality',
      label: 'Molality',
      component: MolalityCalculator,
    },
    {
      id: 'dilutions',
      label: 'Dilutions',
      component: DilutionCalculator,
    },
    {
      id: 'unknown-conc',
      label: 'Unknown Conc.',
      component: UnknownConcentrationCalculator,
    },
    {
      id: 'units',
      label: 'Units',
      component: UnitsConverter,
    },
    {
      id: 'buffer',
      label: 'Buffer',
      component: BufferCalculator,
    },
    {
      id: 'simple-calcs',
      label: '%/Density/DF',
      component: SimpleCalculators,
    },
    {
      id: 'reference',
      label: 'Reference',
      component: ReferenceTables,
    },
    {
      id: 'practical',
      label: 'Practical',
      component: PracticalHelpers,
    },
    {
      id: 'qol',
      label: 'QOL',
      component: QualityOfLife,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-width-6xl mx-auto px-4 py-6">
        <Header />
        <FeatureSummary />
        <TabNavigation tabs={tabs} />
        
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            Professional pharmaceutical analyst toolkit built with Next.js & Tailwind CSS
            <br />
            <span className="text-xs opacity-75">
              Save calculations locally • Export to Excel • Print-friendly • Dark mode support
            </span>
          </p>
        </footer>
      </div>
      <Toaster />
    </main>
  );
}