// src/types/order.types.ts

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'ready' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded' 
  | 'partial';

export type PaymentMethod = 
  | 'cash' 
  | 'transfer' 
  | 'card' 
  | 'yappy' 
  | 'nequi' 
  | 'other';

export type DeliveryType = 'delivery' | 'pickup';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  discount: number;
  subtotal: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  province: string;
  references?: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_address: ShippingAddress;
  delivery_type: DeliveryType;
  delivery_date?: string;
  delivery_time_slot?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_notes?: string;
  admin_notes?: string;
  payment_reference?: string;
  paid_at?: string;
  tracking_number?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  id: number;
  order_id: number;
  previous_status?: string;
  new_status: string;
  notes?: string;
  changed_by?: number;
  createdAt?: string;
}

export interface CreateOrderPayload {
  payment_method: PaymentMethod;
  shipping_address: ShippingAddress;
  delivery_type: DeliveryType;
  delivery_date?: string;
  delivery_time_slot?: string;
  customer_notes?: string;
  payment_reference?: string;
}