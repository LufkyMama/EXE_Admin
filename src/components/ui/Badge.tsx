export default function Badge({
  children,
  color = "slate",
}: {
  children: React.ReactNode;
  color?: "green" | "amber" | "red" | "slate" | "blue";
}) {
  const map: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`px-2 py-0.5 text-xs rounded-md ${map[color]}`}>
      {children}
    </span>
  );
}
