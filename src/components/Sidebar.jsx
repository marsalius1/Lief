// Left sidebar — routine selector, parking lot for unscheduled tasks
import RoutineSelector from './RoutineSelector';
import ParkingLot from './ParkingLot';

export default function Sidebar({ routines, onTaskClick, activeId }) {
  const unscheduledTasks = (routines.activeRoutine?.tasks || []).filter(
    (t) => t.scheduledTime === null
  );

  return (
    <div className="w-[300px] min-w-[300px] bg-slate-900 text-white flex flex-col h-screen border-r border-slate-700">
      {/* App header */}
      <div className="px-5 py-4 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-tight text-white">Lief</h1>
        <p className="text-xs text-slate-400 mt-0.5">Plan your day</p>
      </div>

      <RoutineSelector routines={routines} />

      <ParkingLot
        tasks={unscheduledTasks}
        onAddTask={routines.addTask}
        onTaskClick={onTaskClick}
        onDeleteTask={routines.deleteTask}
        activeId={activeId}
      />
    </div>
  );
}
