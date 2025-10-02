import { useEffect, useState } from "react";
import {
  createChallenge,
  deleteChallenge,
  listChallenges,
  updateChallenge,
} from "@/services/challengeApi";
import type { Challenge } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

export default function Challenges() {
  const [items, setItems] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Challenge>>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    isComplete: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    if (editingId) {
      await updateChallenge(editingId, form);
    } else {
      await createChallenge(form);
    }
    setForm({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      isComplete: false,
    });
    setEditingId(null);
    load();
  };

  const edit = (c: Challenge) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      description: c.description,
      startDate: c.startDate?.slice(0, 10),
      endDate: c.endDate?.slice(0, 10),
      isComplete: false,
    });
  };
  return (
    <div>
      <h1 className="text-3xl font-semibold text-emerald-600 mb-6">
        Challenges
      </h1>
      {/* Form */}
      <form
        onSubmit={submit}
        className="bg-white border rounded-2xl p-4 mb-6 grid grid-cols-5 gap-3"
      >
        <Input
          placeholder="Name"
          value={form.name || ""}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <Input
          type="date"
          value={form.startDate || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, startDate: e.target.value }))
          }
        />
        <Input
          type="date"
          value={form.endDate || ""}
          onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
        />
        <select
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          value={form.isComplete ? "DONE" : "NOT DONE"}
          onChange={(e) =>
            setForm((f) => ({ ...f, isComplete: e.target.value === "DONE" }))
          }
        >
          <option value="NOT DONE">NOT DONE</option>
          <option value="DONE">DONE</option>
        </select>
        <div className="col-span-5">
          <Button type="submit">
            {editingId ? "Update" : "Create"} challenge
          </Button>
          {editingId && (
            <Button
              type="button"
              className="ml-2"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  description: "",
                  startDate: "",
                  endDate: "",
                  isComplete: false,
                });
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
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
                  <td className="p-3">
                    {c.startDate
                      ? new Date(c.startDate).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td className="p-3">
                    {c.endDate
                      ? new Date(c.endDate).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td className="p-3">
                    <Badge color={c.isComplete ? "green" : "red"}>
                      {c.isComplete ? "DONE" : "NOT DONE"}
                    </Badge>
                  </td>
                  <td className="p-3 space-x-3">
                    <button className="text-blue-600" onClick={() => edit(c)}>
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={async () => {
                        await deleteChallenge(c.id);
                        load();
                      }}
                    >
                      Delete
                    </button>
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
