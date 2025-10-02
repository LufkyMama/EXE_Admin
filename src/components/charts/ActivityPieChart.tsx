import { useEffect, useMemo, useState } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Label } from "recharts";
import { fetchUserActivities, type UserActivityRow } from "@/services/userActivityApi";

/** Màu đúng tông Figma: Plastic=blue-slate, Transport=amber, Energy=green, Food=violet */
const COLORS = ["#1f2937", "#f59e0b", "#22c55e", "#8b5cf6"];
const NAME_INDEX: Record<string, number> = { Plastic: 0, Transportation: 1, Energy: 2, Food: 3 };
const MIN_LABEL_PCT = 1;

/** viewBox type hẹp cho Label center (tránh cảnh báo TS) */
type CenterLabelProps = { viewBox?: { cx?: number; cy?: number } };

/** Chuẩn hoá YYYY-MM-DD (UTC) để khớp payload có 'Z' */
function toDateKeySafe(d?: Date | string | null): string {
  if (!d) return "";
  if (typeof d === "string") {
    const m = d.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
  }
  const t = new Date(d as any);
  return isNaN(+t) ? "" : t.toISOString().slice(0, 10);
}

export default function ActivityPieChart() {
  const [rows, setRows] = useState<UserActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateKey, setDateKey] = useState<string>(() => toDateKeySafe(new Date()));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUserActivities();
        if (!cancelled) setRows(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Tổng theo ngày chọn -> % theo 4 nhóm (đúng bố cục Figma)
  const { chartData, pieData, totalRaw } = useMemo(() => {
    const totals = { plastic: 0, transportation: 0, energy: 0, food: 0 };

    for (const r of rows) {
      const k = toDateKeySafe(r?.date);
      if (!k || k !== dateKey) continue;
      totals.plastic        += r.plasticUsage?.cO2Emission ?? 0;
      totals.transportation += r.trafficUsage?.cO2Emission ?? 0;
      totals.energy         += r.energyUsage?.cO2Emission ?? 0;
      totals.food           += r.foodUsage?.cO2Emission ?? 0;
    }

    const sum = totals.plastic + totals.transportation + totals.energy + totals.food;
    const toPct = (v: number) => (sum > 0 ? (v / sum) * 100 : 0);

    const all = [
      { name: "Plastic",        value: toPct(totals.plastic),        raw: totals.plastic },
      { name: "Transportation", value: toPct(totals.transportation), raw: totals.transportation },
      { name: "Energy",         value: toPct(totals.energy),         raw: totals.energy },
      { name: "Food",           value: toPct(totals.food),           raw: totals.food },
    ];
    const filtered = all.filter(d => d.value > 0.000001);
    return { chartData: filtered, pieData: all, totalRaw: sum };
  }, [rows, dateKey]);

  return (
    <div className="w-full">
      {/* Date picker (Figma có filter ngày) */}
      <div className="mb-3">
        <input
          type="date"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          value={dateKey}
          onChange={(e) => setDateKey(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : totalRaw <= 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
          No data for the selected date
        </div>
      ) : (
        <div className="flex items-start gap-6 h-64">
          {/* Donut chart bên trái */}
          <div className="flex-1 h-full">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip
                  formatter={(val: any, name: any, props: any) => {
                    const pct = typeof val === "number" ? `${val.toFixed(2)}%` : val;
                    const raw = (props?.payload?.raw ?? 0).toFixed(2);
                    return [`${pct} (${raw} CO₂e)`, name];
                  }}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  minAngle={2}
                  labelLine={false}
                  label={(p: any) => (p.value >= MIN_LABEL_PCT ? `${(p.value as number).toFixed(1)}%` : null)}
                >
                  {chartData.map((d) => (
                    <Cell key={d.name} fill={COLORS[NAME_INDEX[d.name]]} />
                  ))}
                  {/* Nhãn giữa: "My Daily Activities" + tổng CO2e (đúng Figma) */}
                  <Label
                    position="center"
                    content={({ viewBox }: CenterLabelProps) => {
                      const cx = typeof viewBox?.cx === "number" ? viewBox!.cx! : undefined;
                      const cy = typeof viewBox?.cy === "number" ? viewBox!.cy! : undefined;
                      if (cx === undefined || cy === undefined) return null;
                      return (
                        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan className="fill-slate-500 text-xs">My Daily Activities</tspan>
                          <tspan x={cx} dy="1.2em" className="fill-slate-900 text-sm font-semibold">
                            {totalRaw.toFixed(2)} CO₂e
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend bên phải (ẩn mục 0%) */}
          <div className="w-56">
            <ul className="space-y-3 text-sm">
              {pieData
                .filter((d) => d.raw > 0)
                .map((d) => (
                  <li key={d.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ background: COLORS[NAME_INDEX[d.name]] }}
                      />
                      <span>{d.name}</span>
                    </span>
                    <span className="font-medium">
                      {d.value.toFixed(1)}%
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
