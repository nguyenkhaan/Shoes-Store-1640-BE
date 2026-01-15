import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";
class AdminServices {
    static async getAdminDashboard() {
        try {
            // 1️⃣ Tổng số đơn hàng
            const totalOrders = await prisma.order.count();

            // 2️⃣ Tổng số khách hàng đã đăng ký (verify = true)
            const totalUsers = await prisma.user.count({
                where: { verify: true },
            });

            // 3️⃣ Tổng tiền người dùng đã chi
            const users = await prisma.user.findMany({
                where: { verify: true },
                select: {
                    orders: {
                        select: {
                            orderItems: {
                                select: { quantity: true, price: true },
                            },
                        },
                    },
                },
            });

            let totalSpent = 0;
            for (const user of users) {
                for (const order of user.orders) {
                    for (const item of order.orderItems) {
                        totalSpent += Number(item.price) * item.quantity;
                    }
                }
            }

            return {
                success: true,
                data: {
                    totalOrders,
                    totalUsers,
                    totalSpent,
                },
                message: "Site stats fetched successfully",
                httpStatus: HttpStatus.OK,
            };
        } catch (err) {
            console.error(">>> getSiteStats error:", err);
            return {
                success: false,
                message: "Failed to fetch site stats",
                httpStatus: HttpStatus.INTERNAL,
            };
        }
    }
}
export default AdminServices