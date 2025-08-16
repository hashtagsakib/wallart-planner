import { useState } from "react";
import { ArrowRight, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";

export default function PosterConfiguration() {
  const navigate = useNavigate();
  const [posterCount, setPosterCount] = useState<string>("");
  const [posterSize, setPosterSize] = useState<string>("");
  const [wallColor, setWallColor] = useState<string>("");
  const [showWarning, setShowWarning] = useState(false);

  const wallColors = [
    { value: "white", label: "White", color: "#FFFFFF" },
    { value: "beige", label: "Beige", color: "#F5F5DC" },
    { value: "lightgray", label: "Light Gray", color: "#D3D3D3" },
    { value: "darkgray", label: "Dark Gray", color: "#696969" },
    { value: "cream", label: "Cream", color: "#FFFDD0" },
    { value: "offwhite", label: "Off White", color: "#FAF0E6" },
    { value: "lightblue", label: "Light Blue", color: "#ADD8E6" },
    { value: "lightgreen", label: "Light Green", color: "#90EE90" },
  ];

  const posterSizes = [
    { value: "20x30", label: "20 x 30 cm" },
    { value: "30x40", label: "30 x 40 cm" },
    { value: "40x50", label: "40 x 50 cm" },
    { value: "50x70", label: "50 x 70 cm" },
    { value: "60x80", label: "60 x 80 cm" },
    { value: "70x100", label: "70 x 100 cm" },
  ];

  const handleBack = () => {
    navigate("/wall-type");
  };

  const handleContinue = () => {
    if (!posterCount || !posterSize || !wallColor) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    // Store configuration in localStorage for the canvas page
    localStorage.setItem("posterConfig", JSON.stringify({
      count: posterCount,
      size: posterSize,
      wallColor: wallColor
    }));
    navigate("/color-selection");
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
          currentStep={2} 
          totalSteps={4} 
          stepLabels={["Wall Type", "Posters", "Colors", "Review"]}
        />

        {/* Content */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Configure Your Posters
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the number of posters, their size, and your wall color. Maximum 15 posters allowed.
            </p>
          </div>

          {/* Configuration Form */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-12">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Poster Count */}
              <div className="space-y-3">
                <Label htmlFor="poster-count" className="text-lg font-semibold text-foreground">
                  Number of Posters
                </Label>
                <Select value={posterCount} onValueChange={setPosterCount}>
                  <SelectTrigger className="h-12 bg-background border-border">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} poster{num > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Poster Size */}
              <div className="space-y-3">
                <Label htmlFor="poster-size" className="text-lg font-semibold text-foreground">
                  Poster Size (cm)
                </Label>
                <Select value={posterSize} onValueChange={setPosterSize}>
                  <SelectTrigger className="h-12 bg-background border-border">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {posterSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Wall Color */}
              <div className="space-y-3">
                <Label htmlFor="wall-color" className="text-lg font-semibold text-foreground">
                  Wall Color
                </Label>
                <Select value={wallColor} onValueChange={setWallColor}>
                  <SelectTrigger className="h-12 bg-background border-border">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {wallColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded border border-border" 
                            style={{ backgroundColor: color.color }}
                          />
                          <span>{color.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview Section */}
            {posterCount && posterSize && wallColor && (
              <div className="mt-8 p-6 bg-background rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Configuration Preview</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>📊 {posterCount} poster{parseInt(posterCount) > 1 ? 's' : ''}</span>
                  <span>📏 {posterSizes.find(s => s.value === posterSize)?.label}</span>
                  <span>🎨 {wallColors.find(c => c.value === wallColor)?.label} wall</span>
                </div>
              </div>
            )}

            {/* Warning Message */}
            {showWarning && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
                <p className="text-warning text-center font-medium">
                  ⚠️ Please select all options to continue
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Wall Type</span>
            </Button>

            <Button
              onClick={handleContinue}
              className="flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}