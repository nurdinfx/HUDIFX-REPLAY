import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import {
    Plus,
    LayoutDashboard,
    Swords,
    Play,
    Radio,
    Compass,
    BookOpen,
    Settings,
    ChevronDown,
    Search,
    Bell,
    Sun,
    Flame,
    User as UserIcon
} from 'lucide-react';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    path: string;
    active?: boolean;
    beta?: boolean;
}

const NavItem = ({ icon, label, path, active, beta }: NavItemProps) => (
    <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
    >
        <div className={`${active ? 'text-blue-500' : 'text-gray-500 group-hover:text-white'} transition-colors`}>
            {icon}
        </div>
        <span className="text-sm font-bold flex-1">{label}</span>
        {beta && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black tracking-tighter uppercase">Beta</span>}
    </Link>
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { currentLanguage } = useLanguageStore();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-[#06080d] text-white font-sans selection:bg-blue-500/30">
            {/* Sidebar */}
            <aside className="w-[260px] border-r border-white/5 flex flex-col p-4 bg-[#0a0e14]">
                <div className="mb-10 px-2 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-1 group">
                        <span className="text-xl font-black tracking-tighter flex items-center">
                            HUDI
                            <span className="text-blue-500 transform -skew-x-12 inline-block ml-0.5">F</span>
                            X
                        </span>
                    </Link>
                    <button className="lg:hidden text-gray-400 hover:text-white">
                        <LayoutDashboard className="w-6 h-6" />
                    </button>
                </div>

                {/* User Profile in Sidebar */}
                <div className="mb-8 p-4 rounded-2xl bg-[#0f141c] border border-white/5 flex flex-col items-center text-center group transition-all hover:border-white/10">
                    <div className="relative mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-0.5 shadow-xl">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border border-white/10">
                                {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : <UserIcon className="w-8 h-8 text-blue-500" />}
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#0f141c]">PRO</div>
                    </div>
                    <div className="text-sm font-bold text-white mb-0.5 truncate w-full">{user?.username}</div>
                    <div className="text-[10px] text-gray-500 font-medium truncate w-full">{user?.email}</div>
                </div>

                {/* Main Nav */}
                <nav className="flex-1 space-y-1">
                    <NavItem icon={<Compass className="w-5 h-5" />} label="Get Started" path="/dashboard" />
                    <NavItem icon={<Play className="w-5 h-5" />} label="Testing" path="/dashboard" active={isActive('/dashboard')} />
                    <NavItem icon={<Radio className="w-5 h-5" />} label="Live" path="#" beta />
                    <NavItem icon={<Swords className="w-5 h-5" />} label="Strategies" path="#" />
                    <NavItem icon={<LayoutDashboard className="w-5 h-5 rotate-45" />} label="Battles" path="#" beta />
                </nav>

                {/* Secondary Nav */}
                <div className="mt-auto space-y-1 border-t border-white/5 pt-6">
                    <NavItem icon={<BookOpen className="w-5 h-5" />} label="Education" path="#" />
                    <NavItem icon={<Settings className="w-5 h-5" />} label="Account Settings" path="#" />
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded-xl mt-4"
                    >
                        <LayoutDashboard className="w-5 h-5 rotate-180" />
                        <span className="text-sm font-bold tracking-tight">Version: 2.0.56-pro</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Dashboard Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0e14]/50 backdrop-blur-sm z-30">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search symbol, session, user..."
                                className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full">
                            <span className="text-sm font-black">2</span>
                            <Flame className="w-4 h-4" />
                            <span className="text-[10px] font-bold tracking-tighter uppercase ml-0.5">day streak!</span>
                        </div>

                        <div className="w-px h-6 bg-white/10 mx-2" />

                        <div className="flex items-center gap-3">
                            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                                <Bell className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                                <Sun className="w-4 h-4" />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 px-2 py-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-xs font-bold text-white uppercase tracking-tighter">{currentLanguage}</span>
                                    <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute top-full mt-2 right-0 w-48 bg-[#0f141c] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 transition-colors">Profile</button>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 transition-colors font-bold text-rose-500" onClick={logout}>Sign out</button>
                                    </div>
                                )}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 cursor-pointer hover:scale-105 transition-all">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto bg-[#06080d]">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
