import { Request, Response } from "express"; 
import renderEmail from "~/utlis/renderEmail";
import sendEmail from "~/utlis/email";
import HttpStatus from "~/utlis/statusMap";
import { makeResetPasswordToken } from "~/services/jwt.services";
import { ENV } from "~/configs/env.config";
import { 
    resetUserPassword, 
    findUserByEmail, 
    updateUser 
} from "~/services/user.services"; 
import prisma from "~/configs/mysqlPrisma.config";

class User {
    // 
    static async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        // check email ton tai trong he thong khong
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Email không tồn tại trong hệ thống."
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
            message: "Error while trying to send email. Please try again later"
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
                return res.status(401).json({ success: false, message: "Không tìm thấy ID trong Token" });
            }

            // Cap nhat thong tin nguoi dung
            const updatedUser = await updateUser(Number(userId), { name, phone, address });

            if (updatedUser) {
                return res.status(200).json({
                    success: true,
                    message: "Cập nhật thành công!",
                    data: updatedUser
                });
            }
            return res.status(400).json({ success: false, message: "Cập nhật thất bại" });
            
        } catch (error) {
            console.error("Lỗi chi tiết:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    };
    static getProfile = async (req: any, res: any) => {
        try {
            return res.status(200).json({
                success: true,
                data: req.user
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Lỗi lấy profile" });
        }
    };

    // Bo sung them ham cap nhat anh dai dien cho user
    static async updateAvatar(req: Request, res: Response) {
        try {
            const { userId, avatar } = req.body; // avatar chinh la public_id tren Cloudinary
            const result = await updateUser(Number(userId), { avatar });

            if (result) {
                return res.status(HttpStatus.OK).json({
                    success: true,
                    message: "Cập nhật ảnh đại diện thành công",
                    data: result
                });
            }
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Cập nhật thất bại" });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL).json({ success: false, message: "Internal Error" });
        }
    }
}

export default User;