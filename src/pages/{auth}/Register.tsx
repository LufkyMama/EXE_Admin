import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { register as apiRegister } from "@/services/authApi";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRegister(form);
      nav("/login");
    } catch (ex: any) {
      setErr(ex?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <form
        onSubmit={submit}
        className="bg-white w-full max-w-sm p-6 rounded-2xl border space-y-3"
      >
        <h1 className="text-xl font-semibold">Create account</h1>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <Input
          placeholder="Username"
          value={form.userName}
          onChange={(e) => setForm((f) => ({ ...f, userName: e.target.value }))}
        />
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <Input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <Input
          placeholder="Phone number"
          value={form.phoneNumber}
          onChange={(e) =>
            setForm((f) => ({ ...f, phoneNumber: e.target.value }))
          }
        />
        <Button type="submit" className="w-full">
          Register
        </Button>
        <div className="text-sm text-slate-500">
          Have an account?{" "}
          <Link className="text-blue-600" to="/login">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
