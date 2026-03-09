"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Wifi } from "lucide-react";
import { useWallet } from "@/lib/genlayer/wallet";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface VibeCheckInputProps {
  onCheckVibe: (statement: string) => void;
  isChecking: boolean;
}

export function VibeCheckInput({ onCheckVibe, isChecking }: VibeCheckInputProps) {
  const [statement, setStatement] = useState("");
  const { isConnected, isOnCorrectNetwork } = useWallet();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  }, [statement]);

  const handleSubmit = () => {
    const trimmed = statement.trim();
    if (!trimmed || isChecking || !isConnected) return;
    onCheckVibe(trimmed);
    setStatement("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = statement.trim().length > 0 && isConnected && isOnCorrectNetwork && !isChecking;

  return (
    <div className="glass-card p-4 md:p-6 animate-fade-in">
      <div className="flex items-start gap-3">
        {/* Animated AI dot */}
        <div className="mt-2 flex-shrink-0 relative">
          <div className="w-3 h-3 rounded-full bg-accent" />
          {isChecking && (
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-accent animate-ping opacity-75" />
          )}
        </div>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            id="vibe-statement-input"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isConnected
                ? "Type your statement and press Enter or click Send…"
                : "Connect your wallet to start a vibe check…"
            }
            disabled={!isConnected || isChecking}
            rows={1}
            className="w-full bg-transparent resize-none outline-none text-base placeholder:text-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px] max-h-[200px] leading-relaxed pr-2"
          />
          {/* Character hint */}
          {statement.length > 0 && (
            <p className="text-xs text-muted-foreground/40 mt-1">
              Press Enter to send · Shift + Enter for new line
            </p>
          )}
        </div>

        {/* Send button */}
        <Button
          id="check-vibe-btn"
          variant="gradient"
          size="sm"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex-shrink-0 mt-0.5 h-9 w-9 p-0 rounded-full"
          aria-label="Check Vibe"
        >
          {isChecking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Processing banner */}
      {isChecking && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
          <Wifi className="w-4 h-4 text-accent animate-pulse" />
          <span>
            Sending to GenLayer blockchain… AI validators are reaching consensus.
            This may take 30 seconds–2 minutes.
          </span>
        </div>
      )}

      {/* Wrong network warning */}
      {isConnected && !isOnCorrectNetwork && (
        <div className="mt-3 flex items-start gap-2 text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 animate-fade-in">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Wrong network detected. Please switch MetaMask to{" "}
            <strong>GenLayer Studio</strong> (Chain ID: 61999, RPC:{" "}
            <code className="text-xs">https://studio.genlayer.com/api</code>).
            This happens automatically when you click{" "}
            <strong>Connect Wallet</strong>.
          </span>
        </div>
      )}

      {/* Not connected hint */}
      {!isConnected && (
        <p className="mt-3 text-xs text-muted-foreground/60 text-center">
          Connect your MetaMask wallet using the button in the top-right corner.
        </p>
      )}
    </div>
  );
}
