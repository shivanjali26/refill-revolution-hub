import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Package, Recycle, Star, Sparkles, Clock, Gift, X, ShoppingCart, CheckCircle } from "lucide-react";
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

interface TopPopupsProps {
  selectedProduct: Product | null;
  showComboDialog: boolean;
  showRefillDialog: boolean;
  showChooseOption?: boolean;
  onComboClose: () => void;
  onRefillClose: () => void;
  onChooseOptionClose?: () => void;
  onAddToCart: (productId: string, type: 'refill' | 'original') => void;
  onChooseOption?: (product: Product) => void;
}

interface CartAlert {
  id: string;
  type: 'added-to-cart' | 'choose-option' | 'combo-offer' | 'refill-notification';
  message: string;
  product?: Product;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  }[];
  timestamp: number;
}

export const TopPopups = ({ 
  selectedProduct, 
  showComboDialog, 
  showRefillDialog, 
  showChooseOption = false,
  onComboClose, 
  onRefillClose,
  onChooseOptionClose,
  onAddToCart,
  onChooseOption
}: TopPopupsProps) => {
  const { user } = useAuth();
  const { items } = useCart();
  const [reminders, setReminders] = useState<any[]>([]);
  const [cartAlerts, setCartAlerts] = useState<CartAlert[]>([]);
  const [lastCartLength, setLastCartLength] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Check for products that need refills based on purchase history
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const refillReminders = user.purchaseHistory
      .filter(purchase => 
        purchase.type === 'original' && 
        new Date(purchase.purchaseDate) < thirtyDaysAgo
      )
      .map(purchase => ({
        ...purchase,
        daysSincePurchase: Math.floor((now.getTime() - new Date(purchase.purchaseDate).getTime()) / (24 * 60 * 60 * 1000))
      }))
      .slice(0, 3); // Show top 3 reminders

    setReminders(refillReminders);
  }, [user]);

  // Add cart alert
  const addCartAlert = (alert: Omit<CartAlert, 'id' | 'timestamp'>) => {
    const newAlert: CartAlert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setCartAlerts(prev => [newAlert, ...prev.slice(0, 4)]); // Keep max 5 alerts
  };

  // Remove cart alert
  const removeCartAlert = (id: string) => {
    setCartAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Auto-remove alerts after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCartAlerts(prev => prev.filter(alert => Date.now() - alert.timestamp < 8000));
    }, 1000);

    return () => clearTimeout(timer);
  }, [cartAlerts]);

  // Detect when items are added to cart and show alerts
  useEffect(() => {
    if (items.length > lastCartLength && items.length > 0) {
      const latestItem = items[items.length - 1];
      addCartAlert({
        type: 'added-to-cart',
        message: `${latestItem.name} added to cart!`,
        product: {
          id: latestItem.productId,
          name: latestItem.name,
          price: latestItem.price,
          category: '',
          image: latestItem.image,
          hasRefill: latestItem.type === 'refill',
          rewardPoints: 0
        }
      });
    }
    setLastCartLength(items.length);
  }, [items, lastCartLength]);

  const handleRefillClick = (productId: string, productName: string) => {
    onAddToCart(productId, 'refill');
    // The automatic cart detection will handle the alert
  };



  const handleChooseOption = (product: Product) => {
    addCartAlert({
      type: 'choose-option',
      message: `Welcome back! Choose your option for ${product.name}:`,
      product,
      actions: [
        {
          label: `Refill $${product.refillPrice?.toFixed(2)}`,
          onClick: () => {
            onAddToCart(product.id, 'refill');
            removeCartAlert('choose-option');
          }
        },
        {
          label: `Original $${product.price.toFixed(2)}`,
          onClick: () => {
            onAddToCart(product.id, 'original');
            removeCartAlert('choose-option');
          },
          variant: 'outline'
        }
      ]
    });
  };

  // Call handleChooseOption when showChooseOption is true
  useEffect(() => {
    if (showChooseOption && selectedProduct) {
      handleChooseOption(selectedProduct);
      onChooseOptionClose?.();
    }
  }, [showChooseOption, selectedProduct, onChooseOptionClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4 space-y-4">
      {/* Cart Alerts */}
      {cartAlerts.map((alert) => (
        <Card 
          key={alert.id}
          className={`card-hover animate-fade-in shadow-2xl backdrop-blur-sm bg-background/95 ${
            alert.type === 'added-to-cart' 
              ? 'border-green-200 bg-gradient-to-r from-green-50/95 to-green-100/95'
              : alert.type === 'choose-option'
              ? 'border-blue-200 bg-gradient-to-r from-blue-50/95 to-blue-100/95'
              : 'border-primary/20 bg-gradient-to-r from-primary/5/95 to-primary/10/95'
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  alert.type === 'added-to-cart' 
                    ? 'bg-green-100'
                    : alert.type === 'choose-option'
                    ? 'bg-blue-100'
                    : 'bg-primary/10'
                }`}>
                  {alert.type === 'added-to-cart' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : alert.type === 'choose-option' ? (
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {alert.type === 'added-to-cart' ? 'Added to Cart!' :
                     alert.type === 'choose-option' ? 'Choose Your Option' :
                     'Special Offer!'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeCartAlert(alert.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          {alert.actions && (
            <CardContent className="pt-0">
              <div className="flex gap-3">
                {alert.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'default'}
                    className={action.variant === 'outline' ? 'btn-secondary' : 'btn-primary'}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {/* Refill Reminders */}
      {reminders.length > 0 && (
        <Card className="card-hover border-orange-200 bg-gradient-to-br from-orange-50/95 to-orange-100/95 animate-fade-in shadow-2xl backdrop-blur-sm bg-background/95">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Time for Refills!</h3>
                  <p className="text-sm text-muted-foreground">Products you purchased recently</p>
                </div>
                <Badge className="badge-warning">
                  {reminders.length} reminder{reminders.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reminders.map((reminder, index) => (
                <div 
                  key={reminder.id} 
                  className="flex items-center justify-between p-3 bg-white/50 rounded-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1 bg-green-100 rounded-full">
                      <Recycle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium text-sm">{reminder.productName}</span>
                      <div className="text-xs text-muted-foreground">
                        {reminder.daysSincePurchase} days ago
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="btn-primary"
                    onClick={() => {
                      handleRefillClick(reminder.productId, reminder.productName);
                      // The automatic cart detection will handle the alert
                    }}
                  >
                    <Recycle className="h-3 w-3 mr-1" />
                    Add Refill
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Combo Offer Dialog */}
      {showComboDialog && selectedProduct && (
        <Card className="card-hover border-primary/20 bg-gradient-to-r from-primary/5/95 to-primary/10/95 animate-fade-in shadow-2xl backdrop-blur-sm bg-background/95">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Special First-Time Offer!</h3>
                  <p className="text-sm text-muted-foreground">Save money and help the environment</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onComboClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Info */}
            <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-background">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                <Badge className="badge-primary mt-1">
                  {selectedProduct.category}
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
                  Save ${((selectedProduct.price + (selectedProduct.refillPrice || 0)) * 0.15).toFixed(2)}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Original Product:</span>
                  <span>${selectedProduct.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>First Refill Pack:</span>
                  <span>${selectedProduct.refillPrice}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>${(selectedProduct.price + (selectedProduct.refillPrice || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Combo Discount (15%):</span>
                  <span>-${((selectedProduct.price + (selectedProduct.refillPrice || 0)) * 0.15).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">${((selectedProduct.price + (selectedProduct.refillPrice || 0)) * 0.85).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button 
                  className="btn-primary flex-1"
                  onClick={() => {
                    onAddToCart(selectedProduct.id, 'original');
                    onComboClose();
                    // The automatic cart detection will handle the alert
                  }}
                >
                  Add Combo to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-secondary flex-1"
                  onClick={() => {
                    onAddToCart(selectedProduct.id, 'original');
                    onComboClose();
                    // The automatic cart detection will handle the alert
                  }}
                >
                  Just the Original
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refill Notification Dialog */}
      {showRefillDialog && selectedProduct && (
        <Card className="card-hover border-green-200 bg-gradient-to-r from-green-50/95 to-green-100/95 animate-fade-in shadow-2xl backdrop-blur-sm bg-background/95">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Time for a Refill!</h3>
                  <p className="text-sm text-muted-foreground">Save money and help the environment</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onRefillClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Info */}
            <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-background">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                <Badge className="badge-primary mt-1">
                  {selectedProduct.category}
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
                {user && user.rewardPoints >= 100 && (
                  <Badge className="badge-success ml-auto">
                    <Gift className="h-3 w-3 mr-1" />
                    Free with Points!
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Refill Price:</span>
                  <span className={user && user.rewardPoints >= 100 ? "line-through text-muted-foreground" : ""}>
                    ${selectedProduct.refillPrice?.toFixed(2)}
                  </span>
                </div>
                {user && user.rewardPoints >= 100 && (
                  <div className="flex justify-between text-green-600">
                    <span>With Reward Points:</span>
                    <span className="font-semibold">FREE!</span>
                  </div>
                )}
                <div className="flex justify-between text-green-600">
                  <span>You Save:</span>
                  <span>${(selectedProduct.price - (selectedProduct.refillPrice || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Reward Points:</span>
                  <span>+{selectedProduct.rewardPoints} points</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button 
                  className="btn-primary flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  onClick={() => {
                    onAddToCart(selectedProduct.id, 'refill');
                    onRefillClose();
                    // The automatic cart detection will handle the alert
                  }}
                >
                  {user && user.rewardPoints >= 100 ? (
                    <>
                      <Gift className="h-4 w-4 mr-2" />
                      Get Free Refill with Points
                    </>
                  ) : (
                    <>
                      <Recycle className="h-4 w-4 mr-2" />
                      Add Refill - ${selectedProduct.refillPrice?.toFixed(2)}
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-secondary flex-1"
                  onClick={() => {
                    onAddToCart(selectedProduct.id, 'original');
                    onRefillClose();
                    // The automatic cart detection will handle the alert
                  }}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Original Product
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 