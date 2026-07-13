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
    if (!containerRef.current) return;

    let cancelled = false;

    import('maplibre-gl').then(({ default: maplibregl }) => {
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap © CARTO',
            },
          },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
          glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        },
        center: [lng, lat],
        zoom: 1,
        attributionControl: false,
      });

      mapRef.current = map;

      map.on('load', () => {
        if (cancelled) return;

        new maplibregl.Marker({ color: '#ffffff' })
          .setLngLat([lng, lat])
          .addTo(map);

        map.flyTo({
          center: [lng, lat],
          zoom: 5,
          duration: 2000,
          essential: true,
        });
      });
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, label]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '360px' }}
    />
  );
}
