import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";
import { VariantCreateData, VariantUpdateData } from "~/types/VariantsDTO";

// Tạo 1 variant
async function createVariant(data: VariantCreateData) {
  try {
    // Kiểm tra product, size, color có tồn tại không
    const [product, size, color] = await Promise.all([
      prisma.product.findUnique({ where: { id: data.productID } }),
      prisma.size.findUnique({ where: { id: data.sizeID } }),
      prisma.color.findUnique({ where: { id: data.colorID } }),
    ]);

    if (!product) {
      return {
        success: false,
        message: "Product not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    if (!size) {
      return {
        success: false,
        message: "Size not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    if (!color) {
      return {
        success: false,
        message: "Color not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    // Kiểm tra variant này đã tồn tại chưa (cùng product, size, color)
    const existingVariant = await prisma.productVariant.findFirst({
      where: {
        productID: data.productID,
        sizeID: data.sizeID,
        colorID: data.colorID,
      },
    });

    if (existingVariant) {
      return {
        success: false,
        message: "Variant with this size and color already exists for this product",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }

    const variant = await prisma.productVariant.create({
      data: {
        productID: data.productID,
        sizeID: data.sizeID,
        colorID: data.colorID,
        quantity: data.quantity,
      },
      include: {
        product: true,
        size: true,
        color: true,
      },
    });

    return {
      success: true,
      message: "Product variant created successfully",
      httpStatus: HttpStatus.CREATED,
      data: variant,
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

// Lấy tất cả variants của 1 product
async function getVariantsByProduct(productID: number) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { productID },
      include: {
        size: true,
        color: true,
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
      include: {
        product: true,
        size: true,
        color: true,
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
    if (data.sizeID) {
      const size = await prisma.size.findUnique({ where: { id: data.sizeID } });
      if (!size) {
        return {
          success: false,
          message: "Size not found",
          httpStatus: HttpStatus.NOT_FOUND,
        };
      }
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
      include: {
        product: true,
        size: true,
        color: true,
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

// Tạo nhiều variants cùng lúc
async function createMultipleVariants(
  productID: number,
  variants: Array<{ sizeID: number; colorID: number; quantity: number }>
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
    const sizeIDs = [...new Set(variants.map((v) => v.sizeID))];
    const colorIDs = [...new Set(variants.map((v) => v.colorID))];

    const [sizes, colors] = await Promise.all([
      prisma.size.findMany({ where: { id: { in: sizeIDs } } }),
      prisma.color.findMany({ where: { id: { in: colorIDs } } }),
    ]);

    // Validate
    if (sizes.length !== sizeIDs.length) {
      return {
        success: false,
        message: "One or more sizes not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    if (colors.length !== colorIDs.length) {
      return {
        success: false,
        message: "One or more colors not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    // Tạo variants
    const createdVariants = await prisma.productVariant.createMany({
      data: variants.map((v) => ({
        productID,
        sizeID: v.sizeID,
        colorID: v.colorID,
        quantity: v.quantity,
      })),
      skipDuplicates: true, // Skip nếu đã tồn tại
    });

    // Lấy lại variants vừa tạo
    const allVariants = await prisma.productVariant.findMany({
      where: { productID },
      include: {
        size: true,
        color: true,
      },
    });

    return {
      success: true,
      message: `Created ${createdVariants.count} variants successfully`,
      httpStatus: HttpStatus.CREATED,
      data: allVariants,
    };
  } catch (error) {
    console.error(">>> Create multiple variants error:", error);
    return {
      success: false,
      message: "Create variants failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

export { createVariant, getVariantsByProduct, getVariantByID, updateVariant, deleteVariant, createMultipleVariants };
