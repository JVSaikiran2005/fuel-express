
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, QrCode, IndianRupee, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentOptionsProps {
  amount: number;
  onPaymentComplete: (method: string) => void;
  onCancel: () => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  amount, 
  onPaymentComplete,
  onCancel
}) => {
  const [paymentTab, setPaymentTab] = useState<string>('phonepe');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv) {
      toast.error("Please fill in all card details");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete('card');
      toast.success("Payment successful!");
    }, 1500);
  };

  const handlePhonePePayment = () => {
    setIsProcessing(true);
    
    // Simulate QR code scanning and payment completion
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete('phonepe');
      toast.success("PhonePe payment successful!");
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5" />
          Payment
        </CardTitle>
        <CardDescription>
          Choose your preferred payment method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentTab} onValueChange={setPaymentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phonepe" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              PhonePe
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Card
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="phonepe" className="mt-4">
            <div className="text-center space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="mb-2 font-medium">Scan QR Code to Pay</p>
                <div className="border-2 border-dashed border-purple-300 p-4 rounded-lg mx-auto w-48 h-48 flex flex-col items-center justify-center">
                  {/* Fake QR code UI */}
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="bg-black h-3 w-3"></div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs">PhonePe QR Code</div>
                </div>
              </div>
              
              <div className="font-medium">
                Amount: <span className="text-lg"><IndianRupee className="inline h-4 w-4" />{amount.toFixed(2)}</span>
              </div>
              
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                disabled={isProcessing}
                onClick={handlePhonePePayment}
              >
                {isProcessing ? "Processing..." : "I've Completed the Payment"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="card" className="mt-4">
            <form onSubmit={handleCardPayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                  maxLength={19}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input 
                  id="cardName"
                  placeholder="John Doe"
                  value={cardDetails.cardName}
                  onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    maxLength={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv"
                    type="password"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    maxLength={4}
                  />
                </div>
              </div>
              
              <div className="font-medium text-center">
                Amount: <span className="text-lg"><IndianRupee className="inline h-4 w-4" />{amount.toFixed(2)}</span>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Pay Now"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentOptions;
