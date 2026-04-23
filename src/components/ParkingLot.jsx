// Scrollable list of unscheduled tasks with sortable reordering
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import NewTaskForm from './NewTaskForm';

export default function ParkingLot({ tasks, onAddTask, onTaskClick, onDeleteTask, activeId }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'parking-lot' });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Unscheduled
        </h2>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto px-3 pb-2 transition-colors ${
          isOver ? 'bg-slate-800/50' : ''
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onDelete={onDeleteTask}
              isDragActive={activeId === task.id}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-4">
            No unscheduled tasks
          </p>
        )}

        <NewTaskForm onAdd={onAddTask} />
      </div>
    </div>
  );
}
