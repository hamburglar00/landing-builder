"use client";

import React from "react";
import type {
  LandingThemeConfig,
  BackgroundMode,
  ColorOption
} from "@lib/types";
import { ColorSelect } from "./ColorSelect";
import { ImageUploader } from "./ImageUploader";

interface LandingEditorFormProps {
  config: LandingThemeConfig;
  onChange: (config: LandingThemeConfig) => void;
}

export const LandingEditorForm: React.FC<LandingEditorFormProps> = ({
  config,
  onChange
}) => {
  const updateField = <K extends keyof LandingThemeConfig>(
    field: K,
    value: LandingThemeConfig[K]
  ) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  const handleBackgroundModeChange = (mode: BackgroundMode) => {
    updateField("backgroundMode", mode);
  };

  const handleColorChange = (
    field: keyof LandingThemeConfig,
    value: ColorOption
  ) => {
    updateField(field, value as LandingThemeConfig[typeof field]);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-800 bg-gray-950/70 p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Fondo
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-200">Modo de fondo</p>
            <div className="flex gap-3 text-xs text-gray-100">
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="backgroundMode"
                  value="single"
                  checked={config.backgroundMode === "single"}
                  onChange={() => handleBackgroundModeChange("single")}
                  className="h-3.5 w-3.5 accent-cyan-500"
                />
                <span>Una sola imagen</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="backgroundMode"
                  value="rotating"
                  checked={config.backgroundMode === "rotating"}
                  onChange={() => handleBackgroundModeChange("rotating")}
                  className="h-3.5 w-3.5 accent-cyan-500"
                />
                <span>Rotando</span>
              </label>
            </div>
          </div>

          <ImageUploader
            label="Imágenes de fondo"
            multiple
            images={config.backgroundImages}
            onChange={(images) => updateField("backgroundImages", images)}
          />

          {config.backgroundMode === "rotating" && (
            <div className="space-y-1">
              <label
                htmlFor="rotateEveryHours"
                className="block text-xs font-medium text-gray-200"
              >
                Rotar cada (horas)
              </label>
              <input
                id="rotateEveryHours"
                type="number"
                min={1}
                value={config.rotateEveryHours}
                onChange={(e) =>
                  updateField("rotateEveryHours", Number(e.target.value) || 1)
                }
                className="block w-full rounded-md border border-gray-700 bg-gray-900/70 px-2.5 py-1.5 text-xs text-gray-100 outline-none ring-cyan-500/60 focus:ring-1"
              />
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-950/70 p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Logo
        </h3>
        <ImageUploader
          label="Logo principal"
          image={config.logoUrl || null}
          onChange={(image) => updateField("logoUrl", image ?? "")}
        />
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-950/70 p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Título
        </h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="titleLine1"
              className="block text-xs font-medium text-gray-200"
            >
              Línea 1
            </label>
            <input
              id="titleLine1"
              type="text"
              value={config.titleLine1}
              onChange={(e) => updateField("titleLine1", e.target.value)}
              className="block w-full rounded-md border border-gray-700 bg-gray-900/70 px-2.5 py-1.5 text-xs text-gray-100 outline-none ring-cyan-500/60 focus:ring-1"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="titleLine2"
              className="block text-xs font-medium text-gray-200"
            >
              Línea 2
            </label>
            <input
              id="titleLine2"
              type="text"
              value={config.titleLine2}
              onChange={(e) => updateField("titleLine2", e.target.value)}
              className="block w-full rounded-md border border-gray-700 bg-gray-900/70 px-2.5 py-1.5 text-xs text-gray-100 outline-none ring-cyan-500/60 focus:ring-1"
            />
          </div>

          <ColorSelect
            label="Color del título"
            value={config.titleColor}
            onChange={(c) => handleColorChange("titleColor", c)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-950/70 p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Información
        </h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="subtitleLine1"
              className="block text-xs font-medium text-gray-200"
            >
              Línea informativa 1
            </label>
            <input
              id="subtitleLine1"
              type="text"
              value={config.subtitleLine1}
              onChange={(e) => updateField("subtitleLine1", e.target.value)}
              className="block w-full rounded-md border border-gray-700 bg-gray-900/70 px-2.5 py-1.5 text-xs text-gray-100 outline-none ring-cyan-500/60 focus:ring-1"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="subtitleLine2"
              className="block text-xs font-medium text-gray-200"
            >
              Línea informativa 2
            </label>
            <input
              id="subtitleLine2"
              type="text"
              value={config.subtitleLine2}
              onChange={(e) => updateField("subtitleLine2", e.target.value)}
              className="block w-full rounded-md border border-gray-700 bg-gray-900/70 px-2.5 py-1.5 text-xs text-gray-100 outline-none ring-cyan-500/60 focus:ring-1"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="subtitleLine3"
              className="block text-xs font-medium text-gray-200"
            >
              Línea informativa 3
            </label>
            <input
              id="subtitleLine3"
              type="text"
              value={config.subtitleLine3}
              onChange={(e) => updateField("subtitleLine3", e.target.value)}
              className="block w-full rounded-md border border-gray-700 bg-gray-900/70 px-2.5 py-1.5 text-xs text-gray-100 outline-none ring-cyan-500/60 focus:ring-1"
            />
          </div>

          <ColorSelect
            label="Color del texto informativo"
            value={config.subtitleColor}
            onChange={(c) => handleColorChange("subtitleColor", c)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-950/70 p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Texto final
        </h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="footerBadgeText"
              className="block text-xs font-medium text-gray-200"
            >
              Texto del badge
            </label>
            <input
              id="footerBadgeText"
              type="text"
              value={config.footerBadgeText}
              onChange={(e) => updateField("footerBadgeText", e.target.value)}
              className="block w-full rounded-md border border-gray-700 bg-gray-900/70 px-2.5 py-1.5 text-xs text-gray-100 outline-none ring-cyan-500/60 focus:ring-1"
            />
          </div>

          <ColorSelect
            label="Color del badge final"
            value={config.footerBadgeColor}
            onChange={(c) => handleColorChange("footerBadgeColor", c)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-950/70 p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          CTA
        </h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="ctaText"
              className="block text-xs font-medium text-gray-200"
            >
              Texto del botón
            </label>
            <input
              id="ctaText"
              type="text"
              value={config.ctaText}
              onChange={(e) => updateField("ctaText", e.target.value)}
              className="block w-full rounded-md border border-gray-700 bg-gray-900/70 px-2.5 py-1.5 text-xs text-gray-100 outline-none ring-cyan-500/60 focus:ring-1"
            />
          </div>

          <ColorSelect
            label="Color del texto del CTA"
            value={config.ctaTextColor}
            onChange={(c) => handleColorChange("ctaTextColor", c)}
          />

          <ColorSelect
            label="Color de fondo del CTA"
            value={config.ctaBackgroundColor}
            onChange={(c) => handleColorChange("ctaBackgroundColor", c)}
          />

          <ColorSelect
            label="Color del glow del CTA"
            value={config.ctaGlowColor}
            onChange={(c) => handleColorChange("ctaGlowColor", c)}
          />
        </div>
      </section>
    </div>
  );
};

