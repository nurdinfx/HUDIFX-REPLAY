import { useState } from 'react';
import {
    X,
    Search,
    ChevronDown,
    Zap,
    CircleDollarSign,
    Info,
    Calendar
} from 'lucide-react';
import { ASSETS, type Asset } from '../../data/assets';

interface CreateSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (sessionData: any) => void;
}

const CreateSessionModal = ({ isOpen, onClose, onCreate }: CreateSessionModalProps) => {
    const [activeType, setActiveType] = useState('Backtesting');
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('100000');
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [startDate, setStartDate] = useState('2023-01-01');
    const [endDate, setEndDate] = useState('2024-01-01');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showAssetDropdown, setShowAssetDropdown] = useState(false);
    const [assetCategory, setAssetCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const handleCreate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name) newErrors.name = 'This field is required.';
        if (!selectedAsset) newErrors.asset = 'Please select an asset.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onCreate({
            name,
            balance: parseFloat(balance),
            symbol: selectedAsset?.symbol,
            broker: selectedAsset?.broker,
            startDate,
            endDate,
            type: activeType
        });
    };

    const categories = ['All', 'Futures', 'Forex', 'Metal', 'Index', 'Crypto', 'Agricultural', 'Energy', 'Bond', 'Stock'];

    const filteredAssets = ASSETS.filter(a => {
        const matchesCategory = assetCategory === 'All' || a.category === assetCategory;
        const matchesSearch = a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[640px] bg-[#0c1117] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6">
                    <h2 className="text-xl font-bold text-white">Create a quick session</h2>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-400 border border-white/5 transition-colors">
                            Advanced session
                        </button>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-10 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {/* Session Type Tabs */}
                    <div className="flex p-1 bg-[#161b22] rounded-2xl border border-white/5">
                        <button
                            onClick={() => setActiveType('Backtesting')}
                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeType === 'Backtesting' ? 'bg-[#30363d] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Backtesting Session
                        </button>
                        <button
                            onClick={() => setActiveType('PropFirm')}
                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeType === 'PropFirm' ? 'bg-[#30363d] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Prop Firm Session
                            <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black">PRO</span>
                        </button>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white flex items-center gap-1">
                            Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Name your session"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                            }}
                            className={`w-full bg-[#161b22] border rounded-2xl py-4 px-5 text-sm focus:outline-none transition-all ${errors.name ? 'border-rose-500 bg-rose-500/5' : 'border-white/5 focus:border-blue-500/50'}`}
                        />
                        {errors.name && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.name}</p>}
                    </div>

                    {/* Account Balance Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white flex items-center gap-1">
                            Account Balance <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                <CircleDollarSign className="w-4 h-4 text-gray-500" />
                            </div>
                            <input
                                type="number"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                className="w-full bg-[#161b22] border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                            />
                        </div>
                    </div>

                    {/* Assets Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white flex items-center gap-1">
                            Assets <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <button
                                onClick={() => setShowAssetDropdown(!showAssetDropdown)}
                                className={`w-full bg-[#161b22] border rounded-2xl py-4 px-5 text-sm flex justify-between items-center transition-all ${errors.asset ? 'border-rose-500' : 'border-white/5'}`}
                            >
                                <span className={selectedAsset ? 'text-white font-bold' : 'text-gray-500'}>
                                    {selectedAsset ? `${selectedAsset.symbol} (${selectedAsset.broker})` : 'Type to search for assets'}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showAssetDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showAssetDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1117] border border-white/10 rounded-2xl shadow-2xl z-[110] overflow-hidden max-h-[400px] flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-white/5">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setAssetCategory(cat)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${assetCategory === cat ? 'bg-[#30363d] text-white' : 'bg-white/5 text-gray-500 hover:text-gray-300'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Search assets..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-[#161b22] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto py-2 flex-1 custom-scrollbar">
                                        <div className="px-4 py-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">{assetCategory} Assets</div>
                                        {filteredAssets.length > 0 ? filteredAssets.map((asset, index) => (
                                            <button
                                                key={`${asset.symbol}-${asset.broker}-${index}`}
                                                onClick={() => {
                                                    setSelectedAsset(asset);
                                                    setShowAssetDropdown(false);
                                                    setErrors(prev => ({ ...prev, asset: '' }));
                                                }}
                                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-[10px] group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors uppercase">
                                                        {asset.symbol.substring(0, 2)}
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-xs font-bold text-white">
                                                            {asset.symbol} <span className="text-[10px] text-gray-500 font-medium font-sans">({asset.name})</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-[9px] text-gray-600 font-bold uppercase">{asset.category}</div>
                                                            <div className="text-[9px] text-blue-500/50 font-black tracking-widest uppercase">{asset.broker}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {asset.pro && <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black">PRO</span>}
                                            </button>
                                        )) : (
                                            <div className="px-4 py-8 text-center text-xs text-gray-600 italic">No assets found matching your search.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white flex items-center gap-1">
                                Start Date <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                </div>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-[#161b22] border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white font-medium color-scheme-dark"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white flex items-center gap-1">
                                End Date <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                </div>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-[#161b22] border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white font-medium color-scheme-dark"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Chart Layout Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 flex items-center gap-1 uppercase tracking-tighter">
                            Select Chart Layout (Optional) <Info className="w-3 h-3" />
                        </label>
                        <button className="w-full bg-[#161b22] border border-white/5 rounded-2xl py-4 px-5 text-sm flex justify-between items-center text-gray-600 cursor-not-allowed">
                            <span>Select layout</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
                        <button
                            onClick={onClose}
                            className="text-sm font-bold text-gray-500 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                        >
                            Create session
                        </button>
                    </div>
                </div>

                {/* Banner bottom */}
                <div className="bg-blue-500/10 backdrop-blur-md border-t border-white/5 p-3 flex items-center justify-between px-8">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                        <Zap className="w-3 h-3" /> Tip: Dates are synced with real broker data from {selectedAsset?.broker || 'OANDA'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSessionModal;
