import { ArrowRight, Home, Palette, Layout, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background" data-theme="interior">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="animate-fade-in">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-primary rounded-lg">
                  <Home className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-primary font-semibold">Poster Layout Planner</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Design Your
                <span className="gradient-warm bg-clip-text text-transparent"> Perfect Wall</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Plan and visualize beautiful poster layouts with my intuitive interior design tool. 
                Transform your space with professional-looking arrangements.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/wall-type"
                  className="btn btn-primary btn-lg px-8 flex items-center space-x-2 shadow-soft hover:scale-105 transition-transform"
                >
                  <span>Start Planning</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <button className="btn btn-outline btn-lg px-8">
                  View Examples
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-scale-in">
              <div className="relative rounded-2xl overflow-hidden shadow-soft">
                <img 
                  src={heroImage} 
                  alt="Interior design workspace"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">Smart Layouts</p>
                    <p className="text-xs text-muted-foreground">AI-powered suggestions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Design
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional tools made simple for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Layout,
                title: "Wall Types",
                description: "Choose between flat walls or corner arrangements for optimal layouts"
              },
              {
                icon: Palette,
                title: "Color Matching",
                description: "Select wall colors and see how they complement your poster choices"
              },
              {
                icon: Sparkles,
                title: "Smart Sizing",
                description: "Up to 15 posters with intelligent size recommendations"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-xl hover:bg-card transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Space?
            </h2>
           
            <Link 
              to="/wall-type"
              className="btn btn-primary btn-lg px-8 shadow-soft hover:scale-105 transition-transform"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
