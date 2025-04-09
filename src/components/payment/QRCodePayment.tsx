
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Check, Copy, Phone, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodePaymentProps {
  amount: number;
  orderId: string;
  onComplete: () => void;
}

const QRCodePayment = ({ amount, orderId, onComplete }: QRCodePaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // UPI ID for demonstration - in a real app this would come from your backend
  const upiId = "fuelexpress@ybl";
  
  // Generate a fake payment reference for demo purposes
  const paymentRef = `FEXP${orderId.substring(6, 13)}`;
  
  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success("UPI ID copied to clipboard");
    setTimeout(() => setCopied(false), 3000);
  };
  
  const handleRefreshQR = () => {
    setIsLoading(true);
    // Simulate refreshing the QR code
    setTimeout(() => {
      setIsLoading(false);
      toast.success("QR code refreshed");
    }, 1000);
  };
  
  const handleCompletePayment = () => {
    onComplete();
    toast.success("Payment completed successfully");
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">PhonePe Payment</CardTitle>
        <CardDescription>
          Scan the QR code below with PhonePe to pay ₹{amount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="relative bg-white p-4 rounded-lg border">
            {isLoading ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <RefreshCcw className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="qr-code-container">
                {/* This would be an actual QR code in production */}
                <div className="w-48 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdHRlcm4gaWQ9InBhdHRlcm4tMSIgcGF0dGVybkNvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9ImJsYWNrIiAvPjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSJibGFjayIgLz48L3BhdHRlcm4+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjcGF0dGVybi0xKSIgLz48L3N2Zz4=')]"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg">
                  <Phone className="h-8 w-8 text-[#5f259f]" />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Payment Reference</p>
            <p className="font-medium">{paymentRef}</p>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <p className="font-medium">{upiId}</p>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleCopyUPI}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="text-blue-600 border-blue-200"
            onClick={handleRefreshQR}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh QR
              </>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={() => toast.info("Payment instructions sent to your email")}>
          Need Help?
        </Button>
        <Button onClick={handleCompletePayment}>
          I've Completed Payment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodePayment;
