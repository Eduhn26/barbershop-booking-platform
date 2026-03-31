"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [salonName, setSalonName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await api.post("/auth/register", { email, name, password, salonName, role: "admin" });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMsg("Conta criada. Token salvo no localStorage (fase 1).");
    } catch (err: any) {
      setMsg(err?.response?.data?.message ?? "Falha no cadastro");
    }
  }

  return (
    <main className="p-8 max-w-md">
      <h1 className="text-xl font-semibold">Criar conta</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input className="w-full rounded-md bg-zinc-900 p-3" placeholder="Nome do salão" value={salonName} onChange={(e) => setSalonName(e.target.value)} />
        <input className="w-full rounded-md bg-zinc-900 p-3" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full rounded-md bg-zinc-900 p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-md bg-zinc-900 p-3" placeholder="Senha (mín 6)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full rounded-md bg-zinc-800 p-3">Criar</button>
        {msg ? <p className="text-sm text-zinc-300">{msg}</p> : null}
      </form>
    </main>
  );
}
