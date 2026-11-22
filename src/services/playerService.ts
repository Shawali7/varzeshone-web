import type { Player } from "../types";
import { staticApi } from "./api";

export async function getPlayers(): Promise<Player[]> {
  return staticApi.getPlayers();
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  return staticApi.getPlayerById(id);
}
