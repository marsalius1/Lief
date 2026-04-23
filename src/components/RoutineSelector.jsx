// Template list — shows all weekly templates, highlights active, inline input to create new
import { useState, useRef, useEffect } from 'react';

export default function RoutineSelector({ routines: r, onShareRoutine }) {
  const [newName, setNewName] = useState('');
  const inputRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, routine }
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const renameRef = useRef(null);

  useEffect(() => {
    if (renamingId) renameRef.current?.focus();
  }, [renamingId]);

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [contextMenu]);

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    r.addRoutine(trimmed);
    setNewName('');
  }

  function handleContextMenu(e, routine) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, routine });
  }

  function startRename(routine) {
    setRenamingId(routine.id);
    setRenameValue(routine.name);
    setContextMenu(null);
  }

  function commitRename() {
    if (renameValue.trim() && renamingId) {
      r.renameRoutine(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
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
          const isRenaming = renamingId === routine.id;
          return (
            <div
              key={routine.id}
              onClick={() => !isRenaming && r.setActiveRoutineId(routine.id)}
              onContextMenu={(e) => handleContextMenu(e, routine)}
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
              {isRenaming ? (
                <input
                  ref={renameRef}
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); } }}
                  onBlur={commitRename}
                  className="flex-1 bg-slate-900 text-sm text-white rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <span className="flex-1 truncate">{routine.name}</span>
              )}
              {r.routines.length > 1 && !isRenaming && (
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

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-[100] bg-slate-800 border border-slate-600 rounded-lg shadow-xl py-1 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => startRename(contextMenu.routine)}
            className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Rename
          </button>
          <button
            onClick={() => { onShareRoutine(contextMenu.routine); setContextMenu(null); }}
            className="w-full text-left px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Share with Marius
          </button>
        </div>
      )}
    </div>
  );
}
