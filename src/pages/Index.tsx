
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { getUserOrders, FuelOrder } from '@/services/orderService';
import { 
  Calendar, 
  Droplets, 
  Truck, 
  ShoppingBag, 
  TrendingUp
} from 'lucide-react';

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState<FuelOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingDeliveries: 0,
    totalLiters: 0
  });

  // If no user is logged in, redirect to login page
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const fetchOrders = async () => {
      try {
        if (!currentUser) return;
        
        const orders = await getUserOrders(currentUser.id);
        setRecentOrders(orders.slice(0, 3)); // Get only the 3 most recent orders
        
        // Calculate statistics
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const pendingDeliveries = orders.filter(
          order => order.status === 'pending' || order.status === 'processing'
        ).length;
        const totalLiters = orders.reduce((acc, order) => acc + order.quantity, 0);
        
        setStats({
          totalOrders,
          totalSpent,
          pendingDeliveries,
          totalLiters
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser, navigate]);

  return (
    <MainLayout title="Dashboard">
      <div className="grid gap-6">
        {/* Welcome message */}
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {currentUser?.name}
          </h2>
          <p className="text-muted-foreground">
            Here's an overview of your fuel orders and activity
          </p>
        </div>
        
        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Orders</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-fuel-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Fuel Ordered</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalLiters} L</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Droplets className="h-6 w-6 text-fuel-green" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Spent</p>
                  <h3 className="text-2xl font-bold mt-1">${stats.totalSpent.toFixed(2)}</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pending Deliveries</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.pendingDeliveries}</h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Truck className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest fuel orders and their status</CardDescription>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <p>Loading recent orders...</p>
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center p-3 border rounded-lg">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <Droplets className="h-5 w-5 text-fuel-blue" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {order.fuelType} - {order.quantity}L
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'}
                          `}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Droplets className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't placed any fuel orders yet
                </p>
                <Button onClick={() => navigate('/order')}>Order Fuel Now</Button>
              </div>
            )}
          </CardContent>
          
          {recentOrders.length > 0 && (
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/history')}>
                View All Orders
              </Button>
            </CardFooter>
          )}
        </Card>
        
        {/* Call-to-action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-fuel-blue to-fuel-accent text-white">
            <CardHeader>
              <CardTitle>Need Fuel?</CardTitle>
              <CardDescription className="text-blue-100">
                Order fuel delivery to your location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Get premium quality fuel delivered to your doorstep with our 
                quick and reliable service.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="secondary" 
                className="bg-white text-fuel-blue hover:bg-blue-50"
                onClick={() => navigate('/order')}
              >
                <Truck className="mr-2 h-4 w-4" />
                Order Now
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View and manage all your past fuel orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Track delivery status, review past orders, and manage your fuel deliveries easily.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline"
                onClick={() => navigate('/history')}
              >
                View Order History
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
