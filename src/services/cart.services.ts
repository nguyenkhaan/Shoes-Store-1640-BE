import HttpStatus from "~/utlis/statusMap";
import prisma from "~/configs/mysqlPrisma.config";

class CartServices 
{
    static async getCarts(userID : number) 
    {
        try 
        {
            const response = await prisma.cart.findUnique({
                where: {
                    userID
                }, 
                select: {
                    id: true 
                }
            })
            return {
                success: true, 
                message: "Get all carts successfully", 
                cartID: response?.id, 
                httpStatus: HttpStatus.OK 
            }
        } 
        catch (err) {
            console.error(">>> Get carts error:", err);
            return {
              success: false,
              message: "Get cart failed",
              httpStatus: HttpStatus.NOT_FOUND,
            };
        }
    }
    static async createCart(userID : number) 
    {
        try 
        {
            const response = await prisma.cart.create({
                data: {
                    userID : userID
                }
            })
            return {
                success: true, 
                message: "Create cart successfully", 
                httpStatus : HttpStatus.CREATED, 
                cartID: response.id   //Tra ve cartID cho phai nguoi dung 
            }
        } 
        catch (err) {
            console.error(">>> Create cart error:", err);
            return {
              success: false,
              message: "Create cart failed",
              httpStatus: HttpStatus.BAD_REQUEST,
            };
        }
    }
    static async deleteCart(userID : number) 
    {
        try 
        {
            await prisma.cart.delete({
                where : {
                    userID  
                }
            })
            return {
                success: true, 
                message: "delete cart successfullt", 
                httpStatus: HttpStatus.OK 
            }
        } 
        catch (err) {
            console.error(">>> Delete cart error:", err);
            return {
              success: false,
              message: "Delete failed",
              httpStatus: HttpStatus.BAD_REQUEST,
            };
        }
    }
}
export default CartServices