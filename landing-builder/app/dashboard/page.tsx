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
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}
      >
        <p style={{ fontSize: "0.9rem", color: "#cbd5f5" }}>
          Cargando dashboard...
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "1.5rem 1.25rem",
        background:
          "radial-gradient(circle at top, #020617 0, #000 55%, #020617 100%)",
        color: "#e5e7eb",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem"
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#f9fafb",
                marginBottom: "0.2rem"
              }}
            >
              Constructor de landing
            </h1>
            <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
              Plantilla fija · edición de contenido y colores.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem"
            }}
          >
            {username && (
              <span
                style={{
                  borderRadius: "999px",
                  padding: "0.25rem 0.9rem",
                  backgroundColor: "rgba(15,23,42,0.85)",
                  color: "#e5e7eb",
                  border: "1px solid rgba(75,85,99,0.8)"
                }}
              >
                Sesión:{" "}
                <span style={{ fontWeight: 600 }}>{username}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              style={{
                borderRadius: "0.5rem",
                padding: "0.4rem 0.9rem",
                border: "1px solid rgba(148,163,184,0.7)",
                backgroundColor: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                cursor: "pointer"
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
            gap: "1.25rem"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div
              style={{
                borderRadius: "1rem",
                padding: "1rem",
                border: "1px solid rgba(31,41,55,1)",
                backgroundColor: "rgba(15,23,42,0.95)",
                maxHeight: "calc(100vh - 190px)",
                overflowY: "auto"
              }}
            >
              <LandingEditorForm config={config} onChange={setConfig} />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                borderRadius: "1rem",
                padding: "0.75rem",
                border: "1px solid rgba(31,41,55,1)",
                backgroundColor: "rgba(15,23,42,0.95)"
              }}
            >
              <button
                type="button"
                onClick={handleSave}
                style={{
                  flex: 1,
                  borderRadius: "0.7rem",
                  padding: "0.55rem 0.75rem",
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  background:
                    "linear-gradient(135deg, #22d3ee 0%, #0ea5e9 60%, #0f766e 100%)",
                  boxShadow: "0 12px 30px rgba(56,189,248,0.45)",
                  cursor: "pointer"
                }}
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  flex: 1,
                  borderRadius: "0.7rem",
                  padding: "0.55rem 0.75rem",
                  border: "1px solid rgba(202,138,4,0.85)",
                  backgroundColor: "rgba(23,23,23,0.9)",
                  color: "#facc15",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Resetear
              </button>
              <button
                type="button"
                onClick={handleExport}
                style={{
                  flex: 1,
                  borderRadius: "0.7rem",
                  padding: "0.55rem 0.75rem",
                  border: "1px solid rgba(34,197,94,0.9)",
                  backgroundColor: "rgba(6,78,59,0.25)",
                  color: "#bbf7d0",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Exportar JSON
              </button>
            </div>
          </div>

          <div
            style={{
              borderRadius: "1.25rem",
              padding: "0.9rem",
              border: "1px solid rgba(31,41,55,1)",
              backgroundColor: "rgba(15,23,42,0.96)"
            }}
          >
            <h2
              style={{
                marginBottom: "0.6rem",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9ca3af"
              }}
            >
              Preview en vivo
            </h2>
            <LandingPreview config={config} />
          </div>
        </section>
      </div>
    </main>
  );
}

