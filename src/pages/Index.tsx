
import React from 'react';
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
  CardTitle,
} from '@/components/ui/card';
import { Truck, History, Droplets, IndianRupee } from 'lucide-react';
import NearbyStations from '@/components/NearbyStations';
import { getFuelPrices } from '@/services/orderService';

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fuelPrices = getFuelPrices();
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <MainLayout title="Dashboard">
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover-scale transition-transform duration-200 hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Droplets className="h-5 w-5 text-blue-600" />
                </div>
                Current Fuel Prices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>Petrol</span>
                  </div>
                  <div className="flex items-center font-semibold">
                    <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                    {fuelPrices.petrol.toFixed(2)}/L
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <span>Diesel</span>
                  </div>
                  <div className="flex items-center font-semibold">
                    <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                    {fuelPrices.diesel.toFixed(2)}/L
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-transform duration-200 hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Truck className="h-5 w-5 text-amber-600" />
                </div>
                Order Fuel
              </CardTitle>
              <CardDescription>Get fuel delivered to your doorstep</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Quick, convenient fuel delivery with online payment options.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/order')} className="w-full">
                Place Order
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover-scale transition-transform duration-200 hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <History className="h-5 w-5 text-purple-600" />
                </div>
                Order History
              </CardTitle>
              <CardDescription>View and manage your fuel orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Track deliveries and monitor past fuel purchases.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate('/history')} className="w-full">
                View Orders
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Nearby Stations Component */}
        <NearbyStations />
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Delivery Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45 minutes</div>
              <p className="text-xs text-muted-foreground mt-1">Within city limits</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Satisfied Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,000+</div>
              <p className="text-xs text-muted-foreground mt-1">Across major cities</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Delivery Partners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">350+</div>
              <p className="text-xs text-muted-foreground mt-1">Trained and certified</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
