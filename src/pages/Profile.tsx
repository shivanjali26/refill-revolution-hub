import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Package, Bell, Gift, Calendar, Recycle } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Check for refill reminders
      const today = new Date();
      const upcomingRefills = user.purchaseHistory
        .filter(item => item.nextRefillDate)
        .filter(item => {
          const refillDate = new Date(item.nextRefillDate!);
          const daysUntilRefill = Math.ceil((refillDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          return daysUntilRefill <= 7 && daysUntilRefill >= 0;
        });

      setNotifications(upcomingRefills);
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const redeemRewards = () => {
    if (user.rewardPoints >= 100) {
      toast.success("Free refill product redeemed! Check your rewards.");
    } else {
      toast.error(`Need ${100 - user.rewardPoints} more points for free refill.`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <CardTitle>{user.name}</CardTitle>
                <p className="text-muted-foreground">{user.email}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Reward Points</span>
                  </div>
                  <Badge variant="secondary">{user.rewardPoints}</Badge>
                </div>
                
                <Button 
                  onClick={redeemRewards}
                  className="w-full"
                  disabled={user.rewardPoints < 100}
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Redeem Free Refill (100 pts)
                </Button>

                <Separator />

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{user.purchaseHistory.length}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            {notifications.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Refill Reminders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.map((item) => (
                    <div key={item.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        Refill due: {new Date(item.nextRefillDate!).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Purchase History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Purchase History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.purchaseHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No purchases yet</p>
                    </div>
                  ) : (
                    user.purchaseHistory.slice().reverse().map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{item.productName}</h3>
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
                              <span className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${item.price.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(item.purchaseDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        {item.nextRefillDate && (
                          <div className="mt-2 p-2 bg-primary/5 rounded border-l-2 border-primary">
                            <div className="text-sm text-primary">
                              Next refill recommended: {new Date(item.nextRefillDate).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;