import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Home, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

interface ConfigData {
  wallType?: string;
  count?: string;
  size?: string;
  wallColor?: string;
  theme?: string;
}

export default function Review() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<ConfigData>({});

  useEffect(() => {
    const wallType = localStorage.getItem("selectedWallType");
    const posterConfig = JSON.parse(localStorage.getItem("posterConfig") || "{}");
    
    setConfig({
      wallType,
      ...posterConfig
    });
  }, []);

  const wallColors = {
    white: { label: "White", color: "#FFFFFF" },
    beige: { label: "Beige", color: "#F5F5DC" },
    lightgray: { label: "Light Gray", color: "#D3D3D3" },
    darkgray: { label: "Dark Gray", color: "#696969" },
    cream: { label: "Cream", color: "#FFFDD0" },
    offwhite: { label: "Off White", color: "#FAF0E6" },
    lightblue: { label: "Light Blue", color: "#ADD8E6" },
    lightgreen: { label: "Light Green", color: "#90EE90" },
  };

  const colorThemes = {
    classic: "Classic Dark",
    modern: "Modern Black", 
    minimal: "Minimal Gray",
    elegant: "Elegant Charcoal"
  };

  const handleBack = () => {
    navigate("/color-selection");
  };

  const handleCreateLayout = () => {
    navigate("/canvas");
  };

  const handleEdit = (section: string) => {
    if (section === "wall") navigate("/wall-type");
    if (section === "posters") navigate("/poster-selection");
    if (section === "colors") navigate("/color-selection");
  };

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
                <p className="text-sm text-muted-foreground">Choose your wall type, select your posters and size, and drag to arrange!</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Step Indicator */}
        <StepIndicator 
          currentStep={4} 
          totalSteps={4} 
          stepLabels={["Wall Type", "Posters", "Colors", "Review"]}
        />

        {/* Content */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Review Your Configuration
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Review your selections before creating the interactive layout canvas.
            </p>
          </div>

          {/* Review Cards */}
          <div className="space-y-6 mb-12">
            {/* Wall Type */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Wall Type</h3>
                  <p className="text-muted-foreground capitalize">
                    {config.wallType || "Not selected"} Wall
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit("wall")}
                  className="flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Button>
              </div>
            </div>

            {/* Poster Configuration */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Poster Configuration</h3>
                  <div className="space-y-1 text-muted-foreground">
                    <p>📊 {config.count || "0"} poster{parseInt(config.count || "0") > 1 ? 's' : ''}</p>
                    <p>📏 {config.size || "Not selected"} cm</p>
                    <p className="flex items-center space-x-2">
                      <span>🎨</span>
                      {config.wallColor && (
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded border border-border" 
                            style={{ backgroundColor: wallColors[config.wallColor as keyof typeof wallColors]?.color }}
                          />
                          <span>{wallColors[config.wallColor as keyof typeof wallColors]?.label} wall</span>
                        </div>
                      )}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit("posters")}
                  className="flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Button>
              </div>
            </div>

            {/* Color Theme */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Color Theme</h3>
                  <p className="text-muted-foreground">
                    {config.theme ? colorThemes[config.theme as keyof typeof colorThemes] : "Not selected"}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit("colors")}
                  className="flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-12">
            <h3 className="text-lg font-semibold text-foreground mb-4">Ready to Create Your Layout!</h3>
            <p className="text-muted-foreground">
              Your interactive canvas will feature {config.count || "0"} draggable posters on a {config.wallType || "flat"} wall. 
              You'll be able to move posters around and see real-time distance measurements.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Colors</span>
            </Button>

            <Button
              onClick={handleCreateLayout}
              className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
            >
              <span>Create Interactive Layout</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}