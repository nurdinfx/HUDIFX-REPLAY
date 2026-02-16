import React from 'react';
import { Trash2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SessionCardProps {
    session: any;
    onDelete?: (id: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onDelete }) => {
    const navigate = useNavigate();

    const handlePlay = () => {
        navigate(`/session/${session._id}`);
    };

    return (
        <div className="bg-[#0f141c] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-white/10 hover:bg-[#161d28] transition-all">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-500 font-bold group-hover:scale-110 transition-transform uppercase">
                    {session.symbol?.substring(0, 1) || 'S'}
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white uppercase tracking-tight">{session.name || 'Unnamed Session'}</span>
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-black uppercase">{session.type}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-2">
                        <span className="font-bold text-gray-400">{session.symbol}</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-blue-500/50 font-bold">{session.broker}</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span>{session.startDate} - {session.endDate}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end gap-1 px-8 border-x border-white/5">
                    <div className="flex justify-between w-32 text-[10px] font-bold text-gray-500">
                        <span>Progress</span>
                        <span className="text-emerald-500">Active</span>
                    </div>
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-rose-500 transition-colors" onClick={(e) => { e.stopPropagation(); onDelete && onDelete(session._id); }}>
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={handlePlay} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-600/10 active:scale-95">
                        Resume
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white transition-colors">
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionCard;
