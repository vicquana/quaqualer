
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { playScratchSound } from '../utils/audio';

interface ScratchCanvasProps {
  width: number;
  height: number;
  onComplete: () => void;
  color?: string;
  brushSize?: number;
}

const ScratchCanvas: React.FC<ScratchCanvasProps> = ({ 
  width, 
  height, 
  onComplete, 
  color = '#C0C0C0', 
  brushSize = 35 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const lastSoundTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let i = 0; i < 500; i++) {
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
    
    ctx.fillStyle = '#666';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('刮開此處', width / 2, height / 2);
  }, [width, height, color]);

  const getPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let count = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) count++;
    }

    return (count / (pixels.length / 4)) * 100;
  }, [width, height]);

  const scratch = (x: number, y: number) => {
    if (isFinished) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();

    // Throttled sound effect for scratching
    const now = Date.now();
    if (now - lastSoundTime.current > 60) {
      playScratchSound();
      lastSoundTime.current = now;
    }

    const percent = getPercentage();
    if (percent > 65) {
      setIsFinished(true);
      onComplete();
      canvas.style.transition = 'opacity 0.5s ease-out';
      canvas.style.opacity = '0';
      setTimeout(() => {
        ctx.clearRect(0, 0, width, height);
      }, 500);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) scratch(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) scratch(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      scratch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      scratch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      className="absolute top-0 left-0 z-10 cursor-crosshair rounded-lg"
      style={{ touchAction: 'none' }}
    />
  );
};

export default ScratchCanvas;
