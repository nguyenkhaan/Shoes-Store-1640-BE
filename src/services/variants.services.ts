import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";
import { VariantCreateData, VariantUpdateData } from "~/types/VariantsDTO";

//File nay dang bi loi rat nhieu, size luc nay la 1 bien so nguyen, khong con la bang rieng nua nen fix lai cho nay 


// Tạo variant (hỗ trợ tạo 1 hoặc nhiều)
async function createVariant(
  productID: number,
  variants: Array<{ size: number; colorID: number; quantity: number }>
) {
  try {
    // Kiểm tra product tồn tại
    const product = await prisma.product.findUnique({
      where: { id: productID },
    });

    if (!product) {
      return {
        success: false,
        message: "Product not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    // Lấy tất cả size và color IDs để validate
    const colorIDs = [...new Set(variants.map((v) => v.colorID))];   //Lay danh sach color gui ve 
    
    
    //Validate size 
    const invalidSize = variants.some(
      (variant) => typeof variant.size !== "number" || variant.size <= 0
    );
    if (invalidSize) {
      return {
        success: false,
        message: "Invalid size value",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }
    //Validate quantity 
    const invalidQuantity = variants.some(
      v => typeof v.quantity !== "number" || v.quantity < 0
    );
    
    if (invalidQuantity) {
      return {
        success: false,
        message: "Invalid quantity value",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }
    //Validate colors     
    const colors = await prisma.color.findMany({
      where: {
        id : {
          in : colorIDs
        }
      }
    })

    if (colors.length !== colorIDs.length) {
      return {
        success: false,
        message: "One or more colors not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }
    
    // Tạo variants (sử dụng createMany để tối ưu)
    const createdVariants = await prisma.productVariant.createMany({
      data: variants.map((v) => ({
        productID,
        size: v.size, 
        colorID: v.colorID,
        quantity: v.quantity,
      })),
      skipDuplicates: true, // Không tạo nếu đã tồn tại bộ size-color này cho product
    });

    if (createdVariants.count === 0) {
      return {
        success: false,
        message: "No new variants created (duplicates or invalid data)",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }

    // Lấy lại danh sách variants của product để trả về
    const allVariants = await prisma.productVariant.findMany({
      where: { productID },
      select: {
        id: true,
        quantity: true,
        size: true, 
        color: {
          select: {
            id: true,
            name: true,
            hex: true,
          },
        },
      },
    });

    return {
      success: true,
      message: `Successfully processed ${variants.length} variant(s). Created ${createdVariants.count} new variant(s).`,
      httpStatus: HttpStatus.CREATED,
      data: allVariants,
    };
  } catch (error) {
    console.error(">>> Create variant error:", error);
    return {
      success: false,
      message: "Create variant failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

// Lấy tất cả variants
async function getAllVariants() {
  try {
    const variants = await prisma.productVariant.findMany({
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        size: true, 
        color: {
          select: {
            id: true,
            name: true,
            hex: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return {
      success: true,
      message: "Get all variants successfully",
      httpStatus: HttpStatus.OK,
      data: variants,
    };
  } catch (error) {
    console.error(">>> Get all variants error:", error);
    return {
      success: false,
      message: "Get all variants failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

// Lấy tất cả variants của 1 product
async function getVariantsByProduct(productID: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productID },
    });
    if (!product) {
      return {
        success: false,
        message: "Product not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }
    const variants = await prisma.productVariant.findMany({
      where: { productID },
      select: {
        id: true,
        quantity: true,
        size: true, 
        color: {
          select: {
            id: true,
            name: true,
            hex: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Get variants successfully",
      httpStatus: HttpStatus.OK,
      data: variants,
    };
  } catch (error) {
    console.error(">>> Get variants error:", error);
    return {
      success: false,
      message: "Get variants failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

// Lấy variant theo ID
async function getVariantByID(id: number) {
  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        size: true, 
        color: {
          select: {
            id: true,
            name: true,
            hex: true,
          },
        },
      },
    });

    if (!variant) {
      return {
        success: false,
        message: "Variant not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    return {
      success: true,
      message: "Get variant successfully",
      httpStatus: HttpStatus.OK,
      data: variant,
    };
  } catch (error) {
    console.error(">>> Get variant error:", error);
    return {
      success: false,
      message: "Get variant failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

// Cập nhật variant
async function updateVariant(id: number, data: VariantUpdateData) {
  try {
    const existingVariant = await prisma.productVariant.findUnique({
      where: { id },
    });

    if (!existingVariant) {
      return {
        success: false,
        message: "Variant not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    // Nếu update size hoặc color, kiểm tra tồn tại
    if (data.size !== undefined) {
      if (data.size <= 0 || typeof data.size !== 'number')
        return {
          success: false,
          message: "Invalid size",
          httpStatus: HttpStatus.NOT_FOUND,
        };
    }

    if (data.colorID) {
      const color = await prisma.color.findUnique({ where: { id: data.colorID } });
      if (!color) {
        return {
          success: false,
          message: "Color not found",
          httpStatus: HttpStatus.NOT_FOUND,
        };
      }
    }

    const updatedVariant = await prisma.productVariant.update({
      where: { id },
      data,
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        size: true, 
        color: {
          select: {
            id: true,
            name: true,
            hex: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Variant updated successfully",
      httpStatus: HttpStatus.OK,
      data: updatedVariant,
    };
  } catch (error) {
    console.error(">>> Update variant error:", error);
    return {
      success: false,
      message: "Update variant failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

// Xóa variant
async function deleteVariant(id: number) {
  try {
    const existingVariant = await prisma.productVariant.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!existingVariant) {
      return {
        success: false,
        message: "Variant not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    // Kiểm tra xem có order item nào dùng variant này không
    if (existingVariant.orderItems.length > 0) {
      return {
        success: false,
        message: "Cannot delete variant that has been ordered",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }

    await prisma.productVariant.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Variant deleted successfully",
      httpStatus: HttpStatus.OK,
    };
  } catch (error) {
    console.error(">>> Delete variant error:", error);
    return {
      success: false,
      message: "Delete variant failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

export { createVariant, getAllVariants, getVariantsByProduct, getVariantByID, updateVariant, deleteVariant };
