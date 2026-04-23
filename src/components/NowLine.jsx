// Red horizontal line showing the current time — rendered inside today's column
import { useState, useEffect } from 'react';
import { START_HOUR, END_HOUR, HOUR_HEIGHT } from '../constants';

export default function NowLine() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const totalMinutes = now.getHours() * 60 + now.getMinutes();

  if (totalMinutes < START_HOUR * 60 || totalMinutes > END_HOUR * 60) {
    return null;
  }

  const top = ((totalMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT;

  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ top }}
    >
      <div className="relative flex items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1 flex-shrink-0" />
        <div className="flex-1 h-0.5 bg-red-500" />
      </div>
    </div>
  );
}
