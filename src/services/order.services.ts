import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";
import { CreateOrderDTO, UpdateOrderStatusDTO } from "~/types/OrderDTO";
import { Prisma } from "generated/prisma/edge";

// Tạo đơn hàng mới
async function createOrder(userID: number, data: CreateOrderDTO) {
  try {
    // Cần validate payment method (Chờ Payment API)
    // Validate items
    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        message: "Order must have at least one item",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }

    // Lấy thông tin các variants
    const variantIDs = data.items.map((item) => item.productVariantID);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIDs } },
      include: {
        product: true,
      },
    });

    // Kiểm tra tất cả variants có tồn tại không
    if (variants.length !== variantIDs.length) {
      return {
        success: false,
        message: "One or more product variants not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    // Kiểm tra số lượng tồn kho
    for (const item of data.items) {
      const variant = variants.find((v) => v.id === item.productVariantID);
      if (variant && variant.quantity < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for variant ID ${item.productVariantID}. Available: ${variant.quantity}`,
          httpStatus: HttpStatus.BAD_REQUEST,
        };
      }
    }

    // Tạo order với transaction để đảm bảo tính nhất quán
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userID,
          status: "pending",
          shippingAddress: data.shippingAddress,
          createdAt: new Date(),
          payments: {
            create: {
              paymentMethod: data.paymentMethod,
            },
          },
          orderItems: {
            create: data.items.map((item) => {
              const variant = variants.find((v) => v.id === item.productVariantID)!;
              return {
                productVariantID: item.productVariantID,
                quantity: item.quantity,
                price: variant.product.price,
              };
            }),
          },
        },
        select: {
          id: true,
          status: true,
          shippingAddress: true,
          createdAt: true,
          payments: {
            select: {
              id: true,
              paymentMethod: true,
            },
          },
          orderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              productVariant: {
                select: {
                  id: true,
                  size: true, 
                  product: {
                    select: {
                      id: true,
                      name: true,
                      thumbnail: true,
                    },
                  },
                  color: {
                    select: {
                      id: true,
                      name: true,
                      hex: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Trừ số lượng tồn kho
      for (const item of data.items) {
        await tx.productVariant.update({
          where: { id: item.productVariantID },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return {
      success: true,
      message: "Order created successfully",
      httpStatus: HttpStatus.CREATED,
      data: order,
    };
  } catch (error) {
    console.error(">>> Create order error:", error);
    return {
      success: false,
      message: "Create order failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

// Lấy danh sách đơn hàng của user
async function getOrdersByUser(userID: number) {
  try {
    const orders = await prisma.order.findMany({
      where: { userID },
      select: {
        id: true,
        status: true,
        shippingAddress: true,
        createdAt: true,
        payments: {
          select: {
            id: true,
            paymentMethod: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            price: true,
            productVariant: {
              select: {
                id: true,
                size: true, 
                product: {
                  select: {
                    id: true,
                    name: true,
                    thumbnail: true,
                  },
                },
                color: {
                  select: {
                    id: true,
                    name: true,
                    hex: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Get orders successfully",
      httpStatus: HttpStatus.OK,
      data: orders,
    };
  } catch (error) {
    console.error(">>> Get orders error:", error);
    return {
      success: false,
      message: "Get orders failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

// Lấy chi tiết đơn hàng
async function getOrderByID(orderID: number, userID?: number) {
  try {
    const whereClause: any = { id: orderID };
    if (userID) {
      whereClause.userID = userID;
    }

    const order = await prisma.order.findFirst({
      where: whereClause,
      select: {
        id: true,
        status: true,
        shippingAddress: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: {
          select: {
            id: true,
            paymentMethod: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            price: true,
            productVariant: {
              select: {
                id: true,
                size: true, 
                product: {
                  select: {
                    id: true,
                    name: true,
                    thumbnail: true,
                  },
                },
                color: {
                  select: {
                    id: true,
                    name: true,
                    hex: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        message: "Order not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    return {
      success: true,
      message: "Get order successfully",
      httpStatus: HttpStatus.OK,
      data: order,
    };
  } catch (error) {
    console.error(">>> Get order error:", error);
    return {
      success: false,
      message: "Get order failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

// Lấy tất cả đơn hàng (Admin)
async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        status: true,
        shippingAddress: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: {
          select: {
            id: true,
            paymentMethod: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            price: true,
            productVariant: {
              select: {
                id: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Get all orders successfully",
      httpStatus: HttpStatus.OK,
      data: orders,
    };
  } catch (error) {
    console.error(">>> Get all orders error:", error);
    return {
      success: false,
      message: "Get all orders failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

// Cập nhật trạng thái đơn hàng (Admin)
async function updateOrderStatus(orderID: number, status: string) {
  try {
    const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderID },
      include: {
        orderItems: true,
      },
    });

    if (!existingOrder) {
      return {
        success: false,
        message: "Order not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    // Nếu đơn đã hủy thì không cho đổi trạng thái khác
    if (existingOrder.status === "cancelled" && status !== "cancelled") {
      return {
        success: false,
        message: "Cannot change status of an already cancelled order",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }

    // Xử lý cập nhật trạng thái
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderID },
        data: { status },
        select: {
          id: true,
          status: true,
          shippingAddress: true,
          createdAt: true,
        },
      });

      // Nếu chuyển từ trạng thái khác sang cancelled -> Hoàn tồn kho
      if (status === "cancelled" && existingOrder.status !== "cancelled") {
        for (const item of existingOrder.orderItems) {
          await tx.productVariant.update({
            where: { id: item.productVariantID },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      return order;
    });

    return {
      success: true,
      message: "Order status updated successfully",
      httpStatus: HttpStatus.OK,
      data: updatedOrder,
    };
  } catch (error) {
    console.error(">>> Update order status error:", error);
    return {
      success: false,
      message: "Update order status failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

// Hủy đơn hàng (User)
async function cancelOrder(orderID: number, userID: number) {
  try {
    const existingOrder = await prisma.order.findFirst({
      where: { id: orderID, userID },
      include: {
        orderItems: true,
      },
    });

    if (!existingOrder) {
      return {
        success: false,
        message: "Order not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    if (existingOrder.status !== "pending") {
      return {
        success: false,
        message: "Can only cancel orders with pending status",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }

    // Hủy đơn và hoàn lại số lượng tồn kho
    await prisma.$transaction(async (tx) => {
      // Cập nhật status
      await tx.order.update({
        where: { id: orderID },
        data: { status: "cancelled" },
      });

      // Hoàn lại tồn kho
      for (const item of existingOrder.orderItems) {
        await tx.productVariant.update({
          where: { id: item.productVariantID },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      }
    });

    return {
      success: true,
      message: "Order cancelled successfully",
      httpStatus: HttpStatus.OK,
    };
  } catch (error) {
    console.error(">>> Cancel order error:", error);
    return {
      success: false,
      message: "Cancel order failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

// Cập nhật địa chỉ nhận hàng (User)
async function updateShippingAddress(orderID: number, userID: number, shippingAddress: string) {
  try {
    const existingOrder = await prisma.order.findFirst({
      where: { id: orderID, userID },
    });

    if (!existingOrder) {
      return {
        success: false,
        message: "Order not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    if (existingOrder.status !== "pending") {
      return {
        success: false,
        message: "Can only update shipping address for orders with pending status",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderID },
      data: { shippingAddress },
      select: {
        id: true,
        shippingAddress: true,
        status: true,
      },
    });

    return {
      success: true,
      message: "Shipping address updated successfully",
      httpStatus: HttpStatus.OK,
      data: updatedOrder,
    };
  } catch (error) {
    console.error(">>> Update shipping address error:", error);
    return {
      success: false,
      message: "Update shipping address failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

export {
  createOrder,
  getOrdersByUser,
  getOrderByID,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  updateShippingAddress,
};
