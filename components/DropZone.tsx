'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';

interface DropZoneProps {
  onImageSelect: (imageBase64: string, mediaType: string, preview: string) => void;
  preview: string;
}

export default function DropZone({ onImageSelect, preview }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(',')[1];
      onImageSelect(base64, file.type, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={[
        'relative w-full border cursor-pointer overflow-hidden transition-colors duration-150',
        isDragging ? 'border-zinc-500 bg-zinc-900' : preview ? 'border-zinc-800' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50',
      ].join(' ')}
      style={{ minHeight: '260px' }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />

      {preview ? (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Aperçu"
            className="w-full object-contain max-h-[480px]"
            style={{ minHeight: '260px' }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-150 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white text-xs bg-black/70 px-3 py-1.5 transition-opacity duration-150">
              Changer l&apos;image
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-20 select-none">
          <p className="text-zinc-400 text-sm">
            {isDragging ? 'Déposez ici' : 'Glissez une image ou cliquez'}
          </p>
          <p className="text-zinc-600 text-xs">JPG, PNG, WEBP, GIF</p>
        </div>
      )}
    </div>
  );
}
