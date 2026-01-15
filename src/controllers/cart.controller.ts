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
        const userID = Number((req.user as JwtPayload).userID) 
        const responseData = await CartServices.deleteCart(userID) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData)
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" })
    }
    static async getAllCarts(req : Request , res : Response) 
    {
        const userID = Number((req.user as JwtPayload).userID) 
        const responseData = await CartServices.getCarts(userID) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData)
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" })
    }
    static async saveProduct(req : Request , res : Response) 
    {
        const userID = Number((req.user as JwtPayload).userID) 
        const { productVariantID , quantity } = req.body 
        const responseData = await CartServices.saveProductToCart(userID , Number(productVariantID) , quantity) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData)
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" })
    }
    static async getProductInCarts(req : Request , res : Response) 
    {
        const userID = Number((req.user as JwtPayload).userID) 
        const responseData = await CartServices.getAllProductsInCart(userID) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData)
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" })
    }
    static async removeProductFromCart(req : Request , res : Response) 
    {
        const cartProductID = Number(req.params.id)
        const responseData = await CartServices.removeProductFromCart(cartProductID) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData)
        return res
        .status(HttpStatus.INTERNAL)
        .json({ success: false, message: "Internal Server Error" })
    }
}
export default Cart 