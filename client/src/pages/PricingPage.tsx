import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../locales/translations';
import {
    Swords,
    Check,
    ArrowRight,
    Sparkles,
    Info,
    ChevronDown
} from 'lucide-react';

const PricingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { currentLanguage, setLanguage } = useLanguageStore();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const t = translations[currentLanguage];

    const plans = {
        intermediate: {
            monthly: 19,
            yearly: 15,
            yearlyTotal: 180,
            save: '35.88'
        },
        pro: {
            monthly: 35,
            yearly: 29.16,
            yearlyTotal: 350,
            save: '70'
        }
    };

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
                            <button className="text-sm font-medium text-blue-500 transition-colors">
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
                        {user ? (
                            <button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">{t.header.dashboard}</button>
                        ) : (
                            <button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">{t.header.tryNow}</button>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-blue-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">{t.pricing.title}</div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.pricing.headline}</h1>
                    <p className="text-gray-400 text-lg mb-12">{t.pricing.subheadline}</p>

                    {/* Billing Toggle */}
                    <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10 mb-20">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#161d28] text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {t.pricing.monthly}
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-[#161d28] text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {t.pricing.yearly}
                        </button>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-32">
                        {/* Intermediate */}
                        <div className="bg-[#0f141c] border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden group">
                            <div className="text-lg font-bold mb-6">{t.pricing.intermediate}</div>
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-full py-2 px-4 text-blue-400 text-xs font-bold w-fit mx-auto mb-8 animate-pulse">
                                {t.pricing.saveYear.replace('{{amount}}', plans.intermediate.save)}
                            </div>
                            <div className="flex items-baseline justify-center gap-1 mb-2">
                                <span className="text-4xl md:text-5xl font-bold">${billingCycle === 'yearly' ? plans.intermediate.yearly : plans.intermediate.monthly}</span>
                                <span className="text-gray-500 font-bold">/ mo</span>
                            </div>
                            {billingCycle === 'yearly' && (
                                <div className="text-gray-500 text-sm mb-10">${plans.intermediate.yearlyTotal} / yearly</div>
                            )}

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold mb-4 transition-all flex items-center justify-center gap-2 group/btn">
                                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                {t.pricing.startTrial}
                            </button>
                            <p className="text-[10px] text-gray-500 italic mb-10 leading-relaxed px-4">
                                {t.pricing.flexiblePayment}
                            </p>

                            <div className="space-y-4 text-left px-4">
                                <FeatureItem active={false} text="Limited sessions" />
                                <FeatureItem active={false} text="Limited trades" />
                                <FeatureItem active={false} text="Keep sessions for 6 months" />
                                <FeatureItem active={false} text="Limited AI queries" />
                            </div>
                        </div>

                        {/* Pro */}
                        <div className="bg-[#0f141c] border-2 border-blue-500/50 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.1)]">
                            {/* Best Deal Ribbon */}
                            <div className="absolute top-6 -left-12 -rotate-45 bg-blue-600 text-white text-[10px] font-black tracking-widest px-14 py-1.5 shadow-lg">
                                {t.pricing.bestDeal}
                            </div>

                            <div className="text-lg font-bold mb-6 text-blue-400">{t.pricing.pro}</div>
                            <div className="bg-blue-600/20 border border-blue-500/30 rounded-full py-2 px-4 text-blue-400 text-xs font-bold w-fit mx-auto mb-8">
                                {t.pricing.saveYear.replace('{{amount}}', plans.pro.save)}
                            </div>
                            <div className="flex items-baseline justify-center gap-1 mb-2">
                                <span className="text-4xl md:text-5xl font-bold text-white">${billingCycle === 'yearly' ? plans.pro.yearly : plans.pro.monthly}</span>
                                <span className="text-gray-500 font-bold">/ mo</span>
                            </div>
                            {billingCycle === 'yearly' && (
                                <div className="text-gray-500 text-sm mb-6">${plans.pro.yearlyTotal} / yearly</div>
                            )}

                            <Link to="#" className="text-blue-500 text-[10px] font-bold hover:text-blue-400 transition-colors mb-4 inline-flex items-center gap-1 justify-center">
                                See best deal pro plan in action <ArrowRight className="w-3 h-3" />
                            </Link>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold mb-4 transition-all flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                {t.pricing.startTrial}
                            </button>
                            <p className="text-[10px] text-gray-500 italic mb-10 leading-relaxed px-4">
                                {t.pricing.flexiblePayment}
                            </p>

                            <div className="space-y-4 text-left px-4">
                                <FeatureItem active={true} text="Unlimited sessions" />
                                <FeatureItem active={true} text="Unlimited trades" />
                                <FeatureItem active={true} text="Unlimited journaling" />
                                <FeatureItem active={true} text="Priority AI assistance" />
                            </div>
                        </div>
                    </div>

                    {/* Comparison Table Section */}
                    <div className="max-w-5xl mx-auto mt-20">
                        <div className="text-center mb-12">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.pricing.pathTitle}</p>
                        </div>

                        {/* Small Cards for header comparison */}
                        <div className="grid grid-cols-[1fr_150px_150px] gap-8 mb-8 px-6 sticky top-16 bg-[#0a0e14]/90 backdrop-blur-md py-4 z-10 border-b border-white/5">
                            <div />
                            <div className="text-center">
                                <div className="text-sm font-bold text-blue-400 mb-1">{t.pricing.pro}</div>
                                <div className="text-lg font-bold">${plans.pro.yearly}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-bold text-gray-400 mb-1">{t.pricing.intermediate}</div>
                                <div className="text-lg font-bold">${plans.intermediate.yearly}</div>
                            </div>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-12">
                            <TableCategory title={t.pricing.featuresCat} />
                            <div className="divide-y divide-white/5 border-t border-white/5">
                                <TableRow label="Backtesting sessions" pro="Unlimited" intermediate="10" />
                                <TableRow label="Max sessions duration" pro="Unlimited" intermediate="6 months" />
                                <TableRow label="Trade history retention" pro="Unlimited" intermediate="6 months" />
                                <TableRow label="Trades per session" pro="Unlimited" intermediate="200" />
                                <TableRow label="Multi-chart layouts" pro="Unlimited" intermediate="2 charts" />
                                <TableRow label="Indicators" pro="Unlimited" intermediate="5" />
                                <TableRow label="FXR Battles" pro={<CheckIcon />} intermediate={<CheckIcon />} />
                                <TableRow label="Replay mode" pro={<CheckIcon />} intermediate={<CheckIcon />} />
                                <TableRow label="Prop firm simulator" pro={<CheckIcon />} intermediate={<CheckOutlineIcon />} />
                                <TableRow label="Custom indicators" pro={<CheckIcon />} intermediate={<CheckOutlineIcon />} />
                            </div>

                            <TableCategory title={t.pricing.journalCat} />
                            <div className="divide-y divide-white/5 border-t border-white/5">
                                <TableRow label="Live journal access" pro="Unlimited" intermediate="Unlimited" />
                                <TableRow label="Live syncing accounts" pro="Unlimited" intermediate="Unlimited" />
                                <TableRow label="AI tag optimization" pro={<CheckIcon />} intermediate={<CheckOutlineIcon />} />
                                <TableRow label="Universal csv import" pro={<CheckIcon />} intermediate={<CheckOutlineIcon />} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const FeatureItem = ({ active, text }: { active: boolean, text: string }) => (
    <div className="flex items-center gap-3">
        <div className={`p-0.5 rounded-full ${active ? 'bg-blue-600' : 'border border-gray-600'}`}>
            <Check className={`w-3 h-3 ${active ? 'text-white' : 'text-gray-600'}`} />
        </div>
        <span className={`text-xs font-medium ${active ? 'text-gray-300' : 'text-gray-500'}`}>{text}</span>
    </div>
);

const TableCategory = ({ title }: { title: string }) => (
    <div className="text-left font-bold text-lg mb-4 text-white">{title}</div>
);

const TableRow = ({ label, pro, intermediate, tooltip }: { label: string, pro: React.ReactNode, intermediate: React.ReactNode, tooltip?: string }) => (
    <div className="grid grid-cols-[1fr_150px_150px] gap-8 py-4 px-6 items-center group hover:bg-white/[0.02] transition-colors rounded-xl">
        <div className="flex items-center gap-2 text-left">
            <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{label}</span>
            {tooltip && <Info className="w-3 h-3 text-gray-600" />}
        </div>
        <div className="text-center font-bold text-sm text-white">{pro}</div>
        <div className="text-center font-bold text-sm text-gray-500">{intermediate}</div>
    </div>
);

const CheckIcon = () => (
    <div className="mx-auto w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
        <Check className="w-3 h-3 stroke-[3]" />
    </div>
);

const CheckOutlineIcon = () => (
    <div className="mx-auto w-5 h-5 flex items-center justify-center text-gray-600">
        <Check className="w-4 h-4" />
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

export default PricingPage;
