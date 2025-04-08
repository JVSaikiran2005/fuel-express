import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { createOrder } from '@/services/orderService';
import { Loader2, DollarSign, Truck, Droplets } from 'lucide-react';

const fuelTypes = [
  { value: 'petrol', label: 'Petrol', price: 1.5 },
  { value: 'diesel', label: 'Diesel', price: 1.3 },
  { value: 'premium', label: 'Premium', price: 1.8 },
];

const OrderForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form state
  const [fuelType, setFuelType] = useState(fuelTypes[0].value);
  const [quantity, setQuantity] = useState(50);
  const [address, setAddress] = useState('');
  const [extraNotes, setExtraNotes] = useState('');

  // Calculate price based on selected options
  const selectedFuelType = fuelTypes.find(type => type.value === fuelType);
  const pricePerLiter = selectedFuelType?.price || 1.5;
  const totalPrice = pricePerLiter * quantity;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!address.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }
    
    try {
      setLoading(true);
      
      // Make sure to pass the current user's ID when creating an order
      await createOrder({
        userId: currentUser.id,
        fuelType,
        quantity,
        deliveryAddress: address,
      });
      
      navigate('/history');
    } catch (error) {
      console.error('Error creating order:', error);
      // Toast error is shown in the service
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Order Fuel">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* Main order form */}
            <Card>
              <CardHeader>
                <CardTitle>New Fuel Order</CardTitle>
                <CardDescription>
                  Fill in the details below to place a new fuel delivery order
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fuel-type">Fuel Type</Label>
                  <Select 
                    value={fuelType} 
                    onValueChange={setFuelType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {fuelTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label} (${type.price.toFixed(2)}/L)
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label htmlFor="quantity">Quantity (Liters)</Label>
                    <span className="text-sm font-medium">{quantity} L</span>
                  </div>
                  
                  <Slider
                    id="quantity"
                    min={10}
                    max={500}
                    step={5}
                    value={[quantity]}
                    onValueChange={(values) => setQuantity(values[0])}
                    className="py-4"
                  />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>10 L</span>
                    <span>250 L</span>
                    <span>500 L</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea 
                    id="address" 
                    placeholder="Enter your complete delivery address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any special delivery instructions or notes..." 
                    value={extraNotes}
                    onChange={(e) => setExtraNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <span className="font-medium">{selectedFuelType?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per liter:</span>
                    <span className="font-medium">${pricePerLiter.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{quantity} liters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee:</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t my-3"></div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Place Order
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Policies and Information */}
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="grid gap-4 text-sm">
                  <div className="flex gap-3 items-start">
                    <div className="bg-primary/10 p-1.5 rounded">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Delivery Time</p>
                      <p className="text-muted-foreground">Orders are typically delivered within 24 hours.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="bg-primary/10 p-1.5 rounded">
                      <Droplets className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Fuel Quality</p>
                      <p className="text-muted-foreground">We provide high-quality, certified fuel that meets all industry standards.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default OrderForm;
