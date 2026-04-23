// Root component — DnD context, layout, and edit panel orchestration
import { useState, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import useRoutines from './hooks/useRoutines';
import Sidebar from './components/Sidebar';
import TimeGrid from './components/TimeGrid';
import EditPanel from './components/EditPanel';
import { computeScheduleFromPointer, getContrastColor, getTopOffset } from './utils';

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;

function MobileNotice() {
  return (
    <div className="h-screen bg-slate-900 flex items-center justify-center px-8">
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-2">Lief</h1>
        <p className="text-slate-400 text-sm mb-6">Plan your day</p>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Lief is designed for laptop and desktop screens. Please open it on a larger device.
        </p>
        <div className="bg-slate-800 rounded-lg px-4 py-3">
          <p className="text-xs text-slate-500 mb-1">Visit on your computer:</p>
          <p className="text-sm text-blue-400 font-medium select-all">lief-in-the-wind.netlify.app</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  if (isMobile) return <MobileNotice />;

  const routines = useRoutines();
  const [editingTask, setEditingTask] = useState(null);
  const [siblingIds, setSiblingIds] = useState([]);
  const [inlineEditId, setInlineEditId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);
  const gridRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const snapOffsetRef = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const activeTask = activeId
    ? routines.activeRoutine?.tasks.find((t) => t.id === activeId)
    : null;

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragMove(event) {
    const { activatorEvent, delta, over } = event;
    const clientX = activatorEvent.clientX + delta.x;
    const clientY = activatorEvent.clientY + delta.y;
    pointerRef.current = { x: clientX, y: clientY };

    if (over?.id === 'time-grid' && gridRef.current) {
      const { day, time } = computeScheduleFromPointer(clientX, clientY, gridRef.current);

      // Snap overlay top to the preview row on the grid
      const gridRect = gridRef.current.getBoundingClientRect();
      const desiredY = gridRect.top - gridRef.current.scrollTop + getTopOffset(time);
      snapOffsetRef.current = desiredY - clientY;

      setDragPreview((prev) => {
        if (prev && prev.taskId === event.active.id && prev.time === time && prev.day === day)
          return prev;
        return { taskId: event.active.id, day, time };
      });
    } else {
      snapOffsetRef.current = 0;
      setDragPreview((prev) => (prev === null ? prev : null));
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    setDragPreview(null);

    if (!over || !active) return;

    const taskId = active.id;
    const task = routines.activeRoutine?.tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (over.id === 'time-grid' && gridRef.current) {
      const { day, time } = computeScheduleFromPointer(
        pointerRef.current.x,
        pointerRef.current.y,
        gridRef.current
      );
      routines.scheduleTask(taskId, time, day);
    } else if (over.id === 'parking-lot') {
      if (task.scheduledTime !== null) {
        routines.unscheduleTask(taskId);
      }
    } else {
      // Dropped over another task — parking lot reorder or unschedule
      const overTask = routines.activeRoutine?.tasks.find(
        (t) => t.id === over.id
      );
      if (overTask) {
        if (task.scheduledTime !== null && overTask.scheduledTime === null) {
          routines.unscheduleTask(taskId);
        } else if (
          task.scheduledTime === null &&
          overTask.scheduledTime === null
        ) {
          routines.reorderTasks(taskId, over.id);
        }
      }
    }
  }

  function handleDragCancel() {
    setActiveId(null);
    setDragPreview(null);
  }

  function handleTaskClick(task) {
    const siblings = (routines.activeRoutine?.tasks || [])
      .filter((t) => t.name === task.name && t.id !== task.id)
      .map((t) => t.id);
    setSiblingIds(siblings);
    setEditingTask(task);
  }

  function handleResizeTask(taskId, duration) {
    routines.updateTask(taskId, { duration });
  }

  function handleDeleteTask(taskId) {
    routines.deleteTask(taskId);
  }

  function handleRepeatTask(taskId, days) {
    routines.repeatTask(taskId, days);
  }

  function handleQuickCreate(day, time) {
    const id = routines.addTask({
      name: '',
      duration: 30,
      scheduledTime: time,
      day,
    });
    setInlineEditId(id);
  }

  function handleInlineRename(taskId, name) {
    setInlineEditId(null);
    if (!name.trim()) {
      routines.deleteTask(taskId);
    } else {
      routines.updateTask(taskId, { name: name.trim() });
    }
  }

  // Modifier: snap the DragOverlay Y to the grid preview position
  function snapToGridModifier({ transform }) {
    return { ...transform, y: transform.y + snapOffsetRef.current };
  }

  function collisionDetection(args) {
    const pointer = pointerWithin(args);
    if (pointer.length > 0) return pointer;
    return rectIntersection(args);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar
          routines={routines}
          onTaskClick={handleTaskClick}
          activeId={activeId}
        />
        <TimeGrid
          ref={gridRef}
          tasks={routines.activeRoutine?.tasks || []}
          onTaskClick={handleTaskClick}
          onResizeTask={handleResizeTask}
          onDeleteTask={handleDeleteTask}
          onRepeatTask={handleRepeatTask}
          onQuickCreate={handleQuickCreate}
          onInlineRename={handleInlineRename}
          inlineEditId={inlineEditId}
          dragPreview={dragPreview}
        />
      </div>

      <DragOverlay dropAnimation={null} modifiers={[snapToGridModifier]}>
        {activeTask ? (
          <div
            className="rounded-lg px-3 py-2 shadow-lg opacity-90 cursor-grabbing text-sm font-medium"
            style={{
              backgroundColor: activeTask.color,
              color: getContrastColor(activeTask.color),
              width: 200,
            }}
          >
            {activeTask.name}
          </div>
        ) : null}
      </DragOverlay>

      {editingTask && (
        <EditPanel
          task={editingTask}
          siblingCount={siblingIds.length}
          onUpdate={(updates) => {
            routines.updateTask(editingTask.id, updates);
            setEditingTask((prev) => ({ ...prev, ...updates }));
          }}
          onUpdateAll={(updates) => {
            routines.updateTasks([editingTask.id, ...siblingIds], updates);
            setEditingTask((prev) => ({ ...prev, ...updates }));
          }}
          onDelete={() => {
            routines.deleteTask(editingTask.id);
            setEditingTask(null);
          }}
          onRepeat={handleRepeatTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </DndContext>
  );
}
