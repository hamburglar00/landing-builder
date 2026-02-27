"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_USERS } from "@lib/mocks";
import { loadSession, saveSession } from "@lib/helpers";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = loadSession();
    if (session?.username) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }

    saveSession(user.username);
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#0f172a_0,_#020617_40%,_#000_100%)] px-4 text-gray-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-500/70 bg-slate-900/95 p-7 shadow-[0_20px_45px_rgba(0,0,0,0.85)] backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-slate-50">
            Panel de clientes
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Accedé a tu constructor de landing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="block text-xs font-medium text-slate-100"
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cliente1"
              className="w-full rounded-lg border border-slate-600 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 transition focus:ring-1"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-100"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              className="w-full rounded-lg border border-slate-600 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 transition focus:ring-1"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-400">{error}</p>
          )}

          <button
            type="submit"
            className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.45)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Ingresar
          </button>

          <p className="mt-2 text-[11px] text-slate-400">
            Mock de ejemplo:{" "}
            <span className="font-semibold text-slate-100">
              cliente1 / 1234
            </span>{" "}
            o{" "}
            <span className="font-semibold text-slate-100">
              cliente2 / abcd
            </span>
            .
          </p>
        </form>
      </div>
    </main>
  );
}

