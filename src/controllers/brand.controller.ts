//Cai nay dung de tao moi brand 
import { Request , response, Response } from "express";
import { createBrand , getBrands , getBrandById , updateBrandByID , deleteBrandByID } from "~/services/brand.services";
import HttpStatus from "~/utlis/statusMap";
class Brand 
{
    static async createBrand(req: Request , res : Response)   //Chi co admin moi co quyen them brand 
    {
        const {name} = req.body 
        const responseData = await createBrand(name) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData) 
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" });
    }
    static async getAllBrands(req : Request , res : Response) 
    {
        //Lay danh sach tat ca nhan hang 
        const responseData = await getBrands() 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData) 
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" });
    }
    static async getBrandByID(req : Request , res : Response) 
    {
        const id = Number(req.params.id) 
        const responseData = await getBrandById(id) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData) 
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" });
    }  //Ham dung de lay thong tin ve 1 nhan hang 
    static async updateBrand(req : Request , res : Response) 
    {
        const {name} = req.body 
        const id = Number(req.params.id) 
        const responseData = await updateBrandByID(id , name) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData) 
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" });
    }
    static async deleteBrand(req : Request , res : Response) 
    {
        const id = Number(req.params.id)
        const responseData = await deleteBrandByID(id)
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData) 
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" });
    }
}
export default Brand 