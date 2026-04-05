import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

const cities = {
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 }
};

// DELHI BOUNDS for safety
const DELHI_BOUNDS = [[28.4, 76.8], [28.9, 77.4]];

function MapController({ center, targetNode }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (targetNode) {
      map.flyTo([targetNode.lat, targetNode.lng], 16, { duration: 1.5 });
    } else {
      map.setView(center, 12);
    }
  }, [center, targetNode, map]);
  return null;
}

const GridView = ({ nodes, edges, theftNodes, currentCity, focussedNodeId }) => {
  const focussedNode = useMemo(() => nodes?.find(n => (n.v_id || n.id) === focussedNodeId), [nodes, focussedNodeId]);
  const mapCenter = useMemo(() => [cities[currentCity]?.lat || 28.6139, cities[currentCity]?.lng || 77.2090], [currentCity]);

  // Color Mapping Logic
  const getNodeStyles = (node) => {
    const type = (node.attributes?.type || node.type || "").toLowerCase();
    const status = node.attributes?.status || node.status || 'default';
    const isfocussed = focussedNodeId === (node.v_id || node.id);

    if (type.includes('power')) return { color: '#10b981', radius: 12, fillOpacity: 0.8 };
    if (type.includes('transformer')) return { color: '#f59e0b', radius: 8, fillOpacity: 0.7 };
    
    // Default Pole colors based on anomaly status
    let color = '#3b82f6'; // Blue
    if (status === 'normal') color = '#22c55e';
    if (status === 'medium_anomaly') color = '#fbbf24';
    if (status === 'high_anomaly') color = '#f43f5e';
    
    return { 
      color, 
      radius: isfocussed ? 10 : 5, 
      fillOpacity: isfocussed ? 1 : 0.6,
      weight: isfocussed ? 3 : 1
    };
  };

  return (
    <div className="w-full h-full relative bg-[#0b1326] overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        preferCanvas={true}
        maxBounds={currentCity === 'Delhi' ? DELHI_BOUNDS : null}
      >
        <MapController center={mapCenter} targetNode={focussedNode} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
          {nodes?.map((node) => {
            const lat = node.attributes?.lat || node.lat;
            const lng = node.attributes?.lng || node.lng;
            const v_id = node.v_id || node.id;
            if (!lat || !lng) return null;

            const styles = getNodeStyles(node);
            const load = node.attributes?.load1 || node.load || 0;
            const expected = node.attributes?.expected_load || 0;
            const status = node.attributes?.status || node.status || 'default';

            return (
              <CircleMarker
                key={v_id}
                center={[lat, lng]}
                radius={styles.radius}
                pathOptions={{
                  fillColor: styles.color,
                  color: styles.color,
                  weight: styles.weight,
                  fillOpacity: styles.fillOpacity
                }}
              >
                <Tooltip sticky>
                  <div className="p-2 min-w-[140px] text-slate-900 font-bold">
                    <p className="border-b border-slate-200 mb-1 pb-1 text-blue-600 text-[10px]">ID: {v_id}</p>
                    <div className="flex justify-between text-[9px] mb-1">
                      <span>LOAD:</span> <span>{Number(load).toFixed(1)} kW</span>
                    </div>
                    <div className="flex justify-between text-[9px] mb-2">
                       <span>EXPECT:</span> <span>{Number(expected).toFixed(1)} kW</span>
                    </div>
                    <div className={`text-center py-1 rounded text-[8px] uppercase tracking-tighter ${
                      status.includes('high') ? 'bg-red-100 text-red-600' : 
                      status.includes('normal') ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {status.replace('_', ' ')}
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Floating View Indicator */}
      <div className="absolute top-6 left-6 z-[1000] bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-2xl">
         <h1 className="text-xl font-black tracking-tighter text-blue-400 mb-1">GRID<span className="text-white">VIEW</span></h1>
         <div className="space-y-1.5 mt-3">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span className="text-[8px] font-bold uppercase text-slate-400">Normal</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500"></div>
               <span className="text-[8px] font-bold uppercase text-slate-400">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               <span className="text-[8px] font-bold uppercase text-slate-400">Static Pole</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GridView;
