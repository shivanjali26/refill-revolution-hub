import { Navbar } from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, Recycle } from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const { user, addPurchase } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Process each item
    items.forEach(item => {
      addPurchase({
        productId: item.productId,
        productName: item.name,
        type: item.type,
        quantity: item.quantity,
        price: item.price * item.quantity
      });
    });

    clearCart();
    toast.success("Order placed successfully! Check your profile for details.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Shopping Cart ({itemCount} items)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 border rounded-lg p-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={item.type === 'refill' ? 'default' : 'secondary'}>
                              {item.type === 'refill' ? (
                                <>
                                  <Recycle className="h-3 w-3 mr-1" />
                                  Refill
                                </>
                              ) : (
                                'Original'
                              )}
                            </Badge>
                            {item.originalPrice && item.price < item.originalPrice && (
                              <Badge variant="destructive" className="text-xs">
                                ${item.originalPrice - item.price} OFF
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-lg font-semibold">${item.price.toFixed(2)}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-primary">Free</span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  Earn {items.reduce((points, item) => points + (item.type === 'refill' ? 20 : 10) * item.quantity, 0)} reward points with this order
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  disabled={items.length === 0}
                >
                  Place Order
                </Button>

                {items.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Sustainability Impact */}
            {items.some(item => item.type === 'refill') && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center space-x-2">
                    <Recycle className="h-5 w-5" />
                    <span>Environmental Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {items.filter(item => item.type === 'refill').reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Packages saved from landfill
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;