import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, Leaf, Star } from "lucide-react";
import { LoginDialog } from "./LoginDialog";

export const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cartCount] = useState(0);
  const [rewardPoints] = useState(150);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                RefillHub
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
                Products
              </a>
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
                Categories
              </a>
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
                How it Works
              </a>
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
                Sustainability
              </a>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Reward Points */}
              <div className="hidden sm:flex items-center space-x-1 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{rewardPoints}</span>
                <span className="text-muted-foreground">pts</span>
              </div>

              {/* Cart */}
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* User Account */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsLoginOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>

              {/* CTA Button */}
              <Button className="hidden sm:inline-flex bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
};