// Positioned task block inside a day column — draggable, resizable, with context menu
import { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { getTopOffset, getHeight, getContrastColor } from '../utils';
import { HOUR_HEIGHT } from '../constants';

export default function ScheduledTask({ task, onClick, onResize, onDelete, onRepeat, isEditing, onRename }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });
  const [liveDuration, setLiveDuration] = useState(null);
  const liveDurationRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);

  // Close context menu on any click
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [contextMenu]);

  function handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }

  function handleResizeStart(e) {
    e.stopPropagation();
    e.preventDefault();
    const startY = e.clientY;
    const base = task.duration;

    function onMove(ev) {
      const d = Math.max(15, base + Math.round(((ev.clientY - startY) / HOUR_HEIGHT) * 60 / 15) * 15);
      liveDurationRef.current = d;
      setLiveDuration(d);
    }

    function onUp() {
      if (liveDurationRef.current !== null) onResize(task.id, liveDurationRef.current);
      liveDurationRef.current = null;
      setLiveDuration(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  const duration = liveDuration ?? task.duration;
  const top = getTopOffset(task.scheduledTime);
  const height = getHeight(duration);
  const textColor = getContrastColor(task.color);

  return (
    <>
      <div
        ref={setNodeRef}
        onContextMenu={handleContextMenu}
        className={`absolute rounded-lg shadow-md overflow-hidden select-none transition-opacity
          ${isDragging ? 'opacity-30 z-50' : 'z-10'}`}
        style={{ top, height: Math.max(height, 20), left: 2, right: 2, backgroundColor: task.color }}
      >
        {/* Delete X — top right */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center rounded-full opacity-40 hover:opacity-100 transition-opacity"
          style={{ color: textColor }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l6 6M1 7l6-6" />
          </svg>
        </button>

        {/* Drag + click zone */}
        <div
          {...attributes}
          {...listeners}
          onClick={() => { if (!isDragging) onClick(); }}
          className="h-full cursor-grab active:cursor-grabbing"
        >
          <div className="px-2 py-0.5 h-full flex items-center pr-5" style={{ color: textColor }}>
            {isEditing ? (
              <input
                autoFocus
                defaultValue={task.name}
                onBlur={(e) => onRename(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.target.blur();
                  if (e.key === 'Escape') { e.target.value = ''; e.target.blur(); }
                }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-full bg-transparent text-sm font-semibold outline-none placeholder-white/50"
                style={{ color: 'inherit' }}
                placeholder="Task name..."
              />
            ) : (
              <p className="text-sm font-semibold truncate">{task.name}</p>
            )}
          </div>
        </div>

        {/* Resize handle */}
        <div
          onPointerDown={handleResizeStart}
          className="absolute bottom-0 left-0 right-0 h-3 cursor-s-resize
            opacity-0 hover:opacity-100 transition-opacity"
          style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
        />
      </div>

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          className="fixed z-[100] bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[180px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => onRepeat(task.id, [0, 1, 2, 3, 4, 5, 6])}
            className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            Repeat every day
          </button>
          <button
            onClick={() => onRepeat(task.id, [0, 1, 2, 3, 4])}
            className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            Repeat weekdays
          </button>
          <button
            onClick={() => onRepeat(task.id, [5, 6])}
            className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            Repeat weekends
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={() => { setContextMenu(null); onClick(); }}
            className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            Edit...
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}
