import { Request, Response } from "express";
import HttpStatus from "~/utlis/statusMap";
import * as productVariantService from "~/services/variants.services";

class ProductVariant {
  // Tạo variant cho sản phẩm
  static async createVariant(req: Request, res: Response) {
    const { productID, sizeID, colorID, quantity } = req.body;
    const responseData = await productVariantService.createVariant({
      productID,
      sizeID,
      colorID,
      quantity,
    });

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy tất cả variants của 1 sản phẩm
  static async getVariantsByProduct(req: Request, res: Response) {
    const productID = Number(req.params.productID);
    const responseData = await productVariantService.getVariantsByProduct(productID);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy chi tiết 1 variant
  static async getVariantByID(req: Request, res: Response) {
    const id = Number(req.params.id);
    const responseData = await productVariantService.getVariantByID(id);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Cập nhật variant
  static async updateVariant(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { sizeID, colorID, quantity } = req.body;
    const responseData = await productVariantService.updateVariant(id, {
      sizeID,
      colorID,
      quantity,
    });

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Xóa variant
  static async deleteVariant(req: Request, res: Response) {
    const id = Number(req.params.id);
    const responseData = await productVariantService.deleteVariant(id);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Tạo nhiều variants cùng lúc cho 1 sản phẩm
  static async createMultipleVariants(req: Request, res: Response) {
    const { productID, variants } = req.body;
    const responseData = await productVariantService.createMultipleVariants(productID, variants);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }
}

export default ProductVariant;
