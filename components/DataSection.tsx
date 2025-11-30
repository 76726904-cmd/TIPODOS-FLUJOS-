import React from 'react';
import { MeasuredDataPoint, FlowRegime } from '../types';
import { getRegimeColor } from '../utils/physics';

const EXPERIMENTAL_DATA: MeasuredDataPoint[] = [
  { id: 1, volumeMl: 120.6, timeS: 30, description: "Línea de tinta recta y estable.", expectedRegime: FlowRegime.Laminar },
  { id: 2, volumeMl: 301.6, timeS: 30, description: "Línea clara, ligera difusión al final.", expectedRegime: FlowRegime.Laminar },
  { id: 3, volumeMl: 392.1, timeS: 30, description: "Trazador comienza a ondular.", expectedRegime: FlowRegime.Transition },
  { id: 4, volumeMl: 603.2, timeS: 30, description: "Ondulaciones fuertes y mezcla parcial.", expectedRegime: FlowRegime.Transition },
  { id: 5, volumeMl: 829.4, timeS: 30, description: "Dispersión rápida, mezcla completa.", expectedRegime: FlowRegime.Turbulent },
  { id: 6, volumeMl: 1658.8, timeS: 30, description: "Tinta se disipa instantáneamente.", expectedRegime: FlowRegime.Turbulent },
];

export const DataSection: React.FC<{
  onLoadData: (volumeMl: number) => void;
}> = ({ onLoadData }) => {
  
  // Physics constants for the table calculations
  const DIAMETER = 0.008; // 8mm
  const AREA = Math.PI * Math.pow(DIAMETER/2, 2);
  const VISCOSITY = 9.596e-7; // at 22C

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h3 className="text-lg font-bold text-slate-800">3.1 Datos Recogidos (Mediciones experimentales)</h3>
        <p className="text-sm text-slate-600">
          A continuación se presentan los datos crudos proporcionados en la guía de laboratorio. 
          Puede cargar estos datos en el simulador haciendo clic en el botón "Simular".
        </p>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b">
            <tr>
              <th className="px-4 py-3">Prueba</th>
              <th className="px-4 py-3">Volumen (ml)</th>
              <th className="px-4 py-3">Caudal Q (m³/s)</th>
              <th className="px-4 py-3">Velocidad V (m/s)</th>
              <th className="px-4 py-3">Reynolds (Calc)</th>
              <th className="px-4 py-3">Observación</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {EXPERIMENTAL_DATA.map((data) => {
              // Calculate values for display based on the fixed constants in the text
              const volM3 = data.volumeMl * 1e-6;
              const Q = volM3 / data.timeS;
              const V = Q / AREA;
              const Re = (V * DIAMETER) / VISCOSITY;

              return (
                <tr key={data.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{data.id}</td>
                  <td className="px-4 py-3">{data.volumeMl.toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{Q.toExponential(3)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{V.toFixed(3)}</td>
                  <td className={`px-4 py-3 font-bold ${getRegimeColor(data.expectedRegime)}`}>
                    {Math.round(Re)}
                  </td>
                  <td className="px-4 py-3 italic max-w-xs">{data.description}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onLoadData(data.volumeMl)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold transition-colors"
                    >
                      Simular
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 text-sm text-amber-900">
        <strong>Nota:</strong> Los cálculos de la tabla asumen T=22°C (ν = 9.596×10⁻⁷ m²/s) y D=8mm, constantes para todo el experimento.
      </div>
    </div>
  );
};