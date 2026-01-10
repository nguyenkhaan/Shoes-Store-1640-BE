import { Request , response, Response } from "express";
import renderEmail from "~/utlis/renderEmail";
import sendEmail from "~/utlis/email";
import HttpStatus from "~/utlis/statusMap";
import { makeResetPasswordToken } from "~/services/jwt.services";
import { ENV } from "~/configs/env.config";
import { resetUserPassword } from "~/services/resetPassword.services";
class User 
{
    static async forgotPassword(req : Request , res : Response) 
    {
        const {email} = req.body 
        const token = makeResetPasswordToken({
            email, role: ["User"]
        })  //verify Token , Kiem tra email co ton tai trong he thong khong 

        const content = await renderEmail('changePassword' , {
            to : email, 
            resetLink: `${ENV.FE}/reset-password?token=${token}`, //Tao token va gui den FE 
            expireMinutes: 5 
        })
        const sendResult = await sendEmail('ShoeStore' , email , 'Reset Password' , content) 
        console.log(sendResult)
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
    static async changePassword(req : Request , res : Response) 
    {
        //Middleware nay dung de change password 
        const {email , password} = req.body 
        const responseData = await resetUserPassword(email , password) 
        if (responseData)
            return res.status(responseData.httpStatus).json(responseData);
        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });

    }
}
export default User 