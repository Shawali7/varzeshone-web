import type { PlayerTransfer } from "../types";
import { staticApi } from "./api";

export async function getTransfers(): Promise<PlayerTransfer[]> {
  return staticApi.getTransfers();
}

export async function getPlayerTransferHistory(
  playerId: string,
): Promise<PlayerTransfer[]> {
  return staticApi.getPlayerTransferHistory(playerId);
}
