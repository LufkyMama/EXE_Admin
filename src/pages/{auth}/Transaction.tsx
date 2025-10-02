import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import type { Transaction } from "@/services/transactionApi";
import {
  listTransactions,
  updateTransactionStatus,
  statusColor,
  statusLabel,
  TransactionStatus,
} from "@/services/transactionApi";

export default function Transactions() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Transaction | null>(null);
  const [changingId, setChangingId] = useState<string | number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listTransactions(1, 100);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const canChange = (s: TransactionStatus) => s === TransactionStatus.Pending;

  const changeStatus = async (tx: Transaction, next: TransactionStatus) => {
    if (!canChange(tx.status)) return;
    setChangingId(tx.id);
    try {
      await updateTransactionStatus(tx.id, next);
      await load();
    } finally {
      setChangingId(null);
    }
  };

  const fmtCurrency = (n: number) => `${n.toLocaleString("vi-VN")} VND`;
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN");

  return (
    <div>
      <h1 className="text-3xl font-semibold text-emerald-600 mb-6">
        Transaction History
      </h1>

      <div className="bg-white rounded-2xl border overflow-visible">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 text-left w-10"></th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Total Payment</th>
                <th className="p-3 text-left">Payment Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3">{it.userName || "—"}</td>
                  <td className="p-3">{fmtCurrency(it.totalPayment)}</td>
                  <td className="p-3">{fmtDate(it.paymentDate)}</td>
                  <td className="p-3">
                    <Badge color={statusColor(it.status)}>
                      {statusLabel(it.status)}
                    </Badge>
                  </td>
                  <td
                    className="p-3 text-blue-600 underline cursor-pointer"
                    onClick={() => setDetail(it)}
                  >
                    Show Detail
                  </td>
                  <td className="p-3 relative">
                    {/* Action: chỉ cho phép khi đang Pending */}
                    <details className="relative">
                      <summary className="list-none cursor-pointer select-none">
                        <span
                          className={`inline-flex items-center justify-center
                                      px-3 py-1.5 rounded-lg border
                                      ${
                                        canChange(it.status)
                                          ? "text-blue-600 hover:bg-slate-50"
                                          : "text-slate-400 cursor-not-allowed"
                                      }`}
                          title={
                            canChange(it.status)
                              ? "Change status"
                              : "This transaction is finalized"
                          }
                        >
                          Action ▾
                        </span>
                      </summary>

                      {canChange(it.status) && (
                        <div className="absolute z-50 right-0 mt-2 w-56 rounded-2xl border bg-white shadow-xl p-2 text-[14px] leading-6">
                          <div className="px-3 pt-1 pb-2 text-xs font-medium text-slate-400">
                            Set status
                          </div>

                          <button
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-lg"
                            disabled={changingId === it.id}
                            onClick={() =>
                              changeStatus(it, TransactionStatus.Completed)
                            }
                          >
                            Completed
                          </button>
                          <button
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-lg"
                            disabled={changingId === it.id}
                            onClick={() =>
                              changeStatus(it, TransactionStatus.Failed)
                            }
                          >
                            Failed
                          </button>
                          <button
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-lg"
                            disabled={changingId === it.id}
                            onClick={() =>
                              changeStatus(it, TransactionStatus.Cancelled)
                            }
                          >
                            Cancelled
                          </button>
                        </div>
                      )}
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal chi tiết đơn giản */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-5 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">Transaction detail</h3>
            <div className="text-sm space-y-1">
              <div><span className="text-slate-500">ID:</span> {detail.id}</div>
              <div><span className="text-slate-500">User:</span> {detail.userName || "—"}</div>
              <div><span className="text-slate-500">Amount:</span> {fmtCurrency(detail.totalPayment)}</div>
              <div><span className="text-slate-500">Date:</span> {fmtDate(detail.paymentDate)}</div>
              <div><span className="text-slate-500">Status:</span> {statusLabel(detail.status)}</div>
              <div><span className="text-slate-500">Reason:</span> {detail.reason || "—"}</div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 rounded-xl border text-slate-700 hover:bg-slate-50"
                onClick={() => setDetail(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
