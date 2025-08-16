import { useState } from "react";
import { ArrowRight, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function ColorSelection() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<string>("");

  const colorThemes = [
    {
      id: "classic",
      name: "Classic Dark",
      description: "Traditional dark gray posters",
      posterColor: "#4A4A4A",
      frameColor: "#2A2A2A"
    },
    {
      id: "modern",
      name: "Modern Black",
      description: "Sleek black frames",
      posterColor: "#3A3A3A",
      frameColor: "#1A1A1A"
    },
    {
      id: "minimal",
      name: "Minimal Gray",
      description: "Light gray aesthetic",
      posterColor: "#6A6A6A",
      frameColor: "#4A4A4A"
    },
    {
      id: "elegant",
      name: "Elegant Charcoal",
      description: "Sophisticated charcoal tones",
      posterColor: "#505050",
      frameColor: "#303030"
    }
  ];

  const handleBack = () => {
    navigate("/poster-selection");
  };

  const handleContinue = () => {
    if (!selectedTheme) {
      return;
    }
    
    // Store color theme in localStorage
    const existingConfig = JSON.parse(localStorage.getItem("posterConfig") || "{}");
    localStorage.setItem("posterConfig", JSON.stringify({
      ...existingConfig,
      theme: selectedTheme
    }));
    
    navigate("/review");
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
          currentStep={3} 
          totalSteps={4} 
          stepLabels={["Wall Type", "Posters", "Colors", "Review"]}
        />

        {/* Content */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Poster Colors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the color theme for your posters. All posters will use the same color scheme.
            </p>
          </div>

          {/* Color Theme Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {colorThemes.map((theme) => (
              <div
                key={theme.id}
                className={`
                  relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 
                  hover:shadow-elegant hover:scale-105 animate-scale-in
                  ${selectedTheme === theme.id
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-border bg-card hover:border-primary/50'
                  }
                `}
                onClick={() => setSelectedTheme(theme.id)}
              >
                {/* Color Preview */}
                <div className="mb-6 flex items-center justify-center space-x-4">
                  <div className="flex space-x-2">
                    {/* Mini poster previews */}
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-10 rounded border-2"
                        style={{ 
                          backgroundColor: theme.posterColor,
                          borderColor: theme.frameColor
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {theme.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {theme.description}
                  </p>
                </div>

                {/* Selection Indicator */}
                {selectedTheme === theme.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Configuration</span>
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!selectedTheme}
              className="flex items-center space-x-2"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}