import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { translations } from '../../locales/translations';
import {
    Swords,
    ChevronDown,
    ArrowRight,
    ArrowUpRight,
    Play
} from 'lucide-react';

const BacktestPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { currentLanguage, setLanguage } = useLanguageStore();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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
                            <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{t.header.features}</Link>
                            <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{t.header.resources}</Link>
                            <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                <Swords className="w-4 h-4 text-orange-500" /> {t.header.battles}
                            </Link>
                            <Link to="/pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                {t.header.pricing}
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative" onMouseEnter={() => setActiveDropdown('language')}>
                            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                                <span className="text-base">{getFlag(currentLanguage)}</span>
                                {currentLanguage}
                                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'language' ? 'rotate-180' : ''}`} />
                            </button>
                            {activeDropdown === 'language' && (
                                <div className="absolute top-full mt-2 right-0 w-24 bg-[#0f141c] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                                    {['EN', 'ES', 'FR', 'DE', 'RU', 'BR'].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => { setLanguage(lang as any); setActiveDropdown(null); }}
                                            className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors ${currentLanguage === lang ? 'bg-white/5' : ''}`}
                                        >
                                            <span className="text-base">{getFlag(lang as any)}</span>
                                            <span className={`text-[11px] font-bold ${currentLanguage === lang ? 'text-white' : 'text-gray-500'}`}>{lang}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {user ? (
                            <button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">{t.header.dashboard}</button>
                        ) : (
                            <button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">{t.header.tryNow}</button>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-left">
                        <div className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">BACKTEST</div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-[1.1]">
                            Streamline your backtesting <br />
                            <span className="text-white">with HudiFx</span>
                        </h1>
                        <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
                            Unlock a suite of features designed to streamline and enhance your backtesting process. At HudiFx, we empower traders like you to analyze, refine, and optimize your strategies with ease. Explore our comprehensive tools tailored for efficient, accurate, and insightful backtesting.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                            Get started for free
                        </button>
                    </div>

                    {/* Right Visual Grid (Mockup of the app UI bits) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            {/* Go-to price item */}
                            <div className="bg-[#121821] border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-colors">
                                <span className="text-xs font-medium text-gray-400">Go-to price</span>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <div className="bg-[#121821] border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-colors">
                                <span className="text-xs font-medium text-gray-400">Go-to next session</span>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <div className="bg-[#121821] border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-colors">
                                <span className="text-xs font-medium text-gray-400">Go-to next day open</span>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-500 transition-colors" />
                            </div>

                            {/* Trading Buttons */}
                            <div className="bg-[#121821] border border-white/5 p-6 rounded-2xl flex flex-col gap-3">
                                <button className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><ArrowUpRight className="w-3 h-3 text-emerald-900 stroke-[3]" /></div> Buy
                                </button>
                                <button className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                                    <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center rotate-90"><ArrowUpRight className="w-3 h-3 text-rose-900 stroke-[3]" /></div> Sell
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 pt-8">
                            {/* Symbol Search */}
                            <div className="bg-[#121821] border border-white/5 p-4 rounded-2xl">
                                <div className="text-[10px] font-bold text-gray-500 mb-3 ml-2 uppercase tracking-widest">Forex</div>
                                <div className="space-y-2">
                                    <SymbolItem active symbol="EUR/USD" />
                                    <SymbolItem symbol="USD/JPY" />
                                    <SymbolItem symbol="GBP/USD" />
                                    <SymbolItem symbol="USD/CHF" />
                                </div>
                            </div>

                            {/* Order Details Preview */}
                            <div className="bg-[#121821] border border-white/5 p-4 rounded-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Create new order</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-500">Estimated Loss</span>
                                        <span className="text-red-500">-$12.50</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-[30%] h-full bg-blue-500" />
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 5, 10].map(v => (
                                            <div key={v} className="flex-1 bg-white/5 py-1 rounded text-[8px] font-bold text-gray-500 text-center">{v}%</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Float Help Button */}
            <div className="fixed bottom-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                <span className="text-lg font-bold">?</span>
            </div>
        </div>
    );
};

const SymbolItem = ({ symbol, active = false }: { symbol: string, active?: boolean }) => (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-sm border ${active ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'} flex items-center justify-center`}>
                {active && <CheckIcon />}
            </div>
            <span className={`text-xs font-bold ${active ? 'text-white' : 'text-gray-400'}`}>{symbol}</span>
        </div>
    </div>
);

const CheckIcon = () => (
    <svg className="w-3 h-3 text-[#0a0e14] stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

export default BacktestPage;
