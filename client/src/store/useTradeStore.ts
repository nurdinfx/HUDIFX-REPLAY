import { create } from 'zustand';
import api from '../lib/axios';

interface Trade {
    _id: string;
    symbol: string;
    entryPrice: number;
    exitPrice?: number;
    lotSize: number;
    direction: 'BUY' | 'SELL';
    status: 'OPEN' | 'CLOSED';
    profit?: number;
}

interface TradeState {
    trades: Trade[];
    isLoading: boolean;
    openTrade: (tradeData: any) => Promise<void>;
    closeTrade: (tradeId: string, exitData: any) => Promise<void>;
    fetchTrades: (sessionId?: string) => Promise<void>;
}

export const useTradeStore = create<TradeState>((set) => ({
    trades: [],
    isLoading: false,

    openTrade: async (tradeData) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/trades', tradeData);
            set((state) => ({
                trades: [data, ...state.trades],
                isLoading: false
            }));
        } catch (error) {
            console.error('Failed to open trade', error);
            set({ isLoading: false });
        }
    },

    closeTrade: async (tradeId, exitData) => {
        set({ isLoading: true });
        try {
            const { data } = await api.patch(`/trades/${tradeId}/close`, exitData);
            set((state) => ({
                trades: state.trades.map((t) => (t._id === tradeId ? data : t)),
                isLoading: false
            }));
        } catch (error) {
            console.error('Failed to close trade', error);
            set({ isLoading: false });
        }
    },

    fetchTrades: async (sessionId) => {
        set({ isLoading: true });
        try {
            const params = sessionId ? { sessionId } : {};
            const { data } = await api.get('/trades', { params });
            set({ trades: data, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch trades', error);
            set({ isLoading: false });
        }
    }
}));
