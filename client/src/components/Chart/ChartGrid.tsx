import React from 'react';
import { useReplayStore } from '../../store/useReplayStore';
import { CustomChart } from './CustomChart';

export const ChartGrid: React.FC = () => {
    const { layout, charts } = useReplayStore();

    // Determine Grid Classes based on layout
    // 1: 1x1
    // 2-v: 1x2 (Vertical split)
    // 2-h: 2x1 (Horizontal split)
    // 3: 3 charts (1 large, 2 small)
    // 4: 2x2 

    let gridClass = "grid-cols-1 grid-rows-1";
    if (layout === '2-v') gridClass = "grid-cols-2 grid-rows-1";
    if (layout === '2-h') gridClass = "grid-cols-1 grid-rows-2";
    if (layout === '3') gridClass = "grid-cols-2 grid-rows-2"; // Custom span logic needed below
    if (layout === '4') gridClass = "grid-cols-2 grid-rows-2";

    // Slice charts according to layout count
    const getCount = () => {
        if (layout === '4') return 4;
        if (layout === '3') return 3;
        if (layout.startsWith('2')) return 2;
        return 1;
    };

    const visibleCharts = charts.slice(0, getCount());

    return (
        <div className={`w-full h-full grid gap-px bg-white/5 ${gridClass}`}>
            {visibleCharts.map((chart, index) => {
                // Custom span for layout '3' (First chart takes 2 rows on left, others separate on right)
                // Actually simplified grid span:
                const isFirstOf3 = layout === '3' && index === 0;

                return (
                    <div
                        key={chart.id}
                        className={`relative overflow-hidden ${isFirstOf3 ? 'row-span-2' : ''}`}
                    >
                        <CustomChart id={chart.id} />
                    </div>
                );
            })}
        </div>
    );
};
