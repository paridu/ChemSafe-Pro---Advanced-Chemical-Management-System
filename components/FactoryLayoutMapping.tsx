
import React, { useState, useRef, useEffect } from 'react';
import { StorageLocation, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface FactoryLayoutMappingProps {
  storages: StorageLocation[];
  lang: Language;
  onUpdateStoragePos: (id: string, x: number, y: number, lat?: number, lng?: number) => void;
}

const FactoryLayoutMapping: React.FC<FactoryLayoutMappingProps> = ({ storages, lang, onUpdateStoragePos }) => {
  const t = TRANSLATIONS[lang];
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedStorageId, setSelectedStorageId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [mapPos, setMapPos] = useState({ x: 0, y: 0 });
  const [isPlacing, setIsPlacing] = useState<string | null>(null);
  
  // Local state for editing lat/lng
  const [editLat, setEditLat] = useState<string>('');
  const [editLng, setEditLng] = useState<string>('');
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  const selectedStorage = storages.find(s => s.id === selectedStorageId);

  useEffect(() => {
    if (selectedStorage) {
      setEditLat(selectedStorage.lat?.toString() || '');
      setEditLng(selectedStorage.lng?.toString() || '');
    }
  }, [selectedStorageId]);

  const handleMapClick = (e: React.MouseEvent) => {
    if (!isPlacing || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - mapPos.x) / zoom;
    const y = (e.clientY - rect.top - mapPos.y) / zoom;
    
    // Maintain current Lat/Lng when updating map pixels
    const storage = storages.find(s => s.id === isPlacing);
    onUpdateStoragePos(isPlacing, Math.round(x), Math.round(y), storage?.lat, storage?.lng);
    setIsPlacing(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
       setIsDraggingMap(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingMap) {
      setMapPos(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
    }
  };

  const handleMouseUp = () => setIsDraggingMap(false);

  const updateGeo = () => {
    if (!selectedStorageId) return;
    onUpdateStoragePos(
      selectedStorageId, 
      selectedStorage?.mapX || 0, 
      selectedStorage?.mapY || 0, 
      parseFloat(editLat) || undefined, 
      parseFloat(editLng) || undefined
    );
  };

  const fetchGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      setEditLat(pos.coords.latitude.toFixed(6));
      setEditLng(pos.coords.longitude.toFixed(6));
      setIsGpsLoading(false);
    }, (err) => {
      alert(`Error fetching GPS: ${err.message}`);
      setIsGpsLoading(false);
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4 uppercase">
            <i className="fa-solid fa-map-location-dot text-amber-500"></i>
            {t.nav.mapping}
          </h1>
          <p className="text-slate-400 font-medium">
            Geo-spatial inventory mapping & micro-location tracking.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
           <div className="flex bg-slate-100 p-1 rounded-xl">
             <button 
                onClick={() => setShowGrid(!showGrid)} 
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${showGrid ? 'bg-black text-amber-400' : 'text-slate-400 hover:bg-slate-200'}`}
             >
               Grid: {showGrid ? 'ON' : 'OFF'}
             </button>
             <div className="w-px bg-slate-200 mx-1"></div>
             <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="w-10 h-10 rounded-lg hover:bg-white transition-all"><i className="fa-solid fa-minus"></i></button>
             <div className="px-4 flex items-center font-black text-xs text-slate-600">{(zoom * 100).toFixed(0)}%</div>
             <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-10 h-10 rounded-lg hover:bg-white transition-all"><i className="fa-solid fa-plus"></i></button>
           </div>
           <button onClick={() => setMapPos({x: 0, y: 0})} className="px-6 py-2 bg-black text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Reset View</button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Layout Canvas - Outer container light for contrast */}
        <div className="flex-1 bg-slate-100 rounded-[2.5rem] border border-slate-200 shadow-inner relative overflow-hidden cursor-crosshair group"
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onClick={handleMapClick}
        >
          {/* Grid Background - Conditional */}
          {showGrid && (
            <div className="absolute inset-0 opacity-40 pointer-events-none" 
                 style={{ 
                   backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`, 
                   backgroundSize: `${25 * zoom}px ${25 * zoom}px`,
                   transform: `translate(${mapPos.x}px, ${mapPos.y}px)`
                 }}>
            </div>
          )}

          <div 
            ref={mapRef}
            className="absolute transition-transform duration-75"
            style={{ transform: `translate(${mapPos.x}px, ${mapPos.y}px) scale(${zoom})` }}
          >
            {/* Factory Silhouette - White Background as requested */}
            <div className="w-[1200px] h-[900px] border-2 border-slate-300 rounded-3xl relative bg-white shadow-2xl">
               {/* Reference labels - Darker for white BG */}
               <div className="absolute top-10 left-10 text-[32px] font-black text-slate-200 uppercase select-none pointer-events-none">Main Assembly Wing</div>
               <div className="absolute bottom-10 right-10 text-[32px] font-black text-slate-200 uppercase select-none pointer-events-none">Chemical Storage Yard</div>
               
               {/* Mapped Storages */}
               {storages.filter(s => s.mapX !== undefined && s.mapX !== 0).map(storage => (
                 <div 
                    key={storage.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedStorageId(storage.id); }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125 z-10 ${selectedStorageId === storage.id ? 'scale-150' : ''}`}
                    style={{ left: storage.mapX, top: storage.mapY }}
                 >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white text-lg shadow-xl border-4 ${
                      storage.status === 'Normal' ? 'bg-emerald-500 border-white' :
                      storage.status === 'Warning' ? 'bg-amber-500 border-white' : 'bg-red-500 border-white'
                    }`}>
                      <i className="fa-solid fa-warehouse"></i>
                    </div>
                    {/* Tooltip on hover/select */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-1.5 bg-black text-white rounded-xl text-[10px] font-black uppercase whitespace-nowrap border border-slate-800 shadow-2xl transition-all ${selectedStorageId === storage.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                      {storage.name}
                    </div>
                 </div>
               ))}

               {/* Instruction overlay */}
               {isPlacing && (
                 <div className="absolute inset-0 bg-amber-400/5 flex items-center justify-center pointer-events-none border-4 border-amber-400 border-dashed rounded-3xl">
                    <div className="px-8 py-4 bg-black text-amber-400 rounded-3xl font-black text-sm uppercase shadow-2xl animate-pulse flex items-center gap-4">
                      <i className="fa-solid fa-location-crosshairs text-xl"></i>
                      Target: {storages.find(s => s.id === isPlacing)?.name}
                    </div>
                 </div>
               )}
            </div>
          </div>
          
          <div className="absolute bottom-8 left-8 flex flex-col gap-2">
             <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest shadow-2xl">
               Alt + Left Click / Middle Mouse to Pan
             </div>
             <div className="px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl text-[9px] font-black text-slate-600 uppercase tracking-widest shadow-xl">
               {zoom > 1.2 ? 'High Precision Mode Active' : 'Normal Resolution'}
             </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="w-80 flex flex-col gap-6 shrink-0 h-full">
           <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col overflow-hidden flex-1">
             <h4 className="font-black text-black text-xs uppercase tracking-widest mb-4">Facility Nodes</h4>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
               {storages.map(storage => (
                 <div 
                   key={storage.id}
                   onClick={() => setSelectedStorageId(storage.id)}
                   className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                     selectedStorageId === storage.id 
                       ? 'bg-black border-black text-white shadow-lg' 
                       : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-amber-400'
                   }`}
                 >
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <p className="text-xs font-black uppercase tracking-tight">{storage.name}</p>
                       <p className={`text-[8px] font-bold uppercase ${selectedStorageId === storage.id ? 'text-amber-400' : 'text-slate-400'}`}>{storage.area}</p>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase ${
                       storage.status === 'Normal' ? 'bg-emerald-500/10 text-emerald-500' :
                       storage.status === 'Warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                     }`}>
                       {storage.status}
                     </div>
                   </div>
                   
                   {/* GPS Info Snippet */}
                   <div className="flex gap-2 text-[8px] font-black uppercase tracking-tighter opacity-70 mb-3">
                      <i className="fa-solid fa-earth-asia"></i>
                      {storage.lat ? `${storage.lat.toFixed(4)}, ${storage.lng?.toFixed(4)}` : 'No GPS Data'}
                   </div>

                   <div className="flex gap-2 mt-2">
                     <button 
                       disabled={isPlacing !== null}
                       onClick={(e) => { e.stopPropagation(); setIsPlacing(storage.id); }}
                       className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                         selectedStorageId === storage.id ? 'bg-amber-400 text-black' : 'bg-white text-slate-600 border border-slate-200 group-hover:border-amber-400'
                       }`}
                     >
                       {storage.mapX ? 'Relocate' : 'Map Pin'}
                     </button>
                     {storage.mapX && (
                       <button 
                         onClick={(e) => { e.stopPropagation(); onUpdateStoragePos(storage.id, 0, 0, storage.lat, storage.lng); }}
                         className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                         title="Remove from map"
                       >
                         <i className="fa-solid fa-location-xmark"></i>
                       </button>
                     )}
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Selected Node Details: Lat/Lng Editor */}
           {selectedStorage && (
             <div className="bg-black rounded-[2rem] p-6 text-white shadow-xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-black uppercase text-xs text-amber-400">Node Coordinates</h5>
                  <button 
                    onClick={fetchGPS}
                    className="p-2 bg-white/10 rounded-lg hover:bg-amber-400 hover:text-black transition-colors"
                    title="Fetch Browser GPS"
                  >
                    <i className={`fa-solid ${isGpsLoading ? 'fa-spinner fa-spin' : 'fa-crosshairs'} text-xs`}></i>
                  </button>
                </div>
                
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Latitude</label>
                        <input 
                           type="text" 
                           value={editLat}
                           onChange={e => setEditLat(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs font-bold text-white outline-none focus:border-amber-400"
                           placeholder="0.0000"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Longitude</label>
                        <input 
                           type="text" 
                           value={editLng}
                           onChange={e => setEditLng(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs font-bold text-white outline-none focus:border-amber-400"
                           placeholder="0.0000"
                        />
                      </div>
                   </div>
                   <button 
                      onClick={updateGeo}
                      className="w-full py-2.5 bg-amber-400 text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg shadow-amber-400/20"
                   >
                     Update Geo-Location
                   </button>
                </div>
             </div>
           )}

           {!selectedStorage && (
              <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center text-xl">
                      <i className="fa-solid fa-satellite"></i>
                    </div>
                    <div>
                      <h5 className="font-black uppercase text-xs">Live Tracking</h5>
                      <p className="text-[8px] text-amber-400 font-bold uppercase tracking-widest">System Online</p>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Select a facility node to manage its precise micro-location pixels and world-scale GPS coordinates.
                </p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default FactoryLayoutMapping;
