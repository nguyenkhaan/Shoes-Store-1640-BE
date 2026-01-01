//Cac ham createUser se tien hanh goi xuong database  app.use(url , function)
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
//Cac ham createUser thi sao -> Cac ham thao tac voi database thi tach xuong services
import { registerUser, verifyUser, loginUser } from "~/services/auth.services";
import { findUserByEmail } from "~/services/user.services";
import HttpStatus from "~/utlis/statusMap";


class Auth 
{
    static async register(req: Request, res: Response) {
        const responseData = await registerUser(req.body);
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
        // Tien hanh gui lai api end point
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
    static async loginGoogle(req: Request, res: Response) {}
    static async refresh(req : Request , res : Response) {} 
    static async logout(req : Request , res : Response) {} 
}
export { Auth };

//Tao refresh token thi bat buoc phai co roles de xac dinh quyen cua nguoi dung
//