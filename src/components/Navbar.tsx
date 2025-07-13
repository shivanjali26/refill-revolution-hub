import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, Leaf, Star } from "lucide-react";
import { LoginDialog } from "./LoginDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
export const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const {
    user,
    logout
  } = useAuth();
  const {
    itemCount
  } = useCart();
  const navigate = useNavigate();
  return <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover-lift transition-all duration-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-elegant">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-gradient">EcoRefill</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/products" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Products
              </Link>
              <Link to="/categories" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Categories
              </Link>
              <a href="#how-it-works" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                How it Works
              </a>
              <a href="#sustainability" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Sustainability
              </a>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Reward Points */}
              {user && <div className="hidden sm:flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold text-yellow-700">{user.rewardPoints}</span>
                  <span className="text-yellow-600 text-xs">pts</span>
                </div>}

              {/* Cart */}
              <Button variant="ghost" size="sm" className="relative hover-lift" onClick={() => navigate('/cart')}>
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground">
                    {itemCount}
                  </Badge>}
              </Button>

              {/* User Account */}
              {user ? <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="hover-lift" onClick={() => navigate('/profile')}>
                    <User className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="sm" className="btn-secondary" onClick={logout}>
                    Logout
                  </Button>
                </div> : <Button variant="ghost" size="sm" className="hover-lift" onClick={() => setIsLoginOpen(true)}>
                  <User className="h-5 w-5" />
                </Button>}

              {/* CTA Button */}
              {!user && <Button className="hidden sm:inline-flex btn-primary" onClick={() => setIsLoginOpen(true)}>
                  Get Started
                </Button>}
            </div>
          </div>
        </div>
      </nav>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>;
};