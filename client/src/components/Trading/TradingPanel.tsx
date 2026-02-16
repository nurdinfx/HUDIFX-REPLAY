import { useState } from 'react';
import { useTradeStore } from '../../store/useTradeStore';
import { useReplayStore } from '../../store/useReplayStore';
import { X } from 'lucide-react';

const TradingPanel = () => {
    const { openTrade, trades, closeTrade, isLoading } = useTradeStore();
    const { isActive } = useReplayStore();

    const [lotSize, setLotSize] = useState(1.0);
    const [stopLoss, setStopLoss] = useState<number | ''>('');
    const [takeProfit, setTakeProfit] = useState<number | ''>('');

    const handleTrade = async (direction: 'BUY' | 'SELL') => {
        // Mock entry price (in real app, get from chart/store)
        const entryPrice = 1.0850;

        await openTrade({
            symbol: 'EURUSD',
            entryPrice,
            lotSize,
            direction,
            stopLoss: stopLoss || undefined,
            takeProfit: takeProfit || undefined,
            sessionId: isActive ? useReplayStore.getState().sessionId : undefined
        });
    };

    return (
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
            <div className="p-4 border-b border-slate-800">
                <h2 className="font-semibold text-lg">Trading Panel</h2>
            </div>

            <div className="p-4 space-y-4">
                {/* Lot Size */}
                <div>
                    <label className="text-xs text-slate-400">Lot Size</label>
                    <input
                        type="number"
                        value={lotSize}
                        onChange={(e) => setLotSize(parseFloat(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white mt-1"
                        step="0.01"
                        min="0.01"
                    />
                </div>

                {/* SL / TP */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-slate-400">Stop Loss</label>
                        <input
                            type="number"
                            value={stopLoss}
                            onChange={(e) => setStopLoss(parseFloat(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white mt-1"
                            placeholder="Price"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Take Profit</label>
                        <input
                            type="number"
                            value={takeProfit}
                            onChange={(e) => setTakeProfit(parseFloat(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white mt-1"
                            placeholder="Price"
                        />
                    </div>
                </div>

                {/* Buy / Sell Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        onClick={() => handleTrade('SELL')}
                        disabled={isLoading}
                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg flex flex-col items-center justify-center transition-colors"
                    >
                        <span className="font-bold text-lg">SELL</span>
                        <span className="text-xs opacity-75">1.0849</span>
                    </button>
                    <button
                        onClick={() => handleTrade('BUY')}
                        disabled={isLoading}
                        className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex flex-col items-center justify-center transition-colors"
                    >
                        <span className="font-bold text-lg">BUY</span>
                        <span className="text-xs opacity-75">1.0851</span>
                    </button>
                </div>
            </div>

            {/* Open Trades */}
            <div className="flex-1 overflow-y-auto border-t border-slate-800">
                <div className="p-3 bg-slate-800/50 text-xs font-semibold text-slate-400 sticky top-0">
                    OPEN POSITIONS
                </div>
                <div className="divide-y divide-slate-800">
                    {trades.filter(t => t.status === 'OPEN').map((trade) => (
                        <div key={trade._id} className="p-3 hover:bg-slate-800/50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold ${trade.direction === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                    {trade.direction} {trade.symbol}
                                </span>
                                <span className="text-slate-400 text-xs">{trade.lotSize} Lot</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-300">{trade.entryPrice}</span>
                                <div className="flex items-center space-x-2">
                                    <span className={trade.profit && trade.profit > 0 ? 'text-green-500' : 'text-red-500'}>
                                        ${trade.profit?.toFixed(2) || '0.00'}
                                    </span>
                                    <button
                                        onClick={() => closeTrade(trade._id, { exitPrice: 1.0855 })} // Mock exit
                                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {trades.filter(t => t.status === 'OPEN').length === 0 && (
                        <div className="p-4 text-center text-slate-500 text-sm">
                            No open positions
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TradingPanel;
