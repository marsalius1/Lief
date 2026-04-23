// Shared constants used across the app

export const HOUR_HEIGHT = 50;
export const START_HOUR = 9;
export const END_HOUR = 25;
export const QUARTER_HEIGHT = HOUR_HEIGHT / 4;
export const LABEL_WIDTH = 56;

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const PRESET_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Orange', value: '#F97316' },
];

export const SEED_DATA = {
  routines: [
    {
      id: 'seed-routine-1',
      name: 'Default',
      tasks: [
        {
          id: 'seed-task-1',
          name: 'Morning exercise',
          duration: 30,
          color: '#3B82F6',
          notes: 'Stretching and a quick run',
          scheduledTime: 540,
          day: 0,
        },
        {
          id: 'seed-task-2',
          name: 'Deep work',
          duration: 90,
          color: '#8B5CF6',
          notes: 'Focus on the main project',
          scheduledTime: 570,
          day: 1,
        },
        {
          id: 'seed-task-3',
          name: 'Lunch break',
          duration: 60,
          color: '#10B981',
          notes: '',
          scheduledTime: 720,
          day: 3,
        },
        {
          id: 'seed-task-4',
          name: 'Email & admin',
          duration: 45,
          color: '#F59E0B',
          notes: 'Process inbox, reply to messages',
          scheduledTime: null,
          day: null,
        },
        {
          id: 'seed-task-5',
          name: 'Reading',
          duration: 30,
          color: '#14B8A6',
          notes: '',
          scheduledTime: null,
          day: null,
        },
      ],
    },
  ],
  activeRoutineId: 'seed-routine-1',
};
