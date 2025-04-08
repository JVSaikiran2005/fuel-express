
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  // In a real app, you would integrate with a backend service
  // For this demo, we'll use localStorage to simulate user persistence
  const login = async (email: string, password: string) => {
    try {
      // Simulate API call with timeout
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get users from localStorage
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const user = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Create a sanitized user object without the password
      const authUser: User = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      
      setCurrentUser(authUser);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      toast.success('Logged in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing users
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if email already exists
      if (users.some((user: any) => user.email === email)) {
        throw new Error('Email already exists');
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name,
        email,
        password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
      };
      
      // Add user to "database"
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Create a sanitized user object without the password
      const authUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      
      // Log the user in
      setCurrentUser(authUser);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      
      toast.success('Account created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.info('Logged out');
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
