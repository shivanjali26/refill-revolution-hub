import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  rewardPoints: number;
  isFirstTime: boolean;
  purchaseHistory: PurchaseItem[];
}

interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  type: 'original' | 'refill';
  quantity: number;
  price: number;
  purchaseDate: string;
  nextRefillDate?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addPurchase: (purchase: Omit<PurchaseItem, 'id' | 'purchaseDate'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('refillhub_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const savedUsers = JSON.parse(localStorage.getItem('refillhub_users') || '[]');
    const existingUser = savedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (existingUser) {
      const { password: _, ...userWithoutPassword } = existingUser;
      setUser(userWithoutPassword);
      localStorage.setItem('refillhub_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    const savedUsers = JSON.parse(localStorage.getItem('refillhub_users') || '[]');
    const existingUser = savedUsers.find((u: any) => u.email === email);
    
    if (existingUser) {
      return false; // User already exists
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      rewardPoints: 0,
      isFirstTime: true,
      purchaseHistory: []
    };

    savedUsers.push(newUser);
    localStorage.setItem('refillhub_users', JSON.stringify(savedUsers));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('refillhub_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('refillhub_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('refillhub_user', JSON.stringify(updatedUser));
    
    // Update in users array
    const savedUsers = JSON.parse(localStorage.getItem('refillhub_users') || '[]');
    const userIndex = savedUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      savedUsers[userIndex] = { ...savedUsers[userIndex], ...updates };
      localStorage.setItem('refillhub_users', JSON.stringify(savedUsers));
    }
  };

  const addPurchase = (purchase: Omit<PurchaseItem, 'id' | 'purchaseDate'>) => {
    if (!user) return;

    const newPurchase: PurchaseItem = {
      ...purchase,
      id: Date.now().toString(),
      purchaseDate: new Date().toISOString(),
      nextRefillDate: purchase.type === 'original' ? 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
    };

    const updatedHistory = [...user.purchaseHistory, newPurchase];
    const pointsEarned = purchase.type === 'refill' ? 20 : 10;
    
    updateUser({
      purchaseHistory: updatedHistory,
      rewardPoints: user.rewardPoints + pointsEarned,
      isFirstTime: false
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, addPurchase }}>
      {children}
    </AuthContext.Provider>
  );
};