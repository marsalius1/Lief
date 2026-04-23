// Weekly time grid — 7 day columns (Mon–Sun) with hour rows and task blocks
import { forwardRef, useMemo, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  START_HOUR,
  END_HOUR,
  HOUR_HEIGHT,
  LABEL_WIDTH,
  DAY_NAMES,
} from '../constants';
import { formatHourLabel, getTopOffset, getHeight } from '../utils';
import ScheduledTask from './ScheduledTask';
import NowLine from './NowLine';

const TimeGrid = forwardRef(function TimeGrid(
  { tasks, onTaskClick, onResizeTask, onDeleteTask, onRepeatTask, onQuickCreate, onInlineRename, inlineEditId, dragPreview },
  ref
) {
  const { setNodeRef } = useDroppable({ id: 'time-grid' });
  const localRef = useRef(null);

  function combinedRef(node) {
    setNodeRef(node);
    localRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }

  // Hour marks for the visible range
  const hours = useMemo(() => {
    const result = [];
    for (let h = START_HOUR; h <= END_HOUR; h++) result.push(h);
    return result;
  }, []);

  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  // Today's column index (0 = Mon, 6 = Sun)
  const todayIndex = useMemo(() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  }, []);

  // Resolve the task being previewed during drag
  const previewTask = dragPreview
    ? tasks.find((t) => t.id === dragPreview.taskId)
    : null;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Day column headers (fixed, not scrollable) */}
      <div
        className="flex border-b border-gray-200 bg-white flex-shrink-0"
        style={{ paddingLeft: LABEL_WIDTH }}
      >
        {DAY_NAMES.map((name, i) => (
          <div
            key={name}
            className={`flex-1 text-center py-2.5 text-sm font-semibold border-l border-gray-200
              ${i === todayIndex ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'}`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Scrollable grid body */}
      <div ref={combinedRef} className="flex-1 overflow-y-auto bg-gray-50">
        <div className="relative" style={{ height: totalHeight }}>
          {/* Hour labels on the left */}
          {hours.map((hour) => (
            <span
              key={hour}
              className="absolute text-xs text-gray-400 font-medium select-none"
              style={{
                left: 8,
                top: Math.max(0, (hour - START_HOUR) * HOUR_HEIGHT - 7),
              }}
            >
              {formatHourLabel(hour)}
            </span>
          ))}

          {/* Day columns */}
          <div
            className="absolute top-0 bottom-0 flex"
            style={{ left: LABEL_WIDTH, right: 0 }}
          >
            {DAY_NAMES.map((name, dayIndex) => {
              const dayTasks = tasks.filter(
                (t) => t.scheduledTime !== null && t.day === dayIndex
              );
              const isToday = dayIndex === todayIndex;

              function handleDblClick(e) {
                const rect = e.currentTarget.getBoundingClientRect();
                const relativeY = e.clientY - rect.top;
                const mins = START_HOUR * 60 + (relativeY / HOUR_HEIGHT) * 60;
                const snapped = Math.round(mins / 15) * 15;
                const time = Math.max(START_HOUR * 60, Math.min(END_HOUR * 60 - 30, snapped));
                onQuickCreate(dayIndex, time);
              }

              return (
                <div
                  key={dayIndex}
                  onDoubleClick={handleDblClick}
                  className={`flex-1 relative border-l border-gray-200 ${
                    isToday ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {/* Horizontal hour & half-hour lines */}
                  {hours.slice(0, -1).map((hour) => {
                    const rowTop = (hour - START_HOUR) * HOUR_HEIGHT;
                    return (
                      <div key={hour}>
                        <div
                          className="absolute left-0 right-0 border-t border-gray-200"
                          style={{ top: rowTop }}
                        />
                        <div
                          className="absolute left-0 right-0 border-t border-dashed border-gray-100"
                          style={{ top: rowTop + HOUR_HEIGHT * 0.5 }}
                        />
                      </div>
                    );
                  })}

                  {/* Bottom border */}
                  <div
                    className="absolute left-0 right-0 border-t border-gray-200"
                    style={{ top: totalHeight }}
                  />

                  {/* Scheduled task blocks */}
                  {dayTasks.map((task) => (
                    <ScheduledTask
                      key={task.id}
                      task={task}
                      onClick={() => onTaskClick(task)}
                      onResize={onResizeTask}
                      onDelete={onDeleteTask}
                      onRepeat={onRepeatTask}
                      isEditing={task.id === inlineEditId}
                      onRename={(name) => onInlineRename(task.id, name)}
                    />
                  ))}

                  {/* Drag preview ghost for this column */}
                  {previewTask &&
                    dragPreview &&
                    dragPreview.day === dayIndex && (
                      <div
                        className="absolute left-1 right-1 rounded-lg border-2 border-dashed pointer-events-none z-30"
                        style={{
                          top: getTopOffset(dragPreview.time),
                          height: getHeight(previewTask.duration),
                          backgroundColor: previewTask.color + '30',
                          borderColor: previewTask.color,
                        }}
                      />
                    )}

                  {/* Current time indicator (today only) */}
                  {isToday && <NowLine />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default TimeGrid;
