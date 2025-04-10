
import React, { useState } from 'react';
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
import { Truck, History, Droplets, IndianRupee, ArrowRight } from 'lucide-react';
import NearbyStations from '@/components/NearbyStations';
import { getFuelPrices } from '@/services/orderService';
import PaymentOptions from '@/components/PaymentOptions';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fuelPrices = getFuelPrices();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleQuickRecharge = (amount: number) => {
    setSelectedAmount(amount);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (method: string) => {
    setShowPaymentModal(false);
    toast.success(`Successfully recharged ₹${selectedAmount} using ${method === 'phonepe' ? 'PhonePe' : 'card'}`);
  };

  return (
    <MainLayout title="Dashboard">
      <div className="grid gap-6">
        {/* Hero Section with Fuel Attendant Image */}
        <Card className="relative overflow-hidden border-none shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700"></div>
          <div className="relative grid md:grid-cols-2 gap-4 p-6 md:p-8">
            <div className="flex flex-col justify-center text-white space-y-4">
              <h1 className="text-3xl font-bold">Premium Fuel Delivered to Your Door</h1>
              <p className="text-blue-100">
                Skip the gas station queues. Order fuel online and get it delivered right where you need it.
              </p>
              <Button 
                onClick={() => navigate('/order')} 
                size="lg"
                className="bg-white text-blue-800 hover:bg-blue-50 w-fit mt-4 group"
              >
                Order Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="flex justify-center items-center">
              <img 
                src="https://images.unsplash.com/photo-1617471346061-5d329ab9c574?w=800&auto=format&fit=crop&q=80" 
                alt="Fuel Attendant" 
                className="rounded-lg shadow-md max-h-64 object-cover"
              />
            </div>
          </div>
        </Card>

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

        {/* Quick Payment Options */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Recharge</CardTitle>
            <CardDescription>Add funds to your fuel wallet for faster checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[500, 1000, 2000].map((amount) => (
                <Button 
                  key={amount} 
                  variant="outline"
                  className="h-20 flex flex-col"
                  onClick={() => handleQuickRecharge(amount)}
                >
                  <span className="text-lg font-semibold flex items-center">
                    <IndianRupee className="h-4 w-4 mr-0.5" />{amount}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">Tap to recharge</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

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

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md p-0">
          <PaymentOptions 
            amount={selectedAmount} 
            onPaymentComplete={handlePaymentComplete} 
            onCancel={() => setShowPaymentModal(false)} 
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Index;
