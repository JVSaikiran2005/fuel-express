
import { toast } from 'sonner';

export interface FuelOrder {
  id: string;
  userId: string;
  fuelType: string;
  quantity: number;
  totalPrice: number;
  deliveryAddress: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod?: 'phonepe' | 'credit_card' | 'debit_card' | 'cash_on_delivery';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  userId: string;
  fuelType: string;
  quantity: number;
  deliveryAddress: string;
  paymentMethod?: 'phonepe' | 'credit_card' | 'debit_card' | 'cash_on_delivery';
}

// Helper function to get orders from localStorage
const getOrders = (): FuelOrder[] => {
  const orders = localStorage.getItem('fuelOrders');
  return orders ? JSON.parse(orders) : [];
};

// Helper function to save orders to localStorage
const saveOrders = (orders: FuelOrder[]) => {
  localStorage.setItem('fuelOrders', JSON.stringify(orders));
};

// Get current fuel prices
export const getFuelPrices = () => {
  // In a real app, these would come from an API or database
  return {
    'petrol': 102.50, // Price in ₹
    'diesel': 96.25,  // Price in ₹
  };
};

// Calculate price based on fuel type and quantity
const calculatePrice = (fuelType: string, quantity: number): number => {
  const fuelPrices = getFuelPrices();
  const pricePerLiter = fuelPrices[fuelType as keyof typeof fuelPrices] || 102.50;
  return parseFloat((pricePerLiter * quantity).toFixed(2));
};

// Create a new order
export const createOrder = async (orderData: CreateOrderData): Promise<FuelOrder> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const totalPrice = calculatePrice(orderData.fuelType, orderData.quantity);
    
    const newOrder: FuelOrder = {
      id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: orderData.userId,
      fuelType: orderData.fuelType,
      quantity: orderData.quantity,
      totalPrice,
      deliveryAddress: orderData.deliveryAddress,
      status: 'pending',
      paymentStatus: orderData.paymentMethod === 'cash_on_delivery' ? 'unpaid' : 'paid',
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const orders = getOrders();
    orders.push(newOrder);
    saveOrders(orders);
    
    toast.success('Order placed successfully');
    return newOrder;
  } catch (error: any) {
    toast.error(error.message || 'Failed to place order');
    throw error;
  }
};

// Get all orders for a specific user
export const getUserOrders = async (userId: string): Promise<FuelOrder[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orders = getOrders();
    // Make sure we're strictly comparing userId to only get the current user's orders
    return orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch orders');
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string, 
  status: FuelOrder['status'],
  userId: string
): Promise<FuelOrder> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    // Security check - ensure user owns this order
    if (orders[orderIndex].userId !== userId) {
      throw new Error('Unauthorized: This order belongs to another user');
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    
    saveOrders(orders);
    toast.success('Order updated successfully');
    return orders[orderIndex];
  } catch (error: any) {
    toast.error(error.message || 'Failed to update order');
    throw error;
  }
};

// Pay for an order
export const payForOrder = async (
  orderId: string, 
  userId: string, 
  paymentMethod: 'phonepe' | 'credit_card' | 'debit_card' | 'cash_on_delivery'
): Promise<FuelOrder> => {
  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    // Security check - ensure user owns this order
    if (orders[orderIndex].userId !== userId) {
      throw new Error('Unauthorized: This order belongs to another user');
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'unpaid' : 'paid',
      paymentMethod,
      status: 'processing',
      updatedAt: new Date().toISOString()
    };
    
    saveOrders(orders);
    toast.success('Payment successful');
    return orders[orderIndex];
  } catch (error: any) {
    toast.error(error.message || 'Payment failed');
    throw error;
  }
};
