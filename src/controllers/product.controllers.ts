import { Request, Response } from "express";
import * as productService from "~/services/product.services";
import HttpStatus from "~/utlis/statusMap";

class Product {
    static async createProduct(req: Request, res: Response) {
        try {
            const responseData = await productService.createProduct(req.body);
            return res.status(responseData.httpStatus).json(responseData);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
        }
    }

    static async getAllProducts(req: Request, res: Response) {
        const responseData = await productService.getProducts();
        return res.status(responseData.httpStatus).json(responseData);
    }

    static async getProductByID(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const responseData = await productService.getProductById(id);
            return res.status(responseData.httpStatus).json(responseData);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Server Error" });
        }
    }
}

export default Product;