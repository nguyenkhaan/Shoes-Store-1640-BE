import prisma from "~/configs/mysqlPrisma.config";
import { generateHash } from "~/utlis/hash";
import HttpStatus from "~/utlis/statusMap";
async function resetUserPassword(email : string , password : string) 
{
    try {
        const hashedPassword = await generateHash(password) 
        const resultChange = await prisma.user.update({
            where: {
                email 
            }, 
            data : {
                password: hashedPassword
            }
        })
        return {
            success: true, 
            message: "Password changes successfully", 
            httpStatus: HttpStatus.OK 
        }
    } 
    catch (err) {
        return {
            success: false, 
            message: "Password changes failed", 
            httpStatus: HttpStatus.UNVAILABLE
        }
    }
}
export {resetUserPassword}