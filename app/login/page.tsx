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
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950/80 p-6 shadow-[0_0_40px_rgba(0,0,0,0.85)]">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-white">
            Panel de clientes
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Accedé a tu constructor de landing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="block text-xs font-medium text-gray-200"
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md border border-gray-700 bg-gray-900/70 px-3 py-2 text-sm text-gray-100 outline-none ring-cyan-500/60 focus:ring-1"
              placeholder="cliente1"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-200"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-700 bg-gray-900/70 px-3 py-2 text-sm text-gray-100 outline-none ring-cyan-500/60 focus:ring-1"
              placeholder="••••"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-400">{error}</p>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Ingresar
          </button>

          <p className="mt-3 text-[11px] text-gray-500">
            Mock de ejemplo: <strong>cliente1 / 1234</strong> o{" "}
            <strong>cliente2 / abcd</strong>.
          </p>
        </form>
      </div>
    </main>
  );
}

