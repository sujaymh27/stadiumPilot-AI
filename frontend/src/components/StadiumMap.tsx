import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { useAppStore } from '../store';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';

// MetLife Stadium schematic bounding box (using lat/lng analogues mapped from x/y 0-100)
const MAP_CENTER: LatLngExpression = [40.8135, -74.0745];
const MAP_ZOOM = 16;

// Convert x/y (0-100) to approximate lat/lng for schematic overlay
function xyToLatLng(x: number, y: number): LatLngExpression {
  // Map x: 0->-74.082, 100->-74.065  |  y: 0->40.817, 100->40.810
  const lng = -74.082 + (x / 100) * 0.017;
  const lat = 40.817 - (y / 100) * 0.007;
  return [lat, lng];
}

const NODE_COLORS: Record<string, string> = {
  gate: '#1a56db',
  section: '#0ea5e9',
  concourse: '#64748b',
  elevator: '#7c3aed',
};

function RouteLayer() {
  const route = useAppStore(s => s.currentRoute);
  const map = useMap();

  useEffect(() => {
    if (route && route.nodes.length > 0) {
      const bounds = route.nodes.map(n => xyToLatLng(n.x, n.y));
      if (bounds.length > 0) {
        map.fitBounds(bounds as [number, number][], { padding: [40, 40], maxZoom: 17 });
      }
    }
  }, [route, map]);

  if (!route) return null;

  const positions = route.nodes.map(n => xyToLatLng(n.x, n.y));

  return (
    <>
      <Polyline
        positions={positions}
        pathOptions={{ color: '#1a56db', weight: 4, opacity: 0.85, dashArray: route.accessible ? '8 4' : undefined }}
      />
      {route.nodes.map((node, i) => (
        <CircleMarker
          key={node.id}
          center={xyToLatLng(node.x, node.y)}
          radius={i === 0 || i === route.nodes.length - 1 ? 10 : 6}
          pathOptions={{
            color: '#fff',
            fillColor: i === 0 ? '#16a34a' : i === route.nodes.length - 1 ? '#dc2626' : (NODE_COLORS[node.type] ?? '#64748b'),
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Tooltip permanent={i === 0 || i === route.nodes.length - 1}>
            {node.label}
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}

export default function StadiumMap() {
  const mapRef = useRef(null);

  return (
    <div className="map-wrapper" role="region" aria-label="Interactive stadium map">
      <MapContainer
        ref={mapRef}
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
