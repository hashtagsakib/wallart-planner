import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/button";

export default function PosterSelection() {
  const navigate = useNavigate();
  const [selectedPosters, setSelectedPosters] = useState<string[]>([]);

  const handleBack = () => {
    navigate("/wall-type");
  };

  const handleContinue = () => {
    if (selectedPosters.length > 0) {
      // Navigate to next step (colors selection)
      alert("Proceeding to color selection...");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Poster Layout Planner</h1>
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
              Select Your Posters
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose up to 15 posters for your wall layout. You can select different sizes and arrangements.
            </p>
          </div>

          {/* Placeholder for poster selection */}
          <div className="bg-card border border-border rounded-xl p-8 text-center mb-12">
            <p className="text-muted-foreground">Poster selection interface will be implemented here</p>
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
              disabled={selectedPosters.length === 0}
              className="flex items-center space-x-2"
            >
              <span>Continue to Colors</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}