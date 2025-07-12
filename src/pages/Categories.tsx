import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Utensils, Home, Sparkles, Baby, Bath } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "cleaning",
    name: "Cleaning Supplies",
    icon: Sparkles,
    description: "Eco-friendly cleaning products with refillable options",
    productCount: 24,
    color: "bg-blue-500"
  },
  {
    id: "personal-care",
    name: "Personal Care",
    icon: Bath,
    description: "Shampoos, body washes, and skincare with refill packs",
    productCount: 18,
    color: "bg-pink-500"
  },
  {
    id: "kitchen",
    name: "Kitchen Essentials",
    icon: Utensils,
    description: "Dish soaps, hand sanitizers, and cooking oils",
    productCount: 15,
    color: "bg-orange-500"
  },
  {
    id: "beverages",
    name: "Beverages",
    icon: Droplets,
    description: "Water bottles, coffee pods, and drink mixes",
    productCount: 12,
    color: "bg-cyan-500"
  },
  {
    id: "home-care",
    name: "Home Care",
    icon: Home,
    description: "Air fresheners, fabric softeners, and floor cleaners",
    productCount: 20,
    color: "bg-green-500"
  },
  {
    id: "baby-care",
    name: "Baby Care",
    icon: Baby,
    description: "Baby shampoos, lotions, and gentle cleaning products",
    productCount: 8,
    color: "bg-purple-500"
  }
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Refillable Categories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our range of sustainable products across different categories. 
            Each category offers refillable options to reduce waste and save money.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${category.color} text-white group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {category.productCount} products
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{category.description}</p>
                  
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg border-l-2 border-primary">
                    <div className="text-sm text-primary font-medium">
                      Refill Benefits
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      • Save up to 30% on refill packs<br/>
                      • Reduce packaging waste<br/>
                      • Earn reward points
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sustainability Stats */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Our Environmental Impact</h2>
            <p className="text-muted-foreground">Together, we're making a difference</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Packages Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">2.5M</div>
              <div className="text-sm text-muted-foreground">Liters Water Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">Waste Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">15K</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;