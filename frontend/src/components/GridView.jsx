import React, { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

const cities = {
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 }
};

const DELHI_BOUNDS = [[28.4, 76.8], [28.9, 77.4]];

// Component to handle map interactions like Panning and Focus
function MapController({ center, targetNode }) {
  const map = useMap();
  const prevTargetRef = useRef(null);

  useEffect(() => {
    map.invalidateSize();
    if (targetNode && targetNode.id !== prevTargetRef.current) {
      prevTargetRef.current = targetNode.id;
      // Fly to the focussed node and zoom in enough to break clusters
      map.flyTo([targetNode.lat, targetNode.lng], 16, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    } else if (!targetNode) {
      map.setView(center, 12);
    }
  }, [center, targetNode, map]);

  return null;
}

const NodeDetails = ({ node }) => {
  const lat = node.attributes?.lat || node.lat;
  const lng = node.attributes?.lng || node.lng;
  const load = node.attributes?.load1 || node.load || 0;
  const expected = node.attributes?.expected_load || 0;
  const status = (node.attributes?.status || node.status || 'default').replace('_', ' ');
  const area = node.attributes?.area || node.area || 'Unknown Sector';

  return (
    <div className="p-3 min-w-[200px] bg-slate-950 text-white rounded-xl font-['Inter'] shadow-2xl border border-white/10">
      <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Node Analytics</span>
        <div className={`w-2 h-2 rounded-full ${status.includes('high') ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
      </div>
      
      <h4 className="text-sm font-black mb-1 uppercase tracking-tighter">{node.v_id || node.id}</h4>
      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-4">{area}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
          <p className="text-[8px] text-slate-500 uppercase mb-1">Live Load</p>
          <p className="text-xs font-black text-white">{Number(load).toFixed(2)} kW</p>
        </div>
        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
          <p className="text-[8px] text-slate-500 uppercase mb-1">Baseline</p>
          <p className="text-xs font-black text-slate-400">{Number(expected).toFixed(2)} kW</p>
        </div>
      </div>

      <div className={`text-center py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
        status.includes('high') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
        status.includes('normal') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      }`}>
        {status} RISK LEVEL
      </div>
      
      <div className="mt-3 overflow-hidden rounded bg-white/5 h-1">
         <div className={`h-full ${status.includes('high') ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((load/(expected||1))*50, 100)}%` }}></div>
      </div>
    </div>
  );
};

const GridView = ({ nodes, theftNodes, currentCity, focussedNodeId }) => {
  const focussedNode = useMemo(() => {
    if (!focussedNodeId) return null;
    const n = nodes?.find(n => (n.v_id || n.id) === focussedNodeId);
    if (!n) return null;
    return {
        ...n,
        lat: n.attributes?.lat || n.lat,
        lng: n.attributes?.lng || n.lng,
        id: n.v_id || n.id
    };
  }, [nodes, focussedNodeId]);

  const mapCenter = useMemo(() => [cities[currentCity]?.lat || 28.6139, cities[currentCity]?.lng || 77.2090], [currentCity]);

  const getNodeStyles = (node) => {
    const type = (node.attributes?.type || node.type || "").toLowerCase();
    const status = node.attributes?.status || node.status || 'default';
    const isfocussed = focussedNodeId === (node.v_id || node.id);

    if (type.includes('power')) return { color: '#10b981', radius: 14, fillOpacity: 0.9 };
    if (type.includes('transformer')) return { color: '#f59e0b', radius: 10, fillOpacity: 0.8 };
    
    let color = '#3b82f6';
    if (status === 'normal') color = '#22c55e';
    if (status === 'medium_anomaly') color = '#fbbf24';
    if (status === 'high_anomaly') color = '#f43f5e';
    
    return { 
      color, 
      radius: isfocussed ? 12 : 5, 
      fillOpacity: isfocussed ? 1 : 0.6,
      weight: isfocussed ? 4 : 1
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

        {/* Focussed Node (Always on top, outside clusters) */}
        {focussedNode && (
            <CircleMarker
                center={[focussedNode.lat, focussedNode.lng]}
                {...getNodeStyles(focussedNode)}
                pane="markerPane"
            >
                <Popup autoPan={false} closeButton={false} offset={[0, -5]}>
                    <NodeDetails node={focussedNode} />
                </Popup>
            </CircleMarker>
        )}

        <MarkerClusterGroup chunkedLoading maxClusterRadius={30}>
          {nodes?.map((node) => {
            const lat = node.attributes?.lat || node.lat;
            const lng = node.attributes?.lng || node.lng;
            const v_id = node.v_id || node.id;
            if (!lat || !lng || v_id === focussedNodeId) return null;

            const styles = getNodeStyles(node);

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
                <Popup>
                    <NodeDetails node={node} />
                </Popup>
              </CircleMarker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Floating UI */}
      <div className="absolute top-6 left-6 z-[1000] bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
         <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-md">grid_view</span>
            </div>
            <h1 className="text-lg font-black tracking-tighter text-white">GRID<span className="text-blue-400">CONSOLE</span></h1>
         </div>
         <div className="space-y-2 mt-4 border-t border-white/5 pt-4">
            {[
                { label: 'Infrastructure Hub', color: 'bg-emerald-500' },
                { label: 'Risk Detected', color: 'bg-red-500' },
                { label: 'Active Surveillance', color: 'bg-blue-500' }
            ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_5px_currentColor]`}></div>
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.label}</span>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default GridView;
