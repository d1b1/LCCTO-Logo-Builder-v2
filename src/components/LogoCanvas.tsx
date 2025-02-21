import React, { useEffect, useRef, forwardRef } from 'react';
import { IconData } from '../types/icon';

interface LogoCanvasProps {
  width: number;
  height: number;
  iconSize: number;
  iconSpacing: number;
  borderWidth: number;
  borderRadius: number;
  borderColor: string;
  icons: (IconData | null)[];
  scale?: number;
}

export const LogoCanvas = forwardRef<HTMLCanvasElement, LogoCanvasProps>(({
  width,
  height,
  iconSize,
  iconSpacing,
  borderWidth,
  borderRadius,
  borderColor,
  icons,
  scale = 1
}, ref) => {
  const localRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || localRef;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with scale
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    // Scale all operations
    ctx.scale(scale, scale);

    // Clear canvas with transparency
    ctx.clearRect(0, 0, width, height);

    // Draw border with radius
    ctx.beginPath();
    ctx.roundRect(
      borderWidth / 2,
      borderWidth / 2,
      width - borderWidth,
      height - borderWidth,
      borderRadius
    );
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();

    // Calculate grid layout
    const gridSize = 2;
    const cellWidth = (width - (iconSpacing * (gridSize + 1))) / gridSize;
    const cellHeight = (height - (iconSpacing * (gridSize + 1))) / gridSize;

    // Draw icons
    icons.forEach((icon, index) => {
      if (!icon) return;

      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      const x = iconSpacing + col * (cellWidth + iconSpacing) + cellWidth / 2;
      const y = iconSpacing + row * (cellHeight + iconSpacing) + cellHeight / 2;

      // Create temporary div for the icon
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `<i class="fa-${icon.family} fa-${icon.name} fa-${icon.style}" style="font-size: ${iconSize}px; color: #374151;"></i>`;
      document.body.appendChild(tempDiv);

      // Use html2canvas to render the icon
      import('html2canvas').then(({ default: html2canvas }) => {
        html2canvas(tempDiv, {
          backgroundColor: null,
          scale: 2,
          logging: false,
        }).then(iconCanvas => {
          // Draw the icon centered at (x, y)
          ctx.drawImage(
            iconCanvas,
            x - iconCanvas.width / 4,
            y - iconCanvas.height / 4,
            iconCanvas.width / 2,
            iconCanvas.height / 2
          );
          
          // Clean up
          document.body.removeChild(tempDiv);
        });
      });
    });
  }, [width, height, iconSize, iconSpacing, borderWidth, borderRadius, borderColor, icons, scale, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      className="bg-white"
    />
  );
});