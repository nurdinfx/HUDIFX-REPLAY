import React from 'react';
import { Info } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    chart?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, chart }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between h-40 relative group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                    {/* Icon placeholder if needed */}
                    <span className="font-medium text-slate-300">{title}</span>
                </div>
                <Info className="w-4 h-4 text-slate-600 cursor-pointer hover:text-slate-400" />
            </div>

            <div className="mt-4">
                <div className="text-3xl font-bold text-white tracking-tight">
                    {value}
                </div>
                {subValue && (
                    <div className="text-sm text-slate-500 mt-1">
                        {subValue}
                    </div>
                )}
            </div>

            {chart && (
                <div className="absolute right-4 bottom-4 w-1/3 h-1/2 opacity-50">
                    {chart}
                </div>
            )}
        </div>
    );
};

export default StatCard;
