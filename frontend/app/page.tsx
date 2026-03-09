"use client";

import { Navbar } from "@/components/Navbar";
import { VibeCheckInput } from "@/components/VibeCheckInput";
import { VibeCheckResultCard } from "@/components/VibeCheckResult";
import { VibeCheckHistory } from "@/components/VibeCheckHistory";
import { useCheckVibe } from "@/lib/hooks/useFootballBets";
import { Sparkles, Zap, Shield, Brain } from "lucide-react";

export default function HomePage() {
  const { checkVibe, isChecking, history, lastResult } = useCheckVibe();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-20 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Hero Section */}
          <div className="text-center mb-10 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by GenLayer AI
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              AI{" "}
              <span className="text-accent relative">
                Vibe Check
                <span className="absolute -inset-1 blur-2xl bg-accent/20 -z-10 rounded-xl" />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Submit any statement to our on-chain AI. It will reach consensus
              across multiple validators and tell you if it{" "}
              <span className="text-green-400 font-semibold">passes</span> or{" "}
              <span className="text-red-400 font-semibold">fails</span> the
              vibe check.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — Chat & Result (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-4 animate-slide-up">
              {/* Latest Result */}
              {lastResult && (
                <VibeCheckResultCard result={lastResult} isLatest />
              )}

              {/* Input Box */}
              <VibeCheckInput
                onCheckVibe={checkVibe}
                isChecking={isChecking}
              />

              {/* Loading shimmer placeholder when no result yet */}
              {!lastResult && !isChecking && (
                <div className="glass-card p-6 border-dashed opacity-50 text-center animate-fade-in">
                  <p className="text-sm text-muted-foreground">
                    Your result will appear here after the AI validates your statement ✨
                  </p>
                </div>
              )}
            </div>

            {/* Right — History (1/3 width on desktop) */}
            <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <VibeCheckHistory history={history} />
            </div>
          </div>

          {/* How It Works Section */}
          <div
            className="mt-12 glass-card p-6 md:p-8 animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div className="text-accent font-bold text-lg">1. Submit a Statement</div>
                <p className="text-sm text-muted-foreground">
                  Connect your MetaMask wallet and type anything — a message,
                  opinion, or phrase — into the chat box. Press Enter or click Send.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-accent" />
                </div>
                <div className="text-accent font-bold text-lg">2. AI Consensus</div>
                <p className="text-sm text-muted-foreground">
                  GenLayer's intelligent contract runs an LLM across multiple
                  validators and reaches a strict consensus. This takes around
                  30 seconds to 2 minutes.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div className="text-accent font-bold text-lg">3. Get the Verdict</div>
                <p className="text-sm text-muted-foreground">
                  The on-chain verdict appears — a glowing{" "}
                  <span className="text-green-400 font-semibold">✅ PASS</span>{" "}
                  or a fierce{" "}
                  <span className="text-red-400 font-semibold">❌ FAIL</span>.
                  Results are permanently recorded on the blockchain.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-4">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Powered by GenLayer
            </a>
            <a
              href="https://studio.genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Studio
            </a>
            <a
              href="https://docs.genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/genlayerlabs/genlayer-project-boilerplate"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
