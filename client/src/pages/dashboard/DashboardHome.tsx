import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Trophy,
    Filter,
    Search,
    LayoutDashboard,
    History,
    TrendingUp,
    BarChart2,
    MoreVertical,
    Play,
    ChevronDown
} from 'lucide-react';
import api from '../../lib/axios';
import SessionCard from '../../components/Dashboard/SessionCard';
import CreateSessionModal from '../../components/Dashboard/CreateSessionModal';

const DashboardHome = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [sessions, setSessions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState({
        timeInvested: '1h 59min',
        historicalTime: '1mo 9d 4hr',
        tradesTaken: 0,
        winRate: 0
    });

    const fetchDashboardData = async () => {
        try {
            const [sessionsRes, statsRes] = await Promise.all([
                api.get('/replay/all'),
                api.get('/trades/stats')
            ]);
            setSessions(sessionsRes.data);
            if (statsRes.data) {
                setStats(prev => ({
                    ...prev,
                    tradesTaken: statsRes.data.totalTrades || 0,
                    winRate: Math.round(statsRes.data.winRate || 0)
                }));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleCreateSession = async (sessionData: any) => {
        try {
            const response = await api.post('/replay', sessionData);
            if (response.data) {
                setIsModalOpen(false);
                fetchDashboardData(); // Refresh list
                const sessionId = response.data._id || response.data.id;
                if (sessionId) {
                    navigate(`/dashboard/session/${sessionId}`);
                }
            }
        } catch (error) {
            console.error('Error creating session:', error);
            alert('Failed to create session. Please check your connection.');
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const tabs = ['Dashboard', 'Sessions', 'Trades', 'Analytics'];

    return (
        <div className="p-8">
            {/* Header Title & Tabs */}
            <div className="flex flex-col gap-6 mb-8">
                <h1 className="text-3xl font-bold text-white">Testing</h1>
                <div className="flex items-center gap-8 border-b border-white/5">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <div className="flex items-center gap-2">
                                {tab === 'Dashboard' && <LayoutDashboard className="w-4 h-4" />}
                                {tab === 'Sessions' && <History className="w-4 h-4" />}
                                {tab === 'Trades' && <TrendingUp className="w-4 h-4" />}
                                {tab === 'Analytics' && <BarChart2 className="w-4 h-4" />}
                                {tab}
                            </div>
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Beginner Plan Banner */}
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-3 flex items-center justify-center gap-3 mb-10 text-xs font-medium text-blue-400">
                <span>Sessions on the Beginner plan are hidden after 1 week. Upgrade to Pro to unlock all your past sessions.</span>
                <button className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-white font-bold transition-colors">
                    <Plus className="w-3 h-3" /> Upgrade
                </button>
            </div>

            {activeTab === 'Dashboard' && (
                <>
                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <ActionCard
                            icon={<Plus className="w-5 h-5 text-white" />}
                            title="Backtesting session"
                            desc="Start a session"
                            bg="bg-blue-600/10 border-blue-500/30"
                            iconBg="bg-blue-600"
                            onClick={() => setIsModalOpen(true)}
                        />
                        <ActionCard
                            icon={<Trophy className="w-5 h-5 text-blue-400" />}
                            title="Prop firm session"
                            desc="Start a challenge"
                        />
                        <ActionCard
                            icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
                            title="Tutorials"
                            desc="Learn more"
                        />
                    </div>

                    {/* Performance Section */}
                    <div className="mb-16">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Performance</h2>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0f141c] border border-white/5 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-colors">
                                    <Play className="w-3 h-3 text-blue-500" /> Backtesting <ChevronDown className="w-3 h-3" />
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0f141c] border border-white/5 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-colors">
                                    Lifetime <ChevronDown className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <DashboardStatCard
                                title="Time Invested"
                                value={stats.timeInvested}
                                icon={<TrendingUp className="w-4 h-4 text-gray-600" />}
                            />
                            <DashboardStatCard
                                title="Historical time replayed"
                                value={stats.historicalTime}
                                icon={<History className="w-4 h-4 text-gray-600" />}
                            />
                            <DashboardStatCard
                                title="Trades taken"
                                value={stats.tradesTaken.toString()}
                                subValue="80% buys • 20% sells"
                                progress={80}
                                icon={<TrendingUp className="w-4 h-4 text-gray-600" />}
                            />
                            <DashboardStatCard
                                title="Overall win rate"
                                value={`${stats.winRate}%`}
                                icon={<BarChart2 className="w-4 h-4 text-gray-600" />}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-[#0f141c] border border-white/5 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-sm font-bold text-white">Time Invested</h3>
                                    <button className="text-gray-500 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                                <div className="h-48 flex items-end gap-2 px-2">
                                    {[20, 40, 60, 30, 80, 50, 90, 45, 70, 60, 85].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gradient-to-t from-amber-500/20 to-amber-500/80 rounded-t-sm" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                                <div className="mt-4 text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">Feb 2026</div>
                            </div>
                            <div className="bg-[#0f141c] border border-white/5 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-sm font-bold text-white">Win Rate</h3>
                                    <button className="text-gray-500 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                                <div className="h-48 flex items-end justify-center px-10">
                                    <div className="w-full bg-blue-500 rounded-lg group relative" style={{ height: `${stats.winRate}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
                                            {stats.winRate}% Win Rate
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">Overall</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick view of sessions */}
                    <div className="mb-20">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-white">Recent Sessions</h2>
                            <button onClick={() => setActiveTab('Sessions')} className="text-sm font-bold text-blue-500 hover:underline">View all</button>
                        </div>
                        <div className="space-y-4">
                            {sessions.slice(0, 3).map((session: any) => (
                                <SessionCard key={session._id} session={session} />
                            ))}
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'Sessions' && (
                <div className="mb-20">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white">All Sessions</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-500">{sessions.length} out of {sessions.length} sessions</span>
                            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-8">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search Here"
                                className="w-full bg-[#0f141c] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                        <button className="p-3 bg-[#0f141c] border border-white/5 rounded-xl text-gray-500 hover:text-white transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {sessions.map((session: any) => (
                            <SessionCard key={session._id} session={session} />
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'Trades' && (
                <div className="mb-20">
                    <h2 className="text-xl font-bold text-white mb-8">Recorded Trades</h2>
                    <div className="bg-[#0f141c] border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                                    <th className="px-6 py-4">Symbol</th>
                                    <th className="px-6 py-4">Direction</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Profit/Loss</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold">EURUSD</td>
                                    <td className="px-6 py-4 text-emerald-500">BUY</td>
                                    <td className="px-6 py-4"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-black">PROFIT</span></td>
                                    <td className="px-6 py-4 text-emerald-500">+$124.50</td>
                                    <td className="px-6 py-4 text-gray-500">14 Feb 2026</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold">GBPUSD</td>
                                    <td className="px-6 py-4 text-rose-500">SELL</td>
                                    <td className="px-6 py-4"><span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[10px] font-black">LOSS</span></td>
                                    <td className="px-6 py-4 text-rose-500">-$45.20</td>
                                    <td className="px-6 py-4 text-gray-500">13 Feb 2026</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors text-gray-500 italic">
                                    <td colSpan={5} className="px-6 py-8 text-center bg-white/[0.02]">More trades will appear here as you close them in your sessions.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'Analytics' && (
                <div className="space-y-8 mb-20">
                    <h2 className="text-xl font-bold text-white mb-8">Advanced Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#0f141c] border border-white/5 rounded-3xl p-8">
                            <h3 className="text-sm font-bold text-white mb-8">Equity Curve (Demo)</h3>
                            <div className="h-64 flex items-end">
                                <svg className="w-full h-full" preserveAspectRatio="none">
                                    <polyline
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="4"
                                        points="0,200 50,180 100,195 150,140 200,155 250,110 300,130 350,70 400,90 450,40 500,60"
                                        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-[#0f141c] border border-white/5 rounded-3xl p-8">
                            <h3 className="text-sm font-bold text-white mb-8">Win/Loss Distribution</h3>
                            <div className="flex items-center justify-center h-64">
                                <div className="relative w-48 h-48 rounded-full border-[12px] border-rose-500/20 flex items-center justify-center">
                                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-emerald-500 border-t-transparent border-r-transparent rotate-[45deg]" />
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-white">{stats.winRate}%</div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Success Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CreateSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateSession}
            />
        </div>
    );
};

const ActionCard = ({ icon, title, desc, onClick, bg = "bg-[#0f141c] border-white/5", iconBg = "bg-white/5" }: any) => (
    <button
        onClick={onClick}
        className={`p-6 rounded-2xl border flex items-center gap-5 transition-all text-left group hover:scale-[1.02] active:scale-[0.98] ${bg}`}
    >
        <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${iconBg}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold text-white mb-0.5">{title}</h3>
            <p className="text-sm font-medium text-gray-500">{desc}</p>
        </div>
    </button>
);

const DashboardStatCard = ({ title, value, subValue, progress, icon }: any) => (
    <div className="bg-[#0f141c] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black tracking-widest text-gray-600 uppercase">{title}</span>
            {icon}
        </div>
        <div className="text-3xl font-bold text-white mb-4">{value}</div>
        {subValue && (
            <div className="space-y-2">
                <div className="text-[10px] font-bold text-gray-500">{subValue}</div>
                {progress !== undefined && (
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
                    </div>
                )}
            </div>
        )}
    </div>
);

export default DashboardHome;
