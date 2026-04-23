// Left sidebar — routine selector, parking lot for unscheduled tasks
import RoutineSelector from './RoutineSelector';
import ParkingLot from './ParkingLot';
import ShareButton from './ShareButton';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

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

      {isSafari && (
        <div className="mx-4 mt-3 px-3 py-2 rounded bg-yellow-900/40 border border-yellow-700/50 flex items-start gap-2">
          <span className="text-yellow-500 text-sm flex-shrink-0 mt-px">&#9888;</span>
          <p className="text-xs text-yellow-300/90">
            Safari may clear local data after 7 days. Share your template regularly to keep a backup.
          </p>
        </div>
      )}

      <RoutineSelector routines={routines} />

      <ParkingLot
        tasks={unscheduledTasks}
        onAddTask={routines.addTask}
        onTaskClick={onTaskClick}
        onDeleteTask={routines.deleteTask}
        activeId={activeId}
      />

      {routines.activeRoutine && (
        <ShareButton routine={routines.activeRoutine} />
      )}
    </div>
  );
}
