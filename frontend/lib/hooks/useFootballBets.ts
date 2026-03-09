"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import VibeCheck from "../contracts/FootballBets";
import { getContractAddress, getStudioUrl } from "../genlayer/client";
import { useWallet } from "../genlayer/wallet";
import { success, error } from "../utils/toast";
import type { VibeCheckResult } from "../contracts/types";

/**
 * Hook to get the VibeCheck contract instance.
 * Recreated whenever the wallet address changes.
 */
export function useVibeCheckContract(): VibeCheck | null {
  const { address } = useWallet();
  const contractAddress = getContractAddress();
  const studioUrl = getStudioUrl();

  // Note: do NOT call toasts (side effects) inside useMemo.
  // Contract address validation is handled in the mutation itself.
  const contract = useMemo(() => {
    if (!contractAddress) return null;
    return new VibeCheck(contractAddress, address, studioUrl);
  }, [contractAddress, address, studioUrl]);

  return contract;
}

/**
 * Hook to read the total number of vibe checks from the contract.
 */
export function useTotalChecks() {
  const contract = useVibeCheckContract();

  return useQuery<number, Error>({
    queryKey: ["totalChecks"],
    queryFn: () => {
      if (!contract) return Promise.resolve(0);
      return contract.getTotalChecks();
    },
    refetchOnWindowFocus: true,
    staleTime: 5000,
    enabled: !!contract,
  });
}

/**
 * Hook to submit a vibe check via the contract write function.
 * Maintains a local history of results for the current session.
 */
export function useCheckVibe() {
  const contract = useVibeCheckContract();
  const { address, isOnCorrectNetwork } = useWallet();
  const queryClient = useQueryClient();
  const [history, setHistory] = useState<VibeCheckResult[]>([]);
  const [lastResult, setLastResult] = useState<VibeCheckResult | null>(null);

  const mutation = useMutation({
    mutationFn: async (statement: string) => {
      // Guard: contract address must be configured
      if (!contract) {
        throw new Error(
          "Contract address not configured. Please add NEXT_PUBLIC_CONTRACT_ADDRESS in your Vercel environment variables."
        );
      }
      // Guard: wallet must be connected
      if (!address) {
        throw new Error(
          "Wallet not connected. Please connect your MetaMask wallet first."
        );
      }
      // Guard: must be on GenLayer network
      if (!isOnCorrectNetwork) {
        throw new Error(
          "Wrong network. Please switch MetaMask to the GenLayer Studio network (Chain ID: 61999)."
        );
      }

      const receipt = await contract.checkVibe(statement);

      // ─── Extract PASS / FAIL from the GenLayer receipt ───────────────
      // The genlayer-js LeaderReceipt type has a `result: string` field.
      // Path on localnet / studionet:
      //   receipt.consensus_data.leader_receipt[0].result  ← primary
      // Fallback for testnet / future SDK changes:
      //   receipt.result  (top-level)
      // We also deep-scan any string values in the receipt as a last resort.
      let vibe_status: "PASS" | "FAIL" | "UNKNOWN" = "UNKNOWN";

      function extractVibeStatus(value: unknown): "PASS" | "FAIL" | null {
        if (typeof value === "string") {
          const v = value.trim().toUpperCase();
          if (v === "PASS" || v === "FAIL") return v as "PASS" | "FAIL";
          // Handle quoted string: '"PASS"'
          const unquoted = v.replace(/^"|"$/g, "");
          if (unquoted === "PASS" || unquoted === "FAIL") return unquoted as "PASS" | "FAIL";
        }
        return null;
      }

      // 1. consensus_data.leader_receipt (array) — primary for studionet
      const leaderReceipts = (receipt as any)?.consensus_data?.leader_receipt;
      if (Array.isArray(leaderReceipts) && leaderReceipts.length > 0) {
        const found = extractVibeStatus(leaderReceipts[0]?.result);
        if (found) vibe_status = found;
      }

      // 2. Top-level receipt.result — testnet / alternative SDK behaviour
      if (vibe_status === "UNKNOWN") {
        const found = extractVibeStatus((receipt as any)?.result);
        if (found) vibe_status = found;
      }

      // 3. Deep scan all string fields in the receipt object
      if (vibe_status === "UNKNOWN") {
        const scan = (obj: any): "PASS" | "FAIL" | null => {
          if (!obj || typeof obj !== "object") return null;
          for (const val of Object.values(obj)) {
            const direct = extractVibeStatus(val);
            if (direct) return direct;
            if (typeof val === "object") {
              const nested = scan(val);
              if (nested) return nested;
            }
          }
          return null;
        };
        const found = scan(receipt);
        if (found) vibe_status = found;
      }

      const result: VibeCheckResult = {
        statement,
        vibe_status,
        timestamp: Date.now(),
        txHash: receipt?.hash,
      };

      return result;
    },
    onSuccess: (result: VibeCheckResult) => {
      setLastResult(result);
      setHistory((prev: VibeCheckResult[]) => [result, ...prev]);
      queryClient.invalidateQueries({ queryKey: ["totalChecks"] });
      success(
        result.vibe_status === "PASS" ? "✅ Vibe Passed!" : "❌ Vibe Failed!",
        {
          description: `"${result.statement.slice(0, 60)}${result.statement.length > 60 ? "…" : ""}"`,
        }
      );
    },
    onError: (err: any) => {
      console.error("Error checking vibe:", err);
      error("Vibe Check Failed", {
        description: err?.message || "Please try again.",
      });
    },
  });

  return {
    ...mutation,
    history,
    lastResult,
    checkVibe: (statement: string) => mutation.mutate(statement),
    checkVibeAsync: mutation.mutateAsync,
    isChecking: mutation.isPending,
  };
}
