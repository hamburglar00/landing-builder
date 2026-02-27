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
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background:
          "radial-gradient(circle at top, #0f172a 0, #020617 40%, #000 100%)",
        color: "#e5e7eb",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          padding: "1.75rem",
          borderRadius: "1rem",
          border: "1px solid rgba(148,163,184,0.6)",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.9))",
          boxShadow: "0 20px 45px rgba(0,0,0,0.75)"
        }}
      >
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              marginBottom: "0.25rem",
              color: "#f9fafb"
            }}
          >
            Panel de clientes
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            Accedé a tu constructor de landing.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <label
              htmlFor="username"
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#e5e7eb"
              }}
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
              style={{
                width: "100%",
                borderRadius: "0.5rem",
                border: "1px solid #4b5563",
                backgroundColor: "#020617",
                padding: "0.5rem 0.75rem",
                fontSize: "0.85rem",
                color: "#f9fafb",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <label
              htmlFor="password"
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#e5e7eb"
              }}
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
              style={{
                width: "100%",
                borderRadius: "0.5rem",
                border: "1px solid #4b5563",
                backgroundColor: "#020617",
                padding: "0.5rem 0.75rem",
                fontSize: "0.85rem",
                color: "#f9fafb",
                outline: "none"
              }}
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#f97373"
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              marginTop: "0.4rem",
              width: "100%",
              borderRadius: "0.6rem",
              border: "none",
              padding: "0.55rem 0.75rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#ffffff",
              background:
                "linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #0f766e 100%)",
              boxShadow: "0 12px 30px rgba(56,189,248,0.45)",
              cursor: "pointer"
            }}
          >
            Ingresar
          </button>

          <p
            style={{
              marginTop: "0.6rem",
              fontSize: "0.7rem",
              color: "#9ca3af"
            }}
          >
            Mock de ejemplo:{" "}
            <strong style={{ color: "#e5e7eb" }}>cliente1 / 1234</strong> o{" "}
            <strong style={{ color: "#e5e7eb" }}>cliente2 / abcd</strong>.
          </p>
        </form>
      </div>
    </main>
  );
}

