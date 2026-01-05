import prisma from "~/configs/mysqlPrisma.config"
import { generateHash } from "~/utlis/hash"
import { assignUserRole } from "~/services/role.services"
import { UserDTO } from "~/types/UserDTO"    //Su dung kien thuc ve interface 
//[Pending User] 
async function createPendingUser(payload : UserDTO) 
{
    try {
        const password = payload.password 
        const hashPassword = await generateHash(password as string) 
        if (!hashPassword) 
            return false 
        const result = await prisma.user.create({
            data: {
                ...payload, 
                verify : false 
            }
        })
        //Assign permission to user 
        await assignUserRole(result.id , ["User"])
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
async function activeUser(userID : number , email : string) {  //Ham dung de kich hoat nguoi dung 
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
async function createUser(payload : UserDTO) 
{
    try {
        const user = await prisma.user.create({
            data: {
                ...payload , verify: true 
            }
        }) 
        return user 
    } 
    catch (err) {
        console.log(err) 
        return null 
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


export { activeUser , createPendingUser , findUserByEmail , createUser };
//Document: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/mysql

