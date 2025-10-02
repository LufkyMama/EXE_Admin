import api from "./axios";
import type { User } from "@/types";

/** ====== Helpers: map enum -> view ====== */
export const roleLabel = (r?: number) =>
  r === 1 ? "Admin" : r === 3 ? "Staff" : "User";

export const roleBadgeColor = (r?: number) =>
  r === 1 ? "red" : r === 3 ? "blue" : "slate";

export const subLabel = (s?: number) =>
  s === 2 ? "VIP 25" : s === 3 ? "VIP 50" : "Free";

export const subBadgeColor = (s?: number) =>
  s === 1 ? "blue" : "amber";

export const isNullDate = (d?: string | null) =>
  !d || d.startsWith("0001-01-01");

/** ====== API wrapper types ====== */
type PagedPayload<T> = {
  success: boolean;
  message: string;
  data: {
    data: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

/** Chuẩn hoá một user (chỉ ép kiểu, không đổi field name) */
const normalizeUser = (u: any): User => ({
  id: u?.id,
  userName: u?.userName ?? "",
  email: u?.email ?? "",
  phoneNumber: u?.phoneNumber ?? null,
  role: Number(u?.role) || 2,
  dateOfBirth: u?.dateOfBirth ?? null,
  subscriptionType: Number(u?.subscriptionType) || 1,
});

/** GET /api/User (paging) */
export const listUsersPaged = async (page = 1, pageSize = 10) => {
  const { data } = await api.get<PagedPayload<User>>("/User", {
    params: { page, pageSize },
  });
  const items = Array.isArray(data?.data?.data)
    ? data.data.data.map(normalizeUser)
    : [];
  return {
    items,
    page: data?.data?.page ?? page,
    pageSize: data?.data?.pageSize ?? pageSize,
    totalCount: data?.data?.totalCount ?? items.length,
    totalPages: data?.data?.totalPages ?? 1,
    hasNextPage: !!data?.data?.hasNextPage,
    hasPreviousPage: !!data?.data?.hasPreviousPage,
  };
};

/** Tiện: nếu chỉ cần mảng users */
export const listUsers = async (page = 1, pageSize = 10) => {
  const res = await listUsersPaged(page, pageSize);
  return res.items;
};

/** GET /api/User/{id} */
export const getUser = async (id: number | string): Promise<User> => {
  const { data } = await api.get<any>(`/User/${id}`);
  return normalizeUser(data?.data ?? data);
};

/** GET /api/User/me – phòng trường hợp BE trả wrapper khác lạ */
export const getMe = async (): Promise<User> => {
  const { data } = await api.get<any>("/User/me");
  // Trường hợp trả về object trực tiếp
  if (data?.id || data?.role) return normalizeUser(data);
  // Trường hợp wrapper { data: { ...user } }
  if (data?.data && !Array.isArray(data.data)) return normalizeUser(data.data);
  // Trường hợp "nhầm" trả về paging (lấy phần tử đầu)
  if (Array.isArray(data?.data?.data) && data.data.data[0])
    return normalizeUser(data.data.data[0]);
  // Fallback
  return normalizeUser(data);
};

/** PUT /api/User/{id} */
export type UpdateUserPayload = Partial<Pick<
  User,
  "userName" | "email" | "phoneNumber" | "dateOfBirth" | "subscriptionType"
>>;
export const updateUser = async (
  id: number | string,
  payload: UpdateUserPayload
): Promise<User> => {
  const { data } = await api.put<any>(`/User/${id}`, payload);
  return normalizeUser(data?.data ?? data);
};

/** PUT /api/User/{id}/role */
export const updateRole = async (
  id: number | string,
  role: 1 | 2 | 3
): Promise<User> => {
  const { data } = await api.put<any>(`/User/${id}/role`, { role });
  return normalizeUser(data?.data ?? data);
};

/** DELETE /api/User/{id} */
export const deleteUser = async (id: number | string): Promise<void> => {
  await api.delete(`/User/${id}`);
};
