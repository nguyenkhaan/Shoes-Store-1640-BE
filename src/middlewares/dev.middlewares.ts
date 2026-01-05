// Middleware bypass auth cho testing/development
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

// Bypass authentication vi qua luoi test
// Cach dung: them header "x-dev-mode": "true" vao request
const devBypassAuth = (req: Request, res: Response, next: NextFunction) => {
  const hasDevHeader = req.headers["x-dev-mode"] === "true";

  if (hasDevHeader) {
    // Tao mock User Test
    req.user = {
      userID: 999,
      email: "dev@test.com",
      roles: ["Admin"],
    } as JwtPayload;
    return next();
  }
  return next();
};

export default devBypassAuth;
