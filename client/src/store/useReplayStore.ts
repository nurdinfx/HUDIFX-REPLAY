import { create } from 'zustand';
import api from '../lib/axios';

export interface ChartConfig {
    id: string;
    symbol: string;
    timeframe: string;
}

interface ReplayState {
    isActive: boolean;
    isPlaying: boolean;
    speed: number;
    currentCandleIndex: number;
    totalCandles: number;
    sessionId: string | null;
    timeframe: string; // Master timeframe (used for syncing or fallback)
    chartType: string;
    layout: '1' | '2-v' | '2-h' | '3' | '4';
    charts: ChartConfig[];
    activeChartId: string | null;

    startReplay: (symbol: string, timeframe: string, startTime: number) => Promise<void>;
    pauseReplay: () => void;
    resumeReplay: () => void;
    setSpeed: (speed: number) => void;
    nextTick: () => void;
    previousTick: () => void;
    rewindToStart: () => void;
    updateIndex: (index: number) => void;
    loadSession: (sessionId: string) => Promise<void>;
    setTimeframe: (timeframe: string) => void;
    setSymbol: (symbol: string) => void;
    setChartType: (chartType: string) => void;
    setTotalCandles: (total: number) => void;
    replaySpeedLabel: string;
    setReplaySpeedLabel: (label: string) => void;

    // Multi-chart actions
    setLayout: (layout: '1' | '2-v' | '2-h' | '3' | '4') => void;
    updateChart: (id: string, updates: Partial<ChartConfig>) => void;
    setActiveChart: (id: string | null) => void;
    addChart: (chart: ChartConfig) => void;
    removeChart: (id: string) => void;
}

export const useReplayStore = create<ReplayState>((set) => ({
    isActive: false,
    isPlaying: false,
    speed: 1,
    currentCandleIndex: 0,
    totalCandles: 0,
    sessionId: null,
    timeframe: '1m',
    chartType: 'Candles',
    replaySpeedLabel: '1m',
    layout: '1',
    charts: [{ id: 'main', symbol: 'EURUSD', timeframe: '1m' }],
    activeChartId: 'main',

    startReplay: async (symbol, timeframe, startTime) => {
        try {
            const { data } = await api.post('/replay', { symbol, timeframe, startTime });
            set({
                isActive: true,
                sessionId: data._id,
                currentCandleIndex: data.currentCandleIndex,
                isPlaying: false,
                timeframe
            });
        } catch (error) {
            console.error('Failed to start replay', error);
        }
    },

    loadSession: async (sessionId: string) => {
        try {
            const { data } = await api.get(`/replay/${sessionId}`);
            set({
                isActive: true,
                sessionId: data._id,
                currentCandleIndex: data.currentCandleIndex || 0,
                isPlaying: false,
                timeframe: data.timeframe || '1m',
                charts: [{
                    id: 'main',
                    symbol: data.symbol || 'EURUSD',
                    timeframe: data.timeframe || '1m'
                }],
                activeChartId: 'main'
            });
        } catch (error) {
            console.error('Failed to load session', error);
        }
    },

    pauseReplay: () => set({ isPlaying: false }),
    resumeReplay: () => set({ isPlaying: true }),

    setSpeed: (speed) => set({ speed }),

    nextTick: () => {
        set((state) => ({ currentCandleIndex: Math.min(state.currentCandleIndex + 1, state.totalCandles - 1) }));
    },

    previousTick: () => {
        set((state) => ({ currentCandleIndex: Math.max(state.currentCandleIndex - 1, 0) }));
    },

    rewindToStart: () => {
        set({ currentCandleIndex: 0, isPlaying: false });
    },

    updateIndex: (index) => set({ currentCandleIndex: index }),

    setTimeframe: (timeframe) => set((state) => {
        if (state.activeChartId) {
            return {
                timeframe, // Keep master in sync
                charts: state.charts.map(c => c.id === state.activeChartId ? { ...c, timeframe } : c)
            };
        }
        return { timeframe };
    }),
    setSymbol: (symbol) => set((state) => {
        if (state.activeChartId) {
            return {
                charts: state.charts.map(c => c.id === state.activeChartId ? { ...c, symbol } : c)
            };
        }
        return {};
    }),
    setChartType: (chartType) => set({ chartType }),
    setTotalCandles: (total) => set({ totalCandles: total }),

    setReplaySpeedLabel: (label) => set({ replaySpeedLabel: label }),

    setLayout: (layout) => {
        set((state) => {
            let newCharts = [...state.charts];
            const needed = layout === '4' ? 4 : layout === '3' ? 3 : layout.startsWith('2') ? 2 : 1;

            // Fill if needed
            while (newCharts.length < needed) {
                newCharts.push({
                    id: Math.random().toString(36).substr(2, 9),
                    symbol: state.charts[0]?.symbol || 'EURUSD',
                    timeframe: state.charts[0]?.timeframe || '1m'
                });
            }

            // Trim if needed? Maybe not, just hide them in UI
            return { layout, charts: newCharts };
        });
    },

    updateChart: (id, updates) => {
        set((state) => ({
            charts: state.charts.map((c) => (c.id === id ? { ...c, ...updates } : c))
        }));
    },

    setActiveChart: (id) => set({ activeChartId: id }),

    addChart: (chart) => set((state) => ({ charts: [...state.charts, chart] })),

    removeChart: (id) => set((state) => ({
        charts: state.charts.filter((c) => c.id !== id),
        activeChartId: state.activeChartId === id ? (state.charts[0]?.id || null) : state.activeChartId
    })),
}));
