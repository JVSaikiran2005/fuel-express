
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FuelOrder, 
  getUserOrders, 
  payForOrder, 
  updateOrderStatus 
} from '@/services/orderService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, AlertCircle, CreditCard, X, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<FuelOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<FuelOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<FuelOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userOrders = await getUserOrders(currentUser.id);
        setOrders(userOrders);
        setFilteredOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = orders.filter((order) => 
      order.fuelType.toLowerCase().includes(lowerCaseQuery) ||
      order.deliveryAddress.toLowerCase().includes(lowerCaseQuery) ||
      order.status.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const handleViewDetails = (order: FuelOrder) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handlePayment = async (orderId: string) => {
    if (!currentUser) return;
    
    try {
      setIsPaymentProcessing(true);
      await payForOrder(orderId, currentUser.id);
      
      // Update the order in the local state
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            paymentStatus: 'paid',
            status: 'processing'
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          paymentStatus: 'paid',
          status: 'processing'
        });
      }
      
      setIsDetailsOpen(false);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!currentUser) return;
    
    try {
      setIsCancelling(true);
      await updateOrderStatus(orderId, 'cancelled', currentUser.id);
      
      // Update the order in the local state
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'cancelled'
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: 'cancelled'
        });
      }
      
      setIsDetailsOpen(false);
    } catch (error) {
      console.error('Cancel failed:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadgeColor = (status: FuelOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  return (
    <MainLayout title="Order History">
      <div className="space-y-6">
        {/* Search and filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by fuel type, address, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Orders list */}
        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
            <CardDescription>
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-fuel-blue" />
              </div>
            ) : filteredOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {formatDate(order.createdAt).split(',')[0]}
                      </TableCell>
                      <TableCell>{order.fuelType}</TableCell>
                      <TableCell>{order.quantity} L</TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusBadgeColor(order.status)}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={order.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(order)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No orders found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try a different search term' : 'You haven\'t placed any orders yet'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Order details dialog */}
        {selectedOrder && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>
                  Order #{selectedOrder.id.substring(6, 13)} • {formatDate(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fuel Type</p>
                    <p className="font-medium">{selectedOrder.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{selectedOrder.quantity} Liters</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-medium">${selectedOrder.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge 
                      variant="outline" 
                      className={getStatusBadgeColor(selectedOrder.status)}
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Timeline</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-1 rounded-full">
                        <Calendar className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Order Created</p>
                        <p className="text-muted-foreground">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                    </div>
                    
                    {selectedOrder.createdAt !== selectedOrder.updatedAt && (
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-1 rounded-full">
                          <Calendar className="h-3 w-3 text-blue-600" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">Last Updated</p>
                          <p className="text-muted-foreground">{formatDate(selectedOrder.updatedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                {selectedOrder.status === 'pending' && selectedOrder.paymentStatus === 'unpaid' && (
                  <>
                    <Button
                      variant="outline"
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Cancel Order
                    </Button>
                    <Button
                      onClick={() => handlePayment(selectedOrder.id)}
                      disabled={isPaymentProcessing}
                    >
                      {isPaymentProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      Pay Now
                    </Button>
                  </>
                )}
                
                {selectedOrder.status === 'pending' && selectedOrder.paymentStatus === 'paid' && (
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    Cancel Order
                  </Button>
                )}
                
                {(selectedOrder.status === 'processing' || 
                  selectedOrder.status === 'delivered' ||
                  selectedOrder.status === 'cancelled') && (
                  <Button
                    variant="secondary"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Close
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderHistory;
