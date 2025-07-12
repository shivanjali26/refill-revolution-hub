import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart, Recycle, Package, Star, Filter } from "lucide-react";
import { ComboOfferDialog } from "@/components/ComboOfferDialog";
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
  brand: string;
}

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showComboDialog, setShowComboDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const { user } = useAuth();
  const { addToCart } = useCart();

  const products: Product[] = [
    // Refillable products
    {
      id: "1",
      name: "Tide Laundry Detergent",
      price: 24.99,
      refillPrice: 18.99,
      category: "cleaning",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 25,
      brand: "Tide"
    },
    {
      id: "2",
      name: "Head & Shoulders Shampoo",
      price: 19.99,
      refillPrice: 14.99,
      category: "personal-care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 20,
      brand: "Head & Shoulders"
    },
    {
      id: "3",
      name: "Dove Hand Soap",
      price: 12.99,
      refillPrice: 8.99,
      category: "personal-care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 15,
      brand: "Dove"
    },
    {
      id: "4",
      name: "Dawn Dish Soap",
      price: 16.99,
      refillPrice: 11.99,
      category: "kitchen",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 18,
      brand: "Dawn"
    },
    {
      id: "5",
      name: "Colgate Toothpaste",
      price: 8.99,
      refillPrice: 6.99,
      category: "personal-care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 10,
      brand: "Colgate"
    },
    {
      id: "6",
      name: "Brita Water Filter",
      price: 29.99,
      refillPrice: 4.99,
      category: "beverages",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 30,
      brand: "Brita"
    },
    {
      id: "7",
      name: "Lysol All-Purpose Cleaner",
      price: 15.99,
      refillPrice: 10.99,
      category: "cleaning",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 16,
      brand: "Lysol"
    },
    {
      id: "8",
      name: "Johnson's Baby Shampoo",
      price: 18.99,
      refillPrice: 13.99,
      category: "baby-care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 19,
      brand: "Johnson's"
    },
    {
      id: "9",
      name: "Mr. Clean Floor Cleaner",
      price: 21.99,
      refillPrice: 16.99,
      category: "home-care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 22,
      brand: "Mr. Clean"
    },
    {
      id: "10",
      name: "Febreze Air Freshener",
      price: 13.99,
      refillPrice: 9.99,
      category: "home-care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 14,
      brand: "Febreze"
    },
    // Non-refillable products
    {
      id: "11",
      name: "Nike Memory Foam Pillow",
      price: 45.99,
      category: "home-care",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 10,
      brand: "Nike"
    },
    {
      id: "12",
      name: "Sherpa Fleece Blanket",
      price: 89.99,
      category: "home-care",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 15,
      brand: "Home Collection"
    },
    {
      id: "13",
      name: "Stainless Steel Water Bottle",
      price: 34.99,
      category: "beverages",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 8,
      brand: "Hydro Flask"
    },
    {
      id: "14",
      name: "Bamboo Cutting Board Set",
      price: 49.99,
      category: "kitchen",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 12,
      brand: "EcoChef"
    },
    {
      id: "15",
      name: "Organic Cotton Towel Set",
      price: 79.99,
      category: "personal-care",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 18,
      brand: "Luxury Living"
    }
  ];

  const categories = [
    { id: "all", name: "All Products" },
    { id: "cleaning", name: "Cleaning Supplies" },
    { id: "personal-care", name: "Personal Care" },
    { id: "kitchen", name: "Kitchen Essentials" },
    { id: "beverages", name: "Beverages" },
    { id: "home-care", name: "Home Care" },
    { id: "baby-care", name: "Baby Care" }
  ];

  // Set initial category from URL parameter
  useState(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  });

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleProductClick = (product: Product) => {
    if (!user) {
      toast.error("Please login to purchase products");
      return;
    }

    // If product is not refillable, just add to cart
    if (!product.hasRefill) {
      addToCart({
        id: `${product.id}-original`,
        productId: product.id,
        name: product.name,
        type: 'original',
        price: product.price,
        image: product.image
      });
      toast.success(`${product.name} added to cart!`);
      return;
    }

    const hasPurchased = user.purchaseHistory.some(
      item => item.productId === product.id && item.type === 'original'
    );

    if (user.isFirstTime || !hasPurchased) {
      setSelectedProduct(product);
      setShowComboDialog(true);
    } else {
      handleRefillOption(product);
    }
  };

  const handleRefillOption = (product: Product) => {
    const refillPrice = product.refillPrice || 0;
    
    toast.success(
      <div>
        <p>Welcome back! Choose your option:</p>
        <div className="flex gap-2 mt-2">
          <Button 
            size="sm" 
            onClick={() => {
              addToCart({
                id: `${product.id}-refill`,
                productId: product.id,
                name: `${product.name} (Refill)`,
                type: 'refill',
                price: refillPrice,
                originalPrice: product.price,
                image: product.image
              });
              toast.dismiss();
              toast.success(`You earned ${product.rewardPoints} reward points!`);
            }}
          >
            Refill ${refillPrice.toFixed(2)}
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              addToCart({
                id: `${product.id}-original`,
                productId: product.id,
                name: product.name,
                type: 'original',
                price: product.price,
                image: product.image
              });
              toast.dismiss();
            }}
          >
            Original ${product.price.toFixed(2)}
          </Button>
        </div>
      </div>,
      { duration: 5000 }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Refillable Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our complete range of sustainable products with smart refill options. 
            Save money and help the environment with every purchase.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
            <Filter className="h-4 w-4" />
            Filter by:
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
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
                        {categories.find(cat => cat.id === product.category)?.name || product.category}
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
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {product.brand}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${product.price}</span>
                      {product.hasRefill && (
                        <span className="text-sm text-green-600">
                          Refill available from ${product.refillPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>+{product.rewardPoints} points</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.hasRefill 
                      ? (user ? (hasPurchased ? 'Choose Option' : 'View Combo Deal') : 'Login to Purchase')
                      : 'Add to Cart'
                    }
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>

      <ComboOfferDialog 
        product={selectedProduct}
        open={showComboDialog}
        onOpenChange={setShowComboDialog}
      />
    </div>
  );
};

export default Products;