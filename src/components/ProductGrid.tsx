import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart, Recycle, Package, Star } from "lucide-react";
import { ComboOfferDialog } from "./ComboOfferDialog";

interface Product {
  id: string;
  name: string;
  price: number;
  refillPrice: number;
  category: string;
  image: string;
  hasRefill: boolean;
  isPreviouslyPurchased: boolean;
  rewardPoints: number;
}

export const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showComboDialog, setShowComboDialog] = useState(false);

  const products: Product[] = [
    {
      id: "1",
      name: "Eco Laundry Detergent",
      price: 24.99,
      refillPrice: 18.99,
      category: "Home Care",
      image: "/placeholder.svg",
      hasRefill: true,
      isPreviouslyPurchased: false,
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
      isPreviouslyPurchased: true,
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
      isPreviouslyPurchased: false,
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
      isPreviouslyPurchased: true,
      rewardPoints: 18
    }
  ];

  const handleProductClick = (product: Product) => {
    if (!product.isPreviouslyPurchased) {
      setSelectedProduct(product);
      setShowComboDialog(true);
    }
  };

  const addToCart = (product: Product, isRefill = false) => {
    // TODO: Implement cart functionality
    console.log(`Added to cart: ${product.name} ${isRefill ? '(Refill)' : ''}`);
  };

  return (
    <>
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Refillable Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our range of sustainable products with smart refill options. 
              Save money and help the environment with every purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
                  {product.isPreviouslyPurchased ? (
                    <div className="w-full space-y-2">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, true);
                        }}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Buy Refill - ${product.refillPrice}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, false);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Original - ${product.price}
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View Combo Deal
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ComboOfferDialog 
        product={selectedProduct}
        open={showComboDialog}
        onOpenChange={setShowComboDialog}
        onAddToCart={addToCart}
      />
    </>
  );
};