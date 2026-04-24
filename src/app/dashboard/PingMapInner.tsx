'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PingWithSeq } from '@/db/pings';
import { MARKER_COLORS } from '@/lib/constants';

const WORLD_BOUNDS = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

function createGlowIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:10px;height:10px;
      background:${color};
      border-radius:50%;
      box-shadow:0 0 8px 3px ${color}60;
    "></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

function MapController({
  pings,
  onPixelsChange,
  onMovingChange,
}: {
  pings: PingWithSeq[];
  onPixelsChange: (px: Record<number, { x: number; y: number }>) => void;
  onMovingChange: (moving: boolean) => void;
}) {
  const map = useMap();

  const update = useCallback(() => {
    const result: Record<number, { x: number; y: number }> = {};
    for (const ping of pings) {
      const pt = map.latLngToContainerPoint([Number(ping.latitude), Number(ping.longitude)]);
      result[ping.id] = { x: pt.x, y: pt.y };
    }
    onPixelsChange(result);
  }, [map, pings, onPixelsChange]);

  useMapEvents({
    movestart: () => onMovingChange(true),
    zoomstart: () => onMovingChange(true),
    moveend: () => {
      onMovingChange(false);
      update();
    },
    zoomend: () => {
      onMovingChange(false);
      update();
    },
    resize: update,
  });

  useEffect(() => {
    if (pings.length === 0) return;
    if (pings.length === 1) {
      map.setView([Number(pings[0].latitude), Number(pings[0].longitude)], 5);
    } else {
      const bounds = L.latLngBounds(pings.map((p) => [Number(p.latitude), Number(p.longitude)]));
      map.fitBounds(bounds, { padding: [60, 120] });
    }
    setTimeout(update, 400);
  }, [map, pings, update]);

  return null;
}

export default function PingMapInner({ pings }: { pings: PingWithSeq[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [markerPixels, setMarkerPixels] = useState<Record<number, { x: number; y: number }>>({});
  const [cardEndpoints, setCardEndpoints] = useState<Record<number, { x: number; y: number }>>({});
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const endpoints: Record<number, { x: number; y: number }> = {};
    for (const ping of pings) {
      const card = cardRefs.current[ping.id];
      if (!card) continue;
      const cardRect = card.getBoundingClientRect();
      endpoints[ping.id] = {
        x: cardRect.left - containerRect.left,
        y: cardRect.top - containerRect.top + cardRect.height / 2,
      };
    }
    setCardEndpoints(endpoints);
  }, [pings, markerPixels]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[50vh] sm:h-[480px] rounded-lg overflow-hidden border border-zinc-800"
    >
      {/* Map fills container */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={1.2}
        maxZoom={20}
        maxBounds={WORLD_BOUNDS}
        maxBoundsViscosity={0.85}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains={['a', 'b', 'c', 'd']}
          noWrap={false}
        />
        <MapController
          pings={pings}
          onPixelsChange={setMarkerPixels}
          onMovingChange={setIsMoving}
        />
        {pings.map((ping, i) => (
          <Marker
            key={ping.id}
            position={[Number(ping.latitude), Number(ping.longitude)]}
            icon={createGlowIcon(MARKER_COLORS[i % MARKER_COLORS.length])}
          />
        ))}
      </MapContainer>

      {/* SVG lines — above map, below cards */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 599, opacity: isMoving ? 0 : 1, transition: 'opacity 0.15s ease' }}
      >
        {pings.map((ping, i) => {
          const marker = markerPixels[ping.id];
          const endpoint = cardEndpoints[ping.id];
          if (!marker || !endpoint) return null;
          const color = MARKER_COLORS[i % MARKER_COLORS.length];
          const isHovered = hoveredId === ping.id;
          const opacity = isHovered ? 0.9 : hoveredId !== null ? 0.15 : 0.5;
          return (
            <line
              key={ping.id}
              x1={marker.x}
              y1={marker.y}
              x2={endpoint.x}
              y2={endpoint.y}
              stroke={color}
              strokeWidth={isHovered ? 1.5 : 1}
              strokeDasharray="5 3"
              opacity={opacity}
            />
          );
        })}
      </svg>

      {/* Empty state overlay */}
      {pings.length === 0 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
          style={{ zIndex: 1000 }}
        >
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-emerald-400 text-sm font-mono tracking-wide">No signal detected.</p>
          <p className="text-emerald-600 text-xs font-mono">
            Send your first ping to begin the mission.
          </p>
        </div>
      )}

      {/* Overlay cards — top-right corner */}
      <div className="absolute top-3 right-3 flex flex-col gap-2" style={{ zIndex: 1000 }}>
        {pings.map((ping, i) => {
          const color = MARKER_COLORS[i % MARKER_COLORS.length];
          const isHovered = hoveredId === ping.id;
          return (
            <div
              key={ping.id}
              ref={(el) => {
                cardRefs.current[ping.id] = el;
              }}
              onMouseEnter={() => setHoveredId(ping.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="w-36 sm:w-44 rounded border p-2 sm:p-3 cursor-default select-none backdrop-blur-sm"
              style={{
                borderColor: color,
                backgroundColor: isHovered ? `${color}22` : 'rgba(9,9,11,0.75)',
                transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.2s ease, background-color 0.2s ease',
              }}
            >
              <div
                className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest mb-1"
                style={{ color }}
              >
                Ping #{ping.seqNum}
              </div>
              <div className="text-[10px] sm:text-xs text-zinc-300 font-mono leading-relaxed">
                <div>{Number(ping.latitude).toFixed(4)}°</div>
                <div>{Number(ping.longitude).toFixed(4)}°</div>
              </div>
              {isHovered && (
                <div className="mt-1 text-[9px] text-zinc-500 font-mono">
                  {new Date(ping.createdAt).toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
