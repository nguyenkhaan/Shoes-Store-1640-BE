//Middleware dung de validation du lieu 
/**
 * 1. Password phai chua tu 8 ki tu tro len 
 * 2. Email phai thuc hien theo dung dinh dang 
 */
import { Request , Response , NextFunction } from "express"
import HttpStatus from "~/utlis/statusMap"
import Rule from "~/utlis/validationRules"
class Validation 
{
    static email(req : Request , res : Response , next : NextFunction) 
    {
        const { email } = req.body 
        if (!email) 
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false, 
                message : "Missing email", 
            })  
        const check = Rule.email(email) 
        if (!check) 
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false, 
                message: "Invalid Email Format" 
            }) 
        next() 
    }  
    static password(req : Request , res : Response , next : NextFunction) 
    {
        const {password} = req.body 
        if (!password) 
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false, 
                message : "Missing password", 
            })  
        const check = Rule.password(password) 
        if (!check)
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false, 
                message: "Invalid Password Format" 
            }) 
        next()  
    }
}
export default Validation