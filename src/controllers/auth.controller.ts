//Cac ham createUser se tien hanh goi xuong database

import { Request, Response } from "express";
import { verifyUser, createPendingUser } from "~/services/user.services";
//Cac ham createUser thi sao -> Cac ham thao tac voi database thi tach xuong services
import { encodeToken , decodeToken } from "~/services/jwt.services";
class Auth {
    static async register(req: Request, res: Response) {
        const { username, email, password } = req.body;
        // Luu nguoi dung tam thoi vao co so du lieu va bat verify = false
        // Can phai co ham kiem tra xem nguoi dung da ton tai chua -> Neu nhu ton tai roi thi khong cho dang ki

        const data = await createPendingUser(username, email, password);
        if (data) {
            const access_token = encodeToken({
                userID: data.id,
                email: data.email,
                purpose: "email-verify",
            } , ); //Gui qua FE thi se viet la userID, khong nen viet moi chu id, con o BE thi luu moi chu id thoi cung duoc
            return res.status(200).json({
                message: "Register successfully. Please check your email", 
                success: true, 
                token : access_token 
            })
        }
        return res.status(500).json({
            message: "Register Failed. Please try again later",
            success: false,
        });
    }

    static async verify(req: Request, res: Response) {
        //Ham nay moi tien hanh luu nguoi dung xuong database
        const token = req.query.token as string 
        console.log(token) 
        if (!token) 
            return res.status(400).json({success: false , message : "Missing token"}) 

        const result = decodeToken(token , 'access' , 'email-verify') 
        if (result == 0) 
            return res.status(401).json({success: false , message : "Invalid token purpose"}) 
        if (result == -1) 
            return res.status(401).json({success: false , message : "Your session has been expired"}) 
        
        // Cap nhat trang thai cho nguoi dung 


        //Viet them ham vao cho user-services: Lay thong tin cu the ve 1 nguoi dung dua tren userID, Trong ham utlist thi viet 1 ham de xac dinh trang thai nguoi dung de chan logic
        const userID = result.userID 
        const email = result.email 
        await verifyUser(userID , email) 
        return res.status(200).json({
            message: "Your email has been verified successfully", 
            success: true 
        })
    }

}
export { Auth };
