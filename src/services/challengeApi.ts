import api from "./axios";
import type { Challenge } from "@/types";

// Nhận "2025-10-02" hoặc "2025-10-02T08:30" -> về ISO UTC "2025-10-02T00:00:00.000Z"
const toUtcIso = (v?: string | null) => {
  if (!v) return undefined;
  const s = v.includes("T") ? v : `${v}T00:00:00Z`;   // date-only -> 00:00 UTC
  const d = new Date(s);
  return isNaN(+d) ? undefined : d.toISOString();
};

const normalizeDates = (body: Partial<Challenge>) => ({
  ...body,
  startDate: toUtcIso(body.startDate as any),
  endDate: toUtcIso(body.endDate as any),
});
export const listChallenges = async (): Promise<Challenge[]> => {
  const { data } = await api.get<Challenge[]>("/Challenge");
  return data;
};
export const createChallenge = async (body: Partial<Challenge>) => {
  const { data } = await api.post("/Challenge", normalizeDates(body));
  return data;
};
export const getChallenge = async (id: string): Promise<Challenge> => {
  const { data } = await api.get<Challenge>(`/Challenge/${id}`);
  return data;
};
export const updateChallenge = async (id: string, body: Partial<Challenge>) => {
  const { data } = await api.put(`/Challenge/${id}`, normalizeDates(body));
  return data;
};
export const deleteChallenge = async (id: string) => {
  const { data } = await api.delete(`/Challenge/${id}`);
  return data;
};
export const setChallengeStatus = async (c: Challenge, done: boolean) => {
  return updateChallenge(String(c.id), {
    id: c.id,
    name: c.name,
    description: c.description,
    startDate: c.startDate || undefined,
    endDate: c.endDate || undefined,
    isComplete: done,
  });
};
