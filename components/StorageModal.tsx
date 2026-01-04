import React from 'react';

interface StorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  usageBytes: number;
  recordCount: number;
  onClearAll: () => void;
}

const StorageModal: React.FC<StorageModalProps> = ({ isOpen, onClose, usageBytes, recordCount, onClearAll }) => {
  if (!isOpen) return null;

  const usageKB = (usageBytes / 1024).toFixed(2);
  const quotaMB = 5; // Arbitrary UI limit for visual bar
  const percent = Math.min((usageBytes / (quotaMB * 1024 * 1024)) * 100, 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
        <div className="bg-[#121214] border border-zinc-800 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg">Storage Manager</h3>
                <button onClick={onClose} className="text-zinc-400 hover:text-white transition w-8 h-8 rounded-full hover:bg-zinc-800 flex items-center justify-center">✕</button>
            </div>
            
            <div className="p-8 space-y-6">
                <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-indigo-400 mb-2">{usageKB} <span className="text-sm text-zinc-500">KB</span></div>
                    <div className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Total IndexedDB Usage</div>
                </div>

                <div className="bg-zinc-900 rounded-full h-4 w-full overflow-hidden border border-zinc-800 relative">
                     <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${Math.max(percent, 2)}%` }}
                     ></div>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono font-medium">
                    <span>0 KB</span>
                    <span>{quotaMB} MB (Soft Limit)</span>
                </div>

                <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-zinc-300 text-sm font-medium">Total Records</span>
                        <span className="text-white font-mono font-bold">{recordCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-300 text-sm font-medium">Storage Type</span>
                        <span className="text-indigo-400 text-[10px] font-bold px-2 py-1 bg-indigo-500/10 rounded-full">IndexedDB</span>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-[#0a0a0c] border-t border-zinc-800 flex justify-between items-center">
                <button onClick={onClose} className="text-zinc-400 text-xs font-bold hover:text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors">CANCEL</button>
                <button 
                    onClick={() => {
                        if(confirm('Are you sure you want to delete all data? This cannot be undone.')) {
                            onClearAll();
                            onClose();
                        }
                    }}
                    className="bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 px-6 py-3 rounded-full text-xs font-bold transition-colors"
                >
                    CLEAR ALL DATA
                </button>
            </div>
        </div>
    </div>
  );
};

export default StorageModal;
