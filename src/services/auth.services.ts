import {
    createPendingUser,
    activeUser,
    findUserByEmail,
} from "~/services/user.services";
import { decodeToken, encodeToken , createVerifyToken } from "~/services/jwt.services";

import HttpStatus from "~/utlis/statusMap";
async function registerUser(data: any) {
    try {
        //name , email , avatar , password , phone , address , avatar
        const {email , password} = data 
        if (!email || !password)
            return {
                message: "Missing information",
                success: false,
                httpStatus: HttpStatus.BAD_REQUEST,
            };
        //Check if user exists 
        const isUser = await findUserByEmail(email)  
        if (isUser) 
            return {
                message: "You are already a user", 
                success: false, 
                httpStatus: HttpStatus.CONFLICT 
            }
        //Create pending user 
        const pendingUser = await createPendingUser(data);
        if (pendingUser) {
            const access_token = await createVerifyToken(pendingUser.id , email)   //Tao access_token tam thoi de verifiy nguoi dung 
            return {
                message:
                    "Register successfully. Please check your email for verify",
                success: true,
                token: access_token,
                httpStatus: HttpStatus.OK,
            };
        }
        return {
            message: "Register failed. Please try again later",
            success: false,
            httpStatus: HttpStatus.BAD_REQUEST,
        };
    } catch (err) {
        console.log(">>> Register Error: ", err);
        return null;
    }
}

async function verifyUser(token: string) {
    try {
        const result = decodeToken(token, "verify" ,"email-verify");
        if (result == 0)
            return {
                success: false,
                message: "Invalid token purpose",
                httpStatus: HttpStatus.UNAUTHORIZED,
            };
        if (result == -1)
            return {
                success: false,
                message: "Your session has been expired",
                httpStatus: HttpStatus.BAD_REQUEST,
            };

        // Cap nhat trang thai cho nguoi dung

        //Viet them ham vao cho user-services: Lay thong tin cu the ve 1 nguoi dung dua tren userID, Trong ham utlist thi viet 1 ham de xac dinh trang thai nguoi dung de chan logic
        const userID = result.userID;
        const email = result.email;
        const verifyResult = await activeUser(userID, email);
        if (!verifyResult)
            return {
                message: "User has not been recognized",
                success: false,
                httpStatus: HttpStatus.UNAUTHORIZED,
            };
        return {
            message: "Your email has been verified successfully",
            success: true,
            httpStatus: HttpStatus.CREATED,
        };
    } catch (err) {
        console.log(">>> Verify Error", err);
        return null;
    }
}

export { registerUser, verifyUser };





/*  
id        Int        @id @default(autoincrement())
  name      String
  email     String     @unique
  password  String
  phone     String
  address   String
  avatar    String     @default("https://www.svgrepo.com/show/452030/avatar-default.svg")
  verify    Boolean    @default(false)
  userRoles UserRole[]
  carts     cart?
  orders    Order[]



*/ 