import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { TransactionReceipt } from "./types";

/**
 * VibeCheck contract class for interacting with the GenLayer VibeCheck contract
 */
class VibeCheck {
  private contractAddress: `0x${string}`;
  private client: ReturnType<typeof createClient>;

  constructor(
    contractAddress: string,
    address?: string | null,
    studioUrl?: string
  ) {
    this.contractAddress = contractAddress as `0x${string}`;

    const config: any = {
      chain: studionet,
    };

    if (address) {
      config.account = address as `0x${string}`;
    }

    if (studioUrl) {
      config.endpoint = studioUrl;
    }

    this.client = createClient(config);
  }

  /**
   * Update the address used for transactions
   */
  updateAccount(address: string): void {
    const config: any = {
      chain: studionet,
      account: address as `0x${string}`,
    };
    this.client = createClient(config);
  }

  /**
   * Check the vibe of a statement (write operation — triggers AI consensus).
   * Returns a TransactionReceipt; the caller can extract the return value from the receipt.
   * @param statement - The statement to vibe check
   */
  async checkVibe(statement: string): Promise<TransactionReceipt> {
    try {
      const txHash = await this.client.writeContract({
        address: this.contractAddress,
        functionName: "check_vibe",
        args: [statement],
        value: BigInt(0),
      });

      const receipt = await this.client.waitForTransactionReceipt({
        hash: txHash,
        status: "ACCEPTED" as any,
        retries: 60,
        interval: 5000,
      });

      return receipt as TransactionReceipt;
    } catch (error) {
      console.error("Error checking vibe:", error);
      throw new Error("Failed to check vibe");
    }
  }

  /**
   * Get the total number of vibe checks performed (read operation).
   */
  async getTotalChecks(): Promise<number> {
    try {
      const total = await this.client.readContract({
        address: this.contractAddress,
        functionName: "get_total_checks",
        args: [],
      });
      return Number(total) || 0;
    } catch (error) {
      console.error("Error fetching total checks:", error);
      return 0;
    }
  }
}

export default VibeCheck;
