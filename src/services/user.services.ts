import prisma from "~/configs/mysqlPrisma.config"
import { compareHash, generateHash } from "~/utlis/hash"
import { assignUserRole } from "~/services/role.services"
import { UserDTO } from "~/types/UserDTO"    //Su dung kien thuc ve interface 
import HttpStatus from "~/utlis/statusMap";
import Cloudian from "~/services/cloudinary.services";
import { makeResetEmailToken } from "~/services/jwt.services";
//[Pending User] 
class UserServices 
{
    static async createPendingUser(payload : UserDTO) 
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
            //Tao gio hang cho nguoi dung 
            await prisma.cart.create({
                data: {
                    userID: result.id 
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
    static async activeUser(userID : number , email : string) {  //Ham dung de kich hoat nguoi dung 
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
    static async createUser(payload : UserDTO) 
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
    static async findUserByEmail(email : string) 
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
    static async getUserById(id: number) {
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
    static async updateUser(id: number, data: Partial<UserDTO> & { avatar?: string }) {
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
    static async resetUserPassword(email : string , password : string) 
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
    static async lostEmail(userID: number, newEmail: string, password: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userID },
                select: { password: true, email: true }
            })
    
            if (!user) return {
                success: false,
                message: "User not found",
                httpStatus: HttpStatus.NOT_FOUND
            }
    
            const emailExists = await prisma.user.findFirst({
                where: {
                    email: newEmail,
                    // NOT: { id: userID }
                }
            })
    
            if (emailExists) return {
                success: false,
                message: "Email already in use",
                httpStatus: HttpStatus.CONFLICT
            }
    
            const isValid = await compareHash(password, user.password as string)
            if (!isValid) return {
                success: false,
                message: "Password is incorrect",
                httpStatus: HttpStatus.FORBIDDEN
            }
            return {
                success: true,
                httpStatus: HttpStatus.OK
            }
        } catch (err) {
            return {
                success: false,
                message: "Change email failed",
                httpStatus: HttpStatus.INTERNAL
            }
        }
    }
    static async changeEmail(userID : number , email : string) 
    {
        try 
        {
            await prisma.user.update({
                where: {
                    id : userID
                }, 
                data : {
                    email
                }
            })
            return {
                success: true,
                message: "Email updated successfully",
                httpStatus: HttpStatus.OK
            }
        } 
        catch (err) 
        {
            return {
                success: false,
                message: "Change email failed",
                httpStatus: HttpStatus.INTERNAL
            }
        }
    }
}

export default UserServices
//Document: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/mysql

