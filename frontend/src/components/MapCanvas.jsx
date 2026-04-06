import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const cities = {
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 }
};

// STEP 3 DYNAMIC CENTER UPDATE
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 11);
  return null;
}

// Custom Icons
const createIcon = (color, size, isTheft, isSuspicious) => {
  const glowClass = isTheft ? 'glow-red animate-ping opacity-75' : isSuspicious ? 'glow-amber' : '';
  const bgClass = `bg-[${color}]`;
  const boxShadow = isTheft ? '0 0 15px #f43f5e' : isSuspicious ? '0 0 15px #f59e0b' : 'none';
  
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="width: ${size}px; height: ${size}px; background-color: ${color}; box-shadow: ${boxShadow}" class="rounded-full shadow-lg flex items-center justify-center">
             ${isTheft ? `<div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>` : ''}
           </div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2],
  });
};

const MapCanvas = ({ nodes, edges, theftNodes, suspiciousTfs, onInjectTheft, onGenerateGrid, onDetectTheft, currentCity, onCityChange }) => {
  
  // Optimize lookups by indexing nodes
  const nodeMap = useMemo(() => {
    const map = {};
    nodes?.forEach(n => map[n.id] = n);
    return map;
  }, [nodes]);

  const poleIds = useMemo(() => nodes?.filter(n => (n.type || "").toLowerCase() === 'pole').map(p => p.id) || [], [nodes]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <MapContainer
        center={[cities[currentCity].lat, cities[currentCity].lng]}
        zoom={11}
        style={{ height: "100%", width: "100%", backgroundColor: '#0b1326' }}
        zoomControl={false}
      >
        <ChangeView center={[cities[currentCity].lat, cities[currentCity].lng]} />
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />

        {/* STEP 6: DRAW EDGES */}
        {edges?.map((edge, idx) => {
          const start = nodeMap[edge.from];
          const end = nodeMap[edge.to];
          if (!start || !end) return null;
          
          return (
            <Polyline 
              key={`edge-${idx}`}
              positions={[[start.lat, start.lng], [end.lat, end.lng]]}
              pathOptions={{ color: '#22d3ee', weight: 1.5, opacity: 0.4, dashArray: '2, 5' }}
            />
          );
        })}

        {/* STEP 5: RENDER NODES */}
        {nodes?.map((node) => {
          const isTheft = theftNodes?.some(t => t.id === node.id);
          const isSuspicious = suspiciousTfs?.includes(node.id);
          
          let color = '#22d3ee';
          let size = 10;
          const type = (node.type || "").toLowerCase();
          
          if (type === 'Powerplant' || type === 'power_plant') {
            size = 24;
            color = '#a855f7'; // Purple
          } else if (type === 'transformer') {
            size = 16;
            color = isSuspicious ? '#f59e0b' : '#eab308'; // Yellow/Amber
          } else if (type === 'pole') {
            size = 8;
            color = isTheft ? '#f43f5e' : '#22c55e'; // Green (Red if theft)
          }

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={createIcon(color, size, isTheft, isSuspicious)}
              eventHandlers={{
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
              }}
            >
              <Popup className="custom-popup">
                <div className="bg-slate-900 text-white p-1 rounded-lg min-w-[150px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{node.type}</span>
                    <div className={`w-2 h-2 rounded-full ${isTheft ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{node.id}</h4>
                  <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-tight">{node.area}</p>
                  <div className="pt-2 border-t border-slate-700 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[8px] uppercase text-slate-500">Actual</p>
                      <p className="data-font text-xs font-bold">{node.actual_load || 0} kW</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase text-slate-500">Expect</p>
                      <p className="data-font text-xs font-bold">{node.expected_load || 0} kW</p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* STEP 7: BUTTON ACTIONS */}
      <div className="absolute bottom-14 left-6 flex gap-3 z-[1000]">
        
        {/* City Switcher */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-blue-400/30 flex overflow-hidden p-1 shadow-[0_0_30px_rgba(59,130,246,0.15)] mr-4">
           {Object.keys(cities).map(cityName => (
             <button
               key={cityName}
               onClick={() => onCityChange(cityName)}
               className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${
                 currentCity === cityName 
                 ? 'bg-blue-500 text-white shadow-lg' 
                 : 'text-slate-400 hover:text-blue-300'
               }`}
             >
               {cityName}
             </button>
           ))}
        </div>

        <button 
          onClick={onGenerateGrid}
          className="bg-slate-900/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-blue-400/30 flex items-center gap-3 hover:bg-slate-800 transition-all shadow-[0_0_30px_rgba(59,130,246,0.15)] group"
        >
          <span className="material-symbols-outlined text-blue-400 group-hover:rotate-180 transition-transform duration-700 text-sm">refresh</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Generate</span>
        </button>
        <button 
          onClick={() => onInjectTheft([poleIds[Math.floor(Math.random() * poleIds.length)]])}
          className="bg-slate-900/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-red-400/30 flex items-center gap-3 hover:bg-slate-800 transition-all shadow-[0_0_30px_rgba(244,63,94,0.15)] group"
        >
          <span className="material-symbols-outlined text-red-400 group-hover:scale-125 transition-transform text-sm">bolt</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Inject</span>
        </button>
        <button 
          onClick={onDetectTheft}
          className="bg-slate-900/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-amber-400/30 flex items-center gap-3 hover:bg-slate-800 transition-all shadow-[0_0_30px_rgba(245,158,11,0.15)] group"
        >
          <span className="material-symbols-outlined text-amber-400 group-hover:animate-pulse text-sm">radar</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Detect</span>
        </button>
      </div>

      <div className="absolute top-6 left-6 z-[1000] glass-panel p-4 rounded-2xl border border-white/5 shadow-2xl">
         <h1 className="text-xl font-black tracking-tighter text-blue-400 mb-1">WATT<span className="text-white"> WATCH</span></h1>
         <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-slate-500">Grid Leaflet Dashboard v3.0</p>
      </div>
    </div>
  );
};

export default MapCanvas;
