"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LandingEditorForm } from "@components/LandingEditorForm";
import { LandingPreview } from "@components/LandingPreview";
import type { LandingThemeConfig } from "@lib/types";
import { createDefaultConfig } from "@lib/constants";
import {
  clearSession,
  loadConfig,
  loadSession,
  saveConfig
} from "@lib/helpers";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [config, setConfig] = useState<LandingThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (!session?.username) {
      router.replace("/login");
      return;
    }
    setUsername(session.username);

    const storedConfig = loadConfig(session.username);
    const base = createDefaultConfig();
    setConfig(storedConfig ? { ...base, ...storedConfig } : base);
    setLoading(false);
  }, [router]);

  const handleSave = () => {
    if (!username || !config) return;
    saveConfig(username, config);
    window.alert("Configuración guardada correctamente.");
  };

  const handleReset = () => {
    if (!username) return;
    const fresh = createDefaultConfig();
    setConfig(fresh);
    saveConfig(username, fresh);
  };

  const handleExport = () => {
    if (!config) return;
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `landing-config-${username ?? "config"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    clearSession();
    router.replace("/login");
  };

  if (loading || !config) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm text-slate-300">Cargando dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#020617_0,_#000_55%,_#020617_100%)] px-4 py-4 text-slate-100 md:px-6 md:py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:gap-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-50">
              Constructor de landing
            </h1>
            <p className="text-xs text-slate-400">
              Plantilla fija · edición de contenido y colores.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {username && (
              <span className="rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1 text-slate-100">
                Sesión: <span className="font-semibold">{username}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-slate-500 bg-slate-900/90 px-3 py-1.5 font-medium text-slate-100 transition hover:border-red-500 hover:bg-red-500/20 hover:text-red-100"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="max-h-[calc(100vh-190px)] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/95 p-4">
              <LandingEditorForm config={config} onChange={setConfig} />
            </div>

            <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-800 bg-slate-950/95 p-3">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.45)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-yellow-500/90 bg-zinc-900/90 px-4 py-2 text-sm font-medium text-yellow-300 transition hover:bg-yellow-500/5"
              >
                Resetear
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-emerald-500/90 bg-emerald-900/20 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/10"
              >
                Exportar JSON
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/95 p-3 md:p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Preview en vivo
            </h2>
            <LandingPreview config={config} />
          </div>
        </section>
      </div>
    </main>
  );
}

