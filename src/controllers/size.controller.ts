import { Request, Response } from "express";
import * as sizeService from "~/services/size.services";
import HttpStatus from "~/utlis/statusMap";

class Size {
  // Tạo size mới
  static async createSize(req: Request, res: Response) {
    const { value } = req.body;
    const responseData = await sizeService.createSize(value);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy tất cả sizes
  static async getAllSizes(req: Request, res: Response) {
    const responseData = await sizeService.getAllSizes();

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Lấy size theo ID
  static async getSizeByID(req: Request, res: Response) {
    const id = Number(req.params.id);
    const responseData = await sizeService.getSizeByID(id);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Cập nhật size
  static async updateSizeByID(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { value } = req.body;
    const responseData = await sizeService.updateSizeByID(id, value);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }

  // Xóa size
  static async deleteSizeByID(req: Request, res: Response) {
    const id = Number(req.params.id);
    const responseData = await sizeService.deleteSizeByID(id);

    if (responseData) return res.status(responseData.httpStatus).json(responseData);

    return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
  }
}

export default Size;
