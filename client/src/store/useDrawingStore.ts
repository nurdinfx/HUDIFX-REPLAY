import { create } from 'zustand';

export type DrawingTool = 'CURSOR' | 'TRENDLINE' | 'HORIZONTAL_LINE' | 'FIBONACCI' | 'RECTANGLE';

interface Drawing {
    id: string;
    type: DrawingTool;
    points: { time: number; price: number }[];
    styles?: any;
}

interface DrawingState {
    selectedTool: DrawingTool;
    drawings: Drawing[];
    setSelectedTool: (tool: DrawingTool) => void;
    addDrawing: (drawing: Drawing) => void;
    removeDrawing: (id: string) => void;
    clearDrawings: () => void;
}

export const useDrawingStore = create<DrawingState>((set) => ({
    selectedTool: 'CURSOR',
    drawings: [],
    setSelectedTool: (tool) => set({ selectedTool: tool }),
    addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
    removeDrawing: (id) => set((state) => ({ drawings: state.drawings.filter((d) => d.id !== id) })),
    clearDrawings: () => set({ drawings: [] }),
}));
