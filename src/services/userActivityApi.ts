import api from "./axios";

export type Usage = { cO2emission?: number | null };
export type LeaderboardRow = {
  userName: string;
  totalCO2Emission: number | null;
};

export const fetchLeaderboard = async (): Promise<LeaderboardRow[]> => {
  const { data } = await api.get<LeaderboardRow[]>("/UserActivities/LeaderBoard");
  return data;
};