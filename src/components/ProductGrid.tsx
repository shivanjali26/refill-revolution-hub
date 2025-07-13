import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart, Recycle, Package, Star } from "lucide-react";
import { ComboOfferDialog } from "./ComboOfferDialog";
import { TopPopups } from "./TopPopups";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

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

export const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showComboDialog, setShowComboDialog] = useState(false);
  const [showRefillDialog, setShowRefillDialog] = useState(false);
  const [showChooseOption, setShowChooseOption] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();

  const products: Product[] = [
    {
      id: "1",
      name: "Eco Laundry Detergent",
      price: 24.99,
      refillPrice: 18.99,
      category: "Home Care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 25
    },
    {
      id: "2", 
      name: "Natural Shampoo",
      price: 19.99,
      refillPrice: 14.99,
      category: "Personal Care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 20
    },
    {
      id: "3",
      name: "Organic Hand Soap",
      price: 12.99,
      refillPrice: 8.99,
      category: "Personal Care", 
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 15
    },
    {
      id: "4",
      name: "Plant-Based Dish Soap",
      price: 16.99,
      refillPrice: 11.99,
      category: "Kitchen",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 18
    },
    {
      id: "5",
      name: "Bamboo Toothbrush",
      price: 8.99,
      refillPrice: 6.99,
      category: "Personal Care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 10
    },
    {
      id: "6",
      name: "Glass Water Bottle",
      price: 29.99,
      refillPrice: 4.99,
      category: "Beverages",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 30
    }
  ];

  const handleProductClick = (product: Product) => {
    if (!user) {
      toast.error("Please login to purchase products");
      return;
    }

    // Check if user has bought this product before
    const hasPurchased = user.purchaseHistory.some(
      item => item.productId === product.id && item.type === 'original'
    );

    if (user.isFirstTime || !hasPurchased) {
      setSelectedProduct(product);
      setShowComboDialog(true);
    } else {
      // Show refill option for returning customers
      setSelectedProduct(product);
      setShowRefillDialog(true);
    }
  };

  const handleAddToCart = (productId: string, type: 'refill' | 'original') => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (type === 'refill') {
      addToCart({
        id: `${productId}-refill`,
        productId: productId,
        name: `${product.name} (Refill)`,
        type: 'refill',
        price: product.refillPrice,
        originalPrice: product.price,
        image: product.image
      });
    } else {
      addToCart({
        id: `${productId}-original`,
        productId: productId,
        name: product.name,
        type: 'original',
        price: product.price,
        image: product.image
      });
    }
    
    // The TopPopups component will automatically detect cart changes and show alerts
  };

  return (
    <>
      <TopPopups
        selectedProduct={selectedProduct}
        showComboDialog={showComboDialog}
        showRefillDialog={showRefillDialog}
        showChooseOption={showChooseOption}
        onComboClose={() => setShowComboDialog(false)}
        onRefillClose={() => setShowRefillDialog(false)}
        onChooseOptionClose={() => setShowChooseOption(false)}
        onAddToCart={handleAddToCart}
        onChooseOption={(product) => {
          // This will be handled by the TopPopups component internally
        }}
      />

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Refillable Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our range of sustainable products with smart refill options. 
              Save money and help the environment with every purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const hasPurchased = user?.purchaseHistory.some(
                item => item.productId === product.id && item.type === 'original'
              );

              return (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm"
                  onClick={() => handleProductClick(product)}
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/90 text-primary-foreground">
                          {product.category}
                        </Badge>
                      </div>
                      {product.hasRefill && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <Recycle className="h-3 w-3 mr-1" />
                            Refillable
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Original:</span>
                        <span className="font-semibold">${product.price}</span>
                      </div>
                      {product.hasRefill && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Refill:</span>
                          <span className="font-semibold text-primary">${product.refillPrice}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>+{product.rewardPoints} points</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 space-y-2">
                    {hasPurchased ? (
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                          setShowChooseOption(true);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Choose Option
                      </Button>
                    ) : (
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {user ? 'View Combo Deal' : 'Login to Purchase'}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};