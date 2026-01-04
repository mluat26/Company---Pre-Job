import React, { useState, useEffect, useMemo } from 'react';
import { SavedCard, ThemeColor } from '../types';
import MiniCard from './MiniCard';
import { MATERIAL_ICONS, THEME_TEXT_COLORS } from './ResultDisplay';

interface CardSliderProps {
  isOpen: boolean;
  onClose: () => void;
  cards: SavedCard[];
  onUpdateCard: (card: SavedCard) => void;
  onDeleteCard?: (cardId: string) => void;
}

const CardSlider: React.FC<CardSliderProps> = ({ isOpen, onClose, cards, onUpdateCard, onDeleteCard }) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isEditing, setIsEditing] = useState(false);
  
  // Salary View State
  const [salaryPeriod, setSalaryPeriod] = useState<'year' | 'month'>('year');

  useEffect(() => {
    if (isOpen && !activeCardId && cards.length > 0) {
        setActiveCardId(cards[0].id);
    }
  }, [isOpen, cards]);

  useEffect(() => {
      setIsEditing(false);
  }, [activeCardId]);

  const activeCard = cards.find(c => c.id === activeCardId);

  const uniqueTypes = useMemo(() => {
    const types = new Set(cards.map(c => c.companyType));
    return ['All', ...Array.from(types)];
  }, [cards]);

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
        const matchesSearch = card.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              card.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || card.companyType === filterType;
        return matchesSearch && matchesFilter;
    });
  }, [cards, searchTerm, filterType]);

  const getBannerGradient = (color: ThemeColor) => {
     const map: Record<ThemeColor, string> = {
        zinc: 'from-zinc-800 to-black', slate: 'from-slate-800 to-slate-950',
        red: 'from-red-900 to-black', orange: 'from-orange-800 to-black',
        amber: 'from-amber-800 to-black', yellow: 'from-yellow-800 to-black',
        lime: 'from-lime-900 to-black', green: 'from-green-900 to-black',
        emerald: 'from-emerald-900 to-black', teal: 'from-teal-900 to-black',
        cyan: 'from-cyan-900 to-black', sky: 'from-sky-900 to-black',
        blue: 'from-blue-900 to-black', indigo: 'from-indigo-900 to-black',
        violet: 'from-violet-900 to-black', purple: 'from-purple-900 to-black',
        fuchsia: 'from-fuchsia-900 to-black', pink: 'from-pink-900 to-black',
        rose: 'from-rose-900 to-black', black: 'from-zinc-900 to-black',
     };
     return map[color] || 'from-zinc-900 to-black';
  };

  const getThemeColorHex = (color: ThemeColor) => {
       const map: Record<ThemeColor, string> = {
        zinc: '#52525b', slate: '#475569', red: '#b91c1c', orange: '#c2410c',
        amber: '#b45309', yellow: '#a16207', lime: '#4d7c0f', green: '#15803d',
        emerald: '#047857', teal: '#0f766e', cyan: '#0e7490', sky: '#0369a1',
        blue: '#1d4ed8', indigo: '#4338ca', violet: '#6d28d9', purple: '#7e22ce',
        fuchsia: '#a21caf', pink: '#be185d', rose: '#be123c', black: '#18181b',
     };
     return map[color];
  };

  const formatCurrency = (amount: number) => {
    let finalAmount = amount;
    if (salaryPeriod === 'month') {
        finalAmount = amount / 12;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: activeCard?.currency || 'USD', maximumFractionDigits: 0 }).format(finalAmount);
  };

  const getDomain = (url: string) => {
      try { return new URL(url).hostname; } catch { return ''; }
  };

  const handleUpdateCardData = (field: keyof SavedCard, value: any) => {
      if (activeCard) {
          onUpdateCard({ ...activeCard, [field]: value });
      }
  };

  const colors: ThemeColor[] = [
      'zinc', 'slate', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 
      'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'black'
  ];
  
  const iconColorClass = activeCard ? (THEME_TEXT_COLORS[activeCard.themeColor] || 'text-white') : 'text-white';

  return (
    <>
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={onClose}
        />
      )}

      {/* Slider Panel */}
      <div className={`fixed top-0 right-0 h-full w-[95vw] max-w-[1800px] bg-[#050505] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* === LEFT COLUMN: MODERN DETAIL VIEW (65%) === */}
        <div className="w-[65%] h-full bg-[#0a0a0c] flex flex-col relative overflow-hidden border-r border-white/5">
             
             {/* Header Toolbar */}
             <div className="h-16 border-b border-white/5 flex items-center px-8 justify-between shrink-0 bg-[#0a0a0c] z-20">
                 <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></span>
                    Intelligence Hub
                 </h2>
                 {activeCard && (
                     <div className="flex gap-4">
                        <a 
                             href={activeCard.website}
                             target="_blank"
                             rel="noreferrer"
                             className="text-zinc-400 text-xs font-bold hover:text-white flex items-center gap-1 transition-colors"
                        >
                            VISIT PORTAL <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                        
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full transition ${isEditing ? 'bg-indigo-600 text-white' : 'bg-white text-black hover:bg-zinc-200 border-transparent'}`}
                        >
                             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                             {isEditing ? 'DONE' : 'CUSTOMIZE'}
                        </button>
                     </div>
                 )}
             </div>

             {activeCard ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                     
                     {/* 1. TOP BANNER */}
                     <div className={`relative h-[240px] w-full bg-gradient-to-r ${getBannerGradient(activeCard.themeColor)} transition-colors duration-500`}>
                         <div 
                            className="absolute right-0 top-0 w-[50%] h-full opacity-[0.2] bg-no-repeat bg-right bg-contain mix-blend-overlay grayscale contrast-125 pointer-events-none"
                            style={{ backgroundImage: `url(https://www.google.com/s2/favicons?domain=${getDomain(activeCard.website)}&sz=256)` }}
                         ></div>
                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0c] to-transparent"></div>
                         
                         <div className="absolute -bottom-10 left-8 flex items-end gap-6 z-10">
                             <div className="w-24 h-24 bg-[#0a0a0c] rounded-3xl border border-zinc-800 flex items-center justify-center shadow-2xl p-1">
                                 <div className="w-full h-full bg-zinc-900 rounded-[20px] flex items-center justify-center border border-white/5">
                                     <svg viewBox="0 0 24 24" className={`w-10 h-10 ${iconColorClass}`} fill="currentColor">
                                        {MATERIAL_ICONS['briefcase']}
                                     </svg>
                                 </div>
                             </div>
                             
                             <div className="mb-10">
                                 <div className="flex items-center gap-2 mb-2">
                                     <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-[10px] font-bold text-white/90 uppercase tracking-wider">{activeCard.country}</span>
                                     <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-[10px] font-bold text-white/90 uppercase tracking-wider">{activeCard.type}</span>
                                 </div>
                                 <h1 className="text-4xl font-black text-white tracking-tight leading-none drop-shadow-md">{activeCard.companyName}</h1>
                             </div>
                         </div>
                     </div>

                     {/* 2. CUSTOMIZATION PANEL */}
                     {isEditing && (
                         <div className="mx-8 mt-12 mb-6 p-6 bg-zinc-900/50 border border-indigo-500/30 rounded-3xl animate-fade-in relative overflow-hidden shadow-none">
                             <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                             <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 pl-2">Card Customization</h3>
                             
                             <div className="space-y-6 pl-2">
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="text-zinc-500 text-[10px] font-bold uppercase mb-1 block">Company Name</label>
                                         <input type="text" value={activeCard.companyName} onChange={e => handleUpdateCardData('companyName', e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                                     </div>
                                     <div>
                                         <label className="text-zinc-500 text-[10px] font-bold uppercase mb-1 block">Role</label>
                                         <input type="text" value={activeCard.role} onChange={e => handleUpdateCardData('role', e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                                     </div>
                                     <div>
                                         <label className="text-zinc-500 text-[10px] font-bold uppercase mb-1 block">Entry Salary</label>
                                         <input type="number" value={activeCard.entryLevelSalary} onChange={e => handleUpdateCardData('entryLevelSalary', Number(e.target.value))} className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                                     </div>
                                      <div>
                                         <label className="text-zinc-500 text-[10px] font-bold uppercase mb-1 block">Mid Salary</label>
                                         <input type="number" value={activeCard.midLevelSalary} onChange={e => handleUpdateCardData('midLevelSalary', Number(e.target.value))} className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                                     </div>
                                      <div>
                                         <label className="text-zinc-500 text-[10px] font-bold uppercase mb-1 block">Currency</label>
                                         <input type="text" value={activeCard.currency} onChange={e => handleUpdateCardData('currency', e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none uppercase" />
                                     </div>
                                     <div>
                                         <label className="text-zinc-500 text-[10px] font-bold uppercase mb-1 block">Country</label>
                                         <input type="text" value={activeCard.country} onChange={e => handleUpdateCardData('country', e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                                     </div>
                                     <div>
                                         <label className="text-zinc-500 text-[10px] font-bold uppercase mb-1 block">Workplace Rating (1-5)</label>
                                         <input type="number" min="1" max="5" value={activeCard.workplaceRating || 3} onChange={e => handleUpdateCardData('workplaceRating', Number(e.target.value))} className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                                     </div>
                                     <div>
                                         <label className="text-zinc-500 text-[10px] font-bold uppercase mb-1 block">Size Rating (1-5)</label>
                                         <input type="number" min="1" max="5" value={activeCard.sizeRating || 2} onChange={e => handleUpdateCardData('sizeRating', Number(e.target.value))} className="w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                                     </div>
                                 </div>

                                 <div>
                                     <label className="text-zinc-500 text-[10px] font-bold uppercase mb-2 block">Theme Color</label>
                                     <div className="flex flex-wrap gap-2">
                                         {colors.map(c => (
                                             <button 
                                                key={c}
                                                onClick={() => handleUpdateCardData('themeColor', c)}
                                                className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${activeCard.themeColor === c ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-900' : 'opacity-70 hover:opacity-100'}`}
                                                style={{ backgroundColor: getThemeColorHex(c) }}
                                             />
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* 3. CONTENT */}
                     <div className={`px-8 ${isEditing ? 'pt-6' : 'pt-16'} pb-20 max-w-5xl`}>
                         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-zinc-800 pb-8">
                             <div>
                                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Role Overview</h3>
                                <p className="text-2xl font-light text-zinc-200 leading-relaxed max-w-2xl">
                                    Targeting the <span className="text-white font-medium">{activeCard.role}</span> position within the <span className="text-white font-medium">{activeCard.industryDomain}</span> sector.
                                </p>
                             </div>
                             
                             {/* SALARY TOGGLE */}
                             <div className="bg-zinc-900 p-1 rounded-full flex gap-1 shrink-0">
                                 <button 
                                    onClick={() => setSalaryPeriod('year')}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${salaryPeriod === 'year' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                 >
                                     YEARLY
                                 </button>
                                 <button 
                                    onClick={() => setSalaryPeriod('month')}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${salaryPeriod === 'month' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                 >
                                     MONTHLY
                                 </button>
                             </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                             
                             <div className="bg-[#0e0e10] p-8 hover:bg-[#121214] transition-colors group">
                                 <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-zinc-300 transition-colors">Entry Level</div>
                                 <div className="text-xl font-mono font-bold text-white">{formatCurrency(activeCard.entryLevelSalary)}</div>
                                 <div className="text-xs text-zinc-600 mt-1 font-mono">Base / {salaryPeriod === 'year' ? 'Year' : 'Month'}</div>
                             </div>

                             <div className="bg-[#0e0e10] p-8 hover:bg-[#121214] transition-colors group">
                                 <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-indigo-400 transition-colors">Mid Level</div>
                                 <div className="text-xl font-mono font-bold text-indigo-200">{formatCurrency(activeCard.midLevelSalary)}</div>
                                 <div className="text-xs text-zinc-600 mt-1 font-mono">Base / {salaryPeriod === 'year' ? 'Year' : 'Month'}</div>
                             </div>

                             <div className="bg-[#0e0e10] p-8 hover:bg-[#121214] transition-colors group">
                                 <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-zinc-300 transition-colors">Currency</div>
                                 <div className="text-xl font-mono font-bold text-white">{activeCard.currency}</div>
                                 <div className="text-xs text-zinc-600 mt-1 font-mono">ISO Code</div>
                             </div>

                             <div className="bg-[#0e0e10] p-8 hover:bg-[#121214] transition-colors group">
                                 <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-zinc-300 transition-colors">Organization</div>
                                 <div className="text-lg text-white font-medium">{activeCard.companyType}</div>
                             </div>

                             <div className="bg-[#0e0e10] p-8 hover:bg-[#121214] transition-colors group col-span-2">
                                 <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-zinc-300 transition-colors">Domain</div>
                                 <div className="text-lg text-white font-medium">{activeCard.industryDomain}</div>
                             </div>

                             {/* RATINGS ROW */}
                             <div className="bg-[#0e0e10] p-8 hover:bg-[#121214] transition-colors group">
                                 <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-yellow-400 transition-colors">Workplace Rating</div>
                                 <div className="flex gap-1 text-yellow-400 text-lg">
                                    {Array.from({length: 5}).map((_, i) => (
                                        <span key={i} className={i < (activeCard.workplaceRating || 3) ? "opacity-100" : "opacity-20"}>★</span>
                                    ))}
                                 </div>
                             </div>

                             <div className="bg-[#0e0e10] p-8 hover:bg-[#121214] transition-colors group col-span-2">
                                 <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-indigo-400 transition-colors">Company Scale</div>
                                 <div className="flex gap-1 text-indigo-400 text-lg">
                                    {Array.from({length: 5}).map((_, i) => (
                                        <span key={i} className={i < (activeCard.sizeRating || 2) ? "opacity-100" : "opacity-20"}>■</span>
                                    ))}
                                 </div>
                             </div>
                         </div>

                         <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-2 text-xs font-mono text-zinc-600">
                             <div className="flex gap-2">
                                 <span className="font-bold text-zinc-500">SOURCE:</span>
                                 <span>{activeCard.salaryExplanation}</span>
                             </div>
                             <div className="flex gap-2">
                                 <span className="font-bold text-zinc-500">LAST UPDATED:</span>
                                 <span>{new Date(activeCard.timestamp).toLocaleString()}</span>
                             </div>
                         </div>
                     </div>
                </div>
             ) : (
                 <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                     Select a card to view intelligence
                 </div>
             )}
        </div>

        {/* === RIGHT COLUMN: ARCHIVE GRID (35%) === */}
        <div className="w-[35%] h-full bg-[#050505] flex flex-col border-l border-zinc-900">
             <div className="border-b border-zinc-900 flex flex-col gap-4 p-6 bg-[#08080a] shrink-0">
                 <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                        <h2 className="text-white font-bold text-sm uppercase tracking-wider">Archive</h2>
                        <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{filteredCards.length}</span>
                     </div>
                     <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" fill="none" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                 </div>

                 <div className="flex gap-2">
                     <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-full px-3 py-2 pl-8 focus:outline-none focus:border-zinc-700"
                        />
                        <svg className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                     </div>
                     
                     <div className="relative">
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="appearance-none bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-full px-3 py-2 pr-8 focus:outline-none focus:border-zinc-700 cursor-pointer"
                        >
                            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <svg className="w-3 h-3 absolute right-2.5 top-3 text-zinc-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                     </div>
                 </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar pb-20">
                {filteredCards.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                        <p className="text-zinc-500 text-sm font-medium">No matches found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {filteredCards.map(card => (
                            <MiniCard 
                                key={card.id} 
                                card={card} 
                                isActive={activeCardId === card.id}
                                onClick={() => setActiveCardId(card.id)}
                                onDelete={() => onDeleteCard && onDeleteCard(card.id)}
                            />
                        ))}
                    </div>
                )}
             </div>
        </div>

      </div>
    </>
  );
};

export default CardSlider;
