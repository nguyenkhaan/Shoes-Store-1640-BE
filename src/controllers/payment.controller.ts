import { Request, Response } from "express";
import HttpStatus from "~/utlis/statusMap";
import { createPayment } from "~/services/payment.services";
import { cancelPayment } from "~/services/payment.services";

class PaymentController {
    static async processPayment(req: Request, res: Response) {
        try {
            const { orderID, paymentMethod } = req.body;
            if (paymentMethod !== 'COD' && paymentMethod !== 'credit_card') 
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false, 
                    message: "Payment method must be COD or credit_card"
                })
            // Chap nhan cac gia tri nhu "COD" và "Credit Card" 
            const responseData = await createPayment(Number(orderID), paymentMethod);
            
            return res.status(responseData.httpStatus).json(responseData);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL).json({
                success: false,
                message: "Internal Server Error during payment."
            });
        }
    }

    static async cancelPayment(req: Request, res: Response) {
    try {
        const { orderID } = req.body;
        const responseData = await cancelPayment(Number(orderID));
        return res.status(responseData.httpStatus).json(responseData);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}
}



export default PaymentController;