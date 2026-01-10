import { Request, Response } from "express";
import HttpStatus from "~/utlis/statusMap";
import * as productService from "~/services/product.services";

class Product {
  // Tạo sản phẩm mới (Admin)
  static async createProduct(req: Request, res: Response) {  //Ham nay sai, phai cho nguoi ta nhan anh, cai thumbnail duoc nhan bang cach dung req.file 
    //Xem lai cai file a code do, a co de cho may dua coi cach de lay file anh ma?? 
    const { name, description, price, active, thumbnail, brandID } = req.body;
    const responseData = await productService.createProduct({
      name,
      description,
      price,
      active,
      thumbnail,
      brandID,
    });

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy danh sách sản phẩm ngoại trừ sản phẩn Inactive (Public)
  static async getAllProducts(req: Request, res: Response) {
    const responseData = await productService.getAllProducts();

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy danh sách tất cả sản phẩm (Admin)
  static async getAllProductsAdmin(req: Request, res: Response) {
    const responseData = await productService.getAllProductsAdmin();

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy thông tin 1 sản phẩm theo ID (Public)
  static async getProductByID(req: Request, res: Response) {
    const id = Number(req.params.id);
    const responseData = await productService.getProductByID(id);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Cập nhật sản phẩm (Admin)
  static async updateProduct(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { name, description, price, active, thumbnail, brandID } = req.body;
    const responseData = await productService.updateProduct(id, {
      name,
      description,
      price,
      active,
      thumbnail, //Cai thumnail nay e phai viet ham de no bien thanh url va gui lai cho phia FE, trong cloudinary.services co ham de doi 
      brandID,
    });

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Xóa sản phẩm (Admin)
  static async deleteProduct(req: Request, res: Response) {
    const id = Number(req.params.id);
    const responseData = await productService.deleteProduct(id);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Tìm kiếm sản phẩm theo tên hoặc mô tả - Sau khi trả kết quả thì Filter ở FE (Public)
  static async searchProducts(req: Request, res: Response) {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Missing or invalid query parameter",
      });
    }

    const responseData = await productService.searchProducts(query);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy sản phẩm theo brand - Dùng cho Related Products (Public)
  static async getProductsByBrand(req: Request, res: Response) {
    const brandID = Number(req.params.brandID);
    const responseData = await productService.getProductsByBrand(brandID);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }
}

export default Product;
