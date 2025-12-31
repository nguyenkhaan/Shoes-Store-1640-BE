import prisma from "~/configs/mysqlPrisma.config"
import { generateHash } from "~/utlis/hash"
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
//[Active User]
async function activeUser(userID : number , email : string) {
    try {
        const user = await prisma.user.findFirst({
          where: { id: userID, email }  //Kiem tra xem user co ton tai khong 
        })
      
        if (!user) return null
      
        return await prisma.user.update({
          where: { id: userID },
          data: { verify: true }
        })
      } catch (err) {
        console.error(err)
        throw err // hoặc return null tùy thiết kế API
      }
}

//Find User By Email 
async function findUserByEmail(email : string) 
{
    try {
        const chk = await prisma.user.findFirst({
            where: {
                email
            }
        })
        return chk 
    } 
    catch (err) {
        console.log(err) 
        return false 
    }
}
//Get user By id 


export { activeUser , createPendingUser , findUserByEmail };
//Document: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/mysql

