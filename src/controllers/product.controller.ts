import { Request, Response } from "express";
import HttpStatus from "~/utlis/statusMap";
import * as productService from "~/services/product.services";
import base64File from "~/utlis/base64File";
import Cloudian from "~/services/cloudinary.services";
import parseArray from "~/utlis/parseArray";

class Product {
    // Tạo sản phẩm mới (Admin)
    static async createProduct(req: any, res: Response) {
        const {
            name,
            description,
            price,
            active,
            brandID,
            category,
            discount,
        } = req.body; //Add cateogry and discount to body
        //Validate category
        const parsedCategory = parseArray(category);

        if (parsedCategory.length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Category must be a non-empty array of strings",
            });
        }

        let parsedDiscount = 0;
        //Validate discount
        if (discount !== undefined) {
            parsedDiscount = Number(discount);
            if (
                isNaN(parsedDiscount) ||
                parsedDiscount < 0 ||
                parsedDiscount > 1
            ) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Discount must be between 0 and 1",
                });
            }
        }

        let thumbnails: string[] = [];
        // let thumbnail = req.body.thumbnail;  //Chinh sua thanh upload nhieu anh
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const base64Images = req.files
                .map((file: Express.Multer.File) => base64File(file))
                .filter((b: string) => typeof b === "string");
            if (base64Images.length > 0)
                thumbnails = await Cloudian.uploadImageMany(base64Images);
        }

        const responseData = await productService.createProduct({
            name,
            description,
            price: Number(price),
            active: active === "true" || active === true,
            thumbnail: thumbnails, //upload nhieu images
            brandID: Number(brandID),
            discount: parsedDiscount,
            category: parsedCategory,
        });

        if (responseData)
            return res.status(responseData.httpStatus).json(responseData);

        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
    }

    // Lấy danh sách sản phẩm ngoại trừ sản phẩn Inactive (Public)
    static async getAllProducts(req: Request, res: Response) {
        const responseData = await productService.getAllProducts();

        if (responseData)
            return res.status(responseData.httpStatus).json(responseData);

        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
    }

    // Lấy danh sách tất cả sản phẩm (Admin)
    static async getAllProductsAdmin(req: Request, res: Response) {
        const responseData = await productService.getAllProductsAdmin();

        if (responseData)
            return res.status(responseData.httpStatus).json(responseData);

        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
    }

    // Lấy thông tin 1 sản phẩm theo ID (Public)
    static async getProductByID(req: Request, res: Response) {
        const id = Number(req.params.id);
        const responseData = await productService.getProductByID(id);

        if (responseData)
            return res.status(responseData.httpStatus).json(responseData);

        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
    }

    static async updateProduct(req: any, res: Response) {
        const id = Number(req.params.id);
        const {
            name,
            description,
            price,
            active,
            brandID,
            category,
            discount,
            remove_public_id,
        } = req.body;

        // 1. Upload new images
        let add_public_ids: string[] = [];

        if (Array.isArray(req.files) && req.files.length > 0) {
            const base64Images = req.files
                .map((file: Express.Multer.File) => base64File(file))
                .filter((b: string) => typeof b === "string");

            if (base64Images.length > 0) {
                add_public_ids = await Cloudian.uploadImageMany(base64Images);
            }
        }

        // 2. Parse remove ids
        const remove_public_ids = parseArray(remove_public_id);

        // 3. Build update data
        const updateData: any = { };
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description 
        if (price !== undefined) updateData.price = Number(price);
        if (active !== undefined)
            updateData.active = active === "true" || active === true;
        if (brandID !== undefined) updateData.brandID = Number(brandID);
        if (category !== undefined) 
        {
            const parsedCategory = parseArray(category);
            if (parsedCategory.length === 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Category must be a non-empty array of strings",
                });
            }
            updateData.category = parsedCategory;
        }

        if (discount !== undefined) {
            const parsedDiscount = Number(discount);
            if (
                isNaN(parsedDiscount) ||
                parsedDiscount < 0 ||
                parsedDiscount > 1
            ) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Discount must be between 0 and 1",
                });
            }
            updateData.discount = parsedDiscount;
        }

        // 4. Update DB
        const responseData = await productService.updateProduct(
            id,
            updateData,
            add_public_ids,
            remove_public_ids
        );

        // 5. Nếu DB OK → xóa Cloudinary
        if (responseData?.success && remove_public_ids.length > 0) {
            await Cloudian.dropImageMany(remove_public_ids);
        }

        return res.status(responseData?.httpStatus || HttpStatus.INTERNAL).json(
            responseData ?? {
                success: false,
                message: "Internal Server Error",
            }
        );
    }

    // Xóa sản phẩm (Admin)
    static async deleteProduct(req: Request, res: Response) {
        const id = Number(req.params.id);
        const responseData = await productService.deleteProduct(id);

        if (responseData)
            return res.status(responseData.httpStatus).json(responseData);

        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
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

        if (responseData)
            return res.status(responseData.httpStatus).json(responseData);

        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
    }

    // Lấy sản phẩm theo brand - Dùng cho Related Products (Public)
    static async getProductsByBrand(req: Request, res: Response) {
        const brandID = Number(req.params.brandID);
        const responseData = await productService.getProductsByBrand(brandID);

        if (responseData)
            return res.status(responseData.httpStatus).json(responseData);

        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
    }
}

export default Product;
