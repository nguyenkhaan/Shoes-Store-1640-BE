import { Router } from "express";
import User from "~/controllers/user.controller.password";  //Nho lay ham reset password nay de su dung lai 

import credentials from "~/middlewares/authentication.middlewares";
import { verifyResetPasswordToken } from "~/middlewares/resetAuth.middlewares";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import { checkUserStatusByEmail, checkUserStatusByID } from "~/middlewares/active.middlewares";
import Validation from "~/middlewares/validation.middlewares";
const router = Router();

//Public

//Private
router.post('/forgot-password' , credentials , requireFields(["email"]) , checkUserStatusByEmail() , User.forgotPassword)  //Kiem tra bang email nyhung khi ra production thi phai doi thanh kiem tra bang userID
router.post(
    "/reset-password",
    credentials,
    requireFields(["email", "token" , "password"]),
    Validation.email, 
    Validation.password, 
    checkUserStatusByEmail(),
    verifyResetPasswordToken,
    User.changePassword 
); 
export default router 
