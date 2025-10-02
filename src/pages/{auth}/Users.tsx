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
  const pageSize = 10;

  const refresh = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listUsersPaged(p, pageSize);
      setUsers(res.items);
      setPage(res.page);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load users");
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
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allChecked = users.length > 0 && selected.size === users.length;
  const toggleAll = () =>
    setSelected((prev) =>
      allChecked ? new Set() : new Set(users.map((u) => u.id as any))
    );

  const fmtDate = (d?: string | null) =>
    !d || isNullDate(d) ? "—" : new Date(d).toLocaleDateString("vi-VN");

  const data = useMemo(
    () =>
      [...users].sort((a, b) =>
        (a.userName || "").localeCompare(b.userName || "")
      ),
    [users]
  );

  // Actions
  const handleMakeRole = async (u: User, r: 1 | 2 | 3) => {
    await updateRole(u.id as any, r);
    await refresh();
  };

  const handleSetSub = async (u: User, s: 1 | 2 | 3) => {
    await updateUser(u.id as any, { subscriptionType: s });
    await refresh();
  };

  const handleDelete = async (u: User) => {
    if (!confirm(`Delete user "${u.userName}"?`)) return;
    await deleteUser(u.id as any);
    await refresh();
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-emerald-600 mb-6">
        User Management
      </h1>

      <div className="bg-white rounded-2xl border overflow-visible relative">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                />
              </th>
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
                <td className="p-4 text-slate-500" colSpan={8}>
                  Loading…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td className="p-4 text-red-600" colSpan={8}>
                  {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td className="p-4 text-slate-500" colSpan={8}>
                  No users
                </td>
              </tr>
            ) : (
              data.map((u) => (
                <tr key={u.id as any} className="border-t">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(u.id as any)}
                      onChange={() => toggle(u.id as any)}
                    />
                  </td>
                  <td className="p-3">{u.userName}</td>
                  <td className="p-3">{fmtDate(u.dateOfBirth as any)}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phoneNumber || "—"}</td>
                  <td className="p-3">
                    <Badge color={subBadgeColor(u.subscriptionType)}>
                      {subLabel(u.subscriptionType)}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge color={roleBadgeColor(u.role)}>
                      {roleLabel(u.role)}
                    </Badge>
                  </td>
                  <td className="p-3 relative">
                    <details className="relative">
                      <summary className="list-none cursor-pointer select-none">
                        <span
                          className="inline-flex items-center justify-center
                       px-3 py-1.5 rounded-lg border text-blue-600
                       hover:bg-slate-50"
                        >
                          Action ▾
                        </span>
                      </summary>

                      {/* Menu lớn hơn, rõ ràng hơn */}
                      <div
                        className="absolute z-50 right-0 mt-2 w-64 rounded-2xl border bg-white shadow-xl p-2
                 text-[14px] leading-6"
                      >
                        <div className="px-3 pt-1 pb-1 text-xs font-medium text-slate-400">
                          Role
                        </div>
                        <button
                          className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg"
                          onClick={() => handleMakeRole(u, 1)}
                        >
                          Make Admin
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg"
                          onClick={() => handleMakeRole(u, 3)}
                        >
                          Make Staff
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg"
                          onClick={() => handleMakeRole(u, 2)}
                        >
                          Make User
                        </button>

                        <hr className="my-2" />

                        <div className="px-3 pt-1 pb-1 text-xs font-medium text-slate-400">
                          Subscription
                        </div>
                        <button
                          className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg"
                          onClick={() => handleSetSub(u, 2)}
                        >
                          Set VIP 25
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg"
                          onClick={() => handleSetSub(u, 3)}
                        >
                          Set VIP 50
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-lg"
                          onClick={() => handleSetSub(u, 1)}
                        >
                          Set Free
                        </button>

                        <hr className="my-2" />

                        <button
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg"
                          onClick={() => handleDelete(u)}
                        >
                          Delete
                        </button>
                      </div>
                    </details>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
