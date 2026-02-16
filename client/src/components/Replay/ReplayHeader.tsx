import React, { useState, useEffect } from 'react';
import {
    ChevronDown,
    Play,
    Pause,
    SkipForward,
    Rewind,
    Newspaper,
    BookOpen,
    Search,
    ArrowUpRight,
    Undo2,
    Redo2,
    Settings,
    Activity,
    Plus,
    EyeOff,
    ArrowLeft,
    ChevronsRight,
    Target,
    Sparkles,
    Moon,
    Maximize,
    Camera,
    Code2,
    Grid3X3,
    BarChart2,
    CandlestickChart,
    LineChart,
    Download,
    Copy,
    Link as LinkIcon,
    ExternalLink,
    X
} from 'lucide-react';
import { useReplayStore } from '../../store/useReplayStore';

interface ReplayHeaderProps {
    symbol: string;
    broker: string;
    type: string;
}

const ReplayHeader: React.FC<ReplayHeaderProps> = ({ symbol }) => {
    const {
        isActive,
        isPlaying,
        pauseReplay,
        resumeReplay,
        nextTick,
        previousTick,
        rewindToStart,
        speed,
        setSpeed,
        replaySpeedLabel,
        setReplaySpeedLabel,
        timeframe: currentTimeframe,
        chartType: currentChartType,
        setTimeframe,
        setSymbol,
        setChartType,
        layout,
        setLayout,
        activeChartId,
        charts
    } = useReplayStore();

    const [isReplayModeOn, setIsReplayModeOn] = useState(true);

    // Dropdown/Modal States
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isIndicatorsModalOpen, setIsIndicatorsModalOpen] = useState(false);
    const [indicatorSearch, setIndicatorSearch] = useState('');
    const [activeIndicatorTab, setActiveIndicatorTab] = useState('All');

    // Custom Timeframe State
    const [isCustomTimeframeMode, setIsCustomTimeframeMode] = useState(false);
    const [customValue, setCustomValue] = useState('1');
    const [customUnit, setCustomUnit] = useState('m');

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = () => {
            setActiveDropdown(null);
            setIsCustomTimeframeMode(false);
        };
        if (activeDropdown) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [activeDropdown]);

    if (!isActive) return null;

    const speedOptions = ['5s', '10s', '15s', '30s', '1m', '3m', '5m', '10m'];

    const handleSpeedSelect = (label: string) => {
        setReplaySpeedLabel(label);

        // Calculate numeric speed (candles per second)
        // Formula: Speed (input) / Timeframe (chart)
        const parseToSeconds = (val: string) => {
            const num = parseInt(val);
            if (val.includes('s')) return num;
            if (val.includes('m')) return num * 60;
            if (val.includes('h')) return num * 3600;
            if (val.includes('D')) return num * 86400;
            if (val.includes('M')) return num * 2592000;
            return num * 60;
        };

        const speedSec = parseToSeconds(label);
        const tfSec = parseToSeconds(currentTimeframe);

        const numericSpeed = Math.max(0.1, speedSec / tfSec);
        setSpeed(numericSpeed);
        setActiveDropdown(null);
    };

    const handleAddCustomTimeframe = () => {
        const timeframe = `${customValue}${customUnit}`;
        setTimeframe(timeframe);
        setActiveDropdown(null);
        setIsCustomTimeframeMode(false);
    };

    // Helper: Dropdown Wrapper
    const Dropdown: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
        if (activeDropdown !== id) return null;
        return (
            <div
                className="absolute top-full left-0 mt-1 min-w-[240px] bg-[#131722] border border-[#363a45] rounded shadow-2xl py-2 z-[100]"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        );
    };

    return (
        <div className="flex flex-col z-50 select-none font-sans relative">
            {/* Indicators Modal */}
            {isIndicatorsModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-[#131722] border border-[#363a45] w-full max-w-3xl rounded-lg shadow-2xl flex flex-col max-h-[80vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#363a45]">
                            <h2 className="text-lg font-bold text-white">Indicators</h2>
                            <button onClick={() => setIsIndicatorsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    className="w-full bg-[#1e222d] border border-[#363a45] rounded px-10 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Search indicator"
                                    value={indicatorSearch}
                                    onChange={(e) => setIndicatorSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-6 px-6 border-b border-[#363a45]">
                            {['All', 'Top rated', 'Community', 'Built-in', 'By FXR'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveIndicatorTab(tab)}
                                    className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeIndicatorTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Indicator List Content */}
                        <div className="flex-1 overflow-y-auto p-2">
                            <div className="grid grid-cols-1 gap-0.5">
                                {[
                                    { name: 'Accumulation/Distribution', category: 'Built-in' },
                                    { name: 'Accumulative Swing Index', category: 'Built-in' },
                                    { name: 'Advance/Decline', category: 'Built-in' },
                                    { name: 'Arnaud Legoux Moving Average', category: 'Built-in' },
                                    { name: 'Aroon', category: 'Built-in' },
                                    { name: 'Average Price', category: 'Built-in' },
                                    { name: 'Average Directional Index', category: 'Built-in' },
                                    { name: 'Average True Range', category: 'Built-in' },
                                    { name: 'Awesome Oscillator', category: 'Built-in' }
                                ].filter(ind => ind.name.toLowerCase().includes(indicatorSearch.toLowerCase())).map((ind, i) => (
                                    <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-[#1e222d] rounded cursor-pointer group transition-colors">
                                        <span className="text-sm text-gray-300 group-hover:text-white">{ind.name}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-bold text-blue-500/70">{ind.category}</span>
                                            <span className="text-[10px] text-gray-600">0</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tier 1: Top Bar */}
            <header className="h-[42px] bg-[#010101] border-b border-white/[0.05] flex items-center justify-between px-3">
                {/* Left side actions */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <ChevronsRight className="w-4 h-4 text-white" />
                        <div className="flex items-center gap-1.5 hover:bg-white/5 px-1.5 py-0.5 rounded cursor-pointer transition-colors group">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">new</span>
                            <ChevronDown className="w-2.5 h-2.5 text-gray-600 group-hover:text-white" />
                        </div>
                        <button className="text-gray-500 hover:text-white transition-colors">
                            <Target className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Center: Replay Control Capsule */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center h-full">
                    <div className="flex items-center gap-1 bg-[#0a0a0b] border border-white/10 rounded-lg px-2 py-1 shadow-2xl">
                        {/* Drag Handle */}
                        <div className="grid grid-cols-2 gap-0.5 px-1 border-r border-white/5 opacity-20 pr-1.5 cursor-grab active:cursor-grabbing">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-0.5 h-0.5 bg-white rounded-full" />
                            ))}
                        </div>

                        {/* Rewind to Start */}
                        <button
                            onClick={() => rewindToStart()}
                            className="p-1 px-1.5 text-gray-500 hover:text-white transition-colors active:scale-90 flex items-center justify-center relative group"
                            title="Rewind to start"
                        >
                            <div className="w-0.5 h-3 bg-current rounded-full" />
                            <Rewind className="w-3.5 h-3.5 ml-[-4px]" />
                        </button>

                        {/* Speed Control Slider */}
                        <div className="flex items-center gap-2 px-1 border-x border-white/5 mx-0.5">
                            <Plus className="w-3 h-3 text-gray-500" />
                            <div className="relative flex items-center group">
                                <input
                                    type="range"
                                    min="0.5"
                                    max="50"
                                    step="0.5"
                                    value={speed || 1}
                                    onChange={(e) => setSpeed(parseFloat(e.target.value) || 1)}
                                    className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500 hover:bg-white/20 transition-colors"
                                />
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1e222d] border border-white/10 text-[9px] font-bold text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                                    {speed}x / sec
                                </div>
                            </div>
                        </div>

                        {/* Step Back & Play */}
                        <div className="flex items-center gap-0">
                            <button
                                onClick={() => previousTick()}
                                className="p-1 px-1.5 text-gray-500 hover:text-white transition-colors active:scale-90 flex items-center justify-center"
                                title="Step back"
                            >
                                <ChevronDown className="w-4 h-4 rotate-90" />
                            </button>
                            <button
                                onClick={() => isPlaying ? pauseReplay() : resumeReplay()}
                                className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white transition-colors active:scale-95"
                            >
                                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                            </button>
                        </div>

                        {/* Capsule Speed Preset Display */}
                        <div className="relative">
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(activeDropdown === 'speed' ? null : 'speed');
                                }}
                                className={`flex items-center gap-1 px-2 h-7 hover:bg-white/5 transition-colors rounded cursor-pointer group ${activeDropdown === 'speed' ? 'bg-white/5' : ''}`}
                            >
                                <span className="text-[11px] font-bold text-white group-hover:text-blue-500 transition-colors uppercase">{replaySpeedLabel}</span>
                                <ChevronDown className="w-2.5 h-2.5 text-gray-600 group-hover:text-white" />
                            </div>

                            {/* Replay Speed Dropdown */}
                            {activeDropdown === 'speed' && (
                                <div className="absolute top-full left-0 mt-1 min-w-[60px] bg-[#0a0a0b] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                                    {speedOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleSpeedSelect(opt)}
                                            className={`w-full text-left px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-blue-600/10 hover:text-blue-500 ${replaySpeedLabel === opt ? 'text-blue-500 bg-blue-600/10' : 'text-gray-400'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Step Forward */}
                        <button
                            onClick={() => nextTick()}
                            className="p-1 px-1.5 text-gray-500 hover:text-white transition-colors active:scale-90"
                            title="Step forward"
                        >
                            <SkipForward className="w-3.5 h-3.5" />
                        </button>

                        {/* Replay Toggle Switch */}
                        <div
                            onClick={() => setIsReplayModeOn(!isReplayModeOn)}
                            className="ml-1 pl-1.5 border-l border-white/5 cursor-pointer"
                        >
                            <div className={`w-8 h-4.5 rounded-full relative p-0.5 transition-colors duration-200 ${isReplayModeOn ? 'bg-blue-600' : 'bg-gray-800'}`}>
                                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${isReplayModeOn ? 'translate-x-[14px]' : 'translate-x-0'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side buttons */}
                <div className="flex items-center gap-1">
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === 'layout' ? null : 'layout');
                            }}
                            className={`text-gray-500 hover:text-white p-1.5 rounded transition-colors ${activeDropdown === 'layout' ? 'bg-white/5 text-white' : ''}`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>

                        {activeDropdown === 'layout' && (
                            <div className="absolute top-full right-0 mt-1 min-w-[120px] bg-[#0a0a0b] border border-white/10 rounded-lg shadow-2xl py-2 z-50">
                                <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Layout</div>
                                {[
                                    { id: '1', label: 'Single', icon: '□' },
                                    { id: '2-v', label: '2 Vertical', icon: '◫' },
                                    { id: '2-h', label: '2 Horizontal', icon: '⊟' },
                                    { id: '3', label: '3 Split', icon: '◲' },
                                    { id: '4', label: '4 Grid', icon: '⧄' }
                                ].map((l) => (
                                    <button
                                        key={l.id}
                                        onClick={() => {
                                            setLayout(l.id as any);
                                            setActiveDropdown(null);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-[11px] font-medium transition-colors hover:bg-blue-600/10 hover:text-blue-500 flex items-center justify-between group`}
                                    >
                                        <span>{l.label}</span>
                                        <span className="text-[14px] opacity-40 group-hover:opacity-100">{l.icon}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1 border-l border-white/5 pl-1.5 ml-1">
                        <button className="flex items-center gap-1.5 px-3 h-[28px] bg-[#0d0d0d] hover:bg-white/5 rounded border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95">
                            <ArrowUpRight className="w-3 h-3 text-blue-500" />
                            <span className="text-[9px] font-bold uppercase tracking-tight">Go To 0/3</span>
                        </button>
                        <button className="flex items-center gap-1.5 px-3 h-[28px] bg-[#0d0d0d] hover:bg-white/5 rounded border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95">
                            <Settings className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-tight">Place Order</span>
                        </button>
                        <button className="flex items-center gap-1.5 px-3 h-[28px] bg-[#0d0d0d] hover:bg-white/5 rounded border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95">
                            <Newspaper className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-tight">News</span>
                        </button>
                        <button className="flex items-center gap-1.5 px-3 h-[28px] bg-[#0d0d0d] hover:bg-white/5 rounded border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-tight">Journal</span>
                        </button>
                    </div>

                    {/* End actions */}
                    <div className="flex items-center gap-2 ml-2 border-l border-white/5 pl-2">
                        <button className="p-1.5 text-blue-500 bg-blue-500/10 rounded-full hover:bg-blue-500/20 transition-all active:scale-90">
                            <Sparkles className="w-4 h-4 fill-current" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-white transition-colors">
                            <Moon className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-white transition-colors">
                            <Maximize className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Tier 2: Sub-Toolbar */}
            <div className="h-9 bg-[#0a0a0a] border-b border-white/[0.05] flex items-center justify-between px-2">
                <div className="flex items-center gap-0.5">
                    {/* Symbol Toggle */}
                    <div className="relative">
                        <div
                            className="flex items-center gap-1.5 px-2.5 h-7 hover:bg-white/5 rounded transition-colors cursor-pointer group"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === 'symbol' ? null : 'symbol');
                            }}
                        >
                            <Search className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                            <span className="text-[11px] font-black text-orange-400 tracking-tight uppercase">
                                {charts.find(c => c.id === activeChartId)?.symbol || symbol || 'EURUSD'}
                            </span>
                        </div>

                        {activeDropdown === 'symbol' && (
                            <div className="absolute top-full left-0 mt-1 min-w-[160px] bg-[#0a0a0b] border border-white/10 rounded-lg shadow-2xl py-2 z-50">
                                <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Select Symbol</div>
                                {['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'XAUUSD'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            setSymbol(s);
                                            setActiveDropdown(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-300 hover:bg-blue-600/10 hover:text-blue-500 transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="p-1 px-1.5 text-gray-600 hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>

                    <span className="text-white/10 mx-1 font-thin">|</span>

                    {/* Timeframe Dropdown Trigger */}
                    <div className="relative">
                        <div
                            className={`flex items-center gap-1 px-2 h-7 rounded hover:bg-white/5 transition-colors cursor-pointer text-blue-500 font-bold text-[11px] uppercase ${activeDropdown === 'timeframe' ? 'bg-white/5' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === 'timeframe' ? null : 'timeframe');
                            }}
                        >
                            {currentTimeframe}
                        </div>

                        <Dropdown id="timeframe">
                            {!isCustomTimeframeMode ? (
                                <>
                                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Minutes</div>
                                    <div className="flex flex-col">
                                        {['1m', '5m', '15m', '30m', '45m'].map(tf => (
                                            <button
                                                key={tf}
                                                onClick={() => { setTimeframe(tf); setActiveDropdown(null); }}
                                                className={`px-4 py-2 text-sm text-left hover:bg-[#1e222d] transition-colors ${currentTimeframe === tf ? 'text-blue-500 bg-blue-500/5' : 'text-gray-300'}`}
                                            >
                                                {tf.replace('m', '')} minute{tf !== '1m' ? 's' : ''}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="px-3 py-1.5 mt-2 text-[10px] uppercase font-bold text-gray-500 tracking-wider border-t border-[#363a45]">Hours</div>
                                    <div className="flex flex-col">
                                        {['1h', '4h'].map(tf => (
                                            <button
                                                key={tf}
                                                onClick={() => { setTimeframe(tf); setActiveDropdown(null); }}
                                                className={`px-4 py-2 text-sm text-left hover:bg-[#1e222d] transition-colors ${currentTimeframe === tf ? 'text-blue-500 bg-blue-500/5' : 'text-gray-300'}`}
                                            >
                                                {tf.replace('h', '')} hour{tf !== '1h' ? 's' : ''}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="px-3 py-1.5 mt-2 text-[10px] uppercase font-bold text-gray-500 tracking-wider border-t border-[#363a45]">Days & Months</div>
                                    <div className="flex flex-col">
                                        {['1D', '1M'].map(tf => (
                                            <button
                                                key={tf}
                                                onClick={() => { setTimeframe(tf); setActiveDropdown(null); }}
                                                className={`px-4 py-2 text-sm text-left hover:bg-[#1e222d] transition-colors ${currentTimeframe === tf ? 'text-blue-500 bg-blue-500/5' : 'text-gray-300'}`}
                                            >
                                                {tf === '1D' ? '1 day' : '1 month'}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setIsCustomTimeframeMode(true)}
                                        className="mt-2 w-full px-4 py-2 text-xs font-bold text-blue-500 border-t border-[#363a45] hover:bg-[#1e222d] text-left"
                                    >
                                        Add custom interval...
                                    </button>
                                </>
                            ) : (
                                <div className="p-4 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Add custom interval</span>
                                        <X
                                            className="w-3.5 h-3.5 text-gray-600 hover:text-white cursor-pointer"
                                            onClick={() => setIsCustomTimeframeMode(false)}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={customValue}
                                            onChange={(e) => setCustomValue(e.target.value)}
                                            className="w-16 bg-[#1e222d] border border-[#363a45] rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                            min="1"
                                            autoFocus
                                        />
                                        <select
                                            className="flex-1 bg-[#1e222d] border border-[#363a45] rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                            value={customUnit}
                                            onChange={(e) => setCustomUnit(e.target.value)}
                                        >
                                            <option value="m">Minute(s)</option>
                                            <option value="h">Hour(s)</option>
                                            <option value="D">Day(s)</option>
                                            <option value="M">Month(s)</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleAddCustomTimeframe}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-xs uppercase tracking-wider transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                        </Dropdown>
                    </div>

                    <span className="text-white/10 mx-1 font-thin">|</span>

                    {/* Chart Type Dropdown Trigger */}
                    <div className="relative">
                        <button
                            className={`p-2 h-7 hover:bg-white/5 rounded transition-colors text-gray-500 hover:text-white ${activeDropdown === 'chartType' ? 'bg-white/5 text-white' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === 'chartType' ? null : 'chartType');
                            }}
                        >
                            <Activity className="w-4 h-4" />
                        </button>

                        <Dropdown id="chartType">
                            {[
                                { name: 'Bars', icon: BarChart2 },
                                { name: 'Candles', icon: CandlestickChart },
                                { name: 'Hollow candles', icon: CandlestickChart },
                                { name: 'Line', icon: LineChart },
                                { name: 'Area', icon: Activity }
                            ].map(type => (
                                <button
                                    key={type.name}
                                    onClick={() => { setChartType(type.name); setActiveDropdown(null); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-[#1e222d] transition-colors ${currentChartType === type.name ? 'text-blue-500 bg-blue-500/5' : 'text-gray-300'}`}
                                >
                                    <type.icon className="w-4 h-4" />
                                    {type.name}
                                </button>
                            ))}
                        </Dropdown>
                    </div>

                    <span className="text-white/10 mx-1 font-thin">|</span>

                    {/* Actions */}
                    <button className="px-3 h-7 text-[10px] font-bold text-blue-500 uppercase hover:bg-white/5 rounded transition-colors">
                        Hide Navbar
                    </button>

                    <span className="text-white/10 mx-1 font-thin">|</span>

                    <button className="px-3 h-7 text-[10px] font-bold text-orange-400 uppercase hover:bg-white/5 rounded transition-colors whitespace-nowrap">
                        New Layout
                    </button>

                    <span className="text-white/10 mx-1 font-thin">|</span>

                    {/* Indicators Modal Trigger */}
                    <button
                        onClick={() => setIsIndicatorsModalOpen(true)}
                        className="flex items-center gap-2 px-3 h-7 text-[10px] font-bold text-sky-400 uppercase hover:bg-white/5 rounded transition-colors"
                    >
                        <EyeOff className="w-3.5 h-3.5" />
                        Indicators
                    </button>

                    <span className="text-white/10 mx-1 font-thin">|</span>

                    <div className="flex items-center">
                        <button className="p-1.5 h-7 hover:bg-white/5 rounded transition-colors text-gray-600 hover:text-white">
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 h-7 hover:bg-white/5 rounded transition-colors text-gray-600 hover:text-white">
                            <Redo2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right side sub-toolbar items */}
                <div className="flex items-center gap-1 pr-1">
                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-tighter mr-3">
                        eur-7g7p2asq -
                        <ChevronDown className="w-3 h-3 text-gray-600 inline ml-1" />
                    </span>

                    <div className="flex items-center border-l border-white/10 ml-2 pl-2 gap-1 text-gray-500">
                        <button className="p-1.5 hover:text-white"><Search className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:text-white"><Target className="w-4 h-4" /></button>

                        {/* Camera/Snapshot Dropdown Trigger */}
                        <div className="relative">
                            <button
                                className={`p-1.5 hover:text-white rounded transition-colors ${activeDropdown === 'camera' ? 'bg-white/5 text-white' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(activeDropdown === 'camera' ? null : 'camera');
                                }}
                            >
                                <Camera className="w-4 h-4" />
                            </button>

                            <Dropdown id="camera">
                                <div className="px-3 py-1 pb-2 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Chart Snapshot</div>
                                {[
                                    { name: 'Download Image', icon: Download, shortcut: 'Ctrl + Alt + S' },
                                    { name: 'Copy Image', icon: Copy, shortcut: 'Ctrl + Shift + S' },
                                    { name: 'Copy Link', icon: LinkIcon, shortcut: 'Alt + S' },
                                    { name: 'Open in new tab', icon: ExternalLink },
                                    { name: 'Tweet Image', icon: X }
                                ].map(action => (
                                    <button
                                        key={action.name}
                                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-[#1e222d] transition-colors text-gray-300 text-sm group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <action.icon className="w-4 h-4 text-gray-500 group-hover:text-white" />
                                            <span>{action.name}</span>
                                        </div>
                                        {action.shortcut && <span className="text-[10px] text-gray-600">{action.shortcut}</span>}
                                    </button>
                                ))}
                            </Dropdown>
                        </div>

                        <div className="w-px h-4 bg-white/5 mx-1" />
                        <button className="flex items-center gap-1.5 px-3 h-[24px] bg-[#1a1a1b] hover:bg-white/10 rounded text-blue-400 font-bold transition-all text-[10px] uppercase border border-white/5">
                            <Code2 className="w-3.5 h-3.5" />
                            Editor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReplayHeader;
