'use client';

import { useEffect, useRef } from 'react';

interface GlobeViewProps {
  lat: number;
  lng: number;
  label: string;
}

export default function GlobeView({ lat, lng, label }: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    import('maplibre-gl').then(({ default: maplibregl }) => {
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [0, 20],
        zoom: 1.5,
        attributionControl: false,
        projection: { type: 'globe' } as Parameters<typeof maplibregl.Map>[0]['projection'],
      });

      mapRef.current = map;

      map.on('load', () => {
        if (cancelled) return;

        const el = document.createElement('div');
        el.style.cssText = `
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.25), 0 0 10px rgba(255,255,255,0.5);
        `;

        new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(
            new maplibregl.Popup({ offset: 16, closeButton: false })
              .setText(label)
          )
          .addTo(map);

        setTimeout(() => {
          map.flyTo({
            center: [lng, lat],
            zoom: 5,
            duration: 2500,
            essential: true,
          });
        }, 700);
      });
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, label]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '380px' }} />
  );
}
