import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";
async function createBrand(name: string) {
    //Tao moi 1 nhan hang
    try {
        const brand = await prisma.brand.create({
            data: {
                name,
            },
        });
        return {
            success: true,
            message: "Create brand successfully",
            brandName: brand.name,
            brandID: brand.id, //Gui lai brandID de tien hanh xu li
            httpStatus: HttpStatus.CREATED,
        };
    } catch (e) {
        console.log(">>> Create product error: ", e);
        return {
            success: false,
            message: "Create brand failed",
            httpStatus: HttpStatus.BAD_REQUEST,
        };
    }
}
async function getBrands() {
    try {
        const brands = await prisma.brand.findMany();
        return {
            success: true,
            message: "Get all brands successfully",
            httpStatus: HttpStatus.OK,
            data: brands,
        };
    } catch (er) {
        console.log(">>> Get brands error: ", er);
        return {
            success: false,
            message: "Create brand failed",
            httpStatus: HttpStatus.INTERNAL,
        };
    }
}
async function getBrandById(id: number) {
    try {
        const brands = await prisma.brand.findUnique({
            where: {
                id,
            },
        });
        if (brands)
            return {
                success: true,
                message: "Get all brands successfully",
                httpStatus: HttpStatus.OK,
                data: brands,
            };
        return {
            success: true,
            message: "Don't have any brands suitable",
            httpStatus: HttpStatus.OK,
        };
    } catch (er) {
        console.log(">>> Get brands error: ", er);
        return {
            success: false,
            message: "Create brand failed",
            httpStatus: HttpStatus.INTERNAL,
        };
    }
}

async function updateBrandByID(id: number, name: string) {
    try {
        const existingBrand = await prisma.brand.findUnique({
            where: { id },
        });

        if (!existingBrand) {
            return {
                success: false,
                message: "Brand not found",
                httpStatus: HttpStatus.NOT_FOUND,
            };
        }
        const updatedBrand = await prisma.brand.update({
            where: { id },
            data: { name },
        });

        return {
            success: true,
            message: "Brand updated successfully",
            httpStatus: HttpStatus.OK,
            data: updatedBrand,
        };
    } catch (error) {
        console.error(">>> Update brand error:", error);
        return {
            success: false,
            message: "Update brand failed",
            httpStatus: HttpStatus.INTERNAL,
        };
    }
}
export { createBrand, getBrands, getBrandById, updateBrandByID };
