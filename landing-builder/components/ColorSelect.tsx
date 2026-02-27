"use client";

import React from "react";
import { COLOR_MAP, COLOR_OPTIONS } from "@lib/constants";
import type { ColorOption } from "@lib/types";

interface ColorSelectProps {
  label: string;
  value: ColorOption;
  onChange: (value: ColorOption) => void;
}

export const ColorSelect: React.FC<ColorSelectProps> = ({
  label,
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-100">{label}</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {COLOR_OPTIONS.map((option) => {
          const isActive = option === value;
          const hex = COLOR_MAP[option];
          return (
            <button
              key={option}
              type="button"
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs capitalize transition
                ${
                  isActive
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-gray-700 bg-gray-900/40 hover:border-cyan-500/60"
                }`}
              onClick={() => onChange(option)}
            >
              <span
                className="h-4 w-4 rounded-full border border-black/20"
                style={{ backgroundColor: hex }}
              />
              <span className="truncate text-gray-100">
                {option.replace("_", " ")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

