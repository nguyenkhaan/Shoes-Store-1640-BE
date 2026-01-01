//Authentication: Xac thuc nguoi dung: JWT Token co hop le hay khong 
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "~/configs/env.config";
import HttpStatus from "~/utlis/statusMap";
//Hau het truong hop deu chi gui acceess token nen o day minh khong kiem tra refresh token nua
const credentials = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ success: false, message: "Missing Authorization Header" });
    }
    const [type, token] = authHeader.split(" ");
    if (!token || type != "Bearer")
        return res
            .status(HttpStatus.FORBIDDEN)
            .json({ success: false, message: "Token is invalid" });
    //Thuc hien gan lai bang req.data -> Route nao ma su dung cai nay thi phai dat lai du lieu la req.data nhe
    try 
    {
        const payload = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET as string); //Tien hanh authentication Refresh token
        //Luc nay ta se dua danh tinh nguoi dung vao 1 truogn req moi, cac truong du lieu van nam trong req.body

        req.user = payload; //Khai bao trong thu muc types moi duoc do, req.user.userID 
        next(); //Next, number 1 Battle
    } 
    catch (err) {
        console.log("Authentication Error: ", err);
        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: "Token is invalid. Please login again",
        });
    }
};
export default credentials;
//Login: Authentication (Dac biet vi luc nay user chua co token) ? Authorization -> Gui refresh token (role: "Admin" , "User"), Client -> Cookies
//Client -> Cookies: token
