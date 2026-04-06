import React, { useMemo, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

const cities = {
  Delhi: { lat: 28.65, lng: 77.10 }, // Centered better for Delhi region
};

const DELHI_BOUNDS = [[28.4, 76.8], [28.9, 77.4]];

// Zoom Hook to control rendering based on zoom level
function ZoomTracker({ onZoomChange }) {
    const map = useMapEvents({
        zoomend: () => onZoomChange(map.getZoom())
    });
    return null;
}

function MapController({ center, targetNode }) {
  const map = useMap();
  const prevTargetRef = useRef(null);

  useEffect(() => {
    map.invalidateSize();
    if (targetNode && targetNode.id !== prevTargetRef.current) {
      prevTargetRef.current = targetNode.id;
      map.flyTo([targetNode.lat, targetNode.lng], 16, { duration: 1.5 });
    }
  }, [center, targetNode, map]);

  return null;
}

const NodeDetails = ({ node, type }) => {
  const lat = node.attributes?.lat || node.lat;
  const lng = node.attributes?.lng || node.lng;
  const status = (node.attributes?.status || node.status || 'normal').replace('_', ' ');
  const id = node.v_id || node.id;

  return (
    <div className="p-3 min-w-[200px] bg-slate-950 text-white rounded-xl font-['Inter'] shadow-2xl border border-white/10">
      <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{type} Analytics</span>
        <div className={`w-2 h-2 rounded-full ${status !== 'normal' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
      </div>
      
      <h4 className="text-sm font-black mb-1 uppercase tracking-tighter">{id}</h4>
      
      {type === 'Pole' && (
        <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="bg-white/5 p-2 rounded-lg">
                <p className="text-[8px] text-slate-500 mb-1">LOAD</p>
                <p className="text-xs font-black">{Number(node.attributes?.load1 || 0).toFixed(1)} kW</p>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
                <p className="text-[8px] text-slate-500 mb-1">STATUS</p>
                <p className="text-[9px] font-black uppercase">{status}</p>
            </div>
        </div>
      )}

      {type === 'Transformer' && (
        <div className="space-y-2">
            <div className="bg-white/5 p-2 rounded-lg flex justify-between">
                <span className="text-[8px] text-slate-500">CAPACITY</span>
                <span className="text-xs font-black">{Number(node.attributes?.capacity).toLocaleString()} kW</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg flex justify-between">
                <span className="text-[8px] text-slate-500">CURR LOAD</span>
                <span className="text-xs font-black text-blue-400">{Number(node.attributes?.current_load || 0).toFixed(1)} kW</span>
            </div>
        </div>
      )}
    </div>
  );
};

const GridView = ({ nodes, Powerplants, transformers, edges, currentCity, focussedNodeId }) => {
  const [zoom, setZoom] = useState(12);
  const [highlightedPath, setHighlightedPath] = useState(null);
  const [visibility, setVisibility] = useState({ poles: true, transformers: true, plants: true });

  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach(n => map[n.v_id] = { ...n, type: 'Pole', lat: n.attributes.lat, lng: n.attributes.lng });
    transformers.forEach(t => map[t.v_id] = { ...t, type: 'Transformer', lat: t.attributes.lat, lng: t.attributes.lng });
    Powerplants.forEach(p => map[p.v_id] = { ...p, type: 'Powerplant', lat: p.attributes.lat, lng: p.attributes.lng });
    return map;
  }, [nodes, transformers, Powerplants]);

  const mapCenter = useMemo(() => [cities[currentCity]?.lat || 28.65, cities[currentCity]?.lng || 77.10], [currentCity]);

  // Interaction handlers
  const handleNodeClick = (nodeId) => {
    const node = nodeMap[nodeId];
    if (!node) return;

    if (node.type === 'Pole') {
        // Find path backward: Pole -> TX -> PP
        const txEdge = edges.distributes.find(e => e.to_id === nodeId);
        if (txEdge) {
            const ppEdge = edges.supplies.find(e => e.to_id === txEdge.from_id);
            setHighlightedPath({
                poleId: nodeId,
                txId: txEdge.from_id,
                ppId: ppEdge ? ppEdge.from_id : null
            });
        }
    } else if (node.type === 'Transformer') {
        // Highlight all connected poles
        const poleIds = edges.distributes.filter(e => e.from_id === nodeId).map(e => e.to_id);
        setHighlightedPath({ txId: nodeId, poleIds });
    } else {
        setHighlightedPath(null);
    }
  };

  const getPoleColor = (status) => {
    switch(status) {
        case 'high_anomaly': return '#f43f5e'; // red
        case 'medium_anomaly': return '#fbbf24'; // yellow
        case 'normal': return '#22c55e'; // green
        default: return '#3b82f6'; // blue
    }
  };

  return (
    <div className="w-full h-full relative bg-[#0b1326]">
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        preferCanvas={true}
        maxBounds={DELHI_BOUNDS}
      >
        <ZoomTracker onZoomChange={setZoom} />
        <MapController center={mapCenter} targetNode={nodeMap[focussedNodeId]} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {/* 1. RENDER EDGES (Only if zoom > 11 for performance) */}
        {zoom >= 11 && (
            <>
                {visibility.plants && edges.supplies.map((edge, i) => {
                    const start = nodeMap[edge.from_id];
                    const end = nodeMap[edge.to_id];
                    if (!start || !end) return null;
                    const isHighlighted = highlightedPath?.ppId === edge.from_id && highlightedPath?.txId === edge.to_id;
                    return (
                        <Polyline 
                            key={`s-${i}`} 
                            positions={[[start.lat, start.lng], [end.lat, end.lng]]} 
                            pathOptions={{ color: isHighlighted ? '#a855f7' : '#3b82f6', weight: isHighlighted ? 4 : 1, opacity: 0.4 }} 
                        />
                    );
                })}
                {visibility.transformers && zoom >= 13 && edges.distributes.map((edge, i) => {
                    const start = nodeMap[edge.from_id];
                    const end = nodeMap[edge.to_id];
                    if (!start || !end) return null;
                    const isHighlighted = (highlightedPath?.txId === edge.from_id && highlightedPath?.poleId === edge.to_id) || 
                                         (highlightedPath?.txId === edge.from_id && highlightedPath?.poleIds?.includes(edge.to_id));
                    return (
                        <Polyline 
                            key={`d-${i}`} 
                            positions={[[start.lat, start.lng], [end.lat, end.lng]]} 
                            pathOptions={{ color: isHighlighted ? '#fbbf24' : '#64748b', weight: isHighlighted ? 3 : 0.5, opacity: 0.3 }} 
                        />
                    );
                })}
            </>
        )}

        {/* 2. RENDER PowerplantS */}
        {visibility.plants && Powerplants.map(pp => (
            <CircleMarker
                key={pp.v_id}
                center={[pp.attributes.lat, pp.attributes.lng]}
                pathOptions={{ fillColor: '#a855f7', color: '#fff', weight: 2, fillOpacity: 0.9 }}
                radius={12}
                eventHandlers={{ click: () => handleNodeClick(pp.v_id) }}
            >
                <Popup><NodeDetails node={pp} type="Powerplant" /></Popup>
            </CircleMarker>
        ))}

        {/* 3. RENDER TRANSFORMERS */}
        {visibility.transformers && transformers.map(tx => (
            <CircleMarker
                key={tx.v_id}
                center={[tx.attributes.lat, tx.attributes.lng]}
                pathOptions={{ 
                    fillColor: (tx.attributes.status === 'anomaly' || tx.status === 'anomaly') ? '#f43f5e' : '#f59e0b', 
                    color: highlightedPath?.txId === tx.v_id ? '#fff' : '#000', 
                    weight: highlightedPath?.txId === tx.v_id ? 3 : 1,
                    fillOpacity: 0.8 
                }}
                radius={8}
                eventHandlers={{ click: () => handleNodeClick(tx.v_id) }}
            >
                <Popup><NodeDetails node={tx} type="Transformer" /></Popup>
            </CircleMarker>
        ))}

        {/* 4. RENDER POLES (Clustered) */}
        {visibility.poles && (
            <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
                {nodes.map(pole => {
                    const isHighlighted = highlightedPath?.poleId === pole.v_id || highlightedPath?.poleIds?.includes(pole.v_id);
                    return (
                        <CircleMarker
                            key={pole.v_id}
                            center={[pole.attributes.lat, pole.attributes.lng]}
                            pathOptions={{ 
                                fillColor: getPoleColor(pole.attributes.status || pole.status), 
                                color: isHighlighted ? '#fff' : 'transparent',
                                weight: 2,
                                fillOpacity: 0.7 
                            }}
                            radius={isHighlighted ? 7 : 4}
                            eventHandlers={{ click: () => handleNodeClick(pole.v_id) }}
                        >
                            <Popup><NodeDetails node={pole} type="Pole" /></Popup>
                        </CircleMarker>
                    );
                })}
            </MarkerClusterGroup>
        )}
      </MapContainer>

      {/* Control Panel Overlay */}
      <div className="absolute top-6 left-6 z-[1000] space-y-4">
        <div className="glass-panel p-5 rounded-3xl border border-white/10 shadow-2xl bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">hub</span>
                </div>
                <div>
                    <h1 className="text-xs font-black tracking-widest text-slate-400 uppercase">Grid Topology</h1>
                    <h2 className="text-lg font-black text-white leading-none">SENTINEL<span className="text-blue-500">MAP</span></h2>
                </div>
            </div>

            <div className="space-y-3">
                {[
                    { key: 'plants', label: 'Power Plants', color: 'bg-purple-500', count: Powerplants.length },
                    { key: 'transformers', label: 'Transformers', color: 'bg-orange-500', count: transformers.length },
                    { key: 'poles', label: 'Distribution Poles', color: 'bg-blue-500', count: nodes.length }
                ].map(item => (
                    <div key={item.key} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <input 
                                type="checkbox" 
                                checked={visibility[item.key]} 
                                onChange={() => setVisibility(v => ({ ...v, [item.key]: !v[item.key] }))}
                                className="w-3 h-3 rounded bg-slate-800 border-white/10"
                            />
                            <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_8px_currentColor]`}></div>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{item.label}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-500">{item.count}</span>
                    </div>
                ))}
            </div>
            
            {highlightedPath && (
                <button 
                    onClick={() => setHighlightedPath(null)}
                    className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-400 transition-all"
                >
                    Clear Path Highlight
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default GridView;
