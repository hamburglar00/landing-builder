"use client";

import React, { useState } from "react";
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
  const [open, setOpen] = useState(false);

  const currentHex = COLOR_MAP[value];
  const currentLabel = value.replace("_", " ");

  const handleSelect = (val: ColorOption) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-100">{label}</p>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-md border border-gray-700 bg-gray-900/70 px-3 py-2 text-xs text-gray-100 shadow-sm transition hover:border-cyan-500/60"
        >
          <span className="flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-full border border-black/20"
              style={{ backgroundColor: currentHex }}
            />
            <span className="truncate capitalize">{currentLabel}</span>
          </span>
          <span className="ml-2 text-[9px] text-gray-400">
            {open ? "▲" : "▼"}
          </span>
        </button>

        {open && (
          <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-gray-700 bg-gray-950/95 p-1 text-xs shadow-lg">
            {COLOR_OPTIONS.map((option) => {
              const hex = COLOR_MAP[option];
              const isActive = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 capitalize transition ${
                    isActive
                      ? "bg-cyan-600/20 text-cyan-100"
                      : "text-gray-200 hover:bg-gray-800/70"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border border-black/20"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="truncate">{option.replace("_", " ")}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

