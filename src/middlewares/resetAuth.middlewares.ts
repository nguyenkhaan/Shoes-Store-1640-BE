import { Request , Response , NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "~/configs/env.config";
import HttpStatus from "~/utlis/statusMap";

async function verifyResetPasswordToken(req : Request , res : Response , next : NextFunction) 
{
    // console.log('>>> Check verify password token') 
    const {token , email} = req.body 
    try {
        const payload = jwt.verify(token , ENV.RESET_PASSWORD_TOKEN_SECRET as string)
        next() 
    } 
    catch (err: any) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            message:
                err.name === "TokenExpiredError"
                    ? "Reset token expired"
                    : "Invalid reset token",
        });
    }
}
async function verifyResetEmailToken(req : Request , res : Response) 
{

}

export {verifyResetEmailToken , verifyResetPasswordToken}