import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode, CandlestickSeries, BarSeries, LineSeries, AreaSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import api from '../../lib/axios';
import { useReplayStore } from '../../store/useReplayStore';

interface ChartContainerProps {
    id?: string;
    symbol?: string;
    timeframe?: string;
    broker?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ id, symbol = 'EURUSD', timeframe = '1m', broker = 'OANDA' }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<SeriesType> | null>(null);

    // Store selectors
    const isReplayActive = useReplayStore((state) => state.isActive);
    const currentCandleIndex = useReplayStore((state) => state.currentCandleIndex);
    const chartType = useReplayStore((state) => state.chartType);
    const storeTimeframe = useReplayStore((state) => state.timeframe);

    const chartConfig = useReplayStore((state) =>
        id ? state.charts.find(c => c.id === id) : null
    );
    const activeChartId = useReplayStore((state) => state.activeChartId);
    const setActiveChart = useReplayStore((state) => state.setActiveChart);

    const activeSymbol = chartConfig?.symbol || symbol;
    const activeTimeframe = isReplayActive ? (chartConfig?.timeframe || storeTimeframe) : (timeframe || '1m');

    const [lastCandle, setLastCandle] = useState<any>(null);
    const [isDataEmpty, setIsDataEmpty] = useState(false);
    const fullDataRef = useRef<any[]>([]);

    // Initialize Chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const container = chartContainerRef.current;
        const chart = createChart(container, {
            layout: {
                background: { color: '#000000' },
                textColor: '#707070',
                fontSize: 10,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.1)', style: 2 },
                horzLines: { color: 'rgba(42, 46, 57, 0.1)', style: 2 },
            },
            width: container.clientWidth || 800,
            height: container.clientHeight || 500,
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    color: '#4a4a4a',
                    width: 1,
                    style: 2,
                    labelBackgroundColor: '#1e222d',
                },
                horzLine: {
                    color: '#494949',
                    width: 1,
                    style: 2,
                    labelBackgroundColor: '#1e222d',
                },
            },
            timeScale: {
                borderColor: '#1e222d',
                timeVisible: true,
                secondsVisible: false,
                barSpacing: 6,
                rightOffset: 12,
                fixLeftEdge: true,
            },
            rightPriceScale: {
                borderColor: '#1e222d',
                autoScale: true,
                alignLabels: true,
                borderVisible: true,
            },
        });

        // Add crosshair move listener for OHLC updates
        chart.subscribeCrosshairMove((param) => {
            if (param.time && param.seriesData.size > 0 && seriesRef.current) {
                const data = param.seriesData.get(seriesRef.current);
                if (data) setLastCandle(data);
            } else if (fullDataRef.current.length > 0) {
                // Return to last actual candle when not hovering
                const last = isReplayActive
                    ? fullDataRef.current[Math.min(currentCandleIndex, fullDataRef.current.length - 1)]
                    : fullDataRef.current[fullDataRef.current.length - 1];
                setLastCandle(last);
            }
        });

        chartRef.current = chart;

        // Resize observer
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
            seriesRef.current = null;
        };
    }, []);

    // Handle Chart Type Switching (Series Lifecycle)
    useEffect(() => {
        if (!chartRef.current) return;

        const chart = chartRef.current;
        if (seriesRef.current) {
            try {
                chart.removeSeries(seriesRef.current);
            } catch (e) {
                console.warn('Failed to remove series:', e);
            }
            seriesRef.current = null;
        }

        let series: ISeriesApi<SeriesType>;

        const upColor = '#089981'; // Vibrant Green
        const downColor = '#f23645'; // Vibrant Red

        switch (chartType) {
            case 'Bars':
                series = chart.addSeries(BarSeries, {
                    upColor: upColor,
                    downColor: downColor,
                });
                break;
            case 'Line':
                series = chart.addSeries(LineSeries, {
                    color: '#2962ff',
                    lineWidth: 2,
                });
                break;
            case 'Area':
                series = chart.addSeries(AreaSeries, {
                    topColor: 'rgba(41, 98, 255, 0.28)',
                    bottomColor: 'rgba(41, 98, 255, 0.05)',
                    lineColor: '#2962ff',
                    lineWidth: 2,
                });
                break;
            case 'Candles':
            case 'Hollow candles':
            default:
                series = chart.addSeries(CandlestickSeries, {
                    upColor: upColor,
                    downColor: downColor,
                    borderVisible: false,
                    wickUpColor: upColor,
                    wickDownColor: downColor,
                });
                break;
        }

        seriesRef.current = series;

        // Apply initial data if available
        if (fullDataRef.current.length > 0) {
            const dataToSet = isReplayActive
                ? fullDataRef.current.slice(0, currentCandleIndex + 1)
                : fullDataRef.current;

            if (dataToSet.length > 0) {
                series.setData(dataToSet);
                setLastCandle(dataToSet[dataToSet.length - 1]);
            }
        }
    }, [chartType]); // ONLY depend on chartType

    // Fetch Data
    // const setTotalCandles = useReplayStore((state) => state.setTotalCandles);
    const speed = useReplayStore((state) => state.speed);
    const nextTick = useReplayStore((state) => state.nextTick);
    const isPlaying = useReplayStore((state) => state.isPlaying);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get(`/market/candles?symbol=${activeSymbol}&timeframe=${activeTimeframe}`);
                const formattedData = data.map((d: any) => ({
                    time: d.time,
                    open: d.open,
                    high: d.high,
                    low: d.low,
                    close: d.close
                })).sort((a: any, b: any) => a.time - b.time);

                fullDataRef.current = formattedData;
                // Only set total candles if this is the active/main chart? 
                // Or let each chart have its own total? 1m has more than 1h.
                // For now, let it be shared but it might cause issues.
                // setTotalCandles(formattedData.length); 

                if (seriesRef.current) {
                    if (isReplayActive) {
                        seriesRef.current.setData(formattedData.slice(0, currentCandleIndex + 1));
                    } else {
                        seriesRef.current.setData(formattedData);
                    }
                }

                if (formattedData.length > 0) {
                    setLastCandle(formattedData[isReplayActive ? Math.min(currentCandleIndex, formattedData.length - 1) : formattedData.length - 1]);
                    setIsDataEmpty(false);
                } else {
                    fullDataRef.current = [];
                    if (seriesRef.current) seriesRef.current.setData([]);
                    setLastCandle(null);
                    setIsDataEmpty(true);
                }

            } catch (error) {
                console.error('Error fetching candles:', error);
                setIsDataEmpty(true);
            }
        };

        fetchData();
    }, [activeSymbol, activeTimeframe, isReplayActive, currentCandleIndex]);

    // Playback Loop
    useEffect(() => {
        let interval: any;
        if (isReplayActive && isPlaying) {
            // speed is ticks per second. So interval is 1000 / speed.
            const ms = 1000 / speed;
            interval = setInterval(() => {
                nextTick();
            }, ms);
        }
        return () => clearInterval(interval);
    }, [isReplayActive, isPlaying, speed, nextTick]);

    // Update chart when replay mode or index changes
    useEffect(() => {
        if (fullDataRef.current.length > 0 && seriesRef.current) {
            const candlesToShow = isReplayActive
                ? fullDataRef.current.slice(0, currentCandleIndex + 1)
                : fullDataRef.current;

            if (candlesToShow.length > 0) {
                seriesRef.current.setData(candlesToShow);
                setLastCandle(candlesToShow[candlesToShow.length - 1]);
            }
        }
    }, [currentCandleIndex, isReplayActive]);

    const priceChange = lastCandle ? lastCandle.close - lastCandle.open : 0;
    const priceChangePct = lastCandle ? (priceChange / lastCandle.open) * 100 : 0;
    const isUp = priceChange >= 0;

    return (
        <div
            ref={chartContainerRef}
            onClick={() => id && setActiveChart(id)}
            className={`w-full h-full relative group transition-colors duration-200 bg-[#030303] ${id && activeChartId === id ? 'ring-1 ring-blue-500/50 z-20' : 'z-0'}`}
        >
            {/* HUDIFX Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <span className="text-[120px] font-black text-white/[0.03] select-none tracking-tighter">
                    HUDIFX
                </span>
            </div>

            {/* No Data Overlay */}
            {isDataEmpty && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50 backdrop-blur-sm">
                    <div className="text-center">
                        <p className="text-white font-bold text-lg mb-2">No Data Available</p>
                        <p className="text-gray-400 text-xs">Target: {activeSymbol} ({activeTimeframe})</p>
                        <p className="text-gray-500 text-[10px] mt-2">Try refreshing or changing symbol</p>
                    </div>
                </div>
            )}

            {/* Top-Left Chart Info Overlay - Status Line */}
            <div className="absolute top-2 left-2 z-20 flex items-center gap-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/5 pointer-events-none select-none">
                <div className="flex items-center gap-2">
                    <span className={`text-[12px] font-bold uppercase tracking-tight ${id && activeChartId === id ? 'text-blue-400' : 'text-gray-200'}`}>
                        {activeSymbol} · {activeTimeframe} · {broker} on HUDIFX
                    </span>
                    <span className="text-gray-600 text-[11px] font-light">|</span>
                </div>

                <div className="flex items-center gap-3.5 text-[11px] font-medium tracking-tight">
                    <div className="flex gap-1"><span className="text-gray-500 font-normal">O</span> <span className={isUp ? "text-[#089981]" : "text-[#f23645]"}>{lastCandle?.open?.toFixed(5) || '0.00000'}</span></div>
                    <div className="flex gap-1"><span className="text-gray-500 font-normal">H</span> <span className={isUp ? "text-[#089981]" : "text-[#f23645]"}>{lastCandle?.high?.toFixed(5) || '0.00000'}</span></div>
                    <div className="flex gap-1"><span className="text-gray-500 font-normal">L</span> <span className={isUp ? "text-[#089981]" : "text-[#f23645]"}>{lastCandle?.low?.toFixed(5) || '0.00000'}</span></div>
                    <div className="flex gap-1"><span className="text-gray-500 font-normal">C</span> <span className={isUp ? "text-[#089981]" : "text-[#f23645]"}>{lastCandle?.close?.toFixed(5) || '0.00000'}</span></div>

                    <div className={`flex gap-1.5 font-bold ${isUp ? "text-[#089981]" : "text-[#f23645]"}`}>
                        <span>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(5)}</span>
                        <span>({priceChangePct >= 0 ? '+' : ''}{priceChangePct.toFixed(2)}%)</span>
                    </div>
                </div>
            </div>

            {/* Price Scale Plus Button (Simulated) */}
            <div className="absolute right-0 top-[40%] -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-5 h-6 bg-[#1e222d] border border-white/10 rounded-l-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-blue-600 transition-all shadow-lg">
                    <span className="text-sm font-bold leading-none">+</span>
                </button>
            </div>

            {/* Price Scale Label (Hover effect mock) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-blue-600 text-white text-[10px] font-bold px-1 py-0.5 rounded-l shadow-lg">
                    {lastCandle?.close?.toFixed(5) || '0.00000'}
                </div>
            </div>
        </div>
    );
};

export default ChartContainer;
