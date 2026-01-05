import { Request , Response } from "express";
import sendEmail from "~/utlis/email";
import renderEmail from "~/utlis/renderEmail";
import HttpStatus from "~/utlis/statusMap";
import { ENV } from "~/configs/env.config";
class Admin 
{
    // static async createProduct(req : Request , res : Response) //Dung de tao moi 1 san pham 
    // {
    //     const {name, description , active , price , brandID , thumbnail} = req.body  

    // } Do phan Product quan li 
    static async forgotPassword(req : Request , res : Response)
    {
        //Tien hanh gui 1 email den email do nguoi dung truyen den, sau do ho se bam vao route change Password 
        const email = ENV.ADMIN_EMAIL as string 
        const content = await renderEmail('changePassword' , {
            to: email, 
            resetLink: 'http://localhost:3000', 
            expireMinutes: 10 
        })
            //Cach su dung: Tao file template trong thu muc templates, goi ham renderEmail de khoi tao noi dung email, truyen vao ten file template vua tao 
            //Truyen du lieu vao template bang 1 object { } 
        const sendResult = await sendEmail('ShoeStore' , email , 'Reset Password' , content) 
        if (sendResult) 
            return res.status(HttpStatus.OK).json({
                success: true, 
                message: "Email has been sent. Check your mailbox"
            }) 
        
        return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
            success: false, 
            message : "Error while trying to send email. Please try again later"
        })
    }
    static async resetPassword(req : Request , res : Response) 
    {

    }
}
export default Admin 