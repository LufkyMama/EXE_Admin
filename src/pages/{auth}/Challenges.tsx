import { useEffect, useState } from "react";
import {
  createChallenge,
  deleteChallenge,
  listChallenges,
  setChallengeStatus,
} from "@/services/challengeApi";
import type { Challenge } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

export default function Challenges() {
  const [items, setItems] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Form tạo mới (gọn)
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<Challenge>>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    isComplete: false,
  });

  const load = async () => {
    setLoading(true);
    try {
      setItems(await listChallenges());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // tạo mới
  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name) return;
    await createChallenge(createForm);
    setCreateForm({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      isComplete: false,
    });
    setOpenCreate(false);
    load();
  };

  const fmt = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("vi-VN") : "—";

  return (
    <div>
      <h1 className="text-3xl font-semibold text-emerald-600 mb-6">
        Challenges
      </h1>

      {/* Tạo mới — gọn, mở khi cần */}
      <div className="mb-4">
        <Button onClick={() => setOpenCreate(v => !v)}>
          {openCreate ? "Close" : "New Challenge"}
        </Button>
      </div>

      {openCreate && (
        <form
          onSubmit={submitCreate}
          className="bg-white border rounded-2xl p-4 mb-6 grid grid-cols-5 gap-3"
        >
          <Input
            placeholder="Name"
            value={createForm.name || ""}
            onChange={(e) => setCreateForm(f => ({ ...f, name: e.target.value }))}
          />
          <Input
            placeholder="Description"
            value={createForm.description || ""}
            onChange={(e) => setCreateForm(f => ({ ...f, description: e.target.value }))}
          />
          <Input
            type="date"
            value={createForm.startDate || ""}
            onChange={(e) => setCreateForm(f => ({ ...f, startDate: e.target.value }))}
          />
          <Input
            type="date"
            value={createForm.endDate || ""}
            onChange={(e) => setCreateForm(f => ({ ...f, endDate: e.target.value }))}
          />
          <div className="col-span-5">
            <Button type="submit">Create challenge</Button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-visible">
        {loading ? (
          <div className="p-6">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 text-left w-10"></th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">StartDate</th>
                <th className="p-3 text-left">EndDate</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.description}</td>
                  <td className="p-3">{fmt(c.startDate)}</td>
                  <td className="p-3">{fmt(c.endDate)}</td>
                  <td className="p-3">
                    <Badge color={c.isComplete ? "green" : "red"}>
                      {c.isComplete ? "DONE" : "NOT DONE"}
                    </Badge>
                  </td>
                  <td className="p-3 relative">
                    <details className="relative">
                      <summary className="list-none cursor-pointer select-none">
                        <span className="inline-flex items-center justify-center
                                         px-3 py-1.5 rounded-lg border text-blue-600
                                         hover:bg-slate-50">
                          Action ▾
                        </span>
                      </summary>
                      <div className="absolute z-50 right-0 mt-2 w-56 rounded-2xl border bg-white shadow-xl p-2 text-[14px] leading-6">
                        <div className="px-3 pt-1 pb-1 text-xs font-medium text-slate-400">
                          Status
                        </div>
                        {c.isComplete ? (
                          <button
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-lg"
                            onClick={async () => {
                              await setChallengeStatus(c, false);
                              load();
                            }}
                          >
                            Mark as NOT DONE
                          </button>
                        ) : (
                          <button
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-lg"
                            onClick={async () => {
                              await setChallengeStatus(c, true);
                              load();
                            }}
                          >
                            Mark as DONE
                          </button>
                        )}

                        <hr className="my-2" />

                        <button
                          className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg"
                          onClick={async () => {
                            if (!confirm(`Delete "${c.name}"?`)) return;
                            await deleteChallenge(c.id);
                            load();
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
