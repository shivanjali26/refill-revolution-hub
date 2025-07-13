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
  refillPrice?: number;
  category: string;
  image: string;
  hasRefill: boolean;
  rewardPoints: number;
  brand?: string;
}

interface ComboOfferDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ComboOfferDialog = ({ product, open, onOpenChange }: ComboOfferDialogProps) => {
  const { addToCart } = useCart();
  
  if (!product || !product.hasRefill || !product.refillPrice) return null;

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
      <DialogContent className="sm:max-w-lg animate-fade-in">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">Special First-Time Offer!</DialogTitle>
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

          {/* Combo Offer */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-primary text-lg">Combo Deal</h4>
                <p className="text-sm text-muted-foreground">Best value for first-time buyers</p>
              </div>
              <Badge className="badge-success ml-auto">
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
          <div className="space-y-4">
            <h5 className="font-semibold text-lg">Why choose the combo?</h5>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="p-1 bg-green-100 rounded-full">
                  <Recycle className="h-4 w-4 text-green-600" />
                </div>
                <span>Ready for your first refill when you need it</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="p-1 bg-yellow-100 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <span>Double reward points + bonus points</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="p-1 bg-purple-100 rounded-full">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <span>15% savings compared to buying separately</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="btn-primary w-full"
              onClick={handleComboAdd}
            >
              Add Combo to Cart - ${finalComboPrice.toFixed(2)}
            </Button>
            
            <Button 
              variant="outline" 
              className="btn-secondary w-full"
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