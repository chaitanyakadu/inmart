// components/Stopwatch.tsx
"use client";

export default function LeadsCount({ count }: { count: number }) {
  return (
    <div className="w-full max-w-md mx-auto p-5 rounded-2xl bg-gradient-to-r from-green-600/95 to-emerald-500/95 shadow-xl backdrop-blur-sm border border-white/10">
      <div className="flex flex-col items-center gap-2">
        {/* stopwatch / uptime */}
        <div className="text-5xl md:text-6xl font-mono font-extrabold text-white drop-shadow-md tracking-wider">
          {count}
        </div>

        {/* "Service is up since" line */}

        <div className="mt-1 text-sm text-white/80">
          <span className="font-medium">Leads handled..</span>
        </div>
      </div>
    </div>
  );
}
