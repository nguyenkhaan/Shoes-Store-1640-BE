import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";
import { SizeCreateData, SizeUpdateData } from "~/types/SizeDTO";

async function createSize(value: number) {
//   try {
//     // Kiểm tra size đã tồn tại chưa
//     const existingSize = await prisma.size.findFirst({
//       where: { value },
//     });

//     if (existingSize) {
//       return {
//         success: false,
//         message: "Size already exists",
//         httpStatus: HttpStatus.BAD_REQUEST,
//       };
//     }

//     const size = await prisma.size.create({
//       data: { value },
//     });

//     return {
//       success: true,
//       message: "Create size successfully",
//       data: size,
//       httpStatus: HttpStatus.CREATED,
//     };
//   } catch (error) {
//     console.error(">>> Create size error:", error);
//     return {
//       success: false,
//       message: "Failed to create size",
//       httpStatus: HttpStatus.BAD_REQUEST,
//     };
//   }
}

async function getAllSizes() {
//   try {
//     const sizes = await prisma.size.findMany({
//       orderBy: {
//         value: "asc",
//       },
//     });

//     return {
//       success: true,
//       message: "Get all sizes successfully",
//       data: sizes,
//       httpStatus: HttpStatus.OK,
//     };
//   } catch (error) {
//     console.error(">>> Get sizes error:", error);
//     return {
//       success: false,
//       message: "Failed to get sizes",
//       httpStatus: HttpStatus.INTERNAL,
//     };
//   }
}

async function getSizeByID(id: number) {
  // try {
  //   const size = await prisma.size.findUnique({
  //     where: { id },
  //   });

  //   if (!size) {
  //     return {
  //       success: false,
  //       message: "Size not found",
  //       httpStatus: HttpStatus.NOT_FOUND,
  //     };
  //   }

  //   return {
  //     success: true,
  //     message: "Get size successfully",
  //     data: size,
  //     httpStatus: HttpStatus.OK,
  //   };
  // } catch (error) {
  //   console.error(">>> Get size error:", error);
  //   return {
  //     success: false,
  //     message: "Failed to get size",
  //     httpStatus: HttpStatus.INTERNAL,
  //   };
  // }
}

async function updateSizeByID(id: number, value: number) {
  // try {
  //   const existingSize = await prisma.size.findUnique({
  //     where: { id },
  //   });

  //   if (!existingSize) {
  //     return {
  //       success: false,
  //       message: "Size not found",
  //       httpStatus: HttpStatus.NOT_FOUND,
  //     };
  //   }

  //   // Kiểm tra value mới đã tồn tại chưa
  //   const duplicateSize = await prisma.size.findFirst({
  //     where: {
  //       value,
  //       id: { not: id },
  //     },
  //   });

  //   if (duplicateSize) {
  //     return {
  //       success: false,
  //       message: "Size value already exists",
  //       httpStatus: HttpStatus.BAD_REQUEST,
  //     };
  //   }

  //   const updatedSize = await prisma.size.update({
  //     where: { id },
  //     data: { value },
  //   });

  //   return {
  //     success: true,
  //     message: "Size updated successfully",
  //     data: updatedSize,
  //     httpStatus: HttpStatus.OK,
  //   };
  // } catch (error) {
  //   console.error(">>> Update size error:", error);
  //   return {
  //     success: false,
  //     message: "Failed to update size",
  //     httpStatus: HttpStatus.BAD_REQUEST,
  //   };
  // }
}

async function deleteSizeByID(id: number) {
  // try {
  //   const existingSize = await prisma.size.findUnique({
  //     where: { id },
  //     include: {
  //       productVariants: true,
  //     },
  //   });

  //   if (!existingSize) {
  //     return {
  //       success: false,
  //       message: "Size not found",
  //       httpStatus: HttpStatus.NOT_FOUND,
  //     };
  //   }

  //   // Kiểm tra xem có variant nào dùng size này không
  //   if (existingSize.productVariants.length > 0) {
  //     return {
  //       success: false,
  //       message: "Cannot delete size that is used in product variants",
  //       httpStatus: HttpStatus.BAD_REQUEST,
  //     };
  //   }

  //   await prisma.size.delete({
  //     where: { id },
  //   });

  //   return {
  //     success: true,
  //     message: "Size deleted successfully",
  //     httpStatus: HttpStatus.OK,
  //   };
  // } catch (error) {
  //   console.error(">>> Delete size error:", error);
  //   return {
  //     success: false,
  //     message: "Failed to delete size",
  //     httpStatus: HttpStatus.BAD_REQUEST,
  //   };
  // }
}

export { createSize, getAllSizes, getSizeByID, updateSizeByID, deleteSizeByID };
