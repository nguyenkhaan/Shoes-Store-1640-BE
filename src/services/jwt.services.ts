import jwt from 'jsonwebtoken' 
import { ENV } from '~/configs/env.config'

function encodeToken(payload : object , type = 'access') 
{
    const secret_key = (type == 'access'? ENV.ACCESS_TOKEN_SECRET : ENV.REFRESH_TOKEN_SECRET)
    const options = {
        expiresIn: 10 * 60   //10 minutes 
    }
    if (type == 'refresh') 
    {
        options.expiresIn = 60*24*60*5 //5 days 
    }
    const token = jwt.sign(payload , secret_key as string , options)
    return token
} 
function decodeToken(token : string , type = 'access' , expectedPurpose = '') //Nhan vao 1 token va giai du lieu ra 
{
    try {
        const secret_key = (type == 'access'? ENV.ACCESS_TOKEN_SECRET : ENV.REFRESH_TOKEN_SECRET)
        //jwt.verify() : Doc token co xac thuc day du, tra ve du lieu dng tin cay , jwt.decode() : Ch doc token, khong lam gi ca 
        const payload = jwt.verify(token , secret_key as string) as jwt.JwtPayload 
        if (payload.purpose !== expectedPurpose) 
            return 0 
        return payload
    } 
    catch (err : any) 
    {
        if (err.name == 'TokenExpiredError')
            return -1 // The token has been expired 
        return 0 
    }
}
export {encodeToken , decodeToken}