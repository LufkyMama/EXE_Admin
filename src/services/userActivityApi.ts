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

export type UsageBase = {
  id: number;
  date: string;            
  cO2Emission: number;     
};

export type PlasticUsage = UsageBase & { plasticItems?: unknown | null };
export type TrafficUsage = UsageBase;
export type FoodUsage    = UsageBase & { score?: number; foodItems?: unknown | null };
export type EnergyUsage  = UsageBase & { electricityConsumption?: number };

export type UserActivityRow = {
  id: number;
  userId: number;
  date: string;                 
  totalCO2Emission: number;
  plasticUsage?: PlasticUsage | null;
  trafficUsage?: TrafficUsage | null;
  foodUsage?: FoodUsage | null;
  energyUsage?: EnergyUsage | null;
};

/** Lấy toàn bộ bản ghi UserActivities  */
export const fetchUserActivities = async (): Promise<UserActivityRow[]> => {
  const { data } = await api.get<UserActivityRow[]>("/UserActivities");
  return Array.isArray(data) ? data : [];
};