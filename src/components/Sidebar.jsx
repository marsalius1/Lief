// Left sidebar — routine selector, parking lot for unscheduled tasks
import { useState, useRef, useEffect } from 'react';
import RoutineSelector from './RoutineSelector';
import ParkingLot from './ParkingLot';
import ShareButton from './ShareButton';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export default function Sidebar({ routines, onTaskClick, activeId }) {
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const importRef = useRef(null);

  useEffect(() => {
    if (showImport) importRef.current?.focus();
  }, [showImport]);

  function handleImportSubmit() {
    if (!importText.trim()) return;
    const ok = routines.importRoutine(importText.trim());
    if (ok) {
      setImportText('');
      setShowImport(false);
    } else {
      alert('Invalid template JSON.');
    }
  }

  const unscheduledTasks = (routines.activeRoutine?.tasks || []).filter(
    (t) => t.scheduledTime === null
  );

  return (
    <div className="w-[300px] min-w-[300px] bg-slate-900 text-white flex flex-col h-screen border-r border-slate-700">
      {/* App header */}
      <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Lief</h1>
          <p className="text-xs text-slate-400 mt-0.5">Plan your day</p>
        </div>
        <button
          onClick={() => setShowImport((v) => !v)}
          title="Import template"
          className={`transition-colors ${showImport ? 'text-slate-300' : 'text-slate-600 hover:text-slate-400'}`}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </button>
      </div>

      {showImport && (
        <div className="px-4 py-3 border-b border-slate-700">
          <textarea
            ref={importRef}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') { setShowImport(false); setImportText(''); } }}
            placeholder="Paste template JSON here..."
            className="w-full h-20 text-xs bg-slate-800 text-white placeholder-slate-500 rounded px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleImportSubmit}
              className="flex-1 text-xs font-medium px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Import
            </button>
            <button
              onClick={() => { setShowImport(false); setImportText(''); }}
              className="flex-1 text-xs font-medium px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isSafari && (
        <div className="mx-4 mt-3 px-3 py-2 rounded bg-yellow-900/40 border border-yellow-700/50 flex items-start gap-2">
          <span className="text-yellow-500 text-sm flex-shrink-0 mt-px">&#9888;</span>
          <p className="text-xs text-yellow-300/90">
            Safari may clear local data after 7 days. Share your template regularly to keep a backup.
          </p>
        </div>
      )}

      <RoutineSelector routines={routines} />

      <ParkingLot
        tasks={unscheduledTasks}
        onAddTask={routines.addTask}
        onTaskClick={onTaskClick}
        onDeleteTask={routines.deleteTask}
        activeId={activeId}
      />

      <div className="px-4 py-3 border-t border-slate-700/50 space-y-3">
        <div className="bg-slate-800 rounded-lg px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">How to use</p>
          <ul className="text-xs text-slate-300 space-y-1.5">
            <li><span className="text-blue-400 font-medium">Double-click</span> the schedule to create a task</li>
            <li><span className="text-blue-400 font-medium">Right-click</span> a task for quick options</li>
            <li><span className="text-blue-400 font-medium">Click</span> a task for detailed editing</li>
            <li><span className="text-blue-400 font-medium">Drag & drop</span> tasks to reschedule</li>
          </ul>
        </div>

        <div className="flex items-start gap-2 bg-emerald-900/30 border border-emerald-800/40 rounded-lg px-3 py-2.5">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p className="text-xs text-emerald-300/90 leading-relaxed">
            100% private. All data is stored locally on your device and is never sent anywhere — unless you click "Share with Marius."
          </p>
        </div>
      </div>

      {routines.activeRoutine && (
        <ShareButton routine={routines.activeRoutine} />
      )}
    </div>
  );
}
