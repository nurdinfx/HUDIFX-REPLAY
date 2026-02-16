import React, { useState } from 'react';
import {
    BarChart2,
    History
} from 'lucide-react';
import { useTradeStore } from '../../store/useTradeStore';

interface TradingBarProps {
    balance: number;
}

const TradingBar: React.FC<TradingBarProps> = ({ balance }) => {
    const { openTrade, isLoading } = useTradeStore();
    const [quantity, setQuantity] = useState(1.0);

    const handleTrade = async (direction: 'BUY' | 'SELL') => {
        // Mock entry price
        const entryPrice = 1.0850;
        await openTrade({
            symbol: 'EURUSD',
            entryPrice,
            lotSize: quantity,
            direction,
            // sessionId: ... (handled by store usually)
        });
    };

    return (
        <div className="h-10 bg-[#060606] border-t border-white/5 flex items-center justify-between px-4 z-50 overflow-hidden select-none shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
            {/* Left: Buy/Sell Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleTrade('BUY')}
                    disabled={isLoading}
                    className="h-7 px-4 bg-[#010101] border border-emerald-500/20 hover:border-emerald-500/50 text-emerald-500 rounded text-[10px] font-black uppercase transition-all flex items-center justify-center active:scale-95 hover:bg-emerald-500/5"
                >
                    Buy
                </button>
                <button
                    onClick={() => handleTrade('SELL')}
                    disabled={isLoading}
                    className="h-7 px-4 bg-[#010101] border border-rose-500/20 hover:border-rose-500/50 text-rose-500 rounded text-[10px] font-black uppercase transition-all flex items-center justify-center active:scale-95 hover:bg-rose-500/5"
                >
                    Sell
                </button>

                <div className="flex items-center gap-2 ml-4 px-3 h-7 bg-[#111111] rounded border border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Quantity</span>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setQuantity(isNaN(val) ? 0 : val);
                        }}
                        className="w-12 h-5 bg-transparent border-none text-[11px] font-mono text-white focus:outline-none text-center"
                        step="0.01"
                    />
                </div>
            </div>

            {/* Right: Account & Stats */}
            <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 px-3 h-7 bg-[#111111] border border-white/5 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-all group active:scale-95">
                    <BarChart2 className="w-3.5 h-3.5 group-hover:text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-tight">Analytics</span>
                </button>

                <div className="h-4 w-px bg-white/10" />

                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Account Balance</span>
                        <span className="text-[11px] font-black text-white">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Realized Pnl</span>
                        <span className="text-[11px] font-black text-emerald-500">$0.00</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Unrealised Pnl</span>
                        <span className="text-[11px] font-black text-gray-400">$0.00</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-1">
                    <button className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white transition-colors bg-[#111111] border border-white/5 rounded shadow-inner">
                        <History className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white transition-colors bg-[#111111] border border-white/5 rounded shadow-inner lg:flex hidden">
                        <div className="w-3 h-3 border-2 border-current rounded-full border-t-transparent animate-spin-slow opacity-20" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradingBar;
