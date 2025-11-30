import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Beaker, BookOpen, Activity, Droplet } from 'lucide-react';
import SimulationCanvas from './components/SimulationCanvas';
import { DataSection } from './components/DataSection';
import { TheorySection } from './components/TheorySection';
import { calculatePhysics, getRegimeBg, getRegimeColor } from './utils/physics';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'sim' | 'data' | 'theory'>('sim');
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Physics Inputs
  const [diameterMm, setDiameterMm] = useState(8);
  const [tempC, setTempC] = useState(22);
  const [valvePercent, setValvePercent] = useState(15); // Controls velocity
  
  // Custom Override used when loading data from table
  const [customVolMl, setCustomVolMl] = useState<number | null>(null);

  // Derived Physics Values
  // If customVolMl is set, we back-calculate velocity from that volume over 30s.
  // Otherwise, we derive velocity from the "Valve" slider.
  const AREA = Math.PI * Math.pow((diameterMm/1000)/2, 2);
  
  let currentVelocity = 0;
  
  if (customVolMl !== null) {
      // Calculate based on the "Data Table" click
      // Q = Vol / 30s
      const volM3 = customVolMl * 1e-6;
      const Q = volM3 / 30;
      currentVelocity = Q / AREA;
  } else {
      // Calculate based on Slider
      // Max arbitrary velocity for demo ~ 2.0 m/s
      currentVelocity = (valvePercent / 100) * 1.5; 
  }

  const physics = calculatePhysics(diameterMm, currentVelocity, tempC);

  // Handler for loading data from the table
  const handleLoadData = (volMl: number) => {
    setCustomVolMl(volMl);
    setActiveTab('sim');
    // Approximate slider position for UX (doesn't affect calc because customVolMl takes precedence)
    const volM3 = volMl * 1e-6;
    const Q = volM3 / 30;
    const V = Q / AREA;
    const estimatedPercent = (V / 1.5) * 100;
    setValvePercent(Math.min(100, Math.max(0, estimatedPercent)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSliderChange = (val: number) => {
      setValvePercent(val);
      setCustomVolMl(null); // Clear custom override
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg">
                <Activity size={24} />
             </div>
             <div>
                <h1 className="text-xl font-bold tracking-tight">Simulador Osborne Reynolds</h1>
                <p className="text-slate-400 text-xs">Mecánica de Fluidos · Universidad</p>
             </div>
          </div>
          
          <nav className="flex gap-2 bg-slate-800 p-1 rounded-lg">
             <button 
                onClick={() => setActiveTab('sim')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'sim' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}
             >
                <Beaker size={16} /> Laboratorio
             </button>
             <button 
                onClick={() => setActiveTab('data')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'data' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}
             >
                <Droplet size={16} /> Datos
             </button>
             <button 
                onClick={() => setActiveTab('theory')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'theory' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}
             >
                <BookOpen size={16} /> Teoría
             </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6">
        
        {/* Simulation Tab */}
        {activeTab === 'sim' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             
             {/* Left Column: Visuals & Stats */}
             <div className="lg:col-span-2 space-y-6">
                
                {/* Visualizer Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-700">Visualización de Flujo</h2>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${getRegimeBg(physics.regime)} ${getRegimeColor(physics.regime)}`}>
                            Régimen: {physics.regime}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-100">
                        <SimulationCanvas 
                            velocity={physics.velocity}
                            reynoldsNumber={physics.reynoldsNumber}
                            regime={physics.regime}
                            isPlaying={isPlaying}
                        />
                    </div>
                    <div className="p-3 bg-slate-50 border-t flex justify-center gap-4">
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border shadow-sm rounded-md hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all active:scale-95"
                        >
                            {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
                            {isPlaying ? "Pausar Tinta" : "Reanudar"}
                        </button>
                        <button 
                             onClick={() => { setValvePercent(0); setCustomVolMl(null); }}
                             className="flex items-center gap-2 px-4 py-2 bg-white border shadow-sm rounded-md hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all active:scale-95"
                        >
                            <RefreshCw size={16} /> Reiniciar
                        </button>
                    </div>
                </div>

                {/* Real-time Data Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                         <div className="text-slate-400 text-xs font-bold uppercase mb-1">Reynolds (Re)</div>
                         <div className={`text-2xl md:text-3xl font-bold font-mono ${getRegimeColor(physics.regime)}`}>
                            {Math.round(physics.reynoldsNumber)}
                         </div>
                     </div>
                     <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                         <div className="text-slate-400 text-xs font-bold uppercase mb-1">Velocidad (V)</div>
                         <div className="text-xl md:text-2xl font-bold font-mono text-slate-700">
                            {physics.velocity.toFixed(3)} <span className="text-sm font-normal text-slate-400">m/s</span>
                         </div>
                     </div>
                     <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                         <div className="text-slate-400 text-xs font-bold uppercase mb-1">Caudal (Q)</div>
                         <div className="text-xl md:text-2xl font-bold font-mono text-slate-700">
                            {(physics.flowRate * 1000 * 60).toFixed(2)} <span className="text-sm font-normal text-slate-400">L/min</span>
                         </div>
                     </div>
                     <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                         <div className="text-slate-400 text-xs font-bold uppercase mb-1">Viscosidad (ν)</div>
                         <div className="text-lg md:text-xl font-bold font-mono text-slate-700">
                            {(physics.kinematicViscosity * 1e6).toFixed(3)} <span className="text-sm font-normal text-slate-400">e-6</span>
                         </div>
                     </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900 leading-relaxed">
                    <strong className="block mb-1">Interpretación:</strong>
                    Actualmente, con una velocidad de <strong>{physics.velocity.toFixed(3)} m/s</strong> y un Re de <strong>{Math.round(physics.reynoldsNumber)}</strong>, 
                    el flujo se clasifica como <strong>{physics.regime}</strong>. 
                    {physics.reynoldsNumber < 2000 
                        ? " Las fuerzas viscosas dominan, manteniendo las capas de fluido ordenadas." 
                        : physics.reynoldsNumber > 4000 
                        ? " Las fuerzas inerciales dominan, creando caos y mezcla." 
                        : " Existe una lucha entre fuerzas viscosas e inerciales, causando inestabilidad."}
                </div>
             </div>

             {/* Right Column: Controls */}
             <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-indigo-500 rounded-full block"></span>
                        Controles de Laboratorio
                    </h3>
                    
                    <div className="space-y-8">
                        {/* Valve Control */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-semibold text-slate-700">Apertura de Válvula</label>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                                    {customVolMl !== null ? "Manual (Override)" : `${valvePercent}%`}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100"
                                step="0.1" 
                                value={valvePercent}
                                onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${physics.regime === 'Laminar' ? 'bg-emerald-200 accent-emerald-600' : physics.regime === 'Turbulento' ? 'bg-rose-200 accent-rose-600' : 'bg-amber-200 accent-amber-500'}`}
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Controla la velocidad del flujo. Velocidad actual calculada: {physics.velocity.toFixed(3)} m/s.
                            </p>
                        </div>

                        {/* Temp Control */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-semibold text-slate-700">Temperatura del Agua</label>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{tempC}°C</span>
                            </div>
                            <input 
                                type="range" 
                                min="5" 
                                max="80" 
                                value={tempC}
                                onChange={(e) => setTempC(parseFloat(e.target.value))}
                                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Afecta la viscosidad. A mayor temperatura, menor viscosidad, facilitando la turbulencia.
                            </p>
                        </div>

                        {/* Diameter Control */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-semibold text-slate-700">Diámetro Tubería</label>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{diameterMm} mm</span>
                            </div>
                            <input 
                                type="range" 
                                min="4" 
                                max="50" 
                                step="0.5"
                                value={diameterMm}
                                onChange={(e) => setDiameterMm(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6 text-white">
                     <h4 className="font-bold text-indigo-300 mb-2 text-sm uppercase">Guía Rápida</h4>
                     <ul className="text-sm space-y-2 text-slate-300">
                         <li>• <strong>Laminar:</strong> Re &lt; 2000 (Línea recta)</li>
                         <li>• <strong>Transición:</strong> 2000 - 4000 (Ondas)</li>
                         <li>• <strong>Turbulento:</strong> Re &gt; 4000 (Caos)</li>
                     </ul>
                </div>
             </div>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && (
           <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">
              <DataSection onLoadData={handleLoadData} />
           </div>
        )}

        {/* Theory Tab */}
        {activeTab === 'theory' && (
           <TheorySection />
        )}
      </main>
    </div>
  );
};

export default App;