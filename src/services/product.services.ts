import prisma from "~/configs/mysqlPrisma.config";
import HttpStatus from "~/utlis/statusMap";
import { ProductDTO } from "~/types/ProductDTO";
import { Prisma } from "generated/prisma/edge";

// Tạo sản phẩm mới
async function createProduct(data: ProductDTO) {
  try {
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
        name: data.name,
        description: data.description,
        price: new Prisma.Decimal(data.price.toString()),
        active: data.active,
        thumbnail: data.thumbnail,
        brandID: data.brandID,
        discount: 0,    //Chinh sua truong nay lai nhan dung, ben FE se gui ve cai nay a 
        category: '' //Chinh sua 2 truong nay lai nhan dung, ben FE se gui ve cai nay a 
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        active: true,
        thumbnail: true,
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
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
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        active: true,
        thumbnail: true,
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        productVariants: {
          select: {
            id: true,
            size: true, 
            quantity: true,
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
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        active: true,
        thumbnail: true,
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        productVariants: {
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
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        active: true,
        thumbnail: true,
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        productVariants: {
          select: {
            id: true,
            size: true, 
            quantity: true,
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
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        active: true,
        thumbnail: true,
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        productVariants: {
          select: {
            id: true,
            size: true, 
            quantity: true,
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
    });

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }

    await prisma.$transaction([
      prisma.productVariant.deleteMany({
        where: { productID: id },
      }),
      prisma.product.delete({
        where: { id },
      }),
    ]);

    return {
      success: true,
      message: "Product and its variants deleted successfully",
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
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        active: true,
        thumbnail: true,
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        productVariants: {
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
    const brand = await prisma.brand.findUnique({
      where: { id: brandID },
    });
    if (!brand) {
      return {
        success: false,
        message: "Brand not found",
        httpStatus: HttpStatus.NOT_FOUND,
      };
    }
    const products = await prisma.product.findMany({
      where: {
        brandID,
        active: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        active: true,
        thumbnail: true,
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        productVariants: {
          select: {
            id: true,
            size: true, 
            quantity: true,
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
