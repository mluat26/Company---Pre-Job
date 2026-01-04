import React from 'react';
import { SavedCard } from '../types';

interface DataGridViewProps {
  isOpen: boolean;
  onClose: () => void;
  data: SavedCard[];
}

const DataGridView: React.FC<DataGridViewProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const copyToClipboard = () => {
     const headers = ["Company", "Role", "Entry Salary", "Mid Salary", "Currency", "Location", "Type", "Domain", "Website", "Workplace Rating", "Size Rating"];
     const rows = data.map(d => [
         d.companyName, d.role, d.entryLevelSalary, d.midLevelSalary, d.currency, d.country, d.companyType, d.industryDomain, d.website, d.workplaceRating || '-', d.sizeRating || '-'
     ].join('\t')).join('\n');
     const text = headers.join('\t') + '\n' + rows;
     navigator.clipboard.writeText(text);
     alert("Data copied to clipboard! You can paste it into Google Sheets/Excel.");
  };

  const exportCSV = () => {
    const headers = ["Company", "Role", "Entry Salary", "Mid Salary", "Currency", "Location", "Type", "Domain", "Website", "Workplace Rating", "Size Rating"];
    const csvContent = "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...data.map(d => [
        `"${d.companyName.replace(/"/g, '""')}"`, 
        `"${d.role.replace(/"/g, '""')}"`, 
        d.entryLevelSalary, 
        d.midLevelSalary, 
        `"${d.currency}"`, 
        `"${d.country.replace(/"/g, '""')}"`, 
        `"${d.companyType.replace(/"/g, '""')}"`, 
        `"${d.industryDomain.replace(/"/g, '""')}"`, 
        `"${d.website}"`,
        d.workplaceRating || 0,
        d.sizeRating || 0
      ].join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `company_intel_data_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0a0c] overflow-hidden flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0f0f12] shadow-sm shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div>
                    <h2 className="text-white font-black text-xl tracking-tight">Master Data Grid</h2>
                    <p className="text-xs text-zinc-500 font-medium">Global Collection View</p>
                </div>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs font-bold rounded-full">{data.length} Records</span>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={exportCSV}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 border border-zinc-700 transition-all"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    CSV Export
                </button>
                <button 
                    onClick={copyToClipboard}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    Copy Excel
                </button>
            </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto custom-scrollbar p-6">
            <div className="bg-[#18181b] rounded-3xl border border-zinc-800 overflow-hidden min-w-full inline-block align-middle relative shadow-xl">
                <table className="min-w-full divide-y divide-zinc-800 border-separate border-spacing-0">
                    <thead className="bg-[#202023]">
                        <tr>
                            {/* Sticky Column 1: Company (Fixed Width 220px) */}
                            <th className="sticky left-0 z-20 bg-[#202023] px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap border-r border-zinc-700 shadow-[4px_0_8px_rgba(0,0,0,0.05)] min-w-[220px] max-w-[220px]">
                                Company
                            </th>
                            {/* Sticky Column 2: Role (Fixed Width 200px) - Left offset matches prev column width */}
                            <th className="sticky left-[220px] z-20 bg-[#202023] px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap border-r border-zinc-700 shadow-[4px_0_8px_rgba(0,0,0,0.05)] min-w-[200px] max-w-[200px]">
                                Role
                            </th>
                            
                            {/* Scrollable Columns */}
                            {["Entry (Base)", "Mid (Base)", "Currency", "Location", "Type", "Domain", "Rating", "Size", "Source", "Action"].map((h, i) => (
                                <th key={i} className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 bg-[#18181b]">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-zinc-800/50 transition-colors group">
                                {/* Sticky Cell 1: Company */}
                                <td className="sticky left-0 z-10 bg-[#18181b] group-hover:bg-[#1f1f23] px-6 py-4 whitespace-nowrap text-sm font-bold text-white border-r border-zinc-800 shadow-[4px_0_8px_rgba(0,0,0,0.05)] min-w-[220px] max-w-[220px] truncate">
                                    {row.companyName}
                                </td>
                                {/* Sticky Cell 2: Role */}
                                <td className="sticky left-[220px] z-10 bg-[#18181b] group-hover:bg-[#1f1f23] px-6 py-4 whitespace-nowrap text-sm text-zinc-300 border-r border-zinc-800 shadow-[4px_0_8px_rgba(0,0,0,0.05)] min-w-[200px] max-w-[200px] truncate">
                                    {row.role}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300 font-mono">{row.entryLevelSalary.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-300 font-mono font-bold">{row.midLevelSalary.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{row.currency}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                    <span className="mr-2">{getFlagEmoji(row.country)}</span>{row.country}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                    <span className="px-3 py-1 bg-zinc-700/50 rounded-full text-xs font-medium">{row.companyType}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{row.industryDomain}</td>
                                
                                {/* New Rating Columns */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500 tracking-tight">
                                     {Array.from({length: row.workplaceRating || 0}).map((_,i) => '★').join('')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-400 tracking-tight">
                                     {Array.from({length: row.sizeRating || 0}).map((_,i) => '■').join('')}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-500 max-w-xs truncate">{row.salaryExplanation}</td>
                                
                                {/* Link Button */}
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <a 
                                        href={row.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 hover:bg-indigo-600 text-zinc-400 hover:text-white transition-colors"
                                        title="Open Source"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && (
                    <div className="p-20 text-center text-zinc-500">
                        No data recorded yet.
                    </div>
                )}
            </div>
        </div>
    </div>
  );
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

export default DataGridView;
