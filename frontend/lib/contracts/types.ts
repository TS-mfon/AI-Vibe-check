/**
 * TypeScript types for GenLayer VibeCheck contract
 */

export type VibeStatus = "PASS" | "FAIL" | "UNKNOWN";

export interface VibeCheckResult {
  statement: string;
  vibe_status: VibeStatus;
  timestamp: number;
  txHash?: string;
}

export interface TransactionReceipt {
  status: string;
  hash: string;
  blockNumber?: number;
  [key: string]: any;
}
