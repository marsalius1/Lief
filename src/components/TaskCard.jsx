// Draggable task card in the parking lot sidebar
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskCard({ task, onClick, onDelete, isDragActive }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 mb-2 rounded-lg bg-slate-800 hover:bg-slate-700
        cursor-grab active:cursor-grabbing select-none transition-colors
        ${isDragActive ? 'opacity-30' : ''}`}
    >
      {/* Color indicator strip */}
      <div
        className="w-1 self-stretch rounded-full flex-shrink-0"
        style={{ backgroundColor: task.color }}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{task.name}</p>
      </div>

      {/* Duration badge */}
      <span className="text-xs text-slate-400 bg-slate-700/80 px-2 py-0.5 rounded-full flex-shrink-0">
        {task.duration}m
      </span>

      {/* Delete */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
        onPointerDown={(e) => e.stopPropagation()}
        className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 2l8 8M2 10l8-8" />
        </svg>
      </button>
    </div>
  );
}
