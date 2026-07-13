'use client';

import { useState } from 'react';
import DropZone from '@/components/DropZone';
import ResultCard from '@/components/ResultCard';
import { GeolocateResult } from '@/types';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Home() {
  const [imageBase64, setImageBase64] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState<GeolocateResult | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageSelect = (base64: string, type: string, prev: string) => {
    setImageBase64(base64);
    setMediaType(type);
    setPreview(prev);
    setResult(null);
    setStatus('idle');
    setErrorMsg('');
  };

  const handleAnalyze = async () => {
    if (!imageBase64 || status === 'loading') return;
    setStatus('loading');
    setResult(null);
    setErrorMsg('');
    try {
      const res = await fetch('/api/geolocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mediaType }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Une erreur est survenue');
        setStatus('error');
        return;
      }
      setResult(data.result);
      setStatus('success');
    } catch {
      setErrorMsg('Impossible de contacter le serveur.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setImageBase64('');
    setMediaType('');
    setPreview('');
    setResult(null);
    setStatus('idle');
    setErrorMsg('');
  };

  return (
    <main className="min-h-screen bg-[#0e0e0e] px-4 py-12">
      <div className="max-w-lg mx-auto space-y-6">

        <header>
          <h1 className="text-xl font-semibold text-white tracking-tight">Géolocalisation</h1>
          <p className="text-sm text-zinc-500 mt-1">Identifiez l&apos;endroit d&apos;une photo grâce à l&apos;IA</p>
        </header>

        <DropZone onImageSelect={handleImageSelect} preview={preview} />

        {imageBase64 && (
          <div className="flex gap-2">
            <button
              onClick={handleAnalyze}
              disabled={status === 'loading'}
              className="flex-1 py-2.5 bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-black text-sm font-medium transition-colors"
            >
              {status === 'loading' ? 'Analyse en cours…' : 'Analyser'}
            </button>
            <button
              onClick={handleReset}
              disabled={status === 'loading'}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-400 text-sm border border-zinc-800 transition-colors"
            >
              Effacer
            </button>
          </div>
        )}

        {status === 'error' && (
          <p className="text-sm text-red-400">{errorMsg}</p>
        )}

        {status === 'success' && result && <ResultCard result={result} />}

      </div>
    </main>
  );
}
