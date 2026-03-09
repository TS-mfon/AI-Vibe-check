"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import type { VibeCheckResult } from "@/lib/contracts/types";

interface VibeCheckResultCardProps {
  result: VibeCheckResult;
  isLatest?: boolean;
}

export function VibeCheckResultCard({ result, isLatest = false }: VibeCheckResultCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation on mount
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const isPass = result.vibe_status === "PASS";
  const isUnknown = result.vibe_status === "UNKNOWN";

  const passStyle = "border-green-500/30 bg-green-500/5";
  const failStyle = "border-red-500/30 bg-red-500/5";
  const unknownStyle = "border-yellow-500/30 bg-yellow-500/5";

  const cardStyle = isPass ? passStyle : isUnknown ? unknownStyle : failStyle;

  const glowClass = isLatest
    ? isPass
      ? "shadow-[0_0_32px_rgba(34,197,94,0.15)]"
      : isUnknown
      ? "shadow-[0_0_32px_rgba(234,179,8,0.15)]"
      : "shadow-[0_0_32px_rgba(239,68,68,0.15)]"
    : "";

  return (
    <div
      className={`
        rounded-xl border p-4 md:p-5 transition-all duration-700 ease-out
        ${cardStyle} ${glowClass}
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {isPass ? (
            <CheckCircle2 className="w-7 h-7 text-green-400" />
          ) : isUnknown ? (
            <span className="text-2xl">🤔</span>
          ) : (
            <XCircle className="w-7 h-7 text-red-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Status badge */}
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`text-xl font-bold tracking-wide ${
                isPass
                  ? "text-green-400"
                  : isUnknown
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {isPass ? "✅ PASS" : isUnknown ? "🤔 UNKNOWN" : "❌ FAIL"}
            </span>
            {isLatest && (
              <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">
                Latest
              </span>
            )}
          </div>

          {/* Statement */}
          <p className="text-sm text-muted-foreground leading-relaxed break-words">
            &ldquo;{result.statement}&rdquo;
          </p>

          {/* Footer: timestamp + tx link */}
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-muted-foreground/50">
              {new Date(result.timestamp).toLocaleTimeString()}
            </span>
            {result.txHash && (
              <a
                href={`https://explorer-studio.genlayer.com/tx/${result.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-accent/60 hover:text-accent transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View tx
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
