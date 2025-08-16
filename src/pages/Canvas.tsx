import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Home, RotateCcw, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

interface Poster {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
}

interface ConfigData {
  wallType?: string;
  count?: string;
  size?: string;
  wallColor?: string;
  theme?: string;
}

export default function Canvas() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<ConfigData>({});
  const [posters, setPosters] = useState<Poster[]>([]);
  const [draggedPoster, setDraggedPoster] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Canvas dimensions
  const canvasWidth = 800;
  const canvasHeight = 600;

  useEffect(() => {
    const wallType = localStorage.getItem("selectedWallType");
    const posterConfig = JSON.parse(localStorage.getItem("posterConfig") || "{}");
    
    setConfig({
      wallType,
      ...posterConfig
    });

    // Initialize posters
    if (posterConfig.count && posterConfig.size) {
      const count = parseInt(posterConfig.count);
      const [width, height] = posterConfig.size.split('x').map((s: string) => parseInt(s));
      
      // Scale poster size for canvas (1cm = 2px)
      const posterWidth = width * 2;
      const posterHeight = height * 2;
      
      const initialPosters: Poster[] = [];
      
      for (let i = 0; i < count; i++) {
        // Arrange posters in a grid-like pattern initially
        const col = i % 3;
        const row = Math.floor(i / 3);
        
        initialPosters.push({
          id: `poster-${i}`,
          x: 100 + col * (posterWidth + 50),
          y: 100 + row * (posterHeight + 50),
          width: posterWidth,
          height: posterHeight,
          isDragging: false
        });
      }
      
      setPosters(initialPosters);
    }
  }, []);

  const wallColors = {
    white: "#FFFFFF",
    beige: "#F5F5DC",
    lightgray: "#D3D3D3",
    darkgray: "#696969",
    cream: "#FFFDD0",
    offwhite: "#FAF0E6",
    lightblue: "#ADD8E6",
    lightgreen: "#90EE90",
  };

  const colorThemes = {
    classic: { poster: "#4A4A4A", frame: "#2A2A2A" },
    modern: { poster: "#3A3A3A", frame: "#1A1A1A" },
    minimal: { poster: "#6A6A6A", frame: "#4A4A4A" },
    elegant: { poster: "#505050", frame: "#303030" }
  };

  const handleMouseDown = (e: React.MouseEvent, posterId: string) => {
    e.preventDefault();
    setDraggedPoster(posterId);
    setPosters(prev => prev.map(p => 
      p.id === posterId ? { ...p, isDragging: true } : p
    ));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current || !draggedPoster) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
    
    setPosters(prev => prev.map(poster => {
      if (poster.id === draggedPoster) {
        // Keep poster within canvas bounds
        const newX = Math.max(0, Math.min(canvasWidth - poster.width, x - poster.width / 2));
        const newY = Math.max(0, Math.min(canvasHeight - poster.height, y - poster.height / 2));
        
        return { ...poster, x: newX, y: newY };
      }
      return poster;
    }));
  };

  const handleMouseUp = () => {
    setDraggedPoster(null);
    setPosters(prev => prev.map(p => ({ ...p, isDragging: false })));
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

  const resetLayout = () => {
    if (config.count && config.size) {
      const count = parseInt(config.count);
      const [width, height] = config.size.split('x').map((s: string) => parseInt(s));
      const posterWidth = width * 2;
      const posterHeight = height * 2;
      
      const resetPosters: Poster[] = [];
      
      for (let i = 0; i < count; i++) {
        const col = i % 3;
        const row = Math.floor(i / 3);
        
        resetPosters.push({
          id: `poster-${i}`,
          x: 100 + col * (posterWidth + 50),
          y: 100 + row * (posterHeight + 50),
          width: posterWidth,
          height: posterHeight,
          isDragging: false
        });
      }
      
      setPosters(resetPosters);
    }
  };

  const handleBack = () => {
    navigate("/review");
  };

  const wallColor = config.wallColor ? wallColors[config.wallColor as keyof typeof wallColors] : "#FFFFFF";
  const theme = config.theme ? colorThemes[config.theme as keyof typeof colorThemes] : { poster: "#4A4A4A", frame: "#2A2A2A" };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Home className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Poster Layout Planner</h1>
                <p className="text-sm text-muted-foreground">Drag posters to arrange your perfect layout</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={resetLayout} className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Canvas Container */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Interactive Layout Canvas
              </h2>
              <p className="text-muted-foreground">
                Drag posters to arrange them. Distance measurements update in real-time.
              </p>
            </div>

            {/* Canvas */}
            <div className="flex justify-center">
              <div
                ref={canvasRef}
                className={`relative border-2 rounded-lg cursor-move select-none ${
                  config.wallType === "corner" ? "border-l-4 border-t-4" : ""
                }`}
                style={{
                  width: canvasWidth,
                  height: canvasHeight,
                  backgroundColor: wallColor,
                  borderColor: "#333"
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Corner indicator for corner walls */}
                {config.wallType === "corner" && (
                  <div className="absolute top-0 left-0 w-8 h-8 bg-gray-400 opacity-50" />
                )}

                {/* Posters */}
                {posters.map((poster) => {
                  const distances = calculateDistance(poster);
                  
                  return (
                    <div key={poster.id}>
                      {/* Poster */}
                      <div
                        className={`absolute border-2 cursor-move transition-shadow duration-200 ${
                          poster.isDragging ? "shadow-glow scale-105" : "hover:shadow-elegant"
                        }`}
                        style={{
                          left: poster.x,
                          top: poster.y,
                          width: poster.width,
                          height: poster.height,
                          backgroundColor: theme.poster,
                          borderColor: theme.frame,
                          zIndex: poster.isDragging ? 10 : 1
                        }}
                        onMouseDown={(e) => handleMouseDown(e, poster.id)}
                      >
                        {/* Poster content placeholder */}
                        <div className="w-full h-full bg-gray-300 opacity-20 flex items-center justify-center text-xs text-gray-600">
                          Poster
                        </div>
                      </div>

                      {/* Distance indicators */}
                      {poster.isDragging && (
                        <>
                          {/* Left distance */}
                          <div
                            className="absolute text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                            style={{
                              left: poster.x / 2 - 10,
                              top: poster.y + poster.height / 2,
                              zIndex: 20
                            }}
                          >
                            {distances.left}cm
                          </div>
                          
                          {/* Right distance */}
                          <div
                            className="absolute text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                            style={{
                              left: poster.x + poster.width + (canvasWidth - poster.x - poster.width) / 2 - 10,
                              top: poster.y + poster.height / 2,
                              zIndex: 20
                            }}
                          >
                            {distances.right}cm
                          </div>
                          
                          {/* Top distance */}
                          <div
                            className="absolute text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                            style={{
                              left: poster.x + poster.width / 2 - 10,
                              top: poster.y / 2 - 10,
                              zIndex: 20
                            }}
                          >
                            {distances.top}cm
                          </div>
                          
                          {/* Bottom distance */}
                          <div
                            className="absolute text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                            style={{
                              left: poster.x + poster.width / 2 - 10,
                              top: poster.y + poster.height + (canvasHeight - poster.y - poster.height) / 2 - 10,
                              zIndex: 20
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

            {/* Instructions */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>💡 Click and drag any poster to move it around. Distance measurements appear while dragging.</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-start">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Review</span>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
