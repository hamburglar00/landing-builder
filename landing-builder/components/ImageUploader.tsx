"use client";

import React, { ChangeEvent } from "react";

type MultipleProps = {
  label: string;
  multiple: true;
  images: string[];
  onChange: (images: string[]) => void;
};

type SingleProps = {
  label: string;
  multiple?: false;
  image: string | null;
  onChange: (image: string | null) => void;
};

type ImageUploaderProps = MultipleProps | SingleProps;

export const ImageUploader: React.FC<ImageUploaderProps> = (props) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      if ("multiple" in props && props.multiple) {
        props.onChange([]);
      } else {
        props.onChange(null);
      }
      return;
    }

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));

    if ("multiple" in props && props.multiple) {
      props.onChange(urls);
    } else {
      props.onChange(urls[0] ?? null);
    }
  };

  const previews =
    "multiple" in props && props.multiple
      ? props.images
      : props.image
      ? [props.image]
      : [];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-100">
        {props.label}
      </label>
      <input
        type="file"
        accept="image/*"
        multiple={"multiple" in props && props.multiple}
        onChange={handleChange}
        className="block w-full cursor-pointer rounded-md border border-gray-700 bg-gray-900/60 text-xs text-gray-200 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-cyan-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-cyan-500"
      />
      {previews.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {previews.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-md border border-gray-700 bg-black/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

