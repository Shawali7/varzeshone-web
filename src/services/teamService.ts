import type { Team } from "../types";
import { staticApi } from "./api";

export async function getTeams(): Promise<Team[]> {
  return staticApi.getTeams();
}

export async function getTeamById(id: string): Promise<Team | undefined> {
  return staticApi.getTeamById(id);
}

export async function getTeamByName(name: string): Promise<Team | undefined> {
  const teams = await staticApi.getTeams();

  return teams.find(
    (team) => team.name.toLowerCase() === name.trim().toLowerCase(),
  );
}
