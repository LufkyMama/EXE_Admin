import api from "./axios";

/** Trạng thái DB (dùng object hằng + union type, không dùng enum) */
export const TransactionStatus = {
  Pending: 0,
  Completed: 1,
  Failed: 2,
  Cancelled: 3,
} as const;
export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

export type Transaction = {
  id: number | string;
  userId?: number;
  userName?: string;
  totalPayment: number;
  paymentDate: string;   // ISO string
  status: TransactionStatus;
  reason?: string | null;
};

/* ---------------------------- helpers ---------------------------- */

const normalizeTx = (t: any): Transaction => ({
  id: t.id ?? t.transactionId ?? t.Id ?? "",
  userId: t.userId ?? t.user?.id,
  userName: t.userName ?? t.user?.userName ?? t.name ?? "",
  totalPayment: Number(t.totalPayment ?? t.amount ?? t.total ?? 0),
  paymentDate: t.paymentDate ?? t.date ?? t.createdAt ?? new Date().toISOString(),
  status: Number(
    t.status ?? t.transactionStatus ?? t.state ?? TransactionStatus.Pending
  ) as TransactionStatus,
  reason: t.reason ?? t.failureReason ?? t.note ?? null,
});

const unwrap = (data: any) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.data)) return data.data.data;
  if (data?.data) return data.data;
  return data;
};

/** Quy tắc chuyển trạng thái: chỉ từ Pending sang 1 trong 3 trạng thái còn lại */
export const canChangeFromTo = (
  from: TransactionStatus,
  to: TransactionStatus
): boolean => {
  if (from === TransactionStatus.Pending) {
    return (
      to === TransactionStatus.Completed ||
      to === TransactionStatus.Failed ||
      to === TransactionStatus.Cancelled
    );
  }
  return false;
};

/* ------------------------------ API ------------------------------ */

/** GET /api/Transaction (tuỳ BE có paging thì truyền page/pageSize) */
export const listTransactions = async (
  page = 1,
  pageSize = 50
): Promise<Transaction[]> => {
  const { data } = await api.get("/Transaction", { params: { page, pageSize } });
  const arr = unwrap(data);
  return (Array.isArray(arr) ? arr : [arr]).filter(Boolean).map(normalizeTx);
};

/** GET /api/Transaction/{id} */
export const getTransaction = async (
  id: number | string
): Promise<Transaction> => {
  const { data } = await api.get(`/Transaction/${id}`);
  const raw = unwrap(data);
  return normalizeTx(Array.isArray(raw) ? raw[0] : raw);
};

/** GET /api/Transaction/user/{userId} (nếu cần dùng theo người dùng) */
export const listTransactionsByUser = async (
  userId: number | string,
  page = 1,
  pageSize = 50
): Promise<Transaction[]> => {
  const { data } = await api.get(`/Transaction/user/${userId}`, {
    params: { page, pageSize },
  });
  const arr = unwrap(data);
  return (Array.isArray(arr) ? arr : [arr]).filter(Boolean).map(normalizeTx);
};

/** PUT /api/Transaction/{id} – cập nhật (gửi đầy đủ để an toàn với BE yêu cầu full model) */
export const updateTransaction = async (
  id: number | string,
  body: Partial<Transaction>
): Promise<Transaction> => {
  const { data } = await api.put(`/Transaction/${id}`, body);
  const raw = unwrap(data);
  return normalizeTx(Array.isArray(raw) ? raw[0] : raw);
};

/** Đổi trạng thái có kiểm tra rule Pending → (Completed|Failed|Cancelled) */
export const updateTransactionStatus = async (
  id: number | string,
  next: TransactionStatus
): Promise<Transaction> => {
  const current = await getTransaction(id);
  if (!canChangeFromTo(current.status, next)) {
    throw new Error("Invalid status transition");
  }
  // Một số BE yêu cầu PUT đủ fields -> gửi lại đầy đủ, chỉ thay status
  const payload: Partial<Transaction> = {
    id: current.id,
    userId: current.userId,
    userName: current.userName,
    totalPayment: current.totalPayment,
    paymentDate: current.paymentDate,
    reason: current.reason ?? null,
    status: next,
  };
  return updateTransaction(id, payload);
};

/* --------------------------- UI helpers -------------------------- */

export const statusLabel = (s: TransactionStatus) =>
  s === TransactionStatus.Pending
    ? "Pending"
    : s === TransactionStatus.Completed
    ? "Completed"
    : s === TransactionStatus.Failed
    ? "Failed"
    : "Cancelled";

export const statusColor = (s: TransactionStatus) =>
  s === TransactionStatus.Completed
    ? "green"
    : s === TransactionStatus.Pending
    ? "amber"
    : s === TransactionStatus.Failed
    ? "red"
    : "slate";
    