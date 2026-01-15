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

    static async getWeeklyRevenue() {
        try {
            // Helper function để format date thành YYYY-MM-DD
            const formatDate = (date: Date): string => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            // Lấy ngày hiện tại
            const today = new Date();
            const todayKey = formatDate(today);

            // Tính ngày bắt đầu (7 ngày trước)
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
            const sevenDaysAgoKey = formatDate(sevenDaysAgo);

            // Tạo range ngày để query
            const sevenDaysAgoStart = new Date(sevenDaysAgo);
            sevenDaysAgoStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date(today);
            todayEnd.setHours(23, 59, 59, 999);

            // Lấy tất cả orders trong 7 ngày gần nhất
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: sevenDaysAgoStart,
                        lte: todayEnd,
                    },
                },
                select: {
                    createdAt: true,
                    orderItems: {
                        select: {
                            quantity: true,
                            price: true,
                        },
                    },
                },
            });

            // Tạo map để lưu revenue theo ngày
            const revenueByDate = new Map<string, number>();

            // Khởi tạo 7 ngày
            for (let i = 0; i < 7; i++) {
                const date = new Date(sevenDaysAgo);
                date.setDate(date.getDate() + i);
                const dateKey = formatDate(date);
                revenueByDate.set(dateKey, 0);
            }

            // Tính revenue cho từng order
            for (const order of orders) {
                const dateKey = formatDate(new Date(order.createdAt));

                let orderTotal = 0;
                for (const item of order.orderItems) {
                    orderTotal += Number(item.price) * item.quantity;
                }

                const currentAmount = revenueByDate.get(dateKey) || 0;
                revenueByDate.set(dateKey, currentAmount + orderTotal);
            }

            // Chuyển Map thành array theo thứ tự ngày (từ sớm nhất tới muộn nhất)
            const weeklyRevenueData = Array.from(revenueByDate.entries())
                .sort((a, b) => {
                    return a[0].localeCompare(b[0]);
                })
                .map(([dateKey]) => {
                    const date = new Date(dateKey);
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const day = dayNames[date.getDay()];
                    const amount = revenueByDate.get(dateKey) || 0;

                    return {
                        day,
                        amount,
                    };
                });

            return {
                success: true,
                data: weeklyRevenueData,
                message: "Weekly revenue fetched successfully",
                httpStatus: HttpStatus.OK,
            };
        } catch (err) {
            console.error(">>> getWeeklyRevenue error:", err);
            return {
                success: false,
                message: "Failed to fetch weekly revenue",
                httpStatus: HttpStatus.INTERNAL,
            };
        }
    }
}
export default AdminServices