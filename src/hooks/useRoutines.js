// Central state hook — manages all routines, tasks, and localStorage persistence
import { useState, useCallback, useEffect } from 'react';
import { SEED_DATA } from '../constants';

const STORAGE_KEY = 'lief-routines';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Migrate tasks that lack the 'day' field (from older format)
      return {
        ...data,
        routines: data.routines.map((r) => ({
          ...r,
          tasks: r.tasks.map((t) => ({
            ...t,
            day: t.day !== undefined ? t.day : (t.scheduledTime !== null ? 0 : null),
          })),
        })),
      };
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return null;
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export default function useRoutines() {
  const [state, setState] = useState(() => {
    return loadFromStorage() || SEED_DATA;
  });

  // Persist every state change
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const { routines, activeRoutineId } = state;
  const activeRoutine =
    routines.find((r) => r.id === activeRoutineId) || routines[0];

  // --- Routine operations ---

  const setActiveRoutineId = useCallback((id) => {
    setState((prev) => ({ ...prev, activeRoutineId: id }));
  }, []);

  const addRoutine = useCallback((name) => {
    const id = crypto.randomUUID();
    setState((prev) => ({
      routines: [...prev.routines, { id, name, tasks: [] }],
      activeRoutineId: id,
    }));
  }, []);

  const deleteRoutine = useCallback((id) => {
    setState((prev) => {
      const remaining = prev.routines.filter((r) => r.id !== id);
      if (remaining.length === 0) return prev;
      return {
        routines: remaining,
        activeRoutineId:
          prev.activeRoutineId === id
            ? remaining[0].id
            : prev.activeRoutineId,
      };
    });
  }, []);

  // --- Task helpers ---

  const updateActiveTasks = useCallback((updater) => {
    setState((prev) => ({
      ...prev,
      routines: prev.routines.map((r) =>
        r.id === prev.activeRoutineId
          ? { ...r, tasks: updater(r.tasks) }
          : r
      ),
    }));
  }, []);

  const addTask = useCallback(
    ({ name, duration = 30, color = '#3B82F6', scheduledTime = null, day = null }) => {
      const id = crypto.randomUUID();
      updateActiveTasks((tasks) => [
        ...tasks,
        { id, name, duration, color, notes: '', scheduledTime, day },
      ]);
      return id;
    },
    [updateActiveTasks]
  );

  const updateTask = useCallback(
    (taskId, updates) => {
      updateActiveTasks((tasks) =>
        tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
    },
    [updateActiveTasks]
  );

  const updateTasks = useCallback(
    (taskIds, updates) => {
      updateActiveTasks((tasks) =>
        tasks.map((t) => (taskIds.includes(t.id) ? { ...t, ...updates } : t))
      );
    },
    [updateActiveTasks]
  );

  const deleteTask = useCallback(
    (taskId) => {
      updateActiveTasks((tasks) => tasks.filter((t) => t.id !== taskId));
    },
    [updateActiveTasks]
  );

  const scheduleTask = useCallback(
    (taskId, time, day) => {
      updateActiveTasks((tasks) =>
        tasks.map((t) =>
          t.id === taskId ? { ...t, scheduledTime: time, day } : t
        )
      );
    },
    [updateActiveTasks]
  );

  const unscheduleTask = useCallback(
    (taskId) => {
      updateActiveTasks((tasks) =>
        tasks.map((t) =>
          t.id === taskId ? { ...t, scheduledTime: null, day: null } : t
        )
      );
    },
    [updateActiveTasks]
  );

  const reorderTasks = useCallback(
    (activeId, overId) => {
      updateActiveTasks((tasks) => {
        const oldIndex = tasks.findIndex((t) => t.id === activeId);
        const newIndex = tasks.findIndex((t) => t.id === overId);
        if (oldIndex === -1 || newIndex === -1) return tasks;
        const next = [...tasks];
        const [moved] = next.splice(oldIndex, 1);
        next.splice(newIndex, 0, moved);
        return next;
      });
    },
    [updateActiveTasks]
  );

  const repeatTask = useCallback(
    (taskId, days) => {
      updateActiveTasks((tasks) => {
        const source = tasks.find((t) => t.id === taskId);
        if (!source || source.scheduledTime === null) return tasks;
        const clones = days
          .filter((d) => d !== source.day)
          .map((d) => ({ ...source, id: crypto.randomUUID(), day: d }));
        return [...tasks, ...clones];
      });
    },
    [updateActiveTasks]
  );

  return {
    routines,
    activeRoutine,
    activeRoutineId,
    setActiveRoutineId,
    addRoutine,
    deleteRoutine,
    addTask,
    updateTask,
    deleteTask,
    scheduleTask,
    unscheduleTask,
    reorderTasks,
    repeatTask,
    updateTasks,
  };
}
