// Luc login -> Kiem tra su active bang email 
// Luc su dung dich vu -> kiem tra userActive bang userID luu ben trong JWT Token 
import prisma from "~/configs/mysqlPrisma.config";
import { Request , Response ,NextFunction } from "express";
import HttpStatus from "~/utlis/statusMap";
import { JwtPayload } from "jsonwebtoken";
function checkUserStatusByEmail() //Kiem tra trang thai nguoi dung , tim kiem bang email 
{
    const checkUserStatusMiddleware = async (req : Request , res : Response , next : NextFunction) => {
        const {email} = req.body 
        console.log('>>> Check email: ' , email) 
        let user = null 
        user = await prisma.user.findUnique({
            where: {
                email
            }, 
            select: {
                id : true , verify: true 
            }
        }) 
        // console.log('>>> Check user: ' , user) 
        if (!user) 
            return res.status(HttpStatus.UNAUTHORIZED).json({success: false , message : "Unauthorized user"}) 
        if (user.verify == false) 
            return res.status(HttpStatus.FORBIDDEN).json({success: false , message : "User haven't been verified"})
        //Co ton tai nguoi dung 
        req.loginUserID = user.id //Gan cai loginUserID nay vao de su dung cho login 
        next() 
    }
    return checkUserStatusMiddleware
} 

function checkUserStatusByID() //Kiem tra trang thai nguoi dung , tim kiem nguoi dung bang userID 
{
    const checkUserStatusMiddleware = async (req : Request , res : Response , next : NextFunction) => {
        const userID = (req.user as JwtPayload).userID 
        let user = null 
        user = await prisma.user.findFirst({
            where: {
                id : userID 
            }, 
            select: {
                id : true , verify: true 
            }
        }) 
        if (!user) 
            return res.status(HttpStatus.UNAUTHORIZED).json({success: false , message : "Unauthorized user"}) 
        if (user.verify == false) 
            return res.status(HttpStatus.FORBIDDEN).json({success: false , message : "User haven't been verified"})
        next() 
    }
    return checkUserStatusMiddleware
}

export {checkUserStatusByEmail , checkUserStatusByID}