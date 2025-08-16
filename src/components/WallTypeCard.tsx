import { Check } from "lucide-react";

interface WallTypeCardProps {
  type: "flat" | "corner";
  title: string;
  description: string;
  image: string;
  selected: boolean;
  onClick: () => void;
}

export const WallTypeCard = ({ 
  type, 
  title, 
  description, 
  image, 
  selected, 
  onClick 
}: WallTypeCardProps) => {
  return (
    <div
      className={`
        relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 
        hover:shadow-soft hover:scale-105 animate-scale-in
        ${selected 
          ? 'border-primary bg-primary/5 shadow-lg' 
          : 'border-border bg-card hover:border-primary/50'
        }
      `}
      onClick={onClick}
    >
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-primary-foreground" />
        </div>
      )}

      {/* Wall Preview */}
      <div className="mb-6 h-48 rounded-xl overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Visual Enhancement */}
      <div className={`
        absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none
        ${selected ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl" />
      </div>
    </div>
  );
};