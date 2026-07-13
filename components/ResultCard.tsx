'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { GeolocateResult } from '@/types';

const GlobeView = dynamic(() => import('./GlobeView'), { ssr: false });

const confidenceColor: Record<string, string> = {
  faible:  'text-red-400',
  moyen:   'text-amber-400',
  'élevé': 'text-emerald-400',
};

const confidenceLabel: Record<string, string> = {
  faible:  'Faible',
  moyen:   'Moyen',
  'élevé': 'Élevé',
};

interface Coords { lat: number; lng: number }

export default function ResultCard({ result }: { result: GeolocateResult }) {
  const color = confidenceColor[result.confidence] ?? 'text-zinc-400';
  const label = confidenceLabel[result.confidence] ?? result.confidence;
  const [coords, setCoords] = useState<Coords | null>(null);

  useEffect(() => {
    const query = `${result.city_or_region}, ${result.country}`;
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`)
      .then((r) => r.json())
      .then((data) => {
        if (data[0]) {
          setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        }
      })
      .catch(() => {});
  }, [result.city_or_region, result.country]);

  return (
    <div className="border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800 mt-6">

      {/* Globe */}
      {coords && (
        <GlobeView
          lat={coords.lat}
          lng={coords.lng}
          label={`${result.city_or_region}, ${result.country}`}
        />
      )}
      {!coords && (
        <div className="flex items-center justify-center h-24 text-zinc-600 text-xs">
          Chargement de la carte…
        </div>
      )}

      <div className="grid grid-cols-2 divide-x divide-zinc-800">
        <div className="p-4">
          <p className="text-xs text-zinc-500 mb-1">Pays</p>
          <p className="text-white font-semibold text-base">{result.country}</p>
        </div>
        <div className="p-4">
          <p className="text-xs text-zinc-500 mb-1">Ville / Région</p>
          <p className="text-white font-semibold text-base">{result.city_or_region}</p>
        </div>
      </div>

      <div className="p-4 flex items-center gap-2">
        <p className="text-xs text-zinc-500">Confiance</p>
        <p className={`text-xs font-medium ${color}`}>{label}</p>
      </div>

      {result.visual_clues && result.visual_clues.length > 0 && (
        <div className="p-4">
          <p className="text-xs text-zinc-500 mb-3">Indices détectés</p>
          <ul className="space-y-2">
            {result.visual_clues.map((clue, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-600 mt-2 shrink-0" />
                <span className="text-zinc-300 text-sm">{clue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
