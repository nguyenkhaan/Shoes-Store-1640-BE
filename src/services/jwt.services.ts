import jwt from "jsonwebtoken";
import { ENV } from "~/configs/env.config";

//GET SCRECT-KEY
type TokenType = "access" | "refresh" | "verify";
type TokenPurpose = "login" | "refresh" | "email-verify";   //Muc dich cu token la lam nhiem vu gi ? 
function getTokenSecretKeyByType(type: TokenType) {
    switch (type) {
        case "verify":
            return ENV.VERIFY_TOKEN_SECRET as string; //Verify user
        case "access":
            return ENV.ACCESS_TOKEN_SECRET as string; //Access token
        case "refresh":
            return ENV.REFRESH_TOKEN_SECRET as string; //refresh Token
    }
    return ENV.ACCESS_TOKEN_SECRET as string;
}

function createVerifyToken(id: number , email: string) {
    const token = jwt.sign(
        { userID: id , email, purpose: "email-verify" },
        ENV.VERIFY_TOKEN_SECRET as string,
        {
            expiresIn: 10 * 60, // 10 minutes
        }
    );
    return token;
}

function encodeToken(payload: object) {
    //Tien hanh tao token va gui lai cho nguoi dung ?
    const access_secret_key = ENV.ACCESS_TOKEN_SECRET;
    const refresh_secret_key = ENV.REFRESH_TOKEN_SECRET;
    const access_token = jwt.sign(payload, access_secret_key as string, {
        expiresIn: 24 * 3600 * 3,
    });
    const refresh_token = jwt.sign(payload, refresh_secret_key as string, {
        expiresIn: 24 * 3600 * 30, //Refresh token het han thi bat user phai dang nhap lai
    });
    return [access_token, refresh_token];
}
function decodeToken(token: string, type: TokenType, expectedPurpose: string) {
    //Tien hanh giai SECRET token
    //Nhan vao 1 token va giai du lieu ra
    try {
        //jwt.verify() : Doc token co xac thuc day du, tra ve du lieu dng tin cay , jwt.decode() : Ch doc token, khong lam gi ca

        const payload = jwt.verify(
            token,
            getTokenSecretKeyByType(type)
        ) as jwt.JwtPayload;
        if (payload.purpose !== expectedPurpose) return 0;
        return payload;
    } catch (err: any) {
        if (err.name == "TokenExpiredError") return -1; // The token has been expired
        return 0;
    }
}
export { encodeToken, decodeToken, createVerifyToken };
