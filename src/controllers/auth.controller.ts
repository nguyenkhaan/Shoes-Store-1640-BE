//Cac ham createUser se tien hanh goi xuong database 

import { createUser } from "~/services/user.services"
import { Request , Response } from "express"
//Cac ham createUser thi sao -> Cac ham thao tac voi database thi tach xuong services 

class Auth 
{
    static async register(req : Request , res : Response) 
    {
        const {username , email , password} = req.body 
        const data = await createUser(username , email , password) 
        
        return res.status(200).json(data) 
        // return res.send('Hello world') 
    }
    //Qua trinh dang ki: Register -> Verify (Tien hanh tao nguoi dung trong endpoint nay)
    //Qua trinh dang nhap: Middleware Authentication (Xac thuc) -> Login (endpoint) 
    //Qua trinh login by google: LoginGoogle (endpoint) 
} 
export {Auth}