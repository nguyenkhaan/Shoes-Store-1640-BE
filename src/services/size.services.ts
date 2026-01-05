import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";

async function getAllSizes()
{
    try {
        const sizes = await prisma.size.findMany({
            orderBy: {
                value: "asc"
            }
        });

        return {
            success: true,
            message: "Get all sizes successfully",
            data: sizes,
            httpStatus: HttpStatus.OK
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to get sizes",
            httpStatus: HttpStatus.INTERNAL
        };
    }
}
export {getAllSizes}