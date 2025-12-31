//Cac ham createUser se tien hanh goi xuong database
import { Request, Response } from "express";
//Cac ham createUser thi sao -> Cac ham thao tac voi database thi tach xuong services
import { registerUser, verifyUser } from "~/services/auth.services";
import HttpStatus from "~/utlis/statusMap";
class Auth {
    static async register(req: Request, res: Response) {
        const responseData = await registerUser(req.body) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData) 
        return res.status(HttpStatus.INTERNAL).json({}) 
    }

    static async verify(req: Request, res: Response) 
    {
        //Ham nay moi tien hanh luu nguoi dung xuong database
        const token = req.query.token as string;
        if (!token)
            return res
                .status(400)
                .json({ success: false, message: "Missing token" });
        const responseData = await verifyUser(token) 
        if (responseData) 
            return res.status(responseData.httpStatus).json(responseData) 
        return res.status(HttpStatus.INTERNAL).json({}) 
    } 
    static async login(req : Request , res : Response) 
    {

    }
    static async loginGoogle(req : Request , res : Response) 
    {
        
    }
}
export { Auth };
