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
    setConfig(storedConfig ?? createDefaultConfig());
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
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-300">Cargando dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:gap-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-white">
              Constructor de landing
            </h1>
            <p className="text-xs text-gray-400">
              Plantilla fija · edición de contenido y colores.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {username && (
              <span className="rounded-full bg-gray-900/70 px-3 py-1 text-gray-200">
                Sesión: <span className="font-semibold">{username}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-gray-700 bg-gray-900/70 px-3 py-1.5 font-medium text-gray-100 transition hover:border-red-500 hover:bg-red-600/20 hover:text-red-200"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="order-1 space-y-4 lg:order-none">
            <LandingEditorForm config={config} onChange={setConfig} />

            <div className="flex flex-wrap gap-3 rounded-xl border border-gray-800 bg-gray-950/80 p-3">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex flex-1 items-center justify-center rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex flex-1 items-center justify-center rounded-md border border-gray-600 bg-gray-900/80 px-4 py-2 text-sm font-medium text-gray-100 transition hover:border-yellow-400 hover:bg-yellow-500/10"
              >
                Resetear
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex flex-1 items-center justify-center rounded-md border border-gray-600 bg-gray-900/80 px-4 py-2 text-sm font-medium text-gray-100 transition hover:border-emerald-400 hover:bg-emerald-500/10"
              >
                Exportar JSON
              </button>
            </div>
          </div>

          <div className="order-2 rounded-2xl border border-gray-800 bg-gray-950/80 p-3 md:p-4 lg:order-none">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Preview en vivo
            </h2>
            <LandingPreview config={config} />
          </div>
        </section>
      </div>
    </main>
  );
}

