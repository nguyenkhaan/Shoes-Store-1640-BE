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
        if ((payload as JwtPayload).purpose != 'reset-password' || email != (payload as JwtPayload).email) 
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false, 
                message: "Token invalid"
            }) 
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
async function verifyResetEmailToken(req : Request , res : Response , next : NextFunction) 
{
    const {token , email} = req.body //Kem kem cai token de tien hanh verify 
    try {
        const payload = jwt.verify(token , ENV.RESET_EMAIL_TOKEN_SECRET as string)
        if ((payload as JwtPayload).purpose != 'reset-email' || email != (payload as JwtPayload).email) 
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false, 
                message: "Token invalid"
            }) 
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

export {verifyResetEmailToken , verifyResetPasswordToken}