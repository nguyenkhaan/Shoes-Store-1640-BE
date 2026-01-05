import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";
import { ProductDTO } from "~/types/ProductDTO";
import { Prisma } from "generated/prisma/edge";

// Tạo sản phẩm mới
async function createProduct(data: ProductDTO) {
  try {
    // Kiểm tra brand có tồn tại không
    const brand = await prisma.brand.findUnique({
      where: { id: data.brandID },
    });

    if (!brand) {
      return {
        success: false,
        message: "Brand not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        price: new Prisma.Decimal(data.price.toString()),
      },
      include: {
        brand: true,
      },
    });

    return {
      success: true,
      message: "Product created successfully",
      httpStatus: HttpStatus.CREATED,
      data: product,
    };
  } catch (error) {
    console.error(">>> Create product error:", error);
    return {
      success: false,
      message: "Create product failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

// Lấy danh sách sản phẩm (chỉ active - public)
async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
      },
      include: {
        brand: true,
        productVariants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return {
      success: true,
      message: "Get all products successfully",
      httpStatus: HttpStatus.OK,
      data: products,
    };
  } catch (error) {
    console.error(">>> Get products error:", error);
    return {
      success: false,
      message: "Get products failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

// Lấy tất cả sản phẩm kể cả inactive (admin)
async function getAllProductsAdmin() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        productVariants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return {
      success: true,
      message: "Get all products successfully",
      httpStatus: HttpStatus.OK,
      data: products,
    };
  } catch (error) {
    console.error(">>> Get products error:", error);
    return {
      success: false,
      message: "Get products failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

// Lấy sản phẩm theo ID
async function getProductByID(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        productVariants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
    });

    if (!product) {
      return {
        success: false,
        message: "Product not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    return {
      success: true,
      message: "Get product successfully",
      httpStatus: HttpStatus.OK,
      data: product,
    };
  } catch (error) {
    console.error(">>> Get product by ID error:", error);
    return {
      success: false,
      message: "Get product failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

// Cập nhật sản phẩm
async function updateProduct(id: number, data: ProductDTO) {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    // Nếu có brandID, kiểm tra brand có tồn tại không
    if (data.brandID) {
      const brand = await prisma.brand.findUnique({
        where: { id: data.brandID },
      });

      if (!brand) {
        return {
          success: false,
          message: "Brand not found",
          httpStatus: HttpStatus.NOT_FOUND,
        };
      }
    }

    const updateData: any = { ...data };
    if (data.price !== undefined) {
      updateData.price = new Prisma.Decimal(data.price.toString());
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        brand: true,
        productVariants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Product updated successfully",
      httpStatus: HttpStatus.OK,
      data: updatedProduct,
    };
  } catch (error) {
    console.error(">>> Update product error:", error);
    return {
      success: false,
      message: "Update product failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

// Xóa sản phẩm
async function deleteProduct(id: number) {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        productVariants: true,
      },
    });

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    // Kiểm tra xem có variant nào không
    if (existingProduct.productVariants.length > 0) {
      return {
        success: false,
        message: "Cannot delete product with existing variants. Please delete all variants first.",
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    }

    await prisma.product.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Product deleted successfully",
      httpStatus: HttpStatus.OK,
    };
  } catch (error) {
    console.error(">>> Delete product error:", error);
    return {
      success: false,
      message: "Delete product failed",
      httpStatus: HttpStatus.BAD_REQUEST,
    };
  }
}

// Tìm kiếm sản phẩm
async function searchProducts(query: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
        ],
      },
      include: {
        brand: true,
        productVariants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Search completed successfully",
      httpStatus: HttpStatus.OK,
      data: products,
    };
  } catch (error) {
    console.error(">>> Search products error:", error);
    return {
      success: false,
      message: "Search products failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

// Lấy sản phẩm theo brand
async function getProductsByBrand(brandID: number) {
  try {
    const products = await prisma.product.findMany({
      where: {
        brandID,
        active: true,
      },
      include: {
        brand: true,
        productVariants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Get products by brand successfully",
      httpStatus: HttpStatus.OK,
      data: products,
    };
  } catch (error) {
    console.error(">>> Get products by brand error:", error);
    return {
      success: false,
      message: "Get products by brand failed",
      httpStatus: HttpStatus.INTERNAL,
    };
  }
}

export {
  createProduct,
  getAllProducts,
  getAllProductsAdmin,
  getProductByID,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByBrand,
};
