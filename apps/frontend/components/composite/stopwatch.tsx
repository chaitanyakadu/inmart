// components/Stopwatch.tsx
"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { toast, Toaster } from "sonner";

type Props = {
  /** start time of the service (ISO string or Date). Defaults to now if not provided. */
  startedAt?: string | Date;
  /** show the "Service is up since" line */
  showSinceLine?: boolean;
  /** optional className to tweak container placement */
  className?: string;
  /** timezone for displaying the startedAt (default: Asia/Kolkata) */
  timeZone?: string;
  count: number;
  state: any;
};

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const hh = pad2(hours);
  const mm = pad2(mins);
  const ss = pad2(secs);

  if (days > 0) {
    return `${days}d ${hh}:${mm}:${ss}`;
  }
  return `${hh}:${mm}:${ss}`;
}

export function Stopwatch({
  startedAt,
  showSinceLine = true,
  className,
  timeZone = "Asia/Kolkata",
  count,
  state,
}: Props) {
  // if startedAt not provided, assume service started now (so uptime starts at 0)
  const startDate = React.useMemo(() => {
    if (!startedAt) return new Date();
    return startedAt instanceof Date ? startedAt : new Date(startedAt);
  }, [startedAt]);

  const [elapsedMs, setElapsedMs] = useState(
    () => Date.now() - startDate.getTime()
  );

  useEffect(() => {
    // update every 1s for efficiency (you can use 500ms if you prefer smoother)
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startDate.getTime());
    }, 1000);

    // initial set (in case startDate is in the future or immediate)
    setElapsedMs(Date.now() - startDate.getTime());

    return () => clearInterval(id);
  }, [startDate]);

  // nicely formatted startedAt for display (localized)
  const startedAtLabel = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone,
      }).format(startDate);
    } catch {
      return startDate.toLocaleString();
    }
  }, [startDate, timeZone]);

  useEffect(() => {
    if (state.metaData.maxLeads.value <= count) {
      toast.success(
        `${count} out of ${state.metaData.maxLeads.value} leads are purchased!`
      );
    }
  }, [count]);

  return (
    <div
      className={clsx(
        `w-full max-w-md mx-auto p-5 rounded-2xl ${state.metaData.maxLeads.value > count ? "bg-gradient-to-r from-green-600/95 to-emerald-500/95" : "bg-neutral-200"} shadow-xl`,
        "backdrop-blur-sm border border-white/10",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        {/* stopwatch / uptime */}
        <div className="text-5xl md:text-6xl font-mono font-extrabold text-white drop-shadow-md tracking-wider">
          {formatElapsed(elapsedMs)}
        </div>

        {/* "Service is up since" line */}
        {showSinceLine && (
          <div className="mt-1 text-sm text-white/80">
            <span className="font-medium">Service is up since..</span>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default Stopwatch;
