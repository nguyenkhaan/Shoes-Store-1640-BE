import prisma from "~/configs/mysqlPrisma.config"
import { generateHash } from "~/utlis/hash"
//[Real User]
async function verifyUser(userID : number , email : string) {
    try {
        //Ham dung de bat verify cho nguoi dung 
        const result = await prisma.user.update({
            where: {
                id: userID, email: email
            }, 
            data: {
                verify: true 
            }
        })
        return result 
    } 
    catch (err) 
    {
        console.log(err); //Su dung cai nay de log loi 
        return null 
    }
}





//[Pending User] 
async function createPendingUser(username: string , email : string , password: string) 
{
    try {
        const hashPassword = await generateHash(password) 
        if (!hashPassword) 
            return false 
        const result = await prisma.user.create({
            data: {
                email , username , password : hashPassword, verify: false //false la nguoi dung chua tien hanh verify
            }
        })
        // console.log(' >>> Check thong tin nguoi dung: ' , result)   
        return result
    } 
    catch (err) 
    {
        console.log(err) 
        return null 
    }
}
export { verifyUser , createPendingUser };
//Document: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/mysql

