import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart, Recycle, Package, Star, Filter } from "lucide-react";
import { TopPopups } from "@/components/TopPopups";
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
  const [showRefillDialog, setShowRefillDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const { user } = useAuth();
  const { addToCart } = useCart();

  const products: Product[] = [
    // Refillable products - Real brands
    {
      id: "1",
      name: "Tide Original Laundry Detergent",
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
      name: "Head & Shoulders Anti-Dandruff Shampoo",
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
      name: "Dove Deep Moisture Body Wash",
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
      name: "Dawn Ultra Dishwashing Liquid",
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
      name: "Colgate Total Toothpaste",
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
      name: "Brita Premium Filtering Water Bottle",
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
      name: "Lysol Disinfectant Spray",
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
      name: "Mr. Clean Multi-Surface Cleaner",
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
      name: "Febreze Air Effects",
      price: 13.99,
      refillPrice: 9.99,
      category: "home-care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 14,
      brand: "Febreze"
    },
    {
      id: "11",
      name: "Crest Pro-Health Toothpaste",
      price: 9.99,
      refillPrice: 7.49,
      category: "personal-care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 12,
      brand: "Crest"
    },
    {
      id: "12",
      name: "Gain Laundry Detergent",
      price: 22.99,
      refillPrice: 17.99,
      category: "cleaning",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 23,
      brand: "Gain"
    },
    {
      id: "13",
      name: "Palmolive Dish Soap",
      price: 14.99,
      refillPrice: 10.99,
      category: "kitchen",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 17,
      brand: "Palmolive"
    },
    {
      id: "14",
      name: "Aveeno Daily Moisturizing Lotion",
      price: 16.99,
      refillPrice: 12.99,
      category: "personal-care",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 18,
      brand: "Aveeno"
    },
    {
      id: "15",
      name: "Clorox Bleach",
      price: 11.99,
      refillPrice: 8.99,
      category: "cleaning",
      image: "/placeholder.svg",
      hasRefill: true,
      rewardPoints: 15,
      brand: "Clorox"
    },
    // Non-refillable products
    {
      id: "16",
      name: "Nike Memory Foam Pillow",
      price: 45.99,
      category: "home-care",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 10,
      brand: "Nike"
    },
    {
      id: "17",
      name: "Sherpa Fleece Blanket",
      price: 89.99,
      category: "home-care",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 15,
      brand: "Home Collection"
    },
    {
      id: "18",
      name: "Hydro Flask Water Bottle",
      price: 34.99,
      category: "beverages",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 8,
      brand: "Hydro Flask"
    },
    {
      id: "19",
      name: "Bamboo Cutting Board Set",
      price: 49.99,
      category: "kitchen",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 12,
      brand: "EcoChef"
    },
    {
      id: "20",
      name: "Organic Cotton Towel Set",
      price: 79.99,
      category: "personal-care",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 18,
      brand: "Luxury Living"
    },
    {
      id: "21",
      name: "Samsung Smart TV 55\"",
      price: 599.99,
      category: "electronics",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 50,
      brand: "Samsung"
    },
    {
      id: "22",
      name: "Apple iPhone 15",
      price: 999.99,
      category: "electronics",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 100,
      brand: "Apple"
    },
    {
      id: "23",
      name: "Sony Wireless Headphones",
      price: 299.99,
      category: "electronics",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 30,
      brand: "Sony"
    },
    {
      id: "24",
      name: "KitchenAid Stand Mixer",
      price: 399.99,
      category: "kitchen",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 40,
      brand: "KitchenAid"
    },
    {
      id: "25",
      name: "Dyson V15 Vacuum Cleaner",
      price: 699.99,
      category: "home-care",
      image: "/placeholder.svg",
      hasRefill: false,
      rewardPoints: 70,
      brand: "Dyson"
    }
  ];

  const categories = [
    { id: "all", name: "All Products" },
    { id: "cleaning", name: "Cleaning Supplies" },
    { id: "personal-care", name: "Personal Care" },
    { id: "kitchen", name: "Kitchen Essentials" },
    { id: "beverages", name: "Beverages" },
    { id: "home-care", name: "Home Care" },
    { id: "baby-care", name: "Baby Care" },
    { id: "electronics", name: "Electronics" }
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

    // If product is not refillable, just add to cart without any popups
    if (!product.hasRefill) {
      addToCart({
        id: `${product.id}-original`,
        productId: product.id,
        name: product.name,
        type: 'original',
        price: product.price,
        image: product.image
      });
      // The TopPopups component will handle showing the "added to cart" alert
      return;
    }

    // For refillable products, check purchase history
    const hasPurchased = user.purchaseHistory.some(
      item => item.productId === product.id && item.type === 'original'
    );

    if (user.isFirstTime || !hasPurchased) {
      // First time user or never purchased this product
      setSelectedProduct(product);
      setShowComboDialog(true);
    } else {
      // Previously purchased - show refill notification
      setSelectedProduct(product);
      setShowRefillDialog(true);
    }
  };

  const handleReminderAddToCart = (productId: string, type: 'refill' | 'original') => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (type === 'refill' && product.hasRefill && product.refillPrice) {
      addToCart({
        id: `${product.id}-refill`,
        productId: product.id,
        name: `${product.name} (Refill)`,
        type: 'refill',
        price: product.refillPrice,
        originalPrice: product.price,
        image: product.image
      });
    } else {
      addToCart({
        id: `${product.id}-original`,
        productId: product.id,
        name: product.name,
        type: 'original',
        price: product.price,
        image: product.image
      });
    }
    // The TopPopups component will handle showing the "added to cart" alert
  };



  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6 text-gradient">
            Our Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our complete range of products with smart refill options for sustainable items. 
            Save money and help the environment with every purchase.
          </p>
        </div>

        {/* Top Popups - Floating over content */}
        <TopPopups 
          selectedProduct={selectedProduct}
          showComboDialog={showComboDialog}
          showRefillDialog={showRefillDialog}
          onComboClose={() => setShowComboDialog(false)}
          onRefillClose={() => setShowRefillDialog(false)}
          onAddToCart={handleReminderAddToCart}
        />

        {/* Category Filter */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filter by:
            </div>
            <div className="flex gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? 'shadow-elegant' 
                      : 'hover:shadow-soft'
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {filteredProducts.map((product, index) => {
            const hasPurchased = user?.purchaseHistory.some(
              item => item.productId === product.id && item.type === 'original'
            );

            return (
              <Card 
                key={product.id} 
                className="card-hover group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleProductClick(product)}
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <div className="aspect-square bg-gradient-to-br from-muted to-background flex items-center justify-center">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className="badge-primary">
                        {categories.find(cat => cat.id === product.category)?.name || product.category}
                      </Badge>
                    </div>
                    {product.hasRefill && (
                      <div className="absolute top-3 right-3">
                        <Badge className="badge-success">
                          <Recycle className="h-3 w-3 mr-1" />
                          Refillable
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                        {product.brand}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gradient">${product.price}</span>
                      {product.hasRefill && (
                        <span className="text-sm text-green-600 font-medium">
                          Refill from ${product.refillPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>+{product.rewardPoints} points</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button 
                    className="btn-primary w-full"
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

    </div>
  );
};

export default Products;