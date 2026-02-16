import { useEffect, useRef } from 'react';
import { useReplayStore } from '../../store/useReplayStore';
import { Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';

const ReplayControls = () => {
    const {
        isActive,
        isPlaying,
        speed,
        pauseReplay,
        resumeReplay,
        setSpeed,
        nextTick
    } = useReplayStore();

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isPlaying && isActive) {
            intervalRef.current = setInterval(() => {
                nextTick();
            }, 1000 / speed);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, isActive, speed, nextTick]);

    if (!isActive) return null;

    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 flex items-center space-x-2 z-50">
            <div className="flex items-center space-x-1 border-r border-slate-700 pr-2">
                <span className="text-xs font-bold text-blue-500 uppercase">Replay</span>
            </div>

            <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                <SkipBack className="w-4 h-4" />
            </button>

            <button
                onClick={() => isPlaying ? pauseReplay() : resumeReplay()}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
            >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
                onClick={() => nextTick()}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
                <SkipForward className="w-4 h-4" />
            </button>

            <div className="h-6 w-px bg-slate-700 mx-2" />

            <div className="flex items-center space-x-1">
                {[1, 2, 4, 10].map((s) => (
                    <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`text-xs px-2 py-1 rounded ${speed === s ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {s}x
                    </button>
                ))}
            </div>

            <div className="h-6 w-px bg-slate-700 mx-2" />

            <button
                onClick={() => window.location.reload()} // Simple way to exit for now
                className="p-1 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-500"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ReplayControls;
