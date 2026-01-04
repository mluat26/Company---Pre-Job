import React, { useState, useEffect } from 'react';
import { CompanyData, ThemeColor, CardIcon, SavedCard } from '../types';

interface ResultDisplayProps {
  data: CompanyData | SavedCard;
  onReset: () => void;
  onSave: (card: SavedCard) => void;
}

// FILLED STYLE ICONS
export const MATERIAL_ICONS: Record<string, React.ReactNode> = {
    'briefcase': <path d="M10 2c-1.1 0-2 .9-2 2v2H2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6h-6V4c0-1.1-.9-2-2-2h-4zm0 2h4v2h-4V4zm-6 4h16v12H4V8z" fill="currentColor" />, 
    'tech': <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 15v4.128a2.125 2.125 0 01-2.125-2.125V15M4 10h16" fill="currentColor" />, 
    'finance': <path d="M20 7h-9.25l-.356-.6A1.65 1.65 0 009 5.35H4A2.35 2.35 0 001.65 7.7v8.6A2.35 2.35 0 004 18.65h16A2.35 2.35 0 0022.35 16.3V9.35A2.35 2.35 0 0020 7zm-5.75 8a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm4.5 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" fill="currentColor" />, 
    'default': <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" fill="currentColor" />, 
};

export const THEME_TEXT_COLORS: Record<ThemeColor, string> = {
    zinc: 'text-zinc-200', slate: 'text-slate-200', red: 'text-red-300', orange: 'text-orange-300',
    amber: 'text-amber-300', yellow: 'text-yellow-300', lime: 'text-lime-300', green: 'text-green-300',
    emerald: 'text-emerald-300', teal: 'text-teal-300', cyan: 'text-cyan-300', sky: 'text-sky-300',
    blue: 'text-blue-300', indigo: 'text-indigo-300', violet: 'text-violet-300', purple: 'text-purple-300',
    fuchsia: 'text-fuchsia-300', pink: 'text-pink-300', rose: 'text-rose-300', black: 'text-zinc-300',
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, onReset, onSave }) => {
  const [isSaved, setIsSaved] = useState(false);

  // Default to briefcase
  const displayIcon = 'briefcase'; 
  const displayColor = 'themeColor' in data ? (data as SavedCard).themeColor : 'zinc';

  useEffect(() => {
     if ('id' in data) {
         setIsSaved(true);
     } else {
         setIsSaved(false);
     }
  }, [data]);

  const handleSave = () => {
    const idToUse = 'id' in data ? (data as SavedCard).id : crypto.randomUUID();
    const newCard: SavedCard = {
        ...data,
        id: idToUse,
        timestamp: Date.now(),
        themeColor: displayColor as ThemeColor,
        icon: displayIcon as any
    };
    onSave(newCard);
    setIsSaved(true);
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "N/A";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency, notation: 'compact', maximumFractionDigits: 1 }).format(amount);
  };

  const getFlagEmoji = (countryName: string) => {
     const map: Record<string, string> = {
        'United States': '🇺🇸', 'USA': '🇺🇸', 'US': '🇺🇸', 'United Kingdom': '🇬🇧', 'UK': '🇬🇧',
        'Vietnam': '🇻🇳', 'Singapore': '🇸🇬', 'Australia': '🇦🇺', 'Canada': '🇨🇦', 'Germany': '🇩🇪', 
        'France': '🇫🇷', 'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'China': '🇨🇳', 'India': '🇮🇳', 
        'Netherlands': '🇳🇱', 'Sweden': '🇸🇪'
    };
    return map[countryName] || map[Object.keys(map).find(k => countryName.includes(k)) || ''] || '🌐';
  };

  const getDomain = (url: string) => {
      try { return new URL(url).hostname; } catch { return ''; }
  };
  const logoUrl = `https://www.google.com/s2/favicons?domain=${getDomain(data.website)}&sz=256`;
  const iconColorClass = THEME_TEXT_COLORS[displayColor as ThemeColor] || 'text-white';
  const currentTheme = { bg: 'from-zinc-800 via-zinc-900 to-black' };

  // MAIN CARD COMPONENT (PREVIEW ONLY)
  const MainCard = ({ className = "" }) => (
    <div className={`relative w-full max-w-[420px] aspect-[4/5] rounded-[32px] transition-all duration-700 ${className} group`}>
        
        {/* Metal/Glass Border */}
        <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-black/30 shadow-2xl ring-1 ring-white/5">
            
            {/* Main Surface */}
            <div className={`relative h-full w-full rounded-[31px] overflow-hidden bg-gradient-to-br ${currentTheme.bg}`}>
                
                {/* LOGO WATERMARK (20%) */}
                <div 
                    className="absolute right-[-20%] bottom-[-10%] w-[80%] h-[80%] opacity-[0.2] bg-no-repeat bg-contain mix-blend-overlay grayscale contrast-125 pointer-events-none z-0"
                    style={{ backgroundImage: `url(${logoUrl})` }}
                ></div>

                {/* Noise */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                <div className="absolute top-[-50%] left-[-50%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none"></div>

                {/* CONTENT */}
                <div className="relative h-full flex flex-col p-8 text-white z-10">
                    
                    <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.2)] ${iconColorClass}`}>
                             <svg viewBox="0 0 24 24" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                                {MATERIAL_ICONS[displayIcon] || MATERIAL_ICONS['briefcase']}
                             </svg>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5 shadow-inner">
                            <span className="text-sm filter grayscale-[0.2]">{getFlagEmoji(data.country)}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">{data.country}</span>
                        </div>
                    </div>

                    <div className="mb-auto">
                        <div className="flex items-center gap-2 mb-3 opacity-60">
                             <span className="h-px w-4 bg-white/50"></span>
                             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{data.companyType}</span>
                        </div>
                        <h1 className="text-4xl font-medium tracking-tight leading-none mb-3 text-white drop-shadow-sm line-clamp-3">
                            {data.companyName}
                        </h1>
                        
                        {/* RATINGS ON CARD */}
                        <div className="flex gap-4 mt-4">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] uppercase tracking-wider opacity-60">Workplace</span>
                                <div className="flex gap-0.5 text-yellow-400 text-xs">
                                    {Array.from({length: 5}).map((_, i) => (
                                        <span key={i} className={i < (data.workplaceRating || 3) ? "opacity-100" : "opacity-30"}>★</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] uppercase tracking-wider opacity-60">Size</span>
                                <div className="flex gap-0.5 text-white text-xs">
                                    {Array.from({length: 5}).map((_, i) => (
                                        <span key={i} className={i < (data.sizeRating || 2) ? "opacity-100" : "opacity-30"}>■</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-2 mt-4">
                        <div className="col-span-2 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-[2px]">
                             <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1">Target Role</div>
                             <div className="font-medium text-base text-white/90 truncate">{data.role}</div>
                        </div>
                         <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-[2px]">
                             <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1">Entry Level</div>
                             <div className="text-sm font-mono font-medium tracking-tight">{formatCurrency(data.entryLevelSalary)}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-[2px]">
                             <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1">Mid Level</div>
                             <div className="text-lg font-mono font-medium tracking-tight text-indigo-300">{formatCurrency(data.midLevelSalary)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 animate-fade-in-up pb-32">
      
      {/* Navigation Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-[#0f0f11] p-4 rounded-[24px] border border-zinc-800 shadow-2xl">
          <button onClick={onReset} className="flex items-center px-6 py-3 text-zinc-400 hover:text-white transition rounded-full hover:bg-zinc-800 gap-2">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             <span className="font-bold text-xs tracking-wide">NEW SEARCH</span>
          </button>
          
          <button onClick={handleSave} disabled={isSaved} className={`flex items-center space-x-2 px-12 py-3 rounded-full font-bold text-sm transition-all shadow-lg transform active:scale-95 ${isSaved ? 'bg-zinc-900 text-green-500 border border-green-900 cursor-default' : 'bg-white text-black hover:opacity-90'}`}>
             <span>{isSaved ? "SAVED TO DECK" : "SAVE TO DECK"}</span>
          </button>
      </div>

      <div className="relative flex justify-center py-8">
         <MainCard />
      </div>

    </div>
  );
};

export default ResultDisplay;
