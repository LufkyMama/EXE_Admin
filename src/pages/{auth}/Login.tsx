import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    await login(email, password);     // <- từ useAuth()
    nav('/', { replace: true });      // redirect về Overview
  } catch (ex: any) {
    setErr(ex?.response?.data?.message || ex?.message || 'Login failed');
  } 
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <form
        onSubmit={onSubmit}
        className="bg-white w-full max-w-sm p-6 rounded-2xl border space-y-3"
      >
        <h1 className="text-xl font-semibold">Admin Login</h1>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <Input
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        <div className="text-sm text-slate-500">
          No account?{" "}
          <Link className="text-blue-600" to="/register">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
