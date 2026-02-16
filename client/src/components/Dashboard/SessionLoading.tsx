import { useEffect, useState } from 'react';

const SessionLoading = () => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing HUDIFX engine...');

    useEffect(() => {
        const statuses = [
            'Initializing HUDIFX engine...',
            'Connecting to broker nodes...',
            'Fetching historical market data...',
            'Syncing candle synchronization...',
            'Loading technical modules...',
            'Preparing chart layout...',
            'Readying session...'
        ];

        let currentStatusIndex = 0;
        const statusInterval = setInterval(() => {
            currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
            setStatus(statuses[currentStatusIndex]);
        }, 800);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;
                return prev + Math.random() * 5;
            });
        }, 100);

        return () => {
            clearInterval(statusInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-[#000000] z-[200] flex flex-col items-center justify-center font-sans tracking-tight">
            <div className="relative flex flex-col items-center">
                {/* Logo Section - Matching FX REPLAY reference */}
                <div className="flex items-center gap-2 mb-12">
                    <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
                        HUDIFX<span className="text-blue-500">-</span>REPLAY
                        <div className="w-8 h-8 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </h1>
                </div>

                {/* Progress Bar Container */}
                <div className="w-72 space-y-2">
                    <div className="h-[3px] w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-medium text-gray-500 lowercase tracking-tight">
                            {status}...
                        </span>
                    </div>
                </div>

                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none -z-10" />
            </div>
        </div>
    );
};

export default SessionLoading;
