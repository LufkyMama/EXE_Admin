import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import useAuth from "@/hooks/useAuth";

export default function AppLayout() {
  const { user, loading, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />

      <main className="flex-1">
        {/* Header */}
        <div className="flex items-center p-4">
          {/* Góc phải */}
          <div className="ml-auto flex items-center gap-4">
            <button className="rounded-lg border px-2 py-1 text-xs hover:bg-slate-100">📩</button>
            <button className="rounded-lg border px-2 py-1 text-xs hover:bg-slate-100">🔔</button>

            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-slate-200" />
              <div className="leading-tight text-right">
                <div className="text-sm font-medium">
                  {loading ? "…" : user?.userName ?? "—"}
                </div>
                <div className="text-xs text-slate-500">Admin Account</div>
              </div>

              <button
                onClick={() => { logout(); nav("/login", { replace: true }); }}
                className="ml-2 text-xs rounded-lg px-3 py-1 border border-slate-300 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Nội dung trang */}
        <div className="px-8 pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
