import UserServices from "~/services/user.services";
import { decodeToken, encodeToken , createVerifyToken, makeAccessToken , decodeGoogleToken } from "~/services/jwt.services";

import HttpStatus from "~/utlis/statusMap";
import { compareHash } from "~/utlis/hash";
import { findRoles } from "~/services/role.services";
import prisma from "~/configs/mysqlPrisma.config"
import { ENV } from "~/configs/env.config";
import renderEmail from "~/utlis/renderEmail";
import sendEmail from "~/utlis/email";
async function registerUser(data: any) {
    try {
        //Deadline di dit nen gpt thong cam nhe 
        const { email, password } = data;

        if (!email || !password) {
            return {
                message: "Missing information",
                success: false,
                httpStatus: HttpStatus.BAD_REQUEST,
            };
        }

        const existingUser = await UserServices.findUserByEmail(email);

        // User đã verify → không cho đăng ký lại
        if (existingUser && existingUser.verify) {
            return {
                message: "You are already a user",
                success: false,
                httpStatus: HttpStatus.CONFLICT,
            };
        }

        // User tồn tại nhưng CHƯA verify → gửi lại mail verify
        if (existingUser && !existingUser.verify) {
            const token = await createVerifyToken(existingUser.id, email);
            console.log('>>> Verify TOken: ' , token) 
            const content = await renderEmail("verifyAccountTemp", {
                email,
                confirmLink: `${ENV.FE}/login?token=${token}`,  //chinh sua lai route 
                expireMinutes: 5,
            });

            await sendEmail(
                "ShoeStore",
                email,
                "Verify your account",
                content
            );

            return {
                message: "Verification email resent. Please check your inbox.",
                success: true,
                httpStatus: HttpStatus.OK,
            };
        }

        // Tạo user mới (verify = 0)
        const pendingUser = await UserServices.createPendingUser(data);

        if (pendingUser) {
            const token = await createVerifyToken(pendingUser.id, email);
            console.log('Verify token: ' , token) 
            const content = await renderEmail("verifyAccount", {
                email,
                verifyLink: `${ENV.FE}/verify-email?token=${token}`,
                expireMinutes: 5,
            });

            await sendEmail(
                "ShoeStore",
                email,
                "Verify your account",
                content
            );

            return {
                message: "Register successfully. Please verify your email.",
                success: true,
                httpStatus: HttpStatus.OK,
            };
        }

        return {
            message: "Register failed",
            success: false,
            httpStatus: HttpStatus.BAD_REQUEST,
        };
    } catch (err) {
        console.log(">>> Register Error:", err);
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
        const verifyResult = await UserServices.activeUser(userID, email);
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

async function loginUser(userID : number , email : string , password : string) 
{
    const hashedPassword = await prisma.user.findFirst({
        where: {id : userID}, // dong bo ten bien thanh id
        select: {
            password: true 
        }
    })
    console.log('>>useloginID: ' , userID , ' user email ' , email , ' password ' , password)
    const isPassword = await compareHash(password , hashedPassword?.password as string) 
    if (!isPassword) 
        return {
            success: false, 
            httpStatus: HttpStatus.UNAUTHORIZED, 
            message: "Wrong password" 
        } 
    const roles = await findRoles(userID) //Tim kiem cac roles cua nguoi dung 
    // console.log('>>> Check find Roles: ' , roles , 'userID: ' , userID)
    const [access_token , refresh_token] = encodeToken({
        userID , email, roles  //Tao token voi cac roles duoc tim kiem trong bang 
    })  
    return {
        success: true, 
        httpStatus: HttpStatus.OK, 
        message: "Login successfully", 
        accessToken: access_token, 
        refreshToken: refresh_token
    }

}

async function refreshAccessToken(userID : number , email : string) 
{
    const roles = await findRoles(userID) 
    const access_token = makeAccessToken({
        id :userID ,
        email ,
        roles
    }) 
    return {
        success: true, 
        message : "New Access Token Created", 
        httpStatus: HttpStatus.OK, 
        accessToken : access_token
    }
}

async function getGoogleToken(code: string) {
    const url = "https://oauth2.googleapis.com/token";

    const body = new URLSearchParams({
        code,
        client_id: ENV.OATH_CLIENT_ID as string,
        client_secret: ENV.OATH_CLIENT_SECRET as string,
        redirect_uri: ENV.FE ?? "",
        grant_type: "authorization_code",
    });
    const r = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });

    if (!r.ok) {
        console.error("Google token error:", await r.text());
        return null;
    }

    const response = await r.json();
    return response;
}

async function loginGoogle(code: string) {
    const tokenData = await getGoogleToken(code);

    if (!tokenData?.id_token) {
        return {
            success: false,
            message: "Invalid Google code",
            httpStatus: HttpStatus.BAD_REQUEST,
        };
    }
    const payload = await decodeGoogleToken(tokenData.id_token);

    if (!payload || !payload.email_verified || !payload.sub) {
        return {
            success: false,
            message: "Google authentication failed",
            httpStatus: HttpStatus.BAD_REQUEST,
        };
    }

    const { email, name, picture } = payload;

    // 3. Tìm user theo googleSub
    let user = await prisma.user.findUnique({
        where: { email : email as string}
    });

    // 4. Nếu chưa có  tạo user mới
    if (!user) {
        user = await UserServices.createUser({
            name : name as string , email : email as string,  
            avatar : picture as string || "https://www.svgrepo.com/show/452030/avatar-default.svg", 
            phone: '00xx', 
            address: '', 
            verify : true 
        })
    }
    if (!user) 
        return {
            success: false, 
            message : "Internal Server Error", 
            httpStatus : HttpStatus.INTERNAL
        }
    const roles = await findRoles(user.id) 
    const [access_token , refresh_token] = encodeToken({
        userID : user.id , email , name , roles , 
    })
    return {
        success: true,
        accessToken : access_token, 
        refreshToken : refresh_token, 
        httpStatus: HttpStatus.OK,
    };
}


export { registerUser, verifyUser , loginUser , refreshAccessToken , loginGoogle };





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