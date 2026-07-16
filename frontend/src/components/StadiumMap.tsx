import { memo, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { useAppStore } from '../store';
import type { RouteNode } from '../store';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';

// ─── Constants ────────────────────────────────────────────────────────────

/** MetLife Stadium real-world coordinates (East Rutherford, NJ) */
const MAP_CENTER: LatLngExpression = [40.8135, -74.0745];
const MAP_ZOOM = 16;

/** Node color by type — shared with RouteLayer */
const NODE_COLORS: Readonly<Record<string, string>> = {
  gate: '#1a56db',
  section: '#0ea5e9',
  concourse: '#64748b',
  elevator: '#7c3aed',
};

// ─── Coordinate mapping ────────────────────────────────────────────────────

/**
 * Convert schematic x/y coords (0-100 grid) to approximate lat/lng for map overlay.
 * Calibrated to MetLife Stadium bounding box.
 */
function xyToLatLng(x: number, y: number): LatLngExpression {
  // x: 0 → -74.082, 100 → -74.065  |  y: 0 → 40.817, 100 → 40.810
  const lng = -74.082 + (x / 100) * 0.017;
  const lat = 40.817 - (y / 100) * 0.007;
  return [lat, lng];
}

// ─── Route layer (only re-renders when route changes) ─────────────────────

interface RouteLayerProps {
  nodes: RouteNode[];
  accessible: boolean;
}

/** Inner Leaflet component — must live inside MapContainer */
function RouteLayerInner({ nodes, accessible }: RouteLayerProps) {
  const map = useMap();

  // Memoize position array so Polyline doesn't re-render on unrelated state changes
  const positions = useMemo(
    () => nodes.map((n) => xyToLatLng(n.x, n.y)),
    [nodes]
  );

  useEffect(() => {
    if (nodes.length > 0) {
      map.fitBounds(positions as [number, number][], { padding: [40, 40], maxZoom: 17 });
    }
  }, [positions, nodes.length, map]);

  return (
    <>
      <Polyline
        positions={positions}
        pathOptions={{
          color: '#1a56db',
          weight: 4,
          opacity: 0.85,
          dashArray: accessible ? '8 4' : undefined,
        }}
      />
      {nodes.map((node, i) => {
        const isEndpoint = i === 0 || i === nodes.length - 1;
        const fillColor =
          i === 0
            ? '#16a34a'
            : i === nodes.length - 1
            ? '#dc2626'
            : (NODE_COLORS[node.type] ?? '#64748b');

        return (
          <CircleMarker
            key={node.id}
            center={xyToLatLng(node.x, node.y)}
            radius={isEndpoint ? 10 : 6}
            pathOptions={{
              color: '#fff',
              fillColor,
              fillOpacity: 1,
              weight: 2,
            }}
          >
            <Tooltip permanent={isEndpoint}>{node.label}</Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

/** Wrapper that reads from store so RouteLayerInner stays pure */
function RouteLayer() {
  const route = useAppStore((s) => s.currentRoute);
  if (!route) return null;
  return <RouteLayerInner nodes={route.nodes} accessible={route.accessible} />;
}

// ─── Main component ────────────────────────────────────────────────────────

function StadiumMap() {
  return (
    <div className="map-wrapper" role="region" aria-label="Interactive stadium map">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        aria-label="MetLife Stadium map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RouteLayer />
      </MapContainer>
    </div>
  );
}

export default memo(StadiumMap);
