import { Request, Response } from "express"
import HttpStatus from "~/utlis/statusMap"
import * as colorService from "~/services/color.services"

export class Color {
  // Tạo màu mới
  static async createColor(req: Request, res: Response) {
    const { name, hex } = req.body
    const responseData = await colorService.createColor(name , hex)

    if (responseData)
      return res.status(responseData.httpStatus).json(responseData)

    return res
      .status(HttpStatus.INTERNAL)
      .json({ success: false, message: "Internal Server Error" })
  }

  // Lấy danh sách tất cả màu
  static async getAllColors(req: Request, res: Response) {
    const responseData = await colorService.getAllColors()

    if (responseData)
      return res.status(responseData.httpStatus).json(responseData)

    return res
      .status(HttpStatus.INTERNAL)
      .json({ success: false, message: "Internal Server Error" })
  }

  // Lấy thông tin 1 màu theo ID
  static async getColorByID(req: Request, res: Response) {
    const id = Number(req.params.id)
    const responseData = await colorService.getColorByID(id)

    if (responseData)
      return res.status(responseData.httpStatus).json(responseData)

    return res
      .status(HttpStatus.INTERNAL)
      .json({ success: false, message: "Internal Server Error" })
  }

  static async updateColorByID(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (!req.body) 
    {
      return res.status(HttpStatus.ACCEPTED).json({
        success: true, 
        message: "The body is empty" 
      })
    }
    const { name, hex } = req.body
    const responseData = await colorService.updateColorByID(id, name , hex)

    if (responseData)
      return res.status(responseData.httpStatus).json(responseData)

    return res
      .status(HttpStatus.INTERNAL)
      .json({ success: false, message: "Internal Server Error" })
  }

  // Xóa màu theo ID
  static async deleteColorByID(req: Request, res: Response) {
    const id = Number(req.params.id)
    const responseData = await colorService.deleteColorByID(id)

    if (responseData)
      return res.status(responseData.httpStatus).json(responseData)

    return res
      .status(HttpStatus.INTERNAL)
      .json({ success: false, message: "Internal Server Error" })
  }
}
export default Color 
