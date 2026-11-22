import type { TeamMembership } from "../types";
import { staticApi } from "./api";

export async function getTeamMemberships(): Promise<TeamMembership[]> {
  return staticApi.getTeamMemberships();
}

export async function getPlayerMembershipHistory(
  playerId: string,
): Promise<TeamMembership[]> {
  return staticApi.getPlayerMembershipHistory(playerId);
}
