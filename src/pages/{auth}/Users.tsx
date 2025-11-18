import { useEffect, useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import type { User } from "@/types";
import {
  listUsersPaged,
  updateRole,
  updateUser,
  deleteUser,
  roleBadgeColor,
  roleLabel,
  subBadgeColor,
  subLabel,
  isNullDate,
} from "@/services/userApi";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number | string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const refresh = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listUsersPaged(p, pageSize);
      setUsers(res.items);
      setPage(res.page);
      setPageSize(res.pageSize);
      setTotalPages(res.totalPages);
      setTotalCount(res.totalCount);
    } catch (e: unknown) {
      const message =
        typeof e === "object" && e && "message" in e ? String((e as { message?: unknown }).message) : null;
      setError(message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: number | string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const allChecked = users.length > 0 && selected.size === users.length;
  const toggleAll = () =>
    setSelected(() => (allChecked ? new Set() : new Set(users.map((u) => u.id))));

  const fmtDate = (d?: string | null) =>
    !d || isNullDate(d) ? "—" : new Date(d).toLocaleDateString("vi-VN");

  const data = useMemo(
    () => [...users].sort((a, b) => (a.userName || "").localeCompare(b.userName || "")),
    [users]
  );

  const startIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = totalCount === 0 ? 0 : Math.min(page * pageSize, totalCount);

  // Chuẩn hoá đảm bảo gửi số cho API (tránh lỗi string->number)
  const toRoleId = (r: unknown): 1 | 2 | 3 | undefined => {
    const n = typeof r === "number" ? r : parseInt(String(r), 10);
    return (n === 1 || n === 2 || n === 3) ? (n as 1 | 2 | 3) : undefined;
  };
  const toSubId = (s: unknown): 1 | 2 | 3 | undefined => {
    const n = typeof s === "number" ? s : parseInt(String(s), 10);
    return (n === 1 || n === 2 || n === 3) ? (n as 1 | 2 | 3) : undefined;
  };

  // Actions
  const handleMakeRole = async (u: User, r: 1 | 2 | 3) => {
    await updateRole(u.id, r);
    await refresh();
  };

  const handleSetSub = async (u: User, s: 1 | 2 | 3) => {
    await updateUser(u.id, { subscriptionType: s });
    await refresh();
  };

  const handleDelete = async (u: User) => {
    if (!confirm(`Delete user "${u.userName}"?`)) return;
    await deleteUser(u.id);
    await refresh();
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-emerald-600 mb-6">User Management</h1>

      <div className="bg-white rounded-2xl border overflow-visible relative">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3 text-left w-10">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} />
              </th>
              <th className="p-3 text-left w-16">No.</th>
              <th className="p-3 text-left">User Name</th>
              <th className="p-3 text-left">Date of birth</th>
              <th className="p-3 text-left">Gmail</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Member Type</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-slate-500" colSpan={9}>Loading…</td>
              </tr>
            ) : error ? (
              <tr>
                <td className="p-4 text-red-600" colSpan={9}>{error}</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td className="p-4 text-slate-500" colSpan={9}>No users</td>
              </tr>
            ) : (
              data.map((u, idx) => {
                const rowNumber = (page - 1) * pageSize + idx + 1;
                return (
                  <tr key={u.id} className="border-t">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(u.id)}
                      onChange={() => toggle(u.id)}
                    />
                  </td>
                  <td className="p-3 font-medium text-slate-500">{rowNumber}</td>
                  <td className="p-3">{u.userName}</td>
                  <td className="p-3">{fmtDate(u.dateOfBirth)}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phoneNumber || "—"}</td>
                  <td className="p-3">
                    <Badge color={subBadgeColor(toSubId(u.subscriptionType) ?? 1)}>
                      {subLabel(toSubId(u.subscriptionType) ?? 1)}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge color={roleBadgeColor(toRoleId(u.role) ?? 2)}>
                      {roleLabel(toRoleId(u.role) ?? 2)}
                    </Badge>
                  </td>
                  <td className="p-3 relative">
                    <details className="relative">
                      <summary className="list-none cursor-pointer select-none">
                        <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border text-blue-600 hover:bg-slate-50">
                          Action ▾
                        </span>
                      </summary>

                      <div className="absolute z-50 right-0 mt-2 w-64 rounded-2xl border bg-white shadow-xl p-2 text-[14px] leading-6">
                        <div className="px-3 pt-1 pb-1 text-xs font-medium text-slate-400">Role</div>
                        <button className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg" onClick={() => handleMakeRole(u, 1)}>Make Admin</button>
                        <button className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg" onClick={() => handleMakeRole(u, 3)}>Make Staff</button>
                        <button className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg" onClick={() => handleMakeRole(u, 2)}>Make User</button>

                        <hr className="my-2" />

                        <div className="px-3 pt-1 pb-1 text-xs font-medium text-slate-400">Subscription</div>
                        <button className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg" onClick={() => handleSetSub(u, 2)}>Set VIP 25</button>
                        <button className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg" onClick={() => handleSetSub(u, 3)}>Set VIP 50</button>
                        <button className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg" onClick={() => handleSetSub(u, 1)}>Set Free</button>

                        <hr className="my-2" />

                        <button className="flex w-full items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(u)}>Delete</button>
                      </div>
                    </details>
                  </td>
                </tr>
              );
            })
            )}
          </tbody>
        </table>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-t text-sm text-slate-600">
          <div>
            Showing {startIndex}–{endIndex} of {totalCount} users
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1.5 rounded-lg border disabled:opacity-40"
              onClick={() => refresh(Math.max(1, page - 1))}
              disabled={page <= 1 || loading}
            >
              Previous
            </button>
            <span>
              Page {totalPages ? Math.min(page, totalPages) : page} of {Math.max(totalPages, 1)}
            </span>
            <button
              className="px-3 py-1.5 rounded-lg border disabled:opacity-40"
              onClick={() => refresh(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || loading}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
