import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sample = [
  { year: 1970, China: 1.2, US: 5.5 },
  { year: 1990, China: 2.3, US: 5.8 },
  { year: 2005, China: 6.2, US: 5.9 },
  { year: 2020, China: 10.1, US: 4.7 },
];

export default function CarbonLineChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={sample}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="China"
            stroke="#2563eb"
            strokeWidth={2}
          />
          <Line type="monotone" dataKey="US" stroke="#16a34a" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
