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
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">EcoRefill</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/products" className="text-foreground/80 hover:text-foreground transition-colors">
                Products
              </Link>
              <Link to="/categories" className="text-foreground/80 hover:text-foreground transition-colors">
                Categories
              </Link>
              <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
                How it Works
              </a>
              <a href="#sustainability" className="text-foreground/80 hover:text-foreground transition-colors">
                Sustainability
              </a>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Reward Points */}
              {user && <div className="hidden sm:flex items-center space-x-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{user.rewardPoints}</span>
                  <span className="text-muted-foreground">pts</span>
                </div>}

              {/* Cart */}
              <Button variant="ghost" size="sm" className="relative" onClick={() => navigate('/cart')}>
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {itemCount}
                  </Badge>}
              </Button>

              {/* User Account */}
              {user ? <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                    <User className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div> : <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)}>
                  <User className="h-5 w-5" />
                </Button>}

              {/* CTA Button */}
              {!user && <Button className="hidden sm:inline-flex bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" onClick={() => setIsLoginOpen(true)}>
                  Get Started
                </Button>}
            </div>
          </div>
        </div>
      </nav>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>;
};