import React from 'react';
import { SavedCard, ThemeColor } from '../types';
import { MATERIAL_ICONS, THEME_TEXT_COLORS } from './ResultDisplay';

interface MiniCardProps {
  card: SavedCard;
  onClick: () => void;
  onDelete?: () => void;
  isActive?: boolean;
}

// Atmospheric Gradient Map - Made slightly more vibrant
const colorMap: Record<ThemeColor, string> = {
    zinc: 'from-zinc-800 via-zinc-900 to-black', slate: 'from-slate-700 via-slate-800 to-slate-950', 
    red: 'from-red-800 via-red-900 to-black', orange: 'from-orange-700 via-orange-900 to-black',
    amber: 'from-amber-700 via-amber-900 to-black', yellow: 'from-yellow-700 via-yellow-900 to-black', 
    lime: 'from-lime-800 via-lime-900 to-black', green: 'from-green-800 via-green-900 to-black',
    emerald: 'from-emerald-800 via-emerald-900 to-black', teal: 'from-teal-800 via-teal-900 to-black', 
    cyan: 'from-cyan-800 via-cyan-900 to-black', sky: 'from-sky-700 via-sky-900 to-black',
    blue: 'from-blue-800 via-blue-900 to-black', indigo: 'from-indigo-800 via-indigo-900 to-black', 
    violet: 'from-violet-800 via-violet-900 to-black', purple: 'from-purple-800 via-purple-900 to-black',
    fuchsia: 'from-fuchsia-800 via-fuchsia-900 to-black', pink: 'from-pink-800 via-pink-900 to-black', 
    rose: 'from-rose-800 via-rose-900 to-black', black: 'from-zinc-800 via-zinc-950 to-black',
};

const MiniCard: React.FC<MiniCardProps> = ({ card, onClick, onDelete, isActive }) => {
  const formatSalary = (amount: number) => {
    if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'k';
    }
    return amount.toString();
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

  const gradientClass = colorMap[card.themeColor] || 'from-zinc-800 via-zinc-900 to-black';
  const iconColorClass = THEME_TEXT_COLORS[card.themeColor] || 'text-white';

  return (
    <div 
        className={`group relative rounded-[20px] transition-all duration-300 transform hover:-translate-y-1 ${isActive ? 'ring-2 ring-indigo-500 scale-[1.02] z-10' : 'hover:shadow-xl z-0'}`}
    >
        {/* Content Container */}
        <div className={`relative h-full w-full bg-gradient-to-br ${gradientClass} rounded-[19px] overflow-hidden shadow-lg`}>
            
            {/* Logo Watermark */}
            <div 
                className="absolute right-[-10%] bottom-[-10%] w-[60%] h-[80%] opacity-[0.2] bg-no-repeat bg-right-bottom bg-contain mix-blend-overlay grayscale contrast-125 pointer-events-none"
                style={{ backgroundImage: `url(https://www.google.com/s2/favicons?domain=${getDomain(card.website)}&sz=128)` }}
            ></div>

            {/* Visual Layers */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-black/40 pointer-events-none"></div>

            {/* Click Handler */}
            <div onClick={onClick} className="absolute inset-0 z-10 cursor-pointer"></div>

            {/* Inner Content */}
            <div className="relative p-5 h-full flex flex-col justify-between text-white pointer-events-none z-20">
                
                {/* Header Row: Flag + Spacer + Delete + Briefcase */}
                <div className="flex justify-between items-start">
                    <div className="bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-sm">
                        <span className="text-[10px] grayscale-[0.2]">{getFlagEmoji(card.country)}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">{card.country}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* DELETE BUTTON (Visible on Hover, Next to icon) */}
                        {onDelete && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                className="w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/80 text-white/50 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 pointer-events-auto backdrop-blur-sm"
                                title="Delete"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        )}
                        
                        {/* Briefcase Icon */}
                        <div className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner ${iconColorClass}`}>
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                {MATERIAL_ICONS['briefcase']}
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="font-bold text-lg leading-tight mb-2 truncate text-white drop-shadow-sm">{card.companyName}</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 truncate max-w-[50%]">
                            {card.role}
                        </span>
                        <span className="text-[11px] font-mono font-medium bg-white/10 px-2 py-1 rounded-md border border-white/5 text-white/90 shadow-sm">
                            {formatSalary(card.entryLevelSalary)} - {formatSalary(card.midLevelSalary)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default MiniCard;
