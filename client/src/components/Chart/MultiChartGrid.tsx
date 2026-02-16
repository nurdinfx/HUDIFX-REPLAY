import { useReplayStore } from '../../store/useReplayStore';
import ChartContainer from './ChartContainer';

const MultiChartGrid = () => {
    const layout = useReplayStore((state) => state.layout);
    const charts = useReplayStore((state) => state.charts);

    const renderGrid = () => {
        switch (layout) {
            case '2-v':
                return (
                    <div className="grid grid-cols-2 h-full gap-[1px] bg-white/5">
                        {charts.slice(0, 2).map((config) => (
                            <ChartContainer key={config.id} id={config.id} />
                        ))}
                    </div>
                );
            case '2-h':
                return (
                    <div className="grid grid-rows-2 h-full gap-[1px] bg-white/5">
                        {charts.slice(0, 2).map((config) => (
                            <ChartContainer key={config.id} id={config.id} />
                        ))}
                    </div>
                );
            case '3':
                return (
                    <div className="grid grid-cols-2 grid-rows-2 h-full gap-[1px] bg-white/5">
                        <div className="row-span-2">
                            <ChartContainer id={charts[0].id} />
                        </div>
                        <ChartContainer id={charts[1].id} />
                        <ChartContainer id={charts[2].id} />
                    </div>
                );
            case '4':
                return (
                    <div className="grid grid-cols-2 grid-rows-2 h-full gap-[1px] bg-white/5">
                        {charts.slice(0, 4).map((config) => (
                            <ChartContainer key={config.id} id={config.id} />
                        ))}
                    </div>
                );
            case '1':
            default:
                return <ChartContainer id={charts[0]?.id || 'main'} />;
        }
    };

    return <div className="w-full h-full bg-[#010101]">{renderGrid()}</div>;
};

export default MultiChartGrid;
