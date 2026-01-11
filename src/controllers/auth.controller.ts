//Cac ham createUser se tien hanh goi xuong database  app.use(url , function)
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
//Cac ham createUser thi sao -> Cac ham thao tac voi database thi tach xuong services
import { registerUser, verifyUser, loginUser , refreshAccessToken , loginGoogle } from "~/services/auth.services";
import HttpStatus from "~/utlis/statusMap";
import upload from "~/configs/multer.config";  
import base64File from "~/utlis/base64File";
class Auth 
{
    static async register(req: Request, res: Response)   //Du lieu nhan luc nay la 
    {
        let file = null    //Nhan lay avatar 
        if (req.file) 
            file = base64File(req.file) //Co the tien hanh upload thang cai chuoi nay len 
        const data = {...req.body} 
        if (file) data.avatar = file 
        const responseData = await registerUser(data);  //Truyen data vao register User 
        
        if (responseData)
            return res.status(responseData.httpStatus).json(responseData);
        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
    }

    static async verify(req: Request, res: Response) {
        //Ham nay moi tien hanh luu nguoi dung xuong database
        const token = req.query.token as string;
        if (!token)
            return res
                .status(400)
                .json({ success: false, message: "Missing token" });
        const responseData = await verifyUser(token);
        if (responseData)
            return res.status(responseData.httpStatus).json(responseData);
        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
    }
    static async ResendVerify(req: Request, res: Response) {
        // Tien hanh gui lai api end point, gui lai duong link kich hoat qua email 
    }
    static async login(req: Request, res: Response) {
        // Phia truoc phai dung middleware thi moi su dung duoc req.user
        const { email, password } = req.body; //Lay email, password tu body (Login)
        const userID = Number(req.loginUserID);
        const responseData = await loginUser(userID, email, password);
        //Tra du lieu thanh cong
        if (responseData)
            return res.status(responseData.httpStatus).json(responseData);
        //Tra du lieu that bai
        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
    }
    static async loginGoogle(req: Request, res: Response) 
    {
        //Tien hanh dang nhao bang google 
        const { code } = req.body  
        const responseData = await loginGoogle(code) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData);
        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
        //Goi du lieu sau 
    }
    static async refresh(req : Request , res : Response) 
    {
        //FE tu goi cai end point nay, nguoi dung khong bam gi het 
        const {userID , email} = (req.body as JwtPayload) 
        const responseData = await refreshAccessToken(userID , email) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData);
        return res
            .status(HttpStatus.INTERNAL)
            .json({ success: false, message: "Internal Server Error" });
    } 
    static async logout(req : Request , res : Response) 
    {
        return res.status(HttpStatus.OK).json({success: true , message : "Log out successfully"})
    } 
}
export { Auth };

//Tao refresh token thi bat buoc phai co roles de xac dinh quyen cua nguoi dung
//