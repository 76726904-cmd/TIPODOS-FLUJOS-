import React from 'react';

export const TheorySection: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto text-slate-800 pb-12">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b pb-2">I. Marco Teórico</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">1.1 Antecedentes</h3>
                <p className="text-slate-600 leading-relaxed">
                    El experimento original de Osborne Reynolds consistió en inyectar un filete colorido en un flujo de agua dentro de un tubo de vidrio. 
                    Reynolds observó que a bajas velocidades el filete era recto (laminar), pero al aumentar la velocidad, este se volvía inestable (transición) y finalmente se mezclaba por completo (turbulento).
                </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">1.2 Número de Reynolds (Re)</h3>
                <p className="text-slate-600 mb-4">
                    Relación adimensional que predice el régimen de flujo:
                </p>
                <div className="bg-slate-100 p-4 rounded text-center font-mono text-lg mb-2">
                    Re = (V · D) / ν
                </div>
                <ul className="text-sm list-disc list-inside space-y-1 text-slate-600">
                    <li><strong>V:</strong> Velocidad media del flujo (m/s)</li>
                    <li><strong>D:</strong> Diámetro de la tubería (m)</li>
                    <li><strong>ν (nu):</strong> Viscosidad cinemática del fluido (m²/s)</li>
                </ul>
            </div>
        </div>

        <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
             <h3 className="text-lg font-semibold mb-4 text-blue-900">Criterios de Clasificación</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                 <div className="p-4 bg-emerald-100 rounded-lg">
                     <div className="font-bold text-emerald-800 text-xl">Re &lt; 2000</div>
                     <div className="font-semibold text-emerald-700">Flujo Laminar</div>
                     <div className="text-xs text-emerald-600 mt-2">Capas paralelas, ordenado, viscosidad domina.</div>
                 </div>
                 <div className="p-4 bg-amber-100 rounded-lg">
                     <div className="font-bold text-amber-800 text-xl">2000 - 4000</div>
                     <div className="font-semibold text-amber-700">Transición</div>
                     <div className="text-xs text-amber-600 mt-2">Inestable, fluctuaciones, mezcla incipiente.</div>
                 </div>
                 <div className="p-4 bg-rose-100 rounded-lg">
                     <div className="font-bold text-rose-800 text-xl">Re &gt; 4000</div>
                     <div className="font-semibold text-rose-700">Flujo Turbulento</div>
                     <div className="text-xs text-rose-600 mt-2">Caótico, inercia domina, alta mezcla.</div>
                 </div>
             </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b pb-2">II. Preguntas y Conclusiones</h2>
        <div className="space-y-4">
            <details className="group border rounded-lg bg-white overflow-hidden">
                <summary className="p-4 cursor-pointer font-semibold bg-slate-50 hover:bg-slate-100 group-open:bg-indigo-50 transition-colors flex justify-between items-center">
                    ¿Qué ocasiona que el flujo sea turbulento?
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-slate-700 leading-relaxed border-t">
                    El predominio de las <strong>fuerzas inerciales</strong> (masa acelerada) sobre las <strong>fuerzas viscosas</strong> (fricción interna). 
                    Cuando la inercia es alta, cualquier pequeña perturbación se amplifica caóticamente en lugar de ser amortiguada por la viscosidad.
                </div>
            </details>

            <details className="group border rounded-lg bg-white overflow-hidden">
                <summary className="p-4 cursor-pointer font-semibold bg-slate-50 hover:bg-slate-100 group-open:bg-indigo-50 transition-colors flex justify-between items-center">
                    ¿Cómo controlamos el tipo de flujo?
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-slate-700 leading-relaxed border-t">
                    Se controla modificando el Número de Reynolds. Dado que el diámetro y la viscosidad suelen ser fijos, la variable de control principal es la <strong>velocidad del fluido</strong>, regulada mediante válvulas.
                </div>
            </details>

            <div className="bg-slate-800 text-white p-6 rounded-lg mt-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-indigo-300">Conclusiones del Experimento</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                    <li><strong className="text-white">Verificación Exitosa:</strong> Las pruebas visuales coincidieron con los intervalos numéricos calculados (Re=2168 mostró ondulaciones).</li>
                    <li><strong className="text-white">Influencia de la Velocidad:</strong> Pequeños incrementos en V (de 0.20 a 0.26 m/s) fueron suficientes para cambiar el régimen.</li>
                    <li><strong className="text-white">Temperatura:</strong> Medir T=22°C fue fundamental. Usar estándares de 20°C habría introducido errores en la clasificación.</li>
                </ul>
            </div>
        </div>
      </section>
    </div>
  );
};