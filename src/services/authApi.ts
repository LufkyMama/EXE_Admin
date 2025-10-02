// src/services/authApi.ts
import api from "./axios";
import type { AuthResult, User } from "@/types";

export const login = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  const { data } = await api.post("/User/login", { email, password });
  // BE của bạn trả về { success, message, data: { user }, token }
  const token: string = data?.data?.token ?? data?.token;
  const user: User = data?.data?.user ?? data?.user;

  if (!token || !user)
    throw new Error("Login response is missing token or user.");
  return { token, user };
};

export type RegisterPayload = {
  userName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  firstname?: string;
  lastname?: string;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post("/User/register", payload);
  return data; // { success, message, data? } tuỳ backend
};
