import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Package, Recycle, Star, Sparkles, Clock, Gift } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  refillPrice?: number;
  category: string;
  image: string;
  hasRefill: boolean;
  rewardPoints: number;
  brand?: string;
}

interface RefillNotificationDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RefillNotificationDialog = ({ product, open, onOpenChange }: RefillNotificationDialogProps) => {
  const { addToCart } = useCart();
  const { user, updateUser } = useAuth();
  
  if (!product || !product.hasRefill || !product.refillPrice || !user) return null;

  const refillPrice = product.refillPrice;
  const originalPrice = product.price;
  const savings = originalPrice - refillPrice;
  const rewardPoints = product.rewardPoints;

  // Check if user has enough points for free refill (100 points = free refill)
  const hasEnoughPoints = user.rewardPoints >= 100;
  const freeRefillPrice = hasEnoughPoints ? 0 : refillPrice;

  const handleRefillAdd = () => {
    addToCart({
      id: `${product.id}-refill`,
      productId: product.id,
      name: `${product.name} (Refill)`,
      type: 'refill',
      price: freeRefillPrice,
      originalPrice: refillPrice,
      image: product.image
    });
    
    if (hasEnoughPoints) {
      // Deduct points for free refill
      updateUser({ rewardPoints: user.rewardPoints - 100 });
      toast.success(`Free refill added! You used 100 reward points.`);
    } else {
      toast.success(`Refill added! You earned ${rewardPoints} reward points!`);
    }
    onOpenChange(false);
  };

  const handleOriginalAdd = () => {
    addToCart({
      id: `${product.id}-original`,
      productId: product.id,
      name: product.name,
      type: 'original',
      price: originalPrice,
      image: product.image
    });
    
    toast.success("Original product added to cart!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg animate-fade-in">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Recycle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">Time for a Refill!</DialogTitle>
              <p className="text-sm text-muted-foreground">Save money and help the environment</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-xl">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-background">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <Badge className="badge-primary mt-1">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Refill Option */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-full">
                <Recycle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-700 text-lg">Refill Option</h4>
                <p className="text-sm text-muted-foreground">Best value for repeat customers</p>
              </div>
              {hasEnoughPoints && (
                <Badge className="badge-success ml-auto">
                  <Gift className="h-3 w-3 mr-1" />
                  Free with Points!
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Refill Price:</span>
                <span className={hasEnoughPoints ? "line-through text-muted-foreground" : ""}>
                  ${refillPrice.toFixed(2)}
                </span>
              </div>
              {hasEnoughPoints && (
                <div className="flex justify-between text-green-600">
                  <span>With Reward Points:</span>
                  <span className="font-semibold">FREE!</span>
                </div>
              )}
              <div className="flex justify-between text-green-600">
                <span>You Save:</span>
                <span>${savings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Reward Points:</span>
                <span>+{rewardPoints} points</span>
              </div>
            </div>

            <div className="mt-3 flex items-center space-x-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Your current points: {user.rewardPoints}</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h5 className="font-semibold text-lg">Why choose refill?</h5>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="p-1 bg-green-100 rounded-full">
                  <Recycle className="h-4 w-4 text-green-600" />
                </div>
                <span>Save ${savings.toFixed(2)} compared to original</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="p-1 bg-yellow-100 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <span>Earn {rewardPoints} reward points</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="p-1 bg-purple-100 rounded-full">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <span>Help reduce plastic waste</span>
              </div>
              {hasEnoughPoints && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-1 bg-green-100 rounded-full">
                    <Gift className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Get it FREE with your reward points!</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="btn-primary w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              onClick={handleRefillAdd}
            >
              {hasEnoughPoints ? (
                <>
                  <Gift className="h-4 w-4 mr-2" />
                  Get Free Refill with Points
                </>
              ) : (
                <>
                  <Recycle className="h-4 w-4 mr-2" />
                  Add Refill - ${refillPrice.toFixed(2)}
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="btn-secondary w-full"
              onClick={handleOriginalAdd}
            >
              <Package className="h-4 w-4 mr-2" />
              Original Product - ${originalPrice.toFixed(2)}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            * Refills help you save money and protect the environment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 