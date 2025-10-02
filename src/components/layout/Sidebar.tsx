import { NavLink } from "react-router-dom";
import { BarChart3, ListChecks, Settings, Users2, Receipt } from "lucide-react";

const Item = ({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: any;
  label: string;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
        isActive
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-50"
      }`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r bg-white h-screen sticky top-0">
      <div className="px-6 py-6 flex items-center gap-2 text-xl font-semibold">
        <img src="/src/assets/logo.svg" alt="logo" className="w-6 h-6" />
        <span>VietCarbona</span>
      </div>
      <nav className="space-y-1">
        <Item to="/" icon={BarChart3} label="Overview" />
        <Item to="/transactions" icon={Receipt} label="Transactions" />
        <Item to="/users" icon={Users2} label="Users" />
        <Item to="/challenges" icon={ListChecks} label="Challenges" />
        <Item to="/settings" icon={Settings} label="Settings" />
      </nav>
    </aside>
  );
}
