import React, { useState, useEffect } from 'react';
import ExtractionForm from './components/ExtractionForm';
import ResultDisplay from './components/ResultDisplay';
import CardSlider from './components/CardSlider';
import MiniCard from './components/MiniCard';
import DataGridView from './components/DataGridView';
import StorageModal from './components/StorageModal';
import { CompanyData, SavedCard } from './types';
import * as storageService from './services/storageService';

const App: React.FC = () => {
  const [data, setData] = useState<CompanyData | SavedCard | null>(null);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isDataGridOpen, setIsDataGridOpen] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  
  // API Rate Limiting State
  const [apiUsage, setApiUsage] = useState({ daily: 0, minute: 0 });
  const [hasApiKey, setHasApiKey] = useState(false);

  // Load from DB on mount
  useEffect(() => {
    storageService.getAllCards().then(cards => {
        setSavedCards(cards);
    });
    
    // Check for existing API key in local storage to show/hide counter
    setHasApiKey(!!localStorage.getItem('gemini_api_key'));
    updateApiUsageState();

    // Refresh usage state periodically to update the "minute" counter visually
    const interval = setInterval(updateApiUsageState, 10000);
    return () => clearInterval(interval);
  }, []);

  // Rate Limit Logic
  const updateApiUsageState = () => {
      const logs = JSON.parse(localStorage.getItem('api_usage_logs') || '[]');
      const now = Date.now();
      // Filter logs for last 24h
      const dailyLogs = logs.filter((ts: number) => now - ts < 24 * 60 * 60 * 1000);
      // Filter logs for last 1 min
      const minuteLogs = logs.filter((ts: number) => now - ts < 60 * 1000);
      
      setApiUsage({
          daily: dailyLogs.length,
          minute: minuteLogs.length
      });
  };

  const handleApiRequestCheck = (): boolean => {
      const logs = JSON.parse(localStorage.getItem('api_usage_logs') || '[]');
      const now = Date.now();
      const dailyLogs = logs.filter((ts: number) => now - ts < 24 * 60 * 60 * 1000);
      const minuteLogs = logs.filter((ts: number) => now - ts < 60 * 1000);

      if (dailyLogs.length >= 20) {
          alert("Daily API limit reached (20/day). Please wait until tomorrow.");
          return false;
      }
      if (minuteLogs.length >= 5) {
          alert("Minute API limit reached (5/min). Please slow down.");
          return false;
      }

      // If allowed, we update logs
      const newLogs = [...dailyLogs, now]; // Keep only relevant daily logs to save space + new one
      localStorage.setItem('api_usage_logs', JSON.stringify(newLogs));
      updateApiUsageState();
      return true;
  };

  // Global Storage Calc
  const storageUsedBytes = storageService.calculateStorageUsage(savedCards);
  const storageLimitBytes = 5 * 1024 * 1024; // 5MB Soft Limit for UI
  const storagePercentage = (storageUsedBytes / storageLimitBytes) * 100;

  const handleDataParsed = (parsedData: CompanyData) => {
    setData(parsedData);
  };

  const handleReset = () => {
    setData(null);
  };

  const handleSaveCard = async (card: SavedCard) => {
    await storageService.saveCardToDB(card);
    const cards = await storageService.getAllCards();
    setSavedCards(cards);
    // Auto-return to home screen after saving
    setData(null);
  };

  const handleDeleteCard = async (cardId: string) => {
    await storageService.deleteCardFromDB(cardId);
    setSavedCards(prev => prev.filter(c => c.id !== cardId));
    
    if (data && 'id' in data && (data as SavedCard).id === cardId) {
        setData(null);
    }
  };

  const handleClearAll = async () => {
      await storageService.clearAllData();
      setSavedCards([]);
      setData(null);
  };

  const handleSelectSavedCard = (card: SavedCard) => {
      setIsSliderOpen(true);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500 selection:text-white bg-[#0a0a0c] text-white">
      
      {/* === GLOBAL GRAIN & ATMOSPHERE === */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay opacity-20"></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="relative z-20 w-full max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 items-center">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <span className="font-bold text-white">D</span>
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block text-white">Data Ops <span className="text-zinc-500 font-normal">v2.3</span></span>
          </div>

          {/* Center: Global Storage Indicator & API Count */}
          <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => setIsStorageModalOpen(true)}
                className="flex flex-col items-center justify-center group"
              >
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-indigo-500 transition-colors">Storage</span>
                    <span className="text-[10px] font-mono text-zinc-300">{(storageUsedBytes / 1024).toFixed(1)} KB</span>
                </div>
                <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-transparent group-hover:border-indigo-500/30 transition-colors">
                    <div 
                        className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                        style={{ width: `${Math.max(storagePercentage, 2)}%` }}
                    ></div>
                </div>
              </button>

              {/* API Count Display (Only visible if Key exists or used) */}
              {(hasApiKey || apiUsage.daily > 0) && (
                  <div className="hidden md:flex flex-col items-center justify-center group">
                      <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-cyan-500 transition-colors">API Limit</span>
                          <span className={`text-[10px] font-mono ${apiUsage.daily >= 20 ? 'text-red-500' : 'text-zinc-300'}`}>{apiUsage.daily}/20</span>
                      </div>
                      <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-transparent group-hover:border-cyan-500/30 transition-colors">
                          <div 
                              className={`h-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] ${apiUsage.daily >= 20 ? 'bg-red-500' : 'bg-cyan-500'}`}
                              style={{ width: `${(apiUsage.daily / 20) * 100}%` }}
                          ></div>
                      </div>
                  </div>
              )}
          </div>

          {/* Right: Tools */}
          <div className="flex justify-end items-center gap-3">
             <button 
                onClick={() => setIsDataGridOpen(true)}
                className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-5 py-2.5 rounded-full transition-all text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wide shadow-sm"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7-4h14M4 6h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>
                <span className="hidden md:inline">Grid</span>
            </button>

            <button 
                onClick={() => setIsSliderOpen(true)}
                className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 px-5 py-2.5 rounded-full transition-all group shadow-lg"
            >
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white">Deck</span>
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">{savedCards.length}</span>
            </button>
          </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 flex flex-col items-center mt-12">
        
        {/* VIEW: Extraction Form (Dashboard) OR Result Display */}
        {!data ? (
           <div className="w-full max-w-5xl space-y-12">
               {/* The Form */}
               <ExtractionForm 
                    onDataParsed={handleDataParsed} 
                    onApiRequest={handleApiRequestCheck}
                    onApiKeySet={() => setHasApiKey(true)}
               />
               
               {/* Recent Cards Grid (If any) */}
               {savedCards.length > 0 && (
                   <div className="animate-fade-in-up">
                       <div className="flex items-center justify-between mb-6 px-2">
                           <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                Recent Collection
                           </h3>
                           <button onClick={() => setIsSliderOpen(true)} className="text-indigo-500 text-xs font-bold hover:text-indigo-400 transition-colors">VIEW ALL</button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           {savedCards.slice(0, 3).map(card => (
                               <MiniCard 
                                    key={card.id} 
                                    card={card} 
                                    onClick={() => handleSelectSavedCard(card)} 
                                    onDelete={() => handleDeleteCard(card.id)}
                               />
                           ))}
                       </div>
                   </div>
               )}
           </div>
        ) : (
           <ResultDisplay 
                data={data} 
                onReset={handleReset} 
                onSave={handleSaveCard}
           />
        )}

      </div>

      {/* Collection Drawer */}
      <CardSlider 
        isOpen={isSliderOpen} 
        onClose={() => setIsSliderOpen(false)} 
        cards={savedCards}
        onUpdateCard={handleSaveCard}
        onDeleteCard={handleDeleteCard}
      />

      {/* Data Grid View Modal */}
      <DataGridView 
        isOpen={isDataGridOpen} 
        onClose={() => setIsDataGridOpen(false)} 
        data={savedCards} 
      />

      {/* Storage Manager Modal */}
      <StorageModal 
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
        usageBytes={storageUsedBytes}
        recordCount={savedCards.length}
        onClearAll={handleClearAll}
      />

    </div>
  );
};

export default App;
