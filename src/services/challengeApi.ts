import api from "./axios";
import type { Challenge } from "@/types";

export const listChallenges = async (): Promise<Challenge[]> => {
  const { data } = await api.get<Challenge[]>("/Chalenge");
  return data;
};
export const createChallenge = async (body: Partial<Challenge>) => {
  const { data } = await api.post("/Chalenge", body);
  return data;
};
export const getChallenge = async (id: string): Promise<Challenge> => {
  const { data } = await api.get<Challenge>(`/Chalenge/${id}`);
  return data;
};
export const updateChallenge = async (id: string, body: Partial<Challenge>) => {
  const { data } = await api.put(`/Chalenge/${id}`, body);
  return data;
};
export const deleteChallenge = async (id: string) => {
  const { data } = await api.delete(`/Chalenge/${id}`);
  return data;
};
