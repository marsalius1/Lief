// Simple inline input at the bottom of the parking lot to create new tasks
import { useState, useRef } from 'react';
import { PRESET_COLORS } from '../constants';

export default function NewTaskForm({ onAdd }) {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  function handleSubmit() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), duration: 30, color: PRESET_COLORS[0].value });
    setName('');
    inputRef.current?.focus();
  }

  return (
    <div className="flex items-center gap-2 py-2">
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
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') { setName(''); e.target.blur(); }
        }}
        placeholder="Add task..."
        className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
      />
    </div>
  );
}
