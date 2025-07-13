import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Recycle, Leaf, Star, ShoppingBag } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <Badge className="badge-primary inline-flex items-center space-x-2">
                <Leaf className="h-4 w-4" />
                <span>Sustainability First</span>
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Refill, Reuse,{" "}
                <span className="text-gradient">
                  Reward
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Join the refill revolution and reduce waste while earning rewards. 
                Get smart notifications for refillable products and track your environmental impact.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-8 py-4"
              >
                <ShoppingBag className="mr-2 h-6 w-6" />
                Start Shopping
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center p-4 bg-card/50 rounded-xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-gradient">10k+</div>
                <div className="text-sm text-muted-foreground">Products Refilled</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-gradient">85%</div>
                <div className="text-sm text-muted-foreground">Waste Reduced</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-gradient">5k+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-up">
            <div className="card-hover p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Recycle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Smart Refill Alerts</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get timely notifications when it's time to refill your favorite products.
              </p>
            </div>

            <div className="card-hover p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-lg">Reward Points</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Earn points with every refill purchase and unlock free products.
              </p>
            </div>

            <div className="card-hover p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Combo Deals</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Special pricing for first-time buyers on product + refill combos.
              </p>
            </div>

            <div className="card-hover p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Leaf className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">Impact Tracking</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                See your positive environmental impact with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};