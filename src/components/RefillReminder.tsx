import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Recycle, Clock, Star, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface RefillReminderProps {
  onAddToCart: (productId: string, type: 'refill' | 'original') => void;
}

export const RefillReminder = ({ onAddToCart }: RefillReminderProps) => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<any[]>([]);

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

  if (!user || reminders.length === 0) return null;

  const handleRefillClick = (productId: string, productName: string) => {
    onAddToCart(productId, 'refill');
    toast.success(`Refill for ${productName} added to cart!`);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-full">
          <Clock className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Time for Refills!</h3>
          <p className="text-sm text-muted-foreground">Products you purchased recently</p>
        </div>
        <Badge className="badge-warning ml-auto">
          {reminders.length} reminder{reminders.length > 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reminders.map((reminder, index) => (
          <Card 
            key={reminder.id} 
            className="card-hover border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-green-100 rounded-full">
                    <Recycle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-sm">{reminder.productName}</span>
                </div>
                <Badge variant="outline" className="text-xs bg-background/80">
                  {reminder.daysSincePurchase} days ago
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You purchased this {reminder.daysSincePurchase} days ago. 
                  Time for a refill to save money and help the environment!
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span>Earn extra reward points with refills</span>
                </div>
                <Button 
                  size="sm" 
                  className="btn-primary w-full"
                  onClick={() => handleRefillClick(reminder.productId, reminder.productName)}
                >
                  <Recycle className="h-3 w-3 mr-1" />
                  Add Refill
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 