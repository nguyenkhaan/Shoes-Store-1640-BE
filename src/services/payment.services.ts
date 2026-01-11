import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";

export const createPayment = async (orderID: number, paymentMethod: string) => {
    try {
        // 1. Kiemm tra don hang co ton tai khong
        const order = await prisma.order.findUnique({ where: { id: orderID } });
        if (!order) {
            return {
                httpStatus: HttpStatus.NOT_FOUND,
                success: false,
                message: "Order not found."
            };
        }

        // 2. Xac dinh phuong thuc thanh toan va trang thai don hang moi
        let newStatus = "PROCESSING";
        if (paymentMethod.toUpperCase() === "COD") {
            newStatus = "PENDING_PAYMENT"; // Cho giao hang moi thanh toan
        } else if (paymentMethod.toUpperCase() === "CREDIT CARD") {
            newStatus = "PAID"; // Thanh toan qua roi qua credit card
        }

        // 3. payment và update order status
        const result = await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    orderID: orderID,
                    paymentMethod: paymentMethod
                }
            });

            await tx.order.update({
                where: { id: orderID },
                data: { status: newStatus }
            });

            return payment;
        });

        return {
            httpStatus: HttpStatus.OK,
            success: true,
            message: `Payment via ${paymentMethod} recorded successfully.`,
            data: result
        };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return {
                httpStatus: HttpStatus.CONFLICT,
                success: false,
                message: "This order already has a payment record."
            };
        }
        return {
            httpStatus: HttpStatus.BAD_REQUEST,
            success: false,
            message: "Failed to process payment."
        };
    }
};

export const cancelPayment = async (orderID: number) => {
    try {
        // Xoa payment và cap nhat lai trang thai don hang ve PENDING (de khach chon lai) (Update order)
        await prisma.$transaction(async (tx) => {
            // 1. Kiểm tra xem có bản ghi Payment không
            const payment = await tx.payment.findUnique({
                where: { orderID: orderID }
            });

            if (!payment) throw new Error("No payment record found to cancel.");

            // 2. Xoa ban ghi Payment
            await tx.payment.delete({
                where: { orderID: orderID }
            });

            // 3. Cap nhat lai trang thai don hang
            await tx.order.update({
                where: { id: orderID },
                data: { status: "PENDING" }
            });
        });

        return {
            httpStatus: HttpStatus.OK,
            success: true,
            message: "Payment cancelled successfully. You can now choose a different method."
        };
    } catch (error: any) {
        return {
            httpStatus: HttpStatus.BAD_REQUEST,
            success: false,
            message: error.message || "Failed to cancel payment."
        };
    }
};

export const getPaymentDetails = async (orderID: number) => {
    try {
        const details = await prisma.order.findUnique({
            where: { id: orderID },
            include: {
                payments: true, //
                user: true      
            }
        });

        if (!details) {
            return { 
                httpStatus: HttpStatus.NOT_FOUND, 
                success: false, 
                message: "Order not found" 
            };
        }

        return {
            httpStatus: HttpStatus.OK, 
            success: true,
            data: {
                orderID: details.id,
                // tong gia tien don hang neu can 
                shippingAddress: details.shippingAddress, //
                customerName: details.user.name,           //
                paymentMethod: details.payments?.paymentMethod || "Not selected"
            }
        };
    } catch (error) {
        return { 
            httpStatus: HttpStatus.INTERNAL, 
            success: false, 
            message: "Error fetching payment details" 
        };
    }
};