import prisma from "~/configs/mysqlPrisma.config"
import { generateHash } from "~/utlis/hash"
import { assignUserRole } from "~/services/role.services"
import { UserDTO } from "~/types/UserDTO"    //Su dung kien thuc ve interface 
import HttpStatus from "~/utlis/statusMap";
import Cloudian from "~/services/cloudinary.services";
//[Pending User] 
async function createPendingUser(payload : UserDTO) 
{
    try {
        //Password Handle 
        const password = payload.password 
        const hashPassword = await generateHash(password as string) 
        if (!hashPassword) 
            return false 
        //Avatar Handle 
        let public_id = '' 
        if (payload.avatar) 
            public_id = (await Cloudian.uploadImage(payload.avatar)).public_id

        //Store to the database 
        const result = await prisma.user.create({
            data: {
                ...payload, 
                verify : false, 
                password: hashPassword, 
                avatar: (public_id? public_id : 'https://www.svgrepo.com/show/452030/avatar-default.svg')
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
async function getUserById(id: number) {
    try {
        return await prisma.user.findUnique({ 
            where: { id },
            include: { userRoles: true } // neu can
        });
    } catch (err) {
        console.log(err);
        return null;
    }
}

// UpdateUser
async function updateUser(id: number, data: Partial<UserDTO> & { avatar?: string }) {
    try {
        return await prisma.user.update({
            where: { id },
            data: data
        });
    } catch (err) {
        console.log(err);
        return null;
    }
}

//Reset Password
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
export { activeUser , createPendingUser , findUserByEmail , createUser , resetUserPassword, getUserById , updateUser};
//Document: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/mysql

