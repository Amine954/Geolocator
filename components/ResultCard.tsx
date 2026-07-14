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

  const geocodeQuery = result.monument
    ? `${result.monument}, ${result.country}`
    : `${result.city_or_region}, ${result.country}`;

  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geocodeQuery)}&format=json&limit=1`)
      .then((r) => r.json())
      .then((data) => {
        if (data[0]) {
          setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        }
      })
      .catch(() => {});
  }, [geocodeQuery]);

  const canOpenMaps = result.location_type !== 'region' && coords;

  return (
    <div className="border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800 mt-6">

      {/* Globe */}
      {coords ? (
        <GlobeView
          lat={coords.lat}
          lng={coords.lng}
          label={result.monument ?? `${result.city_or_region}, ${result.country}`}
        />
      ) : (
        <div className="flex items-center justify-center h-24 text-zinc-600 text-xs">
          Chargement de la carte…
        </div>
      )}

      {/* Monument badge */}
      {result.monument && (
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="text-xs text-zinc-500">Monument</span>
          <span className="text-sm font-semibold text-white">{result.monument}</span>
        </div>
      )}

      {/* Location grid */}
      <div className="grid grid-cols-2 divide-x divide-zinc-800">
        <div className="p-4">
          <p className="text-xs text-zinc-500 mb-1">Pays</p>
          <p className="text-white font-semibold text-base">{result.country}</p>
        </div>
        <div className="p-4">
          <p className="text-xs text-zinc-500 mb-1">
            {result.location_type === 'region' ? 'Région' : 'Ville'}
          </p>
          <p className="text-white font-semibold text-base">{result.city_or_region}</p>
        </div>
      </div>

      {/* Confidence */}
      <div className="p-4 flex items-center gap-2">
        <p className="text-xs text-zinc-500">Confiance</p>
        <p className={`text-xs font-medium ${color}`}>{label}</p>
      </div>

      {/* Visual clues */}
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

      {/* Google Maps — seulement si ville ou monument */}
      {canOpenMaps && (
        <div className="p-4">
          <a
            href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Ouvrir dans Google Maps
          </a>
        </div>
      )}

    </div>
  );
}
