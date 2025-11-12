import React from 'react';
import type { DiseaseAnalysis } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { WarningIcon } from './icons/WarningIcon';
import { FirstAidIcon } from './icons/FirstAidIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { EyeIcon } from './icons/EyeIcon';

interface ResultCardProps {
    analysis: DiseaseAnalysis;
    imagePreviewUrl: string;
    onReset: () => void;
}

const InfoSection: React.FC<{ title: string; items: string[]; icon: React.ReactNode }> = ({ title, items, icon }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        {items && items.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-600">
                {items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        ) : (
            <p className="text-gray-500">No information provided.</p>
        )}
    </div>
);

export const ResultCard: React.FC<ResultCardProps> = ({ analysis, imagePreviewUrl, onReset }) => {
    const { isHealthy, disease, description, symptoms, possibleCauses, treatment, prevention } = analysis;

    const statusClasses = isHealthy
        ? "bg-green-100 border-green-500 text-green-800"
        : "bg-yellow-100 border-yellow-500 text-yellow-800";
    
    const statusIcon = isHealthy
        ? <CheckCircleIcon className="w-8 h-8 mr-3 text-green-600" />
        : <WarningIcon className="w-8 h-8 mr-3 text-yellow-600" />;

    return (
        <div className="w-full animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3 flex-shrink-0">
                    <div className="sticky top-6">
                        <img src={imagePreviewUrl} alt="Analyzed leaf" className="rounded-2xl shadow-lg w-full aspect-square object-cover" />
                        <button
                            onClick={onReset}
                            className="w-full mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
                        >
                            Analyze Another Leaf
                        </button>
                    </div>
                </div>

                <div className="lg:w-2/3 space-y-6">
                    <div className={`border-l-4 p-4 rounded-r-lg flex items-center shadow-md ${statusClasses}`}>
                        {statusIcon}
                        <div>
                            <h2 className="text-2xl font-bold">{disease}</h2>
                            <p className="font-medium">{description}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <InfoSection title="Symptoms" items={symptoms} icon={<EyeIcon className="w-5 h-5" />} />
                        <InfoSection title="Possible Causes" items={possibleCauses} icon={<BeakerIcon className="w-5 h-5" />} />
                        <InfoSection title="Treatment Plan" items={treatment} icon={<FirstAidIcon className="w-5 h-5" />} />
                        <InfoSection title="Prevention" items={prevention} icon={<ShieldCheckIcon className="w-5 h-5" />} />
                    </div>
                </div>
            </div>
        </div>
    );
};
