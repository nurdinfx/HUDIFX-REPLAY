import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../locales/translations';
import {
    ChevronDown,
    Swords,
    TrendingUp,
    Clock,
    BarChart3,
    BrainCircuit,
    ArrowRight,
    Play,
    Sparkles,
    Book,
    Medal,
    LineChart,
    Database,
    Code,
    Mic,
    Headphones,
    Compass,
    Calendar
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { currentLanguage, setLanguage } = useLanguageStore();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Translation helper
    const t = translations[currentLanguage];

    return (
        <div className="min-h-screen bg-[#0a0e14] text-white font-sans selection:bg-blue-500/30">
            {/* Header */}
            <header
                className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0e14]/80 backdrop-blur-md"
                onMouseLeave={() => setActiveDropdown(null)}
            >
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-1 group">
                            <span className="text-xl font-black tracking-tighter flex items-center">
                                HUDI
                                <span className="text-blue-500 transform -skew-x-12 inline-block ml-0.5">F</span>
                                X
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 h-16">
                            <div
                                className="relative h-full flex items-center"
                                onMouseEnter={() => setActiveDropdown('features')}
                            >
                                <button className={`text-sm font-medium ${activeDropdown === 'features' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors flex items-center gap-1 group py-5`}>
                                    {t.header.features} <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
                                </button>

                                {activeDropdown === 'features' && (
                                    <div className="absolute top-16 left-0 w-[600px] bg-[#0f141c] border border-white/10 rounded-2xl shadow-2xl p-6 grid grid-cols-[200px_1fr] gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* Left Card */}
                                        <div
                                            onClick={() => navigate('/features/backtest')}
                                            className="bg-gradient-to-br from-blue-600/20 to-blue-900/40 rounded-xl overflow-hidden border border-blue-500/20 flex flex-col p-4 relative group/card cursor-pointer"
                                        >
                                            <div className="text-[10px] font-bold tracking-widest text-blue-400 mb-2 uppercase">HudiFx</div>
                                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                                <div className="p-3 bg-blue-600 rounded-full mb-3 shadow-lg shadow-blue-600/20 group-hover/card:scale-110 transition-transform">
                                                    <Medal className="w-6 h-6 text-white" />
                                                </div>
                                                <h4 className="text-sm font-bold mb-3 leading-tight">Prop Firm Simulator</h4>
                                                <button className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full font-bold transition-colors">
                                                    Now in app
                                                </button>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center group-hover/card:text-blue-400 transition-colors">
                                                <span className="text-xs font-bold">{t.header.tryNow}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                            {/* Decoration */}
                                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                                        </div>

                                        {/* Right Grid */}
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                            <DropdownItem
                                                onClick={() => navigate('/features/backtest')}
                                                icon={<Play className="w-4 h-4 text-blue-500" />}
                                                title="Backtest"
                                                desc="Train and trade with confidence."
                                            />
                                            <DropdownItem icon={<LineChart className="w-4 h-4 text-emerald-500" />} title="Indicators" desc="Real metrics. Real growth." />
                                            <DropdownItem icon={<Sparkles className="w-4 h-4 text-purple-500" />} title="Mentor AI" desc="Refine decisions. Level up execution." />
                                            <DropdownItem icon={<Database className="w-4 h-4 text-blue-400" />} title="Assets" desc="Validate your edge in any market." />
                                            <DropdownItem icon={<Book className="w-4 h-4 text-amber-500" />} title="Journal" desc="Journal like a pro. Trade like one too." />
                                            <DropdownItem icon={<div className="flex items-center gap-1.5"><Code className="w-4 h-4 text-blue-500" /><span className="text-[8px] bg-blue-500/20 text-blue-400 px-1 rounded font-bold">BETA</span></div>} title="FXR Script" desc="Custom indicators, built for HudiFx." />
                                            <DropdownItem icon={<Medal className="w-4 h-4 text-indigo-500" />} title="Prop Firm Simulator" desc="Simulated challenges that feel real." />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div
                                className="relative h-full flex items-center"
                                onMouseEnter={() => setActiveDropdown('resources')}
                            >
                                <button className={`text-sm font-medium ${activeDropdown === 'resources' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors flex items-center gap-1 group py-5`}>
                                    {t.header.resources} <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                                </button>

                                {activeDropdown === 'resources' && (
                                    <div className="absolute top-16 left-0 w-[600px] bg-[#0f141c] border border-white/10 rounded-2xl shadow-2xl p-6 grid grid-cols-[200px_1fr] gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* Left Card */}
                                        <div className="bg-[#161d28] rounded-xl overflow-hidden border border-white/5 p-4 flex flex-col group/card">
                                            <p className="text-sm font-bold mb-4 leading-tight">What successful traders track daily in their journals</p>
                                            <div className="flex-1 bg-slate-900 rounded-lg p-3 flex flex-col gap-2 relative">
                                                <div className="w-full h-2 bg-white/5 rounded" />
                                                <div className="w-2/3 h-2 bg-blue-500/30 rounded" />
                                                <div className="w-full h-8 bg-gradient-to-r from-emerald-500/10 to-transparent rounded mt-2 border-l border-emerald-500/50" />
                                            </div>
                                            <div className="mt-4 text-xs font-bold text-gray-500 group-hover/card:text-white transition-colors">
                                                What Successful Traders Track...
                                            </div>
                                        </div>

                                        {/* Right Grid */}
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                            <DropdownItem icon={<Book className="w-4 h-4 text-blue-500" />} title="Education" desc="Educational content for better trading." />
                                            <DropdownItem icon={<Compass className="w-4 h-4 text-blue-400" />} title="Trading Strategies" desc="Exclusive access to proven strategies." />
                                            <DropdownItem icon={<Mic className="w-4 h-4 text-emerald-500" />} title="Podcast" desc="Expert insights from pro traders." />
                                            <DropdownItem icon={<Calendar className="w-4 h-4 text-indigo-500" />} title="Events" desc="Demos, contests, and live backtesting." />
                                            <DropdownItem icon={<Headphones className="w-4 h-4 text-blue-500" />} title="Support" desc="Get help and access FAQs." />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                <Swords className="w-4 h-4 text-orange-500" /> {t.header.battles}
                            </button>
                            <button
                                onClick={() => navigate('/pricing')}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                            >
                                {t.header.pricing}
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('language')}
                        >
                            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                                <span className="text-base">{getFlag(currentLanguage)}</span>
                                {currentLanguage}
                                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'language' ? 'rotate-180' : ''}`} />
                            </button>

                            {activeDropdown === 'language' && (
                                <div className="absolute top-full mt-2 right-0 w-24 bg-[#0f141c] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150">
                                    {['EN', 'ES', 'FR', 'DE', 'RU', 'BR'].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setLanguage(lang as any);
                                                setActiveDropdown(null);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors ${currentLanguage === lang ? 'bg-white/5' : ''}`}
                                        >
                                            <span className="text-base">{getFlag(lang as any)}</span>
                                            <span className={`text-[11px] font-bold ${currentLanguage === lang ? 'text-white' : 'text-gray-500'}`}>{lang}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="hidden lg:block text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            {t.header.earn}
                        </button>
                        {user ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                            >
                                {t.header.dashboard}
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                            >
                                {t.header.tryNow}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-40 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Announcement Banner */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-12 hover:bg-blue-500/20 transition-colors cursor-pointer group">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        {t.hero.banner}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                        {t.hero.headline} <br />
                        <span className="text-white/60">{t.hero.headlineSub}</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        {t.hero.subheadline}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col items-center gap-6">
                        {user ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-bold transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.4)] active:scale-95"
                            >
                                {t.hero.goDashboard}
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-bold transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.4)] active:scale-95"
                            >
                                {t.hero.getStarted}
                            </button>
                        )}
                        {!user && (
                            <p className="text-gray-500 text-sm">
                                {t.hero.noCreditCard}
                            </p>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="max-w-7xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        icon={<TrendingUp className="w-6 h-6 text-green-500" />}
                        title="Know your strategy works before risking a dime"
                        visual={<div className="h-32 bg-slate-900/50 rounded-lg border border-white/5 mt-4 overflow-hidden">
                            <div className="w-full h-full flex items-end px-4 gap-1">
                                {[30, 45, 60, 40, 70, 85, 65, 90].map((h, i) => (
                                    <div key={i} className="flex-1 bg-green-500/20 border-t-2 border-green-500" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>}
                    />
                    <FeatureCard
                        icon={<Clock className="w-6 h-6 text-blue-500" />}
                        title="Compress a decade of screen time into hours"
                        visual={<div className="h-32 bg-slate-900/50 rounded-lg border border-white/5 mt-4 p-4 flex flex-col justify-center">
                            <div className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Time invested
                            </div>
                            <div className="text-2xl font-bold">1d 15 hrs</div>
                            <div className="text-xs text-gray-500 mt-2">@ Historical time replayed</div>
                        </div>}
                    />
                    <FeatureCard
                        icon={<BarChart3 className="w-6 h-6 text-teal-500" />}
                        title="Every mistake becomes a data-backed lesson"
                        visual={<div className="h-32 bg-slate-900/50 rounded-lg border border-white/5 mt-4 p-4 flex items-end justify-between">
                            {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8].map((v, i) => (
                                <div key={i} className="w-4 bg-teal-500/40 rounded-t" style={{ height: `${v * 100}%` }} />
                            ))}
                        </div>}
                    />
                    <FeatureCard
                        icon={<BrainCircuit className="w-6 h-6 text-purple-500" />}
                        title="Train your emotions not just your entries"
                        visual={<div className="h-32 bg-slate-900/50 rounded-lg border border-white/5 mt-4 p-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs text-gray-400">Confidence level</span>
                                <span className="text-xs text-blue-400">90%</span>
                            </div>
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="w-[90%] h-full bg-blue-500" />
                            </div>
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-6">
                                <div className="w-[40%] h-full bg-blue-500 opacity-30" />
                            </div>
                        </div>}
                    />
                </div>
            </main>
        </div>
    );
};

const DropdownItem = ({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick?: () => void }) => (
    <button onClick={onClick} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all text-left group">
        <div className="p-2.5 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
            {icon}
        </div>
        <div>
            <h5 className="text-sm font-bold mb-0.5">{title}</h5>
            <p className="text-[11px] text-gray-500 leading-tight">{desc}</p>
        </div>
    </button>
);

const FeatureCard = ({ icon, title, visual }: { icon: React.ReactNode, title: string, visual: React.ReactNode }) => (
    <div className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 transition-colors group text-left">
        <div className="mb-6 group-hover:scale-110 transition-transform origin-left">{icon}</div>
        <h3 className="text-lg font-semibold leading-snug mb-4">{title}</h3>
        {visual}
    </div>
);

const getFlag = (lang: string) => {
    switch (lang) {
        case 'EN': return '🇬🇧';
        case 'ES': return '🇪🇸';
        case 'FR': return '🇫🇷';
        case 'DE': return '🇩🇪';
        case 'RU': return '🇷🇺';
        case 'BR': return '🇧🇷';
        default: return '🇬🇧';
    }
};

export default LandingPage;
