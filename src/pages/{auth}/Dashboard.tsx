import { useEffect, useMemo, useState } from "react";
import CarbonLineChart from "@/components/charts/CarbonLineChart";
import ActivityPieChart from "@/components/charts/ActivityPieChart";
import Badge from "@/components/ui/Badge";
import { fetchLeaderboard, type LeaderboardRow } from "@/services/userActivityApi";
import { listRecentUsers } from "@/services/userApi";
// import { sendNotification } from "@/services/notificationApi";
import type { User } from "@/types";

export default function Dashboard() {
  // leaderboard
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  // recent users
  const [recent, setRecent] = useState<User[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // modal send notification
  const [target, setTarget] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  // const [sending, setSending] = useState(false);
  const closeModal = () => { setTarget(null); setTitle(""); setMessage(""); };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setRows(await fetchLeaderboard()); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingRecent(true);
      try { setRecent(await listRecentUsers(5)); }
      finally { setLoadingRecent(false); }
    })();
  }, []);

  const leaders = useMemo(() => {
    const arr = rows
      .map(r => ({ name: r.userName || "Unknown", total: Number(r.totalCO2Emission) || 0 }))
      .sort((a, b) => a.total - b.total);
    return arr.slice(0, 5);
  }, [rows]);

  const medal = (i: number) => (i === 0 ? "Gold" : i === 1 ? "Silver" : i === 2 ? "Bronze" : "—");
  const badgeColor = (i: number) => (i === 0 ? "amber" : i === 1 ? "slate" : i === 2 ? "amber" : "slate");

  // Chip chỉ có chữ cái đầu (không dùng hình)
  const Initial = ({ name }: { name?: string }) => {
    const ch = (name ?? "?").trim().charAt(0).toUpperCase();
    return (
      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center
                      text-slate-700 font-semibold text-base">
        {ch}
      </div>
    );
  };

  // const submitNotification = async () => {
  //   if (!target) return;
  //   if (!title.trim() || !message.trim()) return;
  //   setSending(true);
  //   try {
  //     await sendNotification({ userId: Number(target.id), title, message });
  //     closeModal();
  //     // có thể show toast thành công ở đây
  //   } catch (e) {
  //     // có thể show toast lỗi ở đây
  //   } finally {
  //     setSending(false);
  //   }
  // };

  return (
    <div className="grid grid-cols-12 gap-8">
      <h1 className="col-span-12 text-4xl font-semibold text-emerald-600">Admin Dashboard</h1>

      {/* Trái: Line chart (rộng hơn) */}
      <section className="col-span-7 bg-white rounded-2xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Carbon Emission Overview</h2>
        </div>
        <CarbonLineChart />
      </section>

      {/* Phải: Top Contributors */}
      <section className="col-span-5 bg-white rounded-2xl border p-6">
        <h2 className="text-xl font-semibold mb-4">Top Contributors</h2>
        {loading ? (
          <div className="text-sm text-slate-500">Loading…</div>
        ) : leaders.length === 0 ? (
          <div className="text-sm text-slate-500">No data</div>
        ) : (
          <ol className="space-y-4 text-base">
            {leaders.map((u, i) => (
              <li key={`${u.name}-${i}`} className="flex items-center justify-between">
                <span className="flex items-center gap-4">
                  <span className="w-6 text-slate-400 text-lg">{i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <span className="font-medium truncate max-w-[10rem]" title={u.name}>{u.name}</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{u.total.toFixed(2)} CO₂e</span>
                  <Badge color={badgeColor(i)}>{medal(i)}</Badge>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Trái dưới: Activity pie */}
      <section className="col-span-7 bg-white rounded-2xl border p-6">
        <h2 className="text-xl font-semibold mb-4">Activity Chart</h2>
        <ActivityPieChart />
      </section>

      {/* Phải dưới: New Users + gửi notification */}
      <section className="col-span-5 bg-white rounded-2xl border p-6">
        <h2 className="text-xl font-semibold mb-4">New Users</h2>

        {loadingRecent ? (
          <div className="text-sm text-slate-500">Loading…</div>
        ) : recent.length === 0 ? (
          <div className="text-sm text-slate-500">No data</div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-5 mb-5">
              {recent.map((u) => (
                <div key={u.id} className="flex flex-col items-center gap-2">
                  <Initial name={u.userName} />
                  <span className="text-xs text-slate-600 max-w-16 truncate" title={u.userName}>
                    {u.userName}
                  </span>
                  <button
                    className="text-emerald-700 text-xs underline"
                    onClick={() => setTarget(u)}
                  >
                    Send
                  </button>
                </div>
              ))}
              {/* “Add New” giống figma nhưng không bắt buộc chức năng */}
              <div className="flex flex-col items-center gap-2 opacity-60">
                <div className="w-12 h-12 rounded-full border border-dashed border-slate-300
                                flex items-center justify-center">+</div>
                <span className="text-xs text-slate-600">Add New</span>
              </div>
            </div>

            <button
              className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm hover:bg-emerald-100"
              onClick={() => setTarget(recent[0])}
              title="Send to a user"
            >
              Send Notifications ›
            </button>
          </>
        )}
      </section>

      {/* Modal gửi notification */}
      {target && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-5 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">
              Send notification to <span className="text-emerald-700">{target.userName}</span>
            </h3>
            <div className="space-y-3">
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full rounded-xl border px-3 py-2 text-sm min-h-[120px]"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-xl border text-slate-700 hover:bg-slate-50"
                onClick={closeModal}
                // disabled={sending}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                // onClick={submitNotification}
                // disabled={sending || !title.trim() || !message.trim()}
              >
                {/* {sending ? "Sending…" : "Send"} */}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
