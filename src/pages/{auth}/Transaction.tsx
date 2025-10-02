import Badge from "@/components/ui/Badge";

export default function Transactions() {
  const items = [
    {
      id: "1",
      name: "Minh",
      totalPayment: 1300000,
      paymentDate: "2025-09-25",
      status: "Pending",
      reason: "",
    },
    {
      id: "2",
      name: "Minh",
      totalPayment: 1300000,
      paymentDate: "2025-09-25",
      status: "Success",
      reason: "",
    },
    {
      id: "3",
      name: "Minh",
      totalPayment: 1300000,
      paymentDate: "2025-09-25",
      status: "Denied",
      reason: "",
    },
  ];
  const color = (s: string) =>
    s === "Success" ? "green" : s === "Pending" ? "amber" : "red";
  return (
    <div>
      <h1 className="text-3xl font-semibold text-emerald-600 mb-6">
        Transaction History
      </h1>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3 text-left w-10"></th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Total Payment</th>
              <th className="p-3 text-left">Payment Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="p-3">
                  <input type="checkbox" />
                </td>
                <td className="p-3">{it.name}</td>
                <td className="p-3">
                  {it.totalPayment.toLocaleString("vi-VN")} VND
                </td>
                <td className="p-3">
                  {new Date(it.paymentDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3">
                  <Badge color={color(it.status)}>{it.status}</Badge>
                </td>
                <td className="p-3 text-blue-600 underline cursor-pointer">
                  Show Detail
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
