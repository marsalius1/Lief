// Slide-in panel for editing task details — name, duration, color, notes
import { useState } from 'react';
import { PRESET_COLORS, DAY_NAMES } from '../constants';
import { formatTimeShort } from '../utils';

export default function EditPanel({ task, siblingCount, onUpdate, onUpdateAll, onDelete, onRepeat, onClose }) {
  const [editAll, setEditAll] = useState(false);

  function handleChange(updates) {
    if (editAll && siblingCount > 0) {
      onUpdateAll(updates);
    } else {
      onUpdate(updates);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Click-to-close backdrop */}
      <div className="flex-1 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="w-[380px] bg-white shadow-2xl h-full flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Task</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Edit-all toggle */}
        {siblingCount > 0 && (
          <button
            onClick={() => setEditAll((v) => !v)}
            className={`mx-5 mt-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              editAll
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span
              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                editAll ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
              }`}
            >
              {editAll && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M2 5l2.5 2.5L8 3" />
                </svg>
              )}
            </span>
            Edit all "{task.name}" tasks ({siblingCount + 1})
          </button>
        )}

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              value={task.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={task.duration}
              onChange={(e) =>
                handleChange({
                  duration: Math.max(15, parseInt(e.target.value) || 15),
                })
              }
              min="15"
              step="15"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Scheduled info */}
          {task.scheduledTime !== null && task.day !== null && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled
              </label>
              <p className="text-sm text-gray-600">
                {DAY_NAMES[task.day]},{' '}
                {formatTimeShort(task.scheduledTime)} –{' '}
                {formatTimeShort(task.scheduledTime + task.duration)}
              </p>
            </div>
          )}

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => handleChange({ color: c.value })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    task.color === c.value
                      ? 'border-gray-800 scale-110 shadow-md'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Repeat */}
          {task.scheduledTime !== null && task.day !== null && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => onRepeat(task.id, [0, 1, 2, 3, 4, 5, 6])}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                >
                  Every day
                </button>
                <button
                  onClick={() => onRepeat(task.id, [0, 1, 2, 3, 4])}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                >
                  Weekdays
                </button>
                <button
                  onClick={() => onRepeat(task.id, [5, 6])}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                >
                  Weekends
                </button>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={task.notes || ''}
              onChange={(e) => handleChange({ notes: e.target.value })}
              rows={4}
              placeholder="Add notes..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer with delete */}
        <div className="px-5 py-4 border-t border-gray-200">
          <button
            onClick={() => {
              if (confirm('Delete this task?')) onDelete();
            }}
            className="w-full py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
