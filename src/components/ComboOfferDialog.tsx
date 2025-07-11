import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Package, Recycle, Star, Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  refillPrice: number;
  category: string;
  image: string;
  hasRefill: boolean;
  rewardPoints: number;
}

interface ComboOfferDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ComboOfferDialog = ({ product, open, onOpenChange }: ComboOfferDialogProps) => {
  const { addToCart } = useCart();
  
  if (!product) return null;

  const comboPrice = product.price + product.refillPrice;
  const savings = comboPrice * 0.15; // 15% savings on combo
  const finalComboPrice = comboPrice - savings;
  const totalRewardPoints = product.rewardPoints * 2 + 50; // Bonus points for combo

  const handleComboAdd = () => {
    // Add combo pack to cart
    addToCart({
      id: `${product.id}-combo`,
      productId: product.id,
      name: `${product.name} + Refill Combo`,
      type: 'original',
      price: finalComboPrice,
      originalPrice: comboPrice,
      image: product.image
    });
    
    toast.success("Combo pack added to cart! You'll save money and help the environment.");
    onOpenChange(false);
  };

  const handleOriginalOnly = () => {
    addToCart({
      id: `${product.id}-original`,
      productId: product.id,
      name: product.name,
      type: 'original',
      price: product.price,
      image: product.image
    });
    
    toast.success("Product added to cart!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle className="text-xl">Special First-Time Offer!</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Combo Offer */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Package className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-primary">Combo Deal</h4>
              <Badge className="bg-green-100 text-green-700 text-xs">
                Save ${savings.toFixed(2)}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Original Product:</span>
                <span>${product.price}</span>
              </div>
              <div className="flex justify-between">
                <span>First Refill Pack:</span>
                <span>${product.refillPrice}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span>${comboPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Combo Discount (15%):</span>
                <span>-${savings.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-primary">${finalComboPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center space-x-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Earn {totalRewardPoints} reward points!</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h5 className="font-medium">Why choose the combo?</h5>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <Recycle className="h-4 w-4 text-green-600" />
                <span>Ready for your first refill when you need it</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Double reward points + bonus points</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>15% savings compared to buying separately</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={handleComboAdd}
            >
              Add Combo to Cart - ${finalComboPrice.toFixed(2)}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleOriginalOnly}
            >
              Just the Original - ${product.price}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            * You'll receive notifications when it's time for your next refill
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};