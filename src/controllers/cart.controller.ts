//Them gio hang moi va xoa gio hang moi 

import { Request , Response } from "express"
import { JwtPayload } from "jsonwebtoken"
import CartServices from "~/services/cart.services"
import HttpStatus from "~/utlis/statusMap"
class Cart 
{
    static async createCart(req : Request , res : Response) 
    {
        const userID = Number((req.user as JwtPayload).userID) 
        const responseData = await CartServices.createCart(userID) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData)
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" })
    }
    static async deleteCart(req : Request , res : Response) 
    {
        const cartID = Number(req.params.id) 
        const userID = Number((req.user as JwtPayload).userID) 
        const responseData = await CartServices.deleteCart(userID , cartID) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData)
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" })
    }
    static async deleteAllCarts(req : Request , res : Response) 
    {
        const userID = Number((req.user as JwtPayload).userID) 
        const responseData = await CartServices.deleteAllCart(userID) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData)
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" })
    }
    static async getAllCarts(req : Request , res : Response) 
    {
        const userID = Number((req.user as JwtPayload).userID) 
        const responseData = await CartServices.getAllCarts(userID) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData)
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" })
    }
}
export default Cart 