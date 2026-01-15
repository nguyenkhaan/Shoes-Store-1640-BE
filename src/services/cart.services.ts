import HttpStatus from "~/utlis/statusMap";
import prisma from "~/configs/mysqlPrisma.config";
import Cloudian from "~/services/cloudinary.services";

class CartServices {
  // Lấy cart của user
  static async getCarts(userID: number) {
    try {
      const response = await prisma.cart.findUnique({
        where: { userID },
        select: { id: true },
      });

      return {
        success: true,
        message: "Get all carts successfully",
        cartID: response?.id,
        httpStatus: HttpStatus.OK,
      };
    } catch (err) {
      console.error(">>> Get carts error:", err);
      return {
        success: false,
        message: "Get cart failed",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }
  }

  // Tạo cart cho user
  static async createCart(userID: number) {
    try {
      const response = await prisma.cart.create({
        data: { userID },
      });

      return {
        success: true,
        message: "Create cart successfully",
        httpStatus: HttpStatus.CREATED,
        cartID: response.id,
      };
    } catch (err) {
      console.error(">>> Create cart error:", err);
      return {
        success: false,
        message: "Create cart failed",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }
  }

  // Xóa cart
  static async deleteCart(userID: number) {
    try {
      await prisma.cart.delete({ where: { userID } });
      return {
        success: true,
        message: "Delete cart successfully",
        httpStatus: HttpStatus.OK,
      };
    } catch (err) {
      console.error(">>> Delete cart error:", err);
      return {
        success: false,
        message: "Delete cart failed",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }
  }

  // Lấy tất cả sản phẩm trong cart
  static async getAllProductsInCart(userID: number) {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userID },
        select: { id: true },
      });

      if (!cart) {
        return {
          success: false,
          message: "Cart not found",
          httpStatus: HttpStatus.NOT_FOUND,
        };
      }

      const items = await prisma.cartProduct.findMany({
        where: { cartID: cart.id },
        select: {
          id: true,
          quantity: true,
          productVariant: {
            select: {
              id: true,
              size: true,
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  description: true,
                  discount: true,
                  category: true,
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
      });

      const formattedItems = items.map((item) => {
        const thumbnails = item.productVariant.product.thumbnail;
        let thumbnailUrl: string | null = null;
        if (Array.isArray(thumbnails) && typeof thumbnails[0] === "string") {
          thumbnailUrl = Cloudian.getImageUrl(thumbnails[0]);
        }
        return {
          ...item,
          productVariant: {
            ...item.productVariant,
            product: {
              ...item.productVariant.product,
              thumbnail: thumbnailUrl,
            },
          },
        };
      });

      return {
        success: true,
        data: formattedItems,
        httpStatus: HttpStatus.OK,
      };
    } catch (err) {
      console.error(">>> get cart products error:", err);
      return {
        success: false,
        message: "Get cart failed",
        httpStatus: HttpStatus.INTERNAL,
      };
    }
  }

  // Lưu sản phẩm (productVariant) vào cart
  static async saveProductToCart(userID: number, productVariantID: number) {
    try {
      const cart = await prisma.cart.findFirst({
        where: { userID },
        select: { id: true },
      });

      if (!cart) {
        return {
          success: false,
          message: "This user doesn't have a cart",
          httpStatus: HttpStatus.BAD_REQUEST,
        };
      }

      const variant = await prisma.productVariant.findFirst({
        where: { id: productVariantID },
        select: { id: true },
      });

      if (!variant) {
        return {
          success: false,
          message: "Product variant doesn't exist",
          httpStatus: HttpStatus.BAD_REQUEST,
        };
      }

      await prisma.cartProduct.upsert({
        where: { cartID_productVariantID: { cartID: cart.id, productVariantID } },
        update: { quantity: 1 }, // nếu muốn tăng số lượng thì dùng { increment: 1 }
        create: { cartID: cart.id, productVariantID, quantity: 1 },
      });

      return {
        success: true,
        message: "Save product successfully",
        httpStatus: HttpStatus.OK,
      };
    } catch (err) {
      console.error(">>> save product error:", err);
      return {
        success: false,
        message: "Save failed",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }
  }

  // Xóa sản phẩm khỏi cart
  static async removeProductFromCart(cartProductID: number) {
    try {
      const cartProduct = await prisma.cartProduct.findFirst({
        where: { id: cartProductID },
      });

      if (!cartProduct) {
        return {
          success: false,
          message: "Cart product not found",
          httpStatus: HttpStatus.NOT_FOUND,
        };
      }

      await prisma.cartProduct.delete({ where: { id: cartProductID } });

      return {
        success: true,
        message: "Remove product successfully",
        httpStatus: HttpStatus.OK,
      };
    } catch (err) {
      console.error(">>> remove product error:", err);
      return {
        success: false,
        message: "Remove product failed",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }
  }
}

export default CartServices;
