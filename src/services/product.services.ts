import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";

export const createProduct = async (data: any) => {
 
    const { name, description, price, active, brandID, productVariants } = data;

    const product = await prisma.product.create({
        data: {
            name,
            description,
            price: String(price), 
            active: Boolean(active),
            brandID: Number(brandID), 
            productVariants: {
                create: productVariants.map((v: any) => ({
                    sizeID: Number(v.sizeID),
                    colorID: Number(v.colorID),
                    quantity: Number(v.quantity) 
                }))
            }
        },
        include: {
            productVariants: true 
        }
    });

    return {
        success: true,
        httpStatus: HttpStatus.CREATED,
        message: "Tao san pham va bien the san pham thanh cong",
        data: product
    };
};

export const getProducts = async () => {
    const data = await prisma.product.findMany({
        include: {
            brand: true,
            productVariants: {
                include: { size: true, color: true }
            }
        }
    });
    return { success: true, httpStatus: HttpStatus.OK, data };
};

export const getProductById = async (id: number) => {
    const data = await prisma.product.findUnique({
        where: { id },
        include: {
            productVariants: { include: { size: true, color: true } }
        }
    });
    if (!data) return { success: false, httpStatus: HttpStatus.NOT_FOUND, message: "San pham khong ton tai" };
    return { success: true, httpStatus: HttpStatus.OK, data };
};