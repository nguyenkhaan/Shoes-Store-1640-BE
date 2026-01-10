import { Request, Response } from "express"; 
import renderEmail from "~/utlis/renderEmail";
import sendEmail from "~/utlis/email";
import bcrypt from "bcrypt";
import HttpStatus from "~/utlis/statusMap";
import { makeResetPasswordToken } from "~/services/jwt.services";
import { ENV } from "~/configs/env.config";
import { 
    resetUserPassword, 
    findUserByEmail, 
    updateUser
} from "~/services/user.services"; 

//Xu ly upload anh dai dien
import base64File from "~/utlis/base64File"; 
import Cloudian from "~/services/cloudinary.services";
import prisma from "~/configs/mysqlPrisma.config";

import jwt from "jsonwebtoken";

class User {
    // 
    static async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        // check email ton tai trong he thong khong
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Email does not exist in our system."
            });
        }

        // Tao token de reset password
        const token = makeResetPasswordToken({
            email, role: ["User"]
        });
        
        // check token  
        console.log("Mã Reset Token của bạn là:", token);

        const content = await renderEmail('changePassword', {
            to: email,
            resetLink: `${ENV.FE}/reset-password?token=${token}`,
            expireMinutes: 5
        });

        const sendResult = await sendEmail('ShoeStore', email, 'Reset Password', content);
        
        if (sendResult) {
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Email has been sent. Check your mailbox"
            });
        }

        return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
            success: false,
            message: "Too many requests. Please try again later"
        });
    }

    // doi mat khau
    static async changePassword(req: Request, res: Response) {
        const { email, password } = req.body;
        const responseData = await resetUserPassword(email, password);
        
        if (responseData) {
            return res.status(responseData.httpStatus).json(responseData);
        }

        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
    }

    // Cap nhat profile nguoi dung
    static updateProfile = async (req: any, res: any) => {
        try {
            const { name, phone, address } = req.body;

            // Lay userID tu token
            const userId = req.user.id || req.user.userID; // tranh bi undefined

            if (!userId) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ 
                    success: false, 
                    message: "Unauthorized: User ID not found." 
                });
            }

            // Cap nhat thong tin nguoi dung
            const updatedUser = await updateUser(Number(userId), { name, phone, address });

            if (updatedUser) {
                return res.status(HttpStatus.OK).json({
                    success: true,
                    message: "Profile updated successfully.",
                    data: updatedUser
                });
            }
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: "Failed to update profile." 
            });
            
        } catch (error) {
            return res.status(HttpStatus.INTERNAL).json({ 
                success: false, 
                message: "System error occurred." 
            });
        }
    };
    static getProfile = async (req: any, res: any) => {
        try {
            const userId = req.user?.id || req.user?.userID;

            const user = await prisma.user.findUnique({
                where: { id: Number(userId) },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    avatar: true,
                    userRoles: true
                }
            });
            
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({ 
                    success: false, 
                    message: "User not found." 
                });
            }

            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Profile retrieved successfully.",
                data: user
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL).json({ 
                success: false, 
                message: "Error fetching user profile." 
            });
        }
    };

    // Bo sung them ham cap nhat anh dai dien cho user
    static async updateAvatar(req: Request, res: Response) {   //Ham nay sai -> Su dung multer.single('avatar') 
         //Xem lai cai file a code do trong route/images_route, a co de cho may dua coi cach de lay file anh va upload len cloudianry ma ma?? 
        try {
            const userReq = req as any;
            const userId = userReq.user?.id || userReq.user?.userID;

            const file = base64File(req.file); 
            
            if (!file) {
                return res.status(HttpStatus.BAD_REQUEST).json({ 
                    success: false, 
                    message: "No image file provided." 
                });
            }

            // Upload len Cloudinary
            const uploadResult = await Cloudian.uploadImage(file);
            const avatarPublicId = uploadResult.public_id;  

            // Update avatar trong database
            const updatedUser = await prisma.user.update({
                where: { id: Number(userId) },
                data: { avatar: avatarPublicId }
            });

            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Avatar updated successfully.",
                data: {
                    avatar: updatedUser.avatar,
                    // Tra ve url de FE hien thi
                    url: await Cloudian.getImageUrl(avatarPublicId) 
                }
            });

        } catch (error) {
            console.error("Avatar Update Error:", error);
            return res.status(HttpStatus.INTERNAL).json({ 
                success: false, 
                message: "Internal Server Error during avatar update." 
            });
        }
    }

}

export default User;

/**
 * REVIEW CODE 
 * 1. Chinh cac message lai thanh Tieng anh 
 * 2. O ham upload avatar, ben phia FE gui cai file ve, ko phai cai public_id. Ho se gui cai anh ve nen em  phai dung multer de nhan cai file do, 
 * Update lai avatar bang cach tai anh nguoi ta gui len cloudinary, va thay public_id luu trong db thanh cai public_id moi (Do viec upload hinh anh len)
 */