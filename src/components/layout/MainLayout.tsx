
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, Truck, History, LogOut, Menu, X, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title = 'Fuel Express' 
}) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="mr-2 h-5 w-5" /> },
    { name: 'Order Fuel', path: '/order', icon: <Truck className="mr-2 h-5 w-5" /> },
    { name: 'Order History', path: '/history', icon: <History className="mr-2 h-5 w-5" /> },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-30 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-full"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <Logo size="md" />
        </div>
        
        <div className="flex flex-col justify-between flex-1 px-4 py-6">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-medium",
                  location.pathname === item.path && "bg-blue-50 text-fuel-blue"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
          </nav>
          
          <div className="space-y-4">
            <div className="px-4 py-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.email}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 z-20 transform transition-transform duration-300 lg:hidden",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col w-64 h-full bg-white border-r border-gray-200">
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <Logo size="md" />
          </div>
          
          <div className="flex flex-col justify-between flex-1 p-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-medium",
                    location.pathname === item.path && "bg-blue-50 text-fuel-blue"
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.icon}
                  {item.name}
                </Button>
              ))}
            </nav>
            
            <div className="space-y-4">
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser.email}
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        
        {/* Backdrop */}
        <div 
          className="absolute inset-0 -z-10 bg-gray-600 bg-opacity-75"
          onClick={() => setMobileMenuOpen(false)}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <h1 className="text-xl font-semibold">{title}</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        
        {/* Footer with Contact Information */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="h-4 w-4" />
            <span>Email us for support:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <span>5231412019@gvpcdpgc.edu.in</span>
            <span>5231412017@gvpcdpgc.edu.in</span>
            <span>5231412011@gvpcdpgc.edu.in</span>
            <span>5231412060@gvpcdpgc.edu.in</span>
            <span>5231412038@gvpcdpgc.edu.in</span>
          </div>
          <p className="mt-2">© 2025 Fuel Express. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
