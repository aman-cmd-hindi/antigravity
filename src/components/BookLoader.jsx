import { Terminal } from 'lucide-react';

const BookLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#09090b] flex flex-col items-center justify-center text-zinc-100">
      <div className="w-full max-w-sm px-6">
        <div className="bg-[#0d0e12] border border-zinc-800 p-5 rounded-md shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">SYS_INIT // v2.6</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">LIVE</span>
            </div>
          </div>

          <div className="space-y-1.5 py-1">
            <div className="text-xs font-mono font-medium text-zinc-200 tracking-tight">
              TIWARI TUTORIALS CORE
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Loading modules: JEE · NEET · Boards · Commerce
            </div>
          </div>

          {/* Minimalist 2px Progress Line */}
          <div className="w-full h-1 bg-zinc-800 rounded-none overflow-hidden relative">
            <div className="h-full bg-zinc-100 animate-loaderLine" />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-1">
            <span>MEM: OK</span>
            <span>SEC_HASH: VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLoader;
