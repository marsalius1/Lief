// Utility functions for time calculations and formatting
import { HOUR_HEIGHT, START_HOUR, END_HOUR, LABEL_WIDTH } from './constants';

/**
 * Given pointer position and the grid scroll container,
 * returns { day: 0–6, time: snapped minutes since midnight }.
 */
export function computeScheduleFromPointer(clientX, clientY, gridElement) {
  const rect = gridElement.getBoundingClientRect();

  // Day from X position (columns start after the label area)
  const columnsWidth = rect.width - LABEL_WIDTH;
  const relativeX = clientX - rect.left - LABEL_WIDTH;
  const day = Math.max(0, Math.min(6, Math.floor((relativeX / columnsWidth) * 7)));

  // Time from Y position
  const relativeY = clientY - rect.top + gridElement.scrollTop;
  const minutesSinceGridStart = (relativeY / HOUR_HEIGHT) * 60;
  const totalMinutes = START_HOUR * 60 + minutesSinceGridStart;
  const snapped = Math.round(totalMinutes / 15) * 15;
  const time = Math.max(START_HOUR * 60, Math.min(END_HOUR * 60 - 15, snapped));

  return { day, time };
}

/** Format total minutes as short time string, e.g. 540 → "9:00", 1470 → "12:30" */
export function formatTimeShort(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${h}:${minutes.toString().padStart(2, '0')}`;
}

/** Format an hour number as a label, e.g. 9 → "9 AM", 25 → "1 AM" */
export function formatHourLabel(hour) {
  const h = hour % 24;
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  if (h > 12) return `${h - 12} PM`;
  return `${h} AM`;
}

/** Pixel offset from the top of the grid for a given time in minutes */
export function getTopOffset(totalMinutes) {
  const minutesSinceStart = totalMinutes - START_HOUR * 60;
  return (minutesSinceStart / 60) * HOUR_HEIGHT;
}

/** Pixel height for a given duration in minutes */
export function getHeight(durationMinutes) {
  return (durationMinutes / 60) * HOUR_HEIGHT;
}

/** Returns white or dark text color based on background luminance */
export function getContrastColor(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1f2937' : '#ffffff';
}
