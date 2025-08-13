'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, BookOpen, FlaskConical, Settings } from 'lucide-react';
import WelcomePopup from '@/components/common/WelcomePopup';

const features = [
	{
		icon: Calculator,
		title: 'Calculation Tools',
		items: [
			'% w/v, w/w, v/v calculators',
			'Density-based conversions',
			'Dilution factor calculator',
			'Moles, Molarity, Normality',
		],
	},
	{
		icon: BookOpen,
		title: 'Reference Tables & Data',
		items: [
			'Lab constants (R, F, Avogadro, ...)',
			'pH indicator color charts',
			'Solubility reference',
			'Common reagent database',
		],
	},
	{
		icon: FlaskConical,
		title: 'Practical Lab Helpers',
		items: [
			'Gravimetric moisture calculator',
			'Tablet assay helper',
			'Spectroscopy converter',
			'Buffer preparation guide',
		],
	},
	{
		icon: Settings,
		title: 'Quality-of-Life Features',
		items: [
			'Save recent calculations',
			'Export to Excel/CSV',
			'Branded PDF reports',
			'Dark mode toggle',
		],
	},
];

export default function FeatureSummary() {
	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
				{features.map((feature, index) => {
					const Icon = feature.icon;
					return (
						<Card
							key={index}
							className='hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-md'
						>
							<CardHeader className='pb-3'>
								<CardTitle className='flex items-center gap-2 text-lg'>
									<Icon className='w-5 h-5 text-blue-500' />
									{feature.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
									{feature.items.map((item, itemIndex) => (
										<li key={itemIndex} className='flex items-start gap-2'>
											<div className='w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0' />
											{item}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					);
				})}
			</div>
			<WelcomePopup />
		</>
	);
}