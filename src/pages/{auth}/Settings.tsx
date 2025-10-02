import useAuth from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-semibold text-emerald-600 mb-6">
        Site Settings
      </h1>
      <div className="bg-white rounded-2xl border p-6 grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Profile Information</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-500">User Name: </span>
              {user?.userName}
            </div>
            <div>
              <span className="text-slate-500">Email: </span>
              {user?.email}
            </div>
            <div>
              <span className="text-slate-500">Phone Number: </span>
              {user?.phoneNumber || "—"}
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Appearance</h2>
          <div className="text-sm text-slate-500">Theme: Light</div>
        </div>
      </div>
    </div>
  );
}
