"use client";

import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { VibeCheckResult } from "@/lib/contracts/types";

interface VibeCheckHistoryProps {
  history: VibeCheckResult[];
}

export function VibeCheckHistory({ history }: VibeCheckHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="glass-card p-6 text-center animate-fade-in">
        <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground/60">
          Your vibe check history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 md:p-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Session History ({history.length})
      </h3>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {history.map((item, idx) => {
          const isPass = item.vibe_status === "PASS";
          return (
            <div
              key={`${item.timestamp}-${idx}`}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors
                ${
                  isPass
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isPass ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed break-words">
                  {item.statement}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-semibold ${
                      isPass ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {item.vibe_status}
                  </span>
                  <span className="text-xs text-muted-foreground/40">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
