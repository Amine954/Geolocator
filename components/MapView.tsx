'use client';

import { useEffect, useRef } from 'react';

interface MapViewProps {
  lat: number;
  lng: number;
  label: string;
}

export default function MapView({ lat, lng, label }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return;

    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      instanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="width:12px;height:12px;background:#fff;border-radius:50%;border:2px solid #000;box-shadow:0 0 0 3px rgba(255,255,255,0.3)"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        className: '',
      });

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(label, { className: 'leaflet-popup-dark' })
        .openPopup();
    })();

    return () => {
      if (instanceRef.current) {
        (instanceRef.current as { remove: () => void }).remove();
        instanceRef.current = null;
      }
    };
  }, [lat, lng, label]);

  return (
    <div
      ref={mapRef}
      style={{ height: '220px', width: '100%' }}
      className="border border-zinc-800"
    />
  );
}
