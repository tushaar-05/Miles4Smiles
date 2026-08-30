'use client';

import { useEffect, useState } from 'react';

// Target event date — update when confirmed
const EVENT_DATE = new Date('2026-12-15T07:00:00+05:30');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function getTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = Math.max(0, EVENT_DATE.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

function CountdownUnit({
  value,
  label,
  isLast,
}: {
  value: number;
  label: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="flex flex-col items-center">
        <span className="text-[2.2rem] sm:text-[2.6rem] font-black text-white leading-none tabular-nums tracking-tight">
          {String(value).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs font-bold text-white/70 uppercase tracking-[0.2em] mt-1">
          {label}
        </span>
      </div>
      {!isLast && (
        <span className="text-white/50 text-3xl font-light self-start pt-1">
          |
        </span>
      )}
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 sm:gap-4 bg-orange-500 rounded-2xl px-6 sm:px-8 py-4 sm:py-5 shadow-2xl shadow-orange-600/50">
      <CountdownUnit value={timeLeft.days} label="Days" />
      <CountdownUnit value={timeLeft.hours} label="Hours" />
      <CountdownUnit value={timeLeft.minutes} label="Minutes" isLast />
    </div>
  );
}
