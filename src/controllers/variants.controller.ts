import { Request, Response } from "express";
import HttpStatus from "~/utlis/statusMap";
import * as productVariantService from "~/services/variants.services";


//Chinh sua lai file variants nay nhan, bay gio size da tro thanh 1 truong Integer trong bang variants roi  


class ProductVariant {   
  // Tạo variant cho sản phẩm (Hỗ trợ 1 hoặc nhiều)
  static async createVariant(req: Request, res: Response) {
    const {productID , size , colorID , quantity , variants} = req.body 
    let variantsToCreate = [];

    if (Array.isArray(variants)) {
      // Trường hợp gửi mảng variants
      variantsToCreate = variants.map((v: any) => ({
        size: Number(v.size),
        colorID: Number(v.colorID),
        quantity: Number(v.quantity),
      }));
    } else if (size && colorID && quantity) {
      // Trường hợp gửi 1 variant lẻ ở body
      variantsToCreate = [
        {
          size: Number(size),
          colorID: Number(colorID),
          quantity: Number(quantity),
        },
      ];
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Missing variant details (either size, colorID, quantity or variants array)",
      });
    }

    const responseData = await productVariantService.createVariant(Number(productID), variantsToCreate);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy tất cả variants (Admin)
  static async getAllVariants(req: Request, res: Response) {   //public 
    const responseData = await productVariantService.getAllVariants();

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy tất cả variants của 1 sản phẩm
  static async getVariantsByProduct(req: Request, res: Response) {   //get by id 
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
    const { size, colorID, quantity } = req.body;
    const updateData: any = {};
    if (size !== undefined) updateData.size = Number(size);
    if (colorID !== undefined) updateData.colorID = Number(colorID);
    if (quantity !== undefined) updateData.quantity = Number(quantity);

    const responseData = await productVariantService.updateVariant(id, updateData);

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
}

export default ProductVariant;
