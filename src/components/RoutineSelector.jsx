// Template list — shows all weekly templates, highlights active, inline input to create new
import { useState, useRef } from 'react';

export default function RoutineSelector({ routines: r }) {
  const [newName, setNewName] = useState('');
  const inputRef = useRef(null);

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    r.addRoutine(trimmed);
    setNewName('');
  }

  return (
    <div className="px-4 py-3 border-b border-slate-700">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Weekly Templates
      </h2>

      {/* Template list */}
      <div className="space-y-0.5 mb-2">
        {r.routines.map((routine) => {
          const isActive = routine.id === r.activeRoutineId;
          return (
            <div
              key={routine.id}
              onClick={() => r.setActiveRoutineId(routine.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors ${
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {/* Active indicator dot */}
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isActive ? 'bg-blue-400' : 'bg-transparent'
                }`}
              />
              <span className="flex-1 truncate">{routine.name}</span>
              {/* Delete — hidden for the first routine (Default) */}
              {r.routines.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${routine.name}"?`)) {
                      r.deleteRoutine(routine.id);
                    }
                  }}
                  className="p-0.5 text-slate-600 hover:text-red-400 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 2l8 8M2 10l8-8" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Always-visible input for new template */}
      <div className="flex items-center gap-2 px-2 py-1.5">
        <button
          onClick={() => inputRef.current?.focus()}
          className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <input
          ref={inputRef}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
            if (e.key === 'Escape') { setNewName(''); e.target.blur(); }
          }}
          placeholder="New template..."
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
        />
      </div>
    </div>
  );
}
