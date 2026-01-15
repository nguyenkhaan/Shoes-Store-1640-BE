import { Request, Response } from "express";
import HttpStatus from "~/utlis/statusMap";
import { JwtPayload } from "jsonwebtoken";
import * as orderService from "~/services/order.services";

class Order {
  // Tạo đơn hàng mới (User)
  static async createOrder(req: Request, res: Response) {
    const userID = Number((req.user as JwtPayload).userID);
    const { shippingAddress, paymentMethod, items } = req.body;
    //Validate payment method 
    if (paymentMethod != "COD" && paymentMethod != "credit_card") {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false, 
        message: "Payment method must be COD or credit_card"
      }) 
    }
    const parsedItems = Array.isArray(items)
      ? items.map((item: any) => ({
          productVariantID: Number(item.productVariantID),
          quantity: Number(item.quantity),
        }))
      : [];

    const responseData = await orderService.createOrder(userID, {
      shippingAddress,
      paymentMethod,
      items: parsedItems,
    });

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy đơn hàng của user (User)
  static async getMyOrders(req: Request, res: Response) {
    const userID = Number((req.user as JwtPayload).userID);
    const responseData = await orderService.getOrdersByUser(userID);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy chi tiết đơn hàng (User)
  static async getOrderByID(req: Request, res: Response) {
    const userID = Number((req.user as JwtPayload).userID);
    const orderID = Number(req.params.id);

    const responseData = await orderService.getOrderByID(orderID, userID);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy chi tiết đơn hàng (Admin)
  static async getOrderByIDAdmin(req: Request, res: Response) {
    const orderID = Number(req.params.id);

    const responseData = await orderService.getOrderByID(orderID);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Hủy đơn hàng (User)
  static async cancelOrder(req: Request, res: Response) {
    const userID = Number((req.user as JwtPayload).userID);
    const orderID = Number(req.params.id);
    const responseData = await orderService.cancelOrder(orderID, userID);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy tất cả đơn hàng (Admin)
  static async getAllOrders(req: Request, res: Response) {
    const responseData = await orderService.getAllOrders();

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Cập nhật trạng thái đơn hàng (Admin)
  static async updateOrderStatus(req: Request, res: Response) {
    const orderID = Number(req.params.id);
    const { status } = req.body;

    const responseData = await orderService.updateOrderStatus(orderID, status);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Cập nhật địa chỉ nhận hàng (User)
  static async updateShippingAddress(req: Request, res: Response) {
    const userID = Number((req.user as JwtPayload).userID);
    const orderID = Number(req.params.id);
    const { shippingAddress } = req.body;

    const responseData = await orderService.updateShippingAddress(orderID, userID, shippingAddress);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }
}

export default Order;
