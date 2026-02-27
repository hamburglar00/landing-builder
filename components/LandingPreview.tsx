"use client";

import React from "react";
import type { LandingThemeConfig } from "@lib/types";
import { COLOR_MAP } from "@lib/constants";

interface LandingPreviewProps {
  config: LandingThemeConfig;
}

export const LandingPreview: React.FC<LandingPreviewProps> = ({ config }) => {
  const bgImage =
    config.backgroundImages.length > 0
      ? config.backgroundImages[0]
      : undefined;

  const titleColor = COLOR_MAP[config.titleColor];
  const subtitleColor = COLOR_MAP[config.subtitleColor];
  const footerColor = COLOR_MAP[config.footerBadgeColor];
  const ctaTextColor = COLOR_MAP[config.ctaTextColor];
  const ctaBgColor = COLOR_MAP[config.ctaBackgroundColor];
  const ctaGlowColor = COLOR_MAP[config.ctaGlowColor];

  const backgroundStyle: React.CSSProperties = bgImage
    ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    : {
        backgroundColor: "#000000"
      };

  const showRotationBadge =
    config.backgroundMode === "rotating" && config.backgroundImages.length > 0;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl border border-gray-700 bg-black shadow-[0_0_50px_rgba(0,0,0,0.9)]"
        style={backgroundStyle}
      >
        {showRotationBadge && (
          <div className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-[11px] font-medium text-gray-100 backdrop-blur">
            {config.backgroundImages.length} imágenes · rota cada{" "}
            {config.rotateEveryHours}h
          </div>
        )}

        <div className="flex h-full flex-col items-center justify-between px-6 py-7 text-center">
          <div className="mt-2 flex w-full justify-center">
            {config.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.logoUrl}
                alt="Logo"
                className="h-16 w-auto max-w-[70%] object-contain drop-shadow-[0_0_12px_rgba(0,0,0,0.9)]"
              />
            ) : (
              <div className="rounded-full bg-black/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-200 backdrop-blur-sm">
                TU LOGO AQUÍ
              </div>
            )}
          </div>

          <div className="mt-4 space-y-1">
            <h1
              className="text-2xl font-extrabold leading-tight drop-shadow-[0_0_14px_rgba(0,0,0,1)]"
              style={{ color: titleColor }}
            >
              {config.titleLine1}
            </h1>
            <h2
              className="text-xl font-semibold leading-tight drop-shadow-[0_0_14px_rgba(0,0,0,1)]"
              style={{ color: titleColor }}
            >
              {config.titleLine2}
            </h2>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="rounded-full px-8 py-3 text-sm font-bold uppercase tracking-wide shadow-xl transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                color: ctaTextColor,
                backgroundColor: ctaBgColor,
                boxShadow: `0 0 25px ${ctaGlowColor}, 0 0 60px ${ctaGlowColor}`
              }}
            >
              {config.ctaText}
            </button>
          </div>

          <div className="mt-5 space-y-1 text-sm font-medium">
            <p
              className="drop-shadow-[0_0_12px_rgba(0,0,0,1)]"
              style={{ color: subtitleColor }}
            >
              {config.subtitleLine1}
            </p>
            <p
              className="drop-shadow-[0_0_12px_rgba(0,0,0,1)]"
              style={{ color: subtitleColor }}
            >
              {config.subtitleLine2}
            </p>
            <p
              className="drop-shadow-[0_0_12px_rgba(0,0,0,1)]"
              style={{ color: subtitleColor }}
            >
              {config.subtitleLine3}
            </p>
          </div>

          <div className="mb-1 mt-6 flex w-full justify-center">
            <span
              className="rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] drop-shadow-[0_0_12px_rgba(0,0,0,1)]"
              style={{
                color: "#000000",
                backgroundColor: footerColor
              }}
            >
              {config.footerBadgeText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

