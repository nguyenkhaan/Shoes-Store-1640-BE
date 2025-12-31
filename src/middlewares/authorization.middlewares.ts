import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import HttpStatus from "~/utlis/statusMap";
type Role = "Admin" | "User";
function verifyRole(accessNeededRoles: Role[]) {
    const authorization = (req: Request, res: Response, next: NextFunction) => {
        if (!req.user)
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json({ success: false, message: "Unauthorized" });
        const roles = (req.user as JwtPayload).roles as Role[]; //Lay quyen cua nguoi dung , Gui token  cho nguoi dungphai co roles
        let hasPermission = true;
        accessNeededRoles.forEach((needRole) => {
            if (!roles.includes(needRole)) {
                hasPermission = false;
                return;
            }
        });
        if (!hasPermission)
            return res
                .status(HttpStatus.FORBIDDEN)
                .json({ success: false, message: "Forbidden" });

        next();
    };
    return authorization;
}
export { verifyRole };
