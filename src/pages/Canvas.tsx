import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Home, RotateCcw, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import Canvas3D from "@/components/Canvas3D";
import html2canvas from "html2canvas";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [config, setConfig] = useState<ConfigData>({});
  const [posters, setPosters] = useState<Poster[]>([]);
  const [draggedPoster, setDraggedPoster] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isExporting, setIsExporting] = useState(false);

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
        // Arrange posters in a 3D space initially
        const col = i % 3;
        const row = Math.floor(i / 3);
        const onWall: 'front' | 'side' = i % 2 === 0 ? 'front' : 'side';
        
        initialPosters.push({
          id: `poster-${i}`,
          x: -200 + col * (posterWidth + 50),
          y: -100 + row * (posterHeight + 50),
          z: onWall === 'front' ? -300 : 100,
          width: posterWidth,
          height: posterHeight,
          isDragging: false,
          onWall
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

  const handleMouseDown = (posterId: string) => {
    setDraggedPoster(posterId);
    setPosters(prev => prev.map(p => 
      p.id === posterId ? { ...p, isDragging: true } : p
    ));
  };

  const handleTouchStart = (posterId: string) => {
    if (isMobile) {
      handleMouseDown(posterId);
    }
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
        const onWall: 'front' | 'side' = i % 2 === 0 ? 'front' : 'side';
        
        resetPosters.push({
          id: `poster-${i}`,
          x: -200 + col * (posterWidth + 50),
          y: -100 + row * (posterHeight + 50),
          z: onWall === 'front' ? -300 : 100,
          width: posterWidth,
          height: posterHeight,
          isDragging: false,
          onWall
        });
      }
      
      setPosters(resetPosters);
    }
  };

  const handleExportPNG = async () => {
    if (!canvasRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      link.download = 'poster-layout-design.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
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
              <Button 
                variant="outline" 
                onClick={handleExportPNG}
                disabled={isExporting}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export PNG'}</span>
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

            {/* 3D Canvas */}
            <div className="flex justify-center" ref={canvasRef}>
              <Canvas3D
                posters={posters}
                wallColor={wallColor}
                posterColor={theme.poster}
                onPosterUpdate={(updater) => setPosters(updater)}
                draggedPoster={draggedPoster}
                onMouseDown={isMobile ? handleTouchStart : handleMouseDown}
                onMouseUp={handleMouseUp}
              />
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
