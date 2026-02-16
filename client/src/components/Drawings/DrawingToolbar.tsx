import React from 'react';
import { useDrawingStore } from '../../store/useDrawingStore';
import type { DrawingTool } from '../../store/useDrawingStore';
import { MousePointer2, Minus, MoveHorizontal, Percent, Square, Settings } from 'lucide-react';

const DrawingToolbar = () => {
    const { selectedTool, setSelectedTool } = useDrawingStore();

    const tools: { id: DrawingTool; icon: React.ElementType; label: string }[] = [
        { id: 'CURSOR', icon: MousePointer2, label: 'Cursor (V)' },
        { id: 'TRENDLINE', icon: Minus, label: 'Trendline (T)' },
        { id: 'HORIZONTAL_LINE', icon: MoveHorizontal, label: 'Horizontal Line (H)' },
        { id: 'FIBONACCI', icon: Percent, label: 'Fibonacci (F)' },
        { id: 'RECTANGLE', icon: Square, label: 'Rectangle (R)' },
    ];

    return (
        <div className="flex flex-col gap-2">
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`p-2.5 rounded-xl transition-all relative group ${selectedTool === tool.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-500 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <tool.icon className={`w-4 h-4 ${tool.id === 'TRENDLINE' ? 'transform -rotate-45' : ''}`} />

                    {/* Tooltip */}
                    <div className="absolute left-full ml-3 px-2 py-1 bg-[#161b22] border border-white/10 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-2xl">
                        {tool.label}
                    </div>
                </button>
            ))}

            <div className="h-px w-6 bg-white/5 my-2 mx-auto" />

            <button className="p-2.5 rounded-xl text-gray-700 hover:text-white transition-all">
                <Settings className="w-4 h-4" />
            </button>
        </div>
    );
};

export default DrawingToolbar;
