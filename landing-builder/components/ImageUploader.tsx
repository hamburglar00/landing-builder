"use client";

import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState
} from "react";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  // Si desde afuera se limpian las imágenes, limpiamos los nombres mostrados
  useEffect(() => {
    if ("multiple" in props && props.multiple) {
      if (props.images.length === 0 && fileNames.length > 0) {
        setFileNames([]);
      }
    } else if (!props.image && fileNames.length > 0) {
      setFileNames([]);
    }
  }, [props, fileNames]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      if ("multiple" in props && props.multiple) {
        props.onChange([]);
      } else {
        props.onChange(null);
      }
      setFileNames([]);
      return;
    }

    const allFiles = Array.from(files);
    const avifFiles = allFiles.filter((file) =>
      file.name.toLowerCase().endsWith(".avif")
    );

    if (avifFiles.length === 0) {
      window.alert(
        "El formato de la imagen debe ser .avif. Por favor, subí archivos .avif."
      );
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    if (avifFiles.length < allFiles.length) {
      window.alert(
        "Algunas imágenes no son .avif y fueron descartadas. Solo se aceptan archivos .avif."
      );
    }

    const urls = avifFiles.map((file) => URL.createObjectURL(file));
    const names = avifFiles.map((file) => file.name);

    if ("multiple" in props && props.multiple) {
      props.onChange(urls);
      setFileNames(names);
    } else {
      props.onChange(urls[0] ?? null);
      setFileNames(names[0] ? [names[0]] : []);
    }
  };

  const clearAll = () => {
    if ("multiple" in props && props.multiple) {
      props.onChange([]);
    } else {
      props.onChange(null);
    }
    setFileNames([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-100">
        {props.label}
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-500"
        >
          {fileNames.length > 0 ? "Cambiar imagen" : "Seleccionar imagen .avif"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".avif"
          multiple={"multiple" in props && props.multiple}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {fileNames.length > 0 && (
        <div className="mt-1 space-y-1 text-xs text-gray-100">
          {fileNames.map((name, index) => (
            <div
              key={`${name}-${index}`}
              className="flex items-center justify-between rounded-md bg-gray-900/70 px-2 py-1"
            >
              <span className="mr-2 truncate" title={name}>
                {name}
              </span>
              <button
                type="button"
                onClick={clearAll}
                className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-500 text-[10px] text-gray-200 hover:border-red-400 hover:text-red-300"
                aria-label="Eliminar imagen"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-gray-400">
        Formato requerido: <span className="font-semibold">.avif</span>
      </p>
    </div>
  );
};

