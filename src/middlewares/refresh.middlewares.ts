// Lma nhiem vu kiem tra refresh token de tien hanh cap lai access token cho nguoi dung
// Middleware dung de kiem tra refresh token co hop le khong
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "~/configs/env.config";
import HttpStatus from "~/utlis/statusMap";
//Moi khi user log out va dang nhap lai thi phai cap cho 1 refresh token moi
const verifyRefreshToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //Refresh token nen gui bang Cookies cho an toan
    const token = req.cookies?.refreshToken; //Ben client gui bang httpOnly Cookies de tranh XSS Attack hoac JS doc duoc
    if (!token)
        return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ success: false, message: "Missing Refresh Token" });
    try {
        const payload = jwt.verify(
            token,
            ENV.REFRESH_TOKEN_SECRET as string
        ) as JwtPayload;
        req.user = payload;  //Luu tru thong tin nguoi dung vao req.user 
        next();
    } catch (err: any) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            message:
                err.name === "TokenExpiredError"
                    ? "Refresh token expired"
                    : "Invalid refresh token",
        });
    }
};
export { verifyRefreshToken };
//Dang so bug 
