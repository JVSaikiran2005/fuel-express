
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
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardType, setCardType] = useState<'credit' | 'debit' | ''>('');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value
      .replace(/(.{4})/g, '$1 ')
      .trim();
    
    setCardDetails({...cardDetails, cardNumber: formattedValue});
    
    // Very basic card type detection based on first digit
    const firstDigit = value.charAt(0);
    if (firstDigit === '4' || firstDigit === '5') {
      setCardType('credit');
    } else if (firstDigit === '6') {
      setCardType('debit');
    } else {
      setCardType('');
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      let formattedValue = value;
      if (value.length > 2) {
        formattedValue = value.substring(0, 2) + '/' + value.substring(2);
      }
      setCardDetails({...cardDetails, expiry: formattedValue});
    }
  };

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv) {
      toast.error("Please fill in all card details");
      return;
    }

    if (cardDetails.cardNumber.length < 16) {
      toast.error("Please enter a valid card number");
      return;
    }

    if (!cardType) {
      toast.error("Unable to determine card type");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Show success message with card type
      toast.success(`${cardType.charAt(0).toUpperCase() + cardType.slice(1)} card payment successful!`);
      
      // Notify parent after a brief delay to show the success state
      setTimeout(() => {
        onPaymentComplete(cardType);
      }, 2000);
    }, 1500);
  };

  const handlePhonePePayment = () => {
    setIsProcessing(true);
    
    // Simulate QR code scanning and payment completion
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      toast.success("PhonePe payment successful!");
      
      // Notify parent after a brief delay to show the success state
      setTimeout(() => {
        onPaymentComplete('phonepe');
      }, 2000);
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
        {paymentSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-700">Payment Successful!</h3>
            <p className="text-gray-600">Your payment of <span className="font-medium"><IndianRupee className="inline h-4 w-4" />{amount.toFixed(2)}</span> has been processed successfully.</p>
            <p className="text-sm text-gray-500">A confirmation receipt has been sent to your email.</p>
          </div>
        ) : (
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
                  <div className="border-2 border-dashed border-purple-300 p-4 rounded-lg mx-auto w-48 h-48 flex items-center justify-center">
                    {/* Actual QR code UI with grid pattern */}
                    <div className="w-40 h-40 bg-white p-2 relative">
                      <div className="absolute top-2 left-2 w-7 h-7 border-4 border-purple-800 rounded-tl-sm"></div>
                      <div className="absolute top-2 right-2 w-7 h-7 border-4 border-purple-800 rounded-tr-sm"></div>
                      <div className="absolute bottom-2 left-2 w-7 h-7 border-4 border-purple-800 rounded-bl-sm"></div>
                      
                      <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-[1px]">
                        {Array.from({ length: 100 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`${Math.random() > 0.7 ? 'bg-purple-800' : 'bg-transparent'}`}
                          ></div>
                        ))}
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white p-1">
                        <div className="w-full h-full bg-gradient-to-br from-purple-700 to-purple-500 rounded-sm"></div>
                      </div>
                    </div>
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
                  <div className="relative">
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardDetails.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="pl-10"
                    />
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {cardType && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium px-2 py-1 rounded bg-gray-100">
                        {cardType.toUpperCase()}
                      </span>
                    )}
                  </div>
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
                      onChange={handleExpiryChange}
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
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '').substring(0, 4)})}
                      maxLength={4}
                    />
                  </div>
                </div>
                
                <div className="font-medium text-center">
                  Amount: <span className="text-lg"><IndianRupee className="inline h-4 w-4" />{amount.toFixed(2)}</span>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center gap-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <IndianRupee className="h-4 w-4" />
                      Pay Now
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter>
        {paymentSuccess ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => onCancel()}
          >
            Close
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentOptions;
