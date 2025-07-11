import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Recycle, Leaf, Star, ShoppingBag } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="inline-flex items-center space-x-1 bg-primary/10 text-primary hover:bg-primary/20">
                <Leaf className="h-3 w-3" />
                <span>Sustainability First</span>
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Refill, Reuse,{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Reward
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Join the refill revolution and reduce waste while earning rewards. 
                Get smart notifications for refillable products and track your environmental impact.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Products Refilled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-sm text-muted-foreground">Waste Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5k+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Recycle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Smart Refill Alerts</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Get timely notifications when it's time to refill your favorite products.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Reward Points</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn points with every refill purchase and unlock free products.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Combo Deals</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Special pricing for first-time buyers on product + refill combos.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Impact Tracking</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                See your positive environmental impact with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};