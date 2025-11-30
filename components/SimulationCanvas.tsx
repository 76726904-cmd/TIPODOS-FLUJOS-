import React, { useRef, useEffect } from 'react';
import { FlowRegime } from '../types';

interface SimulationCanvasProps {
  velocity: number;
  reynoldsNumber: number;
  regime: FlowRegime;
  isPlaying: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  offsetY: number; // Initial random Y offset for thickness
  phase: number; // For transition sine wave
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  velocity,
  reynoldsNumber,
  regime,
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  // Simulation constants
  const PIPE_HEIGHT = 160;
  const INJECTOR_Y = PIPE_HEIGHT / 2;
  const SPEED_MULTIPLIER = 1000; // Scale m/s to pixels/frame roughly
  
  // Initialize or Reset
  useEffect(() => {
    particlesRef.current = [];
  }, []);

  const spawnParticle = (width: number) => {
    // Determine spawn rate based on velocity (more flow = more particles)
    const count = Math.ceil(velocity * 5) + 1;
    
    for (let i = 0; i < count; i++) {
        particlesRef.current.push({
            x: 50, // Start near injector tip
            y: INJECTOR_Y,
            vx: velocity * 2, // Base speed
            vy: 0,
            life: 1.0,
            offsetY: (Math.random() - 0.5) * 4, // Slight thickness to the ink line
            phase: Math.random() * Math.PI * 2,
        });
    }
  };

  const updateParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear pipe interior area
    ctx.clearRect(0, 0, width, height);

    // Draw Pipe Walls
    ctx.fillStyle = '#e2e8f0'; // Light slate outside
    ctx.fillRect(0, 0, width, height);
    
    // Draw Water
    ctx.fillStyle = '#f0f9ff'; // Very light blue water
    ctx.fillRect(0, 20, width, PIPE_HEIGHT);
    
    // Draw Pipe Borders
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(width, 20);
    ctx.moveTo(0, 20 + PIPE_HEIGHT);
    ctx.lineTo(width, 20 + PIPE_HEIGHT);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw Injector Needle
    ctx.beginPath();
    ctx.moveTo(0, INJECTOR_Y + 20);
    ctx.lineTo(50, INJECTOR_Y + 20);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Needle Tip
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(50, INJECTOR_Y + 20, 2, 0, Math.PI * 2);
    ctx.fill();

    // Visual Speed Scaling: Don't let it be too slow or too fast for the screen
    // Map velocity 0.05 - 1.0 to pixel speed 2 - 15
    const pixelSpeed = Math.max(2, Math.min(velocity * 40, 20));

    particlesRef.current.forEach((p, index) => {
      // Move forward
      p.x += pixelSpeed;
      p.life -= 0.002;

      // Behavior based on Reynolds Number
      if (reynoldsNumber < 2000) {
        // LAMINAR: Straight line, minimal diffusion
        p.y = INJECTOR_Y + 20 + p.offsetY; 
      } else if (reynoldsNumber >= 2000 && reynoldsNumber <= 4000) {
        // TRANSITION: Sine wave / Wavy
        // Frequency increases with Re
        const freq = 0.02 + ((reynoldsNumber - 2000) / 2000) * 0.03;
        const amp = 5 + ((reynoldsNumber - 2000) / 2000) * 20;
        
        // Add waving motion relative to X
        p.y = INJECTOR_Y + 20 + p.offsetY + Math.sin(p.x * freq + p.phase) * amp * (p.x > 150 ? 1 : 0);
        
        // Slight mixing at end
        if (p.x > width * 0.7) {
             p.y += (Math.random() - 0.5) * 5;
        }

      } else {
        // TURBULENT: Chaos
        // Diffusion increases with distance
        const turbulenceStart = 100;
        if (p.x > turbulenceStart) {
            const chaosFactor = (reynoldsNumber - 4000) / 10000;
            const spread = (p.x - turbulenceStart) * (0.1 + chaosFactor);
            p.y = INJECTOR_Y + 20 + p.offsetY + (Math.random() - 0.5) * Math.min(spread, PIPE_HEIGHT - 10);
        } else {
            p.y = INJECTOR_Y + 20 + p.offsetY;
        }
      }

      // Draw Particle (Ink)
      const alpha = Math.max(0, p.life);
      ctx.fillStyle = `rgba(70, 0, 180, ${alpha})`; // Indigo ink
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Remove off-screen particles
      if (p.x > width || p.life <= 0) {
        particlesRef.current.splice(index, 1);
      }
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isPlaying) {
      spawnParticle(canvas.width);
    }
    
    updateParticles(ctx, canvas.width, canvas.height);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  });

  return (
    <div className="w-full relative rounded-lg overflow-hidden shadow-inner border border-slate-300 bg-slate-50">
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full h-[200px] block"
      />
      <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-mono text-slate-600">
        Inyector de Tinta
      </div>
      <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded text-xs font-mono text-blue-600 font-bold">
        Agua @ {velocity.toFixed(3)} m/s
      </div>
    </div>
  );
};

export default SimulationCanvas;