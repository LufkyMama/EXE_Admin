import CarbonLineChart from "@/components/charts/CarbonLineChart";
import ActivityPieChart from "@/components/charts/ActivityPieChart";
import Badge from "@/components/ui/Badge";
import { useEffect, useMemo, useState } from "react";
import { fetchLeaderboard, type LeaderboardRow } from "@/services/userActivityApi";

export default function Dashboard() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchLeaderboard();
        setRows(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Sắp xếp theo tổng CO₂ tăng dần, lấy top 5 (CO₂ thấp nhất)
  const leaders = useMemo(() => {
    const arr = rows
      .map((r) => ({
        name: r.userName || "Unknown",
        total: Number(r.totalCO2Emission) || 0,
      }))
      .sort((a, b) => a.total - b.total);
    return arr.slice(0, 5);
  }, [rows]);

  const medal = (rank: number) =>
    rank === 0 ? "Gold" : rank === 1 ? "Silver" : rank === 2 ? "Bronze" : "—";

  const badgeColor = (rank: number) =>
    rank === 0 ? "amber" : rank === 1 ? "slate" : rank === 2 ? "amber" : "slate";

  return (
    <div className="grid grid-cols-12 gap-6">
      <h1 className="col-span-12 text-3xl font-semibold text-emerald-600">
        Admin Dashboard
      </h1>

      <section className="col-span-8 bg-white rounded-2xl border p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Carbon Emission Overview</h2>
        </div>
        <CarbonLineChart />
      </section>

      {/* Top Contributors (CO2 thấp nhất) */}
      <section className="col-span-4 bg-white rounded-2xl border p-5">
        <h2 className="text-lg font-semibold mb-3">Top Contributors</h2>

        {loading ? (
          <div className="text-sm text-slate-500">Loading…</div>
        ) : leaders.length === 0 ? (
          <div className="text-sm text-slate-500">No data</div>
        ) : (
          <ol className="space-y-3 text-sm">
            {leaders.map((u, i) => (
              <li key={`${u.name}-${i}`} className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="w-6 text-slate-400">{i + 1}</span>
                  <div className="w-6 h-6 rounded-full bg-slate-200" />
                  <span className="font-medium truncate max-w-[8rem]" title={u.name}>
                    {u.name}
                  </span>
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

      <section className="col-span-6 bg-white rounded-2xl border p-5">
        <h2 className="text-lg font-semibold mb-3">Activity Chart</h2>
        <ActivityPieChart />
      </section>

      <section className="col-span-6 bg-white rounded-2xl border p-5">
        <h2 className="text-lg font-semibold mb-3">New Users</h2>
        <div className="flex items-center gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-slate-200" />
          ))}
        </div>
      </section>
    </div>
  );
}
