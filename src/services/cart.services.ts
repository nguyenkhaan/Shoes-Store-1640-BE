import HttpStatus from "~/utlis/statusMap";
import prisma from "~/configs/mysqlPrisma.config";
import Cloudian from "~/services/cloudinary.services";

class CartServices {
    static async getCarts(userID: number) {
        try {
            const response = await prisma.cart.findUnique({
                where: {
                    userID,
                },
                select: {
                    id: true,
                },
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
    static async createCart(userID: number) {
        try {
            const response = await prisma.cart.create({
                data: {
                    userID: userID,
                },
            });
            return {
                success: true,
                message: "Create cart successfully",
                httpStatus: HttpStatus.CREATED,
                cartID: response.id, //Tra ve cartID cho phai nguoi dung
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
    static async deleteCart(userID: number) {
        //xoa cart cua nguoi dung
        try {
            await prisma.cart.delete({
                where: {
                    userID,
                },
            });
            return {
                success: true,
                message: "delete cart successfullt",
                httpStatus: HttpStatus.OK,
            };
        } catch (err) {
            console.error(">>> Delete cart error:", err);
            return {
                success: false,
                message: "Delete failed",
                httpStatus: HttpStatus.BAD_REQUEST,
            };
        }
    }
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
                    id: true, //gui them id de tien hanh oa 
                    quantity: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            description: true, 
                            discount: true, 
                            category: true, 
                            //Lay them hinh anh ve 
                            thumbnail: true 
                        },
                    },
                },
            });
            const formattedItems = items.map((item) => {
                const thumbnails = item.product.thumbnail;
              
                let thumbnailUrl: string | null = null;
              
                if (Array.isArray(thumbnails) && typeof thumbnails[0] === "string") {
                  thumbnailUrl = Cloudian.getImageUrl(thumbnails[0]);   //Lay link hinh anh dau tien cua san pham 
                }
                return {
                  ...item,
                  product: {
                    ...item.product,
                    thumbnail: thumbnailUrl,
                  },
                };
              });
              
            return {
                success: true,
                data: formattedItems,
                httpStatus : HttpStatus.OK 
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

    static async saveProductToCart(userID: number, productID: number) {
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
            const product = await prisma.product.findFirst({
                where: {
                    id: productID,
                },
                select: { id: true },
            });
            if (!product) {
                return {
                    success: false,
                    message: "Product doesn't exists",
                    httpStatus: HttpStatus.BAD_REQUEST,
                };
            }
            await prisma.cartProduct.upsert({
                where: {
                    cartID_productID: {
                        //Key do prisma tu sinh ra de su dung
                        cartID: cart.id,
                        productID,
                    },
                },
                update: {
                    quantity: 1   //Neu nhu muon tang so luong san pham thi dung {increment : 1}
                },
                create: {
                    cartID: cart.id,
                    productID,
                    quantity: 1,
                },
            });

            return {
                success: true,
                message: "Save product successfully",
                httpStatus: HttpStatus.OK
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

    static async removeProductFromCart(cartProductID : number) 
    {
        //Ham xoa han product khoi cart
        try {
            const card = await prisma.cartProduct.findFirst({
                where: {
                    id : cartProductID 
                } 
            })
            if (!card) 
                return {
                    success: false,
                    message: " Saving product not found",
                    httpStatus: HttpStatus.NOT_FOUND,
                };


            await prisma.cartProduct.delete({
                where: {
                    id : cartProductID 
                },
            });

            return {
                success: true,
                message: "Remove product successfully",
                httpStatus: HttpStatus.OK
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
