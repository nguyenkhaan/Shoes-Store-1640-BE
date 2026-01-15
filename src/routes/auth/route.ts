import { Router } from "express";
import { Auth } from "~/controllers/auth.controller";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import credentials from "~/middlewares/authentication.middlewares"; //Authentication // Co req.user
import { verifyRole } from "~/middlewares/authorization.middlewares"; //Authorization
import { checkUserStatusByEmail } from "~/middlewares/active.middlewares";
import { verifyRefreshToken } from "~/middlewares/refresh.middlewares";
import upload from "~/configs/multer.config";
import Validation from "~/middlewares/validation.middlewares";
const router = Router();

router.post(
  "/register",
  upload.single("avatar"), //Cho phep nguoi dung upload avatar len, neu khong co avatar thi no se la undefined
  requireFields(["name", "email", "password", "phone", "address"]),
  Auth.register
); //Bat buoc phai gui cac truong nay de tien hanh dang ki

router.get("/verify", Auth.verify);

router.post(
  "/login",
  Validation.email,
  Validation.password,
  requireFields(["email", "password"]), //midleware_1 : Bat nguoi dung phai truyen du email va password
  checkUserStatusByEmail(), //middleware_2 : Kiem tra nguoi dung da xac thuc bang email chua ?
  Auth.login
);
router.get(
  //phuong thuc dung de cap lai access_token
  "/refresh-token",
  verifyRefreshToken,
  Auth.refresh
);
router.post(
  "/logout",
  credentials,
  verifyRole(["User"]), //Bo sung them cai nay vao 
  Auth.logout
);
router.post("/login-google", requireFields(["code"]), Auth.loginGoogle);
// router.get('/resend-verify' , )
export default router;
