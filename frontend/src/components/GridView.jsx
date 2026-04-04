import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const cities = {
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 }
};

// Single Map Controller to handle initial panning, resizing, and flying to anomalies smoothly
function MapController({ center, zoom = 12, targetNode }) {
  const map = useMap();
  
  React.useEffect(() => {
    // Timeout helps invalidate size properly after DOM and Leaflet have fully rendered
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    if (targetNode) {
      map.flyTo([targetNode.lat, targetNode.lng], 16, {
        duration: 1.5,
        animate: true,
        easeLinearity: 0.25
      });
    } else {
      map.setView(center, zoom);
    }
    
    return () => clearTimeout(timer);
  }, [center, zoom, targetNode, map]);

  return null;
}

// Marker Icon Factory
const createMarkerIcon = (color, size, isTheft) => {
  const glowStyle = isTheft ? 'box-shadow: 0 0 20px #f43f5e, 0 0 10px #f43f5e inset;' : 'box-shadow: 0 0 10px rgba(0,0,0,0.5);';
  
  return L.divIcon({
    className: 'grid-marker-icon',
    html: `<div style="
        width: ${size}px; 
        height: ${size}px; 
        background-color: ${color}; 
        border: 2px solid white;
        border-radius: 50%;
        ${glowStyle}
        position: relative;
      ">
        ${isTheft ? '<div class="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-75"></div>' : ''}
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2],
  });
};

const GridView = ({ nodes, edges, theftNodes, suspiciousTfs, currentCity, focussedNodeId }) => {
  
  // Find the focussed node object if any
  const focussedNode = useMemo(() => 
    nodes?.find(n => n.id === focussedNodeId), 
    [nodes, focussedNodeId]
  );

  // Center logic
  const mapCenter = useMemo(() => {
    return [cities[currentCity]?.lat || 28.6139, cities[currentCity]?.lng || 77.2090];
  }, [currentCity]);
  
  // Index nodes for high-speed edge coordinate lookup
  const nodeMap = useMemo(() => {
    const map = {};
    nodes?.forEach(n => map[n.id] = n);
    return map;
  }, [nodes]);

  return (
    <div className="w-full h-full relative bg-[#0b1326] overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <MapController center={mapCenter} targetNode={focussedNode} />
        
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />

        {/* Connections (Edges) */}
        {edges?.map((edge, idx) => {
          const fromNode = nodeMap[edge.from];
          const toNode = nodeMap[edge.to];
          if (!fromNode || !toNode) return null;
          
          return (
            <Polyline 
              key={`edge-${idx}`}
              positions={[[fromNode.lat, fromNode.lng], [toNode.lat, toNode.lng]]}
              pathOptions={{ 
                color: '#22d3ee', 
                weight: 2, 
                opacity: 0.3, 
                dashArray: '3, 7'
              }}
            />
          );
        })}

        {/* Grid Nodes */}
        {nodes?.map((node) => {
          const type = (node.type || "").toLowerCase();
          const isTheft = theftNodes?.some(t => t.id === node.id);
          const isSuspicious = suspiciousTfs?.includes(node.id);
          const isFocussed = focussedNodeId === node.id;
          
          let color = '#3b82f6'; // Default Blue
          let size = 10;

          if (type === 'powerplant' || type === 'power_plant') {
            color = '#22c55e'; // Green
            size = 28;
          } else if (type === 'transformer') {
            color = isSuspicious ? '#f97316' : '#fb923c'; // Orange
            size = 18;
          } else if (type === 'pole') {
            color = isTheft ? '#f43f5e' : '#3b82f6'; // Blue (Red if theft)
            size = 10;
          }

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={createMarkerIcon(color, isFocussed ? size * 1.8 : size, isTheft || isFocussed)}
              eventHandlers={{
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
              }}
            >
              <Popup>
                <div className="data-font p-2 min-w-[140px] bg-slate-900 text-white rounded">
                  <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-2">
                    <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest">{type}</span>
                    <span className={`w-2 h-2 rounded-full ${isTheft ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                  </div>
                  <h4 className="text-sm font-bold m-0">{node.id}</h4>
                  <p className="text-[10px] text-slate-400 uppercase mt-1">{node.area}</p>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-white/5 p-1.5 rounded">
                      <span className="text-[8px] text-slate-500 block">EXPECT</span>
                      <span className="font-bold">{node.expected_load || 0} kW</span>
                    </div>
                    <div className="bg-white/5 p-1.5 rounded">
                      <span className="text-[8px] text-slate-500 block">ACTUAL</span>
                      <span className={`font-bold ${isTheft ? 'text-red-400' : 'text-white'}`}>{node.actual_load || 0} kW</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Legend */}
      <div className="absolute top-6 left-6 z-[1000] glass-panel p-4 rounded-2xl border border-white/5 shadow-2xl">
         <h1 className="text-xl font-black tracking-tighter text-blue-400 mb-1">GRID<span className="text-white">VIEW</span></h1>
         <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
               <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Power Plant</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-orange-500"></div>
               <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Transformer</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-500"></div>
               <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Pole</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GridView;
