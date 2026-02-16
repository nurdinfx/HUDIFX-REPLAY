import React, { useRef, useEffect, useState } from 'react';
import { Renderer, type Candle } from '../../chart-engine/core/Renderer';
import { SMA } from '../../chart-engine/indicators/built-in/SMA';
import { useReplayStore } from '../../store/useReplayStore';
import api from '../../lib/axios';
import { InteractionManager } from '../../chart-engine/drawings/InteractionManager';
import { TrendLine } from '../../chart-engine/drawings/active-tool/TrendLine';
import { FibonacciRetracement } from '../../chart-engine/drawings/active-tool/FibonacciRetracement';

interface CustomChartProps {
    id: string;
    symbol?: string;
    timeframe?: string;
}

export const CustomChart: React.FC<CustomChartProps> = ({ id, symbol: propSymbol, timeframe: propTimeframe }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const interactionManagerRef = useRef<InteractionManager | null>(null);
    const [candles, setCandles] = useState<Candle[]>([]);

    // Store Access
    const { charts, activeChartId, timeframe: masterTimeframe, setActiveChart } = useReplayStore();

    // Derive Config for THIS specific chart instance
    const chartConfig = charts.find(c => c.id === id);
    const activeSymbol = propSymbol || chartConfig?.symbol || 'EURUSD';
    const activeTimeframe = propTimeframe || chartConfig?.timeframe || masterTimeframe || '1m';
    const isActive = id === activeChartId;

    // 1. Initialize Renderer & Manager
    useEffect(() => {
        if (canvasRef.current && !rendererRef.current) {
            const renderer = new Renderer(canvasRef.current);
            rendererRef.current = renderer;
            interactionManagerRef.current = new InteractionManager(renderer);

            // Initial Resize
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                renderer.setSize(clientWidth, clientHeight);
                renderer.render();
            }
        }

        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            if (rendererRef.current) {
                rendererRef.current.setSize(width, height);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // 2. Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get(`/market/candles?symbol=${activeSymbol}&timeframe=${activeTimeframe}&limit=1000`);

                if (!Array.isArray(data) || data.length === 0) {
                    setCandles([]);
                    if (rendererRef.current) rendererRef.current.setData([]);
                    return;
                }

                const formattedData = data.map((d: any) => ({
                    time: d.time,
                    open: d.open,
                    high: d.high,
                    low: d.low,
                    close: d.close,
                    volume: d.volume
                })).sort((a: any, b: any) => a.time - b.time);

                setCandles(formattedData);
                if (rendererRef.current) {
                    rendererRef.current.setData(formattedData);

                    // Sample Indicator
                    rendererRef.current.clearIndicators();
                    const sma20 = new SMA(20, '#ff9800');
                    rendererRef.current.addIndicator(sma20);

                    rendererRef.current.setScroll(0);
                }
            } catch (error) {
                console.error(`Failed to fetch data for chart ${id}`, error);
            }
        };

        fetchData();
    }, [activeSymbol, activeTimeframe]);

    // 3. Handle Interactions
    const isDragging = useRef(false);
    const lastMouseX = useRef(0);

    const handleWheel = (e: React.WheelEvent) => {
        if (!rendererRef.current) return;
        const zoomSensitivity = 0.1;
        const zoomDelta = e.deltaY > 0 ? (1 - zoomSensitivity) : (1 + zoomSensitivity);
        rendererRef.current.setZoom(rendererRef.current.zoomLevel * zoomDelta);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!rendererRef.current || !interactionManagerRef.current || !containerRef.current) return;

        // Select this chart
        setActiveChart(id);

        // Delegate to Interaction Manager
        const handled = interactionManagerRef.current.handleMouseDown(e, containerRef.current.getBoundingClientRect());
        if (handled) return;

        isDragging.current = true;
        lastMouseX.current = e.clientX;
        canvasRef.current?.style.setProperty('cursor', 'grabbing');
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!rendererRef.current || !interactionManagerRef.current || !containerRef.current) return;

        const handled = interactionManagerRef.current.handleMouseMove(e, containerRef.current.getBoundingClientRect());
        if (handled) return;

        if (!isDragging.current) return;

        const deltaX = e.clientX - lastMouseX.current;
        lastMouseX.current = e.clientX;
        const candlesMoved = deltaX / rendererRef.current.zoomLevel;
        rendererRef.current.setScroll(rendererRef.current.scrollOffset + candlesMoved);
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        canvasRef.current?.style.setProperty('cursor', 'crosshair');
    };

    const handleMouseLeave = () => {
        isDragging.current = false;
        canvasRef.current?.style.setProperty('cursor', 'crosshair');
    };

    const activateTool = (toolName: string) => {
        if (!interactionManagerRef.current) return;
        if (toolName === 'TrendLine') interactionManagerRef.current.setTool(new TrendLine());
        else if (toolName === 'Fibonacci') interactionManagerRef.current.setTool(new FibonacciRetracement());
    };

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative bg-[#06080d] overflow-hidden select-none border-t border-l border-white/5 transition-all duration-200 ${isActive ? 'ring-1 ring-blue-500/50 z-10' : ''
                }`}
            onMouseDown={() => setActiveChart(id)} // Ensure clicks anywhere focus the chart
        >
            {/* Info Overlay */}
            <div className="absolute top-2 left-2 flex flex-col gap-0.5 pointer-events-none z-10">
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
                        {activeSymbol} • {activeTimeframe}
                    </span>
                    {isActive && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />}
                </div>
                <div className="text-[8px] text-gray-600 font-bold uppercase tracking-tight">
                    {candles.length} candles | FXReplay Engine
                </div>
            </div>

            {/* Local Toolbar (Only for Active Chart) */}
            {isActive && (
                <div className="absolute top-2 right-2 flex gap-1 z-20">
                    <button
                        onClick={() => activateTool('TrendLine')}
                        className="bg-[#1e222d] hover:bg-[#2a2e39] text-gray-300 text-[10px] px-2 py-0.5 rounded border border-white/5 transition-colors"
                    >
                        Line
                    </button>
                    <button
                        onClick={() => activateTool('Fibonacci')}
                        className="bg-[#1e222d] hover:bg-[#2a2e39] text-gray-300 text-[10px] px-2 py-0.5 rounded border border-white/5 transition-colors"
                    >
                        Fib
                    </button>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="block cursor-crosshair touch-none"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            />

            {/* Active Indicator */}
            {!isActive && (
                <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors cursor-pointer group" onClick={() => setActiveChart(id)}>
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Click to focus</span>
                    </div>
                </div>
            )}
        </div>
    );
};
