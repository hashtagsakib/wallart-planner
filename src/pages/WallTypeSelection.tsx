import { useState } from "react";
import { ArrowRight, Home } from "lucide-react";
import { WallTypeCard } from "@/components/WallTypeCard";
import { StepIndicator } from "@/components/StepIndicator";
import flatWallImage from "@/assets/flat-wall.jpg";
import cornerWallImage from "@/assets/corner-wall.jpg";

export default function WallTypeSelection() {
  const [selectedWallType, setSelectedWallType] = useState<"flat" | "corner" | null>(null);

  const wallTypes = [
    {
      type: "flat" as const,
      title: "Flat Wall",
      description: "Perfect for creating clean, linear poster arrangements. Ideal for hallways, bedrooms, and living rooms.",
      image: flatWallImage,
    },
    {
      type: "corner" as const,
      title: "Corner Wall",
      description: "Great for maximizing space with L-shaped layouts. Perfect for home offices and creative spaces.",
      image: cornerWallImage,
    },
  ];

  const handleContinue = () => {
    if (selectedWallType) {
      // For now, just show an alert - will be replaced with navigation later
      alert(`Selected: ${selectedWallType} wall`);
    }
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
                <p className="text-sm text-muted-foreground">Design your perfect wall</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Step Indicator */}
        <StepIndicator 
          currentStep={1} 
          totalSteps={4} 
          stepLabels={["Wall Type", "Posters", "Colors", "Review"]}
        />

        {/* Content */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Wall Type
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the type of wall where you want to arrange your posters. 
              This will help us suggest the best layout options for your space.
            </p>
          </div>

          {/* Wall Type Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {wallTypes.map((wallType) => (
              <WallTypeCard
                key={wallType.type}
                type={wallType.type}
                title={wallType.title}
                description={wallType.description}
                image={wallType.image}
                selected={selectedWallType === wallType.type}
                onClick={() => setSelectedWallType(wallType.type)}
              />
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selectedWallType}
              className={`
                btn btn-lg px-8 transition-all duration-300 flex items-center space-x-2 mx-auto
                ${selectedWallType 
                  ? 'btn-primary hover:scale-105 shadow-soft' 
                  : 'btn-disabled cursor-not-allowed opacity-50'
                }
              `}
            >
              <span>Continue to Poster Selection</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            {!selectedWallType && (
              <p className="text-sm text-warning mt-4 animate-fade-in">
                Please select a wall type to continue
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Poster Layout Planner. Design your perfect space.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}