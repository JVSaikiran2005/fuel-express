
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Clock, Shield, MapPin, Droplets, CalendarClock, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  
  // If user is already logged in, redirect to home
  React.useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      await login(loginEmail, loginPassword);
      navigate('/');
    } catch (error) {
      // Error is handled in the auth context
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      await signup(signupName, signupEmail, signupPassword);
      navigate('/');
    } catch (error) {
      // Error is handled in the auth context
    }
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-800 to-blue-500 flex flex-col items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1551223496-62c6294d4e38?q=80&w=3270&auto=format&fit=crop" 
          alt="Fuel Station" 
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-blue-900/70 mix-blend-multiply"></div>
      </div>

      <div className="container mx-auto grid md:grid-cols-2 gap-8 max-w-6xl z-10">
        <div className="text-white space-y-8">
          <div className="text-center md:text-left mb-8">
            <Logo size="lg" className="mx-auto md:mx-0 mb-4" />
            <p className="text-blue-100">Your premium fuel delivery service</p>
          </div>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Why Choose Fuel Express</h2>
              <p className="text-blue-100 mb-6">Our service offers unique benefits designed for your convenience and peace of mind</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Time-Saving</h3>
                    <p className="text-sm text-blue-100">Skip the gas station lines and let us bring the fuel to you.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Safety First</h3>
                    <p className="text-sm text-blue-100">Our professional drivers follow strict safety protocols.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Real-Time Tracking</h3>
                    <p className="text-sm text-blue-100">Monitor your delivery in real-time for complete transparency.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    <Droplets className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Quality Fuel</h3>
                    <p className="text-sm text-blue-100">We deliver high-quality fuel that meets all industry standards.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    <CalendarClock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Convenient Scheduling</h3>
                    <p className="text-sm text-blue-100">Schedule deliveries in advance or request immediate service.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    <IndianRupee className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Transparent Pricing</h3>
                    <p className="text-sm text-blue-100">Clear and upfront pricing with no hidden fees or surprises.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-3">Ready to Order Fuel?</h2>
              <p className="text-blue-100 mb-6">Experience the convenience of fuel delivery right to your location</p>
              <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50" onClick={() => navigate('/order')}>
                Order Now
              </Button>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-md mx-auto">          
          <Card className="w-full shadow-xl backdrop-blur-sm bg-white/95">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input 
                        id="password" 
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className={cn(
                        "w-full bg-blue-700 hover:bg-blue-800", 
                        isLoading && "opacity-80"
                      )}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                      Enter your details to create a new account
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)} 
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="your@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className={cn(
                        "w-full bg-blue-700 hover:bg-blue-800", 
                        isLoading && "opacity-80"
                      )}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <p className="text-center mt-4 text-white text-sm">
            © 2025 Fuel Express. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
