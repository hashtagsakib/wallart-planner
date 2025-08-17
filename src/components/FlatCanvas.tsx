import { useState, useRef } from 'react';

interface Poster {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  isDragging: boolean;
  onWall: 'front' | 'side';
}

interface FlatCanvasProps {
  posters: Poster[];
  wallColor: string;
  posterColor: string;
  onPosterUpdate: (updater: (prev: Poster[]) => Poster[]) => void;
  draggedPoster: string | null;
  onMouseDown: (posterId: string) => void;
  onMouseUp: () => void;
}

export default function FlatCanvas({
  posters,
  wallColor,
  posterColor,
  onPosterUpdate,
  draggedPoster,
  onMouseDown,
  onMouseUp
}: FlatCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const canvasWidth = 800;
  const canvasHeight = 600;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current || !draggedPoster) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
    
    onPosterUpdate((prev: Poster[]) => prev.map(poster => {
      if (poster.id === draggedPoster) {
        // Keep poster within canvas bounds
        const newX = Math.max(0, Math.min(canvasWidth - poster.width, x - poster.width / 2));
        const newY = Math.max(0, Math.min(canvasHeight - poster.height, y - poster.height / 2));
        
        return { ...poster, x: newX, y: newY };
      }
      return poster;
    }));
  };

  const calculateDistance = (poster: Poster) => {
    const distances = {
      left: Math.round(poster.x / 2), // Convert back to cm
      right: Math.round((canvasWidth - poster.x - poster.width) / 2),
      top: Math.round(poster.y / 2),
      bottom: Math.round((canvasHeight - poster.y - poster.height) / 2)
    };
    return distances;
  };

  return (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden touch-none relative">
      <div
        ref={canvasRef}
        className="relative w-full h-full"
        style={{ 
          backgroundColor: wallColor,
          touchAction: 'none',
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          margin: '0 auto'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Render posters */}
        {posters.map((poster) => {
          const distances = calculateDistance(poster);
          
          return (
            <div
              key={poster.id}
              className="absolute cursor-move select-none"
              style={{
                left: `${poster.x}px`,
                top: `${poster.y}px`,
                width: `${poster.width}px`,
                height: `${poster.height}px`,
                backgroundColor: poster.isDragging ? '#555555' : posterColor,
                opacity: poster.isDragging ? 0.8 : 1,
                transform: poster.isDragging ? 'scale(1.05)' : 'scale(1)',
                transition: poster.isDragging ? 'none' : 'transform 0.2s ease',
                border: '2px solid #333',
                borderRadius: '4px',
                zIndex: poster.isDragging ? 1000 : 1
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                onMouseDown(poster.id);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                onMouseDown(poster.id);
              }}
            >
              {/* Poster content area */}
              <div
                className="w-full h-full bg-gray-100 rounded-sm"
                style={{
                  margin: '8px',
                  width: 'calc(100% - 16px)',
                  height: 'calc(100% - 16px)'
                }}
              />
              
              {/* Distance indicators when dragging */}
              {poster.isDragging && (
                <>
                  {/* Left distance */}
                  <div
                    className="absolute text-white text-xs bg-black bg-opacity-75 px-1 rounded"
                    style={{
                      left: '-60px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {distances.left}cm
                  </div>
                  
                  {/* Right distance */}
                  <div
                    className="absolute text-white text-xs bg-black bg-opacity-75 px-1 rounded"
                    style={{
                      right: '-60px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {distances.right}cm
                  </div>
                  
                  {/* Top distance */}
                  <div
                    className="absolute text-white text-xs bg-black bg-opacity-75 px-1 rounded"
                    style={{
                      top: '-25px',
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {distances.top}cm
                  </div>
                  
                  {/* Bottom distance */}
                  <div
                    className="absolute text-white text-xs bg-black bg-opacity-75 px-1 rounded"
                    style={{
                      bottom: '-25px',
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {distances.bottom}cm
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
