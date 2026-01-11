export interface OrderItemDTO {
  productVariantID: number;
  quantity: number;
}

export interface CreateOrderDTO {
  shippingAddress: string;
  paymentMethod: "COD" | "credit_card";
  items: OrderItemDTO[];
}

export interface UpdateOrderStatusDTO {
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
}
