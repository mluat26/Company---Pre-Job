import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { generateGeminiPrompt, parseGeminiResponse } from '../services/promptService';
import { CompanyData } from '../types';

interface ExtractionFormProps {
  onDataParsed: (data: CompanyData) => void;
  onApiRequest: () => boolean; // Returns true if request allowed
  onApiKeySet: () => void;
}

const ExtractionForm: React.FC<ExtractionFormProps> = ({ onDataParsed, onApiRequest, onApiKeySet }) => {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [apiKey, setApiKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Auto Mode State
  const [step, setStep] = useState<1 | 2>(1);
  const [url, setUrl] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Manual Mode State
  const [manualData, setManualData] = useState<Partial<CompanyData>>({
      companyName: '',
      role: 'Product Designer',
      entryLevelSalary: 0,
      midLevelSalary: 0,
      currency: 'USD',
      country: 'United States',
      type: 'Product',
      companyType: 'Startup',
      industryDomain: 'SaaS',
      website: '',
      salaryExplanation: 'Manual Entry',
      workplaceRating: 3,
      sizeRating: 2
  });

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
        setApiKey(storedKey);
        onApiKeySet();
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setApiKey(val);
    localStorage.setItem('gemini_api_key', val);
    if (val) onApiKeySet();
  };

  const handleGeneratePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const prompt = generateGeminiPrompt(url);
    setGeneratedPrompt(prompt);
    setStep(2);
  };

  const handleDirectExtraction = async () => {
      if (!apiKey || !url) return;
      
      // RATE LIMIT CHECK
      const allowed = onApiRequest();
      if (!allowed) return;

      setIsProcessing(true);
      setError(null);

      try {
          const ai = new GoogleGenAI({ apiKey: apiKey });
          const prompt = generateGeminiPrompt(url);
          
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt,
          });

          if (response.text) {
              const data = parseGeminiResponse(response.text);
              if (url) data.website = url;
              onDataParsed(data);
          } else {
              throw new Error("Empty response from AI");
          }
      } catch (err: any) {
          setError(err.message || "Failed to extract data via API");
      } finally {
          setIsProcessing(false);
      }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    window.open('https://gemini.google.com/app', '_blank');
  };

  const handleParseJson = () => {
    setError(null);
    try {
      const data = parseGeminiResponse(jsonInput);
      if (url) data.website = url;
      onDataParsed(data);
    } catch (err: any) {
      setError("Error parsing JSON. Ensure you copied the exact Gemini output.");
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Basic validation
      if (!manualData.companyName || !manualData.role) return;
      
      onDataParsed(manualData as CompanyData);
  };

  return (
    <div className="w-full mx-auto space-y-6 relative z-10">
      
      {/* MAGICAL "APPLE INTELLIGENCE" STYLE CONTAINER */}
      <div className="relative rounded-[32px] overflow-hidden p-[1px] shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_-10px_rgba(120,119,198,0.4)] group">
          
          {/* Moving Gradient Border Layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 opacity-40 group-hover:opacity-70 transition-opacity duration-700 animate-gradient-xy"></div>
          
          {/* Main Content Surface */}
          <div className="relative h-full w-full bg-[#0a0a0c]/80 backdrop-blur-2xl rounded-[31px] p-8 overflow-hidden">
              
              {/* === ETHEREAL BACKGROUND BLOBS === */}
              {/* These create the soft, magical multi-color glow behind the content */}
              <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-600/20 blur-[130px] animate-pulse"></div>
              <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-fuchsia-600/20 blur-[130px] animate-pulse delay-1000"></div>
              <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none"></div>

              {/* Noise Texture for that premium feel */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

              <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-white/10 pb-8">
                      <div className="flex-1">
                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400 mb-2 drop-shadow-sm">
                            Add Intelligence
                        </h2>
                        <p className="text-zinc-300 text-sm max-w-xl font-medium leading-relaxed opacity-80">
                            Extract data from career pages using AI or input your own research manually. 
                            Add your API Key for instant one-click extraction.
                        </p>
                        
                        {/* API Key Input */}
                        {mode === 'auto' && (
                            <div className="mt-5 flex items-center gap-2 max-w-md animate-fade-in">
                                 <div className="relative flex-1 group">
                                    <span className="absolute left-3 top-2.5 text-zinc-400 group-focus-within:text-cyan-400 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                                    </span>
                                    <input 
                                        type="password" 
                                        value={apiKey}
                                        onChange={handleApiKeyChange}
                                        placeholder="Gemini API Key (Optional)"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:bg-black/40 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all"
                                    />
                                 </div>
                            </div>
                        )}
                      </div>

                      {/* Mode Switcher - Glass Style */}
                      <div className="bg-white/5 p-1 rounded-full flex gap-1 border border-white/10 shadow-lg shrink-0 backdrop-blur-md">
                          <button 
                            onClick={() => setMode('auto')}
                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${mode === 'auto' ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-zinc-400 hover:text-white'}`}
                          >
                              AUTO EXTRACT
                          </button>
                          <button 
                            onClick={() => setMode('manual')}
                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${mode === 'manual' ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-zinc-400 hover:text-white'}`}
                          >
                              MANUAL ENTRY
                          </button>
                      </div>
                  </div>

                  {/* === AUTO MODE === */}
                  {mode === 'auto' && (
                      <div className="animate-fade-in">
                          {step === 1 ? (
                             <form onSubmit={handleGeneratePrompt}>
                                <div className="relative flex items-center bg-black/20 backdrop-blur-md rounded-full p-2 border border-white/10 shadow-2xl group focus-within:border-indigo-400/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <div className="pl-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                    </div>
                                    <input
                                        type="url"
                                        className="w-full bg-transparent text-white placeholder-zinc-500 px-4 py-3 focus:outline-none text-base font-medium"
                                        placeholder="Paste career page URL here..."
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        required
                                    />
                                    
                                    {apiKey ? (
                                        <button
                                            type="button"
                                            onClick={handleDirectExtraction}
                                            disabled={!url.trim() || isProcessing}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap flex items-center gap-2 border border-white/10"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    MAGIC...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                                    AUTO MAGIC
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={!url.trim()}
                                            className="bg-zinc-800 text-zinc-300 border border-zinc-600 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-700 hover:text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            GENERATE PROMPT
                                        </button>
                                    )}
                                </div>
                                {error && <p className="text-red-400 text-sm mt-3 font-medium text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20 shadow-inner">{error}</p>}
                             </form>
                          ) : (
                              <div className="space-y-6">
                                  <div className="bg-black/30 border border-white/10 rounded-2xl p-4 shadow-inner">
                                      <div className="flex justify-between items-center mb-2">
                                          <span className="text-xs font-bold text-green-400 uppercase tracking-wide">1. Copy Prompt</span>
                                          <button onClick={() => setStep(1)} className="text-xs text-zinc-400 hover:text-white underline">Change URL</button>
                                      </div>
                                      <div className="relative">
                                          <div className="w-full h-20 bg-black/40 text-zinc-400 font-mono text-[10px] p-3 rounded-xl border border-white/5 overflow-y-auto">
                                              {generatedPrompt}
                                          </div>
                                          <button onClick={handleCopyPrompt} className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg transition">
                                              COPY & OPEN AI
                                          </button>
                                      </div>
                                  </div>

                                  <div>
                                      <label className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2 block">2. Paste JSON Result</label>
                                      <textarea 
                                          value={jsonInput}
                                          onChange={(e) => setJsonInput(e.target.value)}
                                          placeholder='Paste the JSON response from Gemini here...'
                                          className="w-full h-32 bg-black/30 text-zinc-100 font-mono text-xs p-4 rounded-2xl border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                                      />
                                      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                                      <button 
                                          onClick={handleParseJson}
                                          disabled={!jsonInput.trim()}
                                          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-full shadow-lg transition disabled:opacity-50"
                                      >
                                          CREATE CARD
                                      </button>
                                  </div>
                              </div>
                          )}
                      </div>
                  )}

                  {/* === MANUAL MODE === */}
                  {mode === 'manual' && (
                      <form onSubmit={handleManualSubmit} className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          <div className="space-y-5">
                               <div>
                                   <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Company Name</label>
                                   <input required type="text" value={manualData.companyName} onChange={e => setManualData({...manualData, companyName: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:bg-black/50 outline-none placeholder-zinc-700 transition-colors" placeholder="e.g. Acme Corp" />
                               </div>
                               <div>
                                   <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Website URL</label>
                                   <input type="url" value={manualData.website} onChange={e => setManualData({...manualData, website: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:bg-black/50 outline-none placeholder-zinc-700 transition-colors" placeholder="https://..." />
                               </div>
                               <div className="grid grid-cols-3 gap-3">
                                   <div>
                                       <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Entry Salary</label>
                                       <input type="number" value={manualData.entryLevelSalary} onChange={e => setManualData({...manualData, entryLevelSalary: Number(e.target.value)})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:bg-black/50 outline-none transition-colors" placeholder="0" />
                                   </div>
                                   <div>
                                       <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Mid Salary</label>
                                       <input type="number" value={manualData.midLevelSalary} onChange={e => setManualData({...manualData, midLevelSalary: Number(e.target.value)})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:bg-black/50 outline-none transition-colors" placeholder="0" />
                                   </div>
                                   <div>
                                       <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Currency</label>
                                       <input type="text" value={manualData.currency} onChange={e => setManualData({...manualData, currency: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:bg-black/50 outline-none uppercase transition-colors" placeholder="USD" />
                                   </div>
                               </div>
                          </div>

                          <div className="space-y-5">
                               <div>
                                   <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Target Role</label>
                                   <input 
                                      type="text" 
                                      value={manualData.role} 
                                      onChange={e => setManualData({...manualData, role: e.target.value})} 
                                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:bg-black/50 outline-none placeholder-zinc-700 transition-colors" 
                                      placeholder="e.g. Product Designer"
                                   />
                               </div>
                               <div className="grid grid-cols-2 gap-3">
                                   <div>
                                       <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Country</label>
                                       <input 
                                          type="text" 
                                          value={manualData.country} 
                                          onChange={e => setManualData({...manualData, country: e.target.value})} 
                                          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:bg-black/50 outline-none placeholder-zinc-700 transition-colors"
                                          placeholder="e.g. United States"
                                       />
                                   </div>
                                   <div>
                                       <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Domain</label>
                                       <input 
                                          type="text" 
                                          value={manualData.industryDomain} 
                                          onChange={e => setManualData({...manualData, industryDomain: e.target.value})} 
                                          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:bg-black/50 outline-none placeholder-zinc-700 transition-colors"
                                          placeholder="e.g. Fintech"
                                       />
                                   </div>
                               </div>

                               {/* RATINGS */}
                               <div className="grid grid-cols-2 gap-3 p-4 bg-black/20 rounded-xl border border-white/10 shadow-inner">
                                    <div>
                                       <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Workplace Rating (1-5)</label>
                                       <input 
                                          type="number" 
                                          min="1" max="5"
                                          value={manualData.workplaceRating} 
                                          onChange={e => setManualData({...manualData, workplaceRating: Number(e.target.value)})} 
                                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500/50 outline-none text-center font-mono"
                                       />
                                       <div className="flex justify-center mt-2 gap-1 text-yellow-400 text-xs">
                                            {Array.from({length: 5}).map((_, i) => (
                                                <span key={i} className={i < (manualData.workplaceRating || 0) ? "opacity-100" : "opacity-20"}>★</span>
                                            ))}
                                       </div>
                                   </div>
                                   <div>
                                       <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Company Size (1-5)</label>
                                       <input 
                                          type="number" 
                                          min="1" max="5"
                                          value={manualData.sizeRating} 
                                          onChange={e => setManualData({...manualData, sizeRating: Number(e.target.value)})} 
                                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500/50 outline-none text-center font-mono"
                                       />
                                       <div className="flex justify-center mt-2 gap-1 text-indigo-400 text-xs">
                                            {Array.from({length: 5}).map((_, i) => (
                                                <span key={i} className={i < (manualData.sizeRating || 0) ? "opacity-100" : "opacity-20"}>■</span>
                                            ))}
                                       </div>
                                   </div>
                               </div>

                               <button type="submit" className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)] transition hover:scale-[1.01] border border-white/10">
                                   ADD CARD MANUALLY
                               </button>
                          </div>
                      </form>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default ExtractionForm;
