import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReplayStore } from '../../store/useReplayStore';
import api from '../../lib/axios';

// import ChartContainer from '../../components/Chart/ChartContainer';
import { ChartGrid } from '../../components/Chart/ChartGrid';
import DrawingToolbar from '../../components/Drawings/DrawingToolbar';
import SessionLoading from '../../components/Dashboard/SessionLoading';
import ReplayHeader from '../../components/Replay/ReplayHeader';
import TradingBar from '../../components/Trading/TradingBar';

const SessionPage = () => {
    const { id } = useParams<{ id: string }>();
    const { loadSession } = useReplayStore();

    const [isLoading, setIsLoading] = useState(true);
    const [sessionData, setSessionData] = useState<any>(null);

    useEffect(() => {
        const fetchSession = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                // Fetch full session details
                const { data } = await api.get(`/replay/${id}`);
                setSessionData(data);
                // Load into store
                await loadSession(id);

                // Keep loading for a bit to show the "WOW" effect of the HUDIFX screen
                setTimeout(() => setIsLoading(false), 2500);
            } catch (error) {
                console.error('Error loading session:', error);
                setIsLoading(false);
            }
        };

        fetchSession();
    }, [id, loadSession]);

    if (isLoading) return <SessionLoading />;

    return (
        <div className="flex flex-col h-screen bg-[#06080d] text-white overflow-hidden select-none">
            {/* Top Toolbar */}
            <ReplayHeader
                symbol={sessionData?.symbol || 'EURUSD'}
                broker={sessionData?.broker || 'OANDA'}
                type={sessionData?.type || 'Backtesting'}
            />

            {/* Main Workspace Area */}
            <div className="flex-1 flex min-h-0 relative bg-[#010101]">
                {/* Left Drawing Sidebar */}
                <div className="w-9 border-r border-white/5 bg-[#060606] flex flex-col items-center py-2 z-40">
                    <DrawingToolbar />
                </div>

                {/* Primary Chart Area */}
                <div className="flex-1 relative flex flex-col">
                    <div className="flex-1 relative">
                        <ChartGrid />
                    </div>
                </div>

                {/* Right Sidebar (Object Tree / Navigation) */}
                <div className="w-60 border-l border-white/5 bg-[#060606] hidden xl:flex flex-col z-30">
                    <div className="h-9 px-4 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]">
                        <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Object tree</span>
                        <div className="flex gap-2">
                            <div className="w-1 h-1 bg-gray-600 rounded-full" />
                            <div className="w-1 h-1 bg-gray-600 rounded-full" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto py-2">
                        {/* Main Chart Layer */}
                        <div className="px-2 mb-1">
                            <div className="flex items-center gap-2 p-2 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded cursor-pointer transition-colors group">
                                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-white truncate uppercase tracking-tight">
                                        {sessionData?.symbol} - {sessionData?.broker} on FXReplay, 1
                                    </span>
                                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">Active Chart</span>
                                </div>
                            </div>
                        </div>

                        {/* Indicator Layers */}
                        <div className="px-4 py-2 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-gray-500 hover:text-gray-300 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full border border-gray-600" />
                                    <span className="text-[10px] font-medium uppercase tracking-tight">Volume (SMA)</span>
                                </div>
                                <div className="w-3 h-3 border border-gray-700 rounded-sm flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-gray-600 italic">
                                <span className="text-[9px]">No drawing objects yet</span>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Session Type</span>
                            <span className="text-[10px] font-black text-blue-500 uppercase">{sessionData?.type || 'BACKTESTING'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Trading / Info Bar */}
            <TradingBar balance={sessionData?.balance || 100000} />
        </div>
    );
};

export default SessionPage;
