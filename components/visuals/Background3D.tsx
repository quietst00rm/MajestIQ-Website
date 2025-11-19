import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  // Initialize off-screen so no interaction on load
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;

    const resize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particle configuration
    const particleCount = width < 768 ? 40 : 100;
    const connectionDistance = width < 768 ? 100 : 160;
    const interactionRadius = 200; // Radius for mouse repulsion
    
    interface Particle {
      x: number;
      y: number;
      z: number; // Depth: 1 is close, 0.1 is far
      vx: number;
      vy: number;
      size: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2, // Depth between 0.2 and 1.0
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Theme Colors
      const particleColor = theme === 'dark' ? '255, 215, 0' : '180, 151, 14';
      const lineColor = theme === 'dark' ? '255, 215, 0' : '180, 151, 14';

      // Mouse parallax target offset (centered)
      const targetX = (mouseRef.current.x - width / 2);
      const targetY = (mouseRef.current.y - height / 2);

      // 1. Update physics and Calculate Render Positions (with Parallax + Repulsion)
      const renderPoints = particles.map(p => {
        // Update base position
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        // Wrap boundaries
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        // Apply Parallax
        let rX = p.x + (targetX * 0.05 * p.z);
        let rY = p.y + (targetY * 0.05 * p.z);

        // Apply Mouse Repulsion
        const dx = mouseRef.current.x - rX;
        const dy = mouseRef.current.y - rY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < interactionRadius) {
            const force = (interactionRadius - distance) / interactionRadius; // 0 to 1
            const angle = Math.atan2(dy, dx);
            const repelStrength = 100 * force * p.z; // Closer particles move more
            
            rX -= Math.cos(angle) * repelStrength;
            rY -= Math.sin(angle) * repelStrength;
        }

        return { x: rX, y: rY, z: p.z, size: p.size };
      });

      // 2. Draw Points and Lines
      renderPoints.forEach((p, i) => {
        // Draw Point
        const opacity = 0.3 + (p.z * 0.7); // Closer = brighter
        ctx.fillStyle = `rgba(${particleColor}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
        ctx.fill();

        // Draw Connections
        for (let j = i + 1; j < renderPoints.length; j++) {
          const p2 = renderPoints[j];
          
          // Skip if depth difference is too high (layer separation)
          if (Math.abs(p.z - p2.z) > 0.3) continue;

          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Scale connection distance by depth
          const maxDist = connectionDistance * ((p.z + p2.z) / 2);

          if (dist < maxDist) {
            const distOpacity = 1 - (dist / maxDist);
            const depthOpacity = (p.z + p2.z) / 2;
            
            ctx.strokeStyle = `rgba(${lineColor}, ${distOpacity * depthOpacity * 0.2})`;
            ctx.lineWidth = 0.5 * depthOpacity;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full -z-10 opacity-100 pointer-events-none"
    />
  );
};

export default Background3D;