
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
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { createOrder, getFuelPrices } from '@/services/orderService';
import { Loader2, CreditCard, Truck, Droplets, IndianRupee, Phone, Mail } from 'lucide-react';

const fuelTypes = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
];

const paymentMethods = [
  { value: 'phonepe', label: 'PhonePe', icon: <Phone className="mr-2 h-4 w-4" /> },
  { value: 'credit_card', label: 'Credit Card', icon: <CreditCard className="mr-2 h-4 w-4" /> },
  { value: 'debit_card', label: 'Debit Card', icon: <CreditCard className="mr-2 h-4 w-4" /> },
  { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: <IndianRupee className="mr-2 h-4 w-4" /> },
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
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);

  // Get current fuel prices
  const fuelPrices = getFuelPrices();

  // Calculate price based on selected options
  const pricePerLiter = fuelPrices[fuelType as keyof typeof fuelPrices] || 102.50;
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
        paymentMethod: paymentMethod as any,
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
                            {type.label} (₹{fuelPrices[type.value as keyof typeof fuelPrices].toFixed(2)}/L)
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
                    min={1}
                    max={50}
                    step={1}
                    value={[quantity]}
                    onValueChange={(values) => setQuantity(values[0])}
                    className="py-4"
                  />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 L</span>
                    <span>25 L</span>
                    <span>50 L</span>
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

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                  >
                    {paymentMethods.map((method) => (
                      <div key={method.value} className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value={method.value} id={method.value} />
                        <Label htmlFor={method.value} className="flex items-center cursor-pointer">
                          {method.icon}
                          {method.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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
                    <span className="font-medium">{fuelType === 'petrol' ? 'Petrol' : 'Diesel'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per liter:</span>
                    <span className="font-medium flex items-center">
                      <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                      {pricePerLiter.toFixed(2)}
                    </span>
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
                    <span className="font-bold text-lg flex items-center">
                      <IndianRupee className="h-4 w-4 mr-0.5" />
                      {totalPrice.toFixed(2)}
                    </span>
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
                      <IndianRupee className="mr-2 h-4 w-4" />
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

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>
                  Get in touch with our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="grid gap-1">
                      <p className="text-sm text-muted-foreground">Email us:</p>
                      <p className="text-sm">5231412019@gvpcdpgc.edu.in</p>
                      <p className="text-sm">5231412017@gvpcdpgc.edu.in</p>
                      <p className="text-sm">5231412011@gvpcdpgc.edu.in</p>
                      <p className="text-sm">5231412060@gvpcdpgc.edu.in</p>
                      <p className="text-sm">5231412038@gvpcdpgc.edu.in</p>
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
