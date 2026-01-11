import { Router } from "express";
//import User from "~/controllers/user.controller.password";  //Nho lay ham reset password nay de su dung lai

import User from "~/controllers/user.controller";

import credentials from "~/middlewares/authentication.middlewares";
import { verifyResetEmailToken, verifyResetPasswordToken } from "~/middlewares/resetAuth.middlewares";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import {
    checkUserStatusByEmail,
    checkUserStatusByID,
} from "~/middlewares/active.middlewares";
import Validation from "~/middlewares/validation.middlewares";
const router = Router();

//Public
router.post(
    "/forgot-password",
    credentials, // Nay la public nen khong can xac thuc
    requireFields(["email"]),
    checkUserStatusByEmail(),
    User.forgotPassword
);
router.post(
    "/reset-password",
    credentials, // nay la public nen khong can xac thuc
    requireFields(["email", "token", "password"]),
    Validation.email,
    Validation.password,
    checkUserStatusByEmail(),
    verifyResetPasswordToken,
    User.changePassword
);

/* Private
router.post('/forgot-password' ,
     credentials , 
     requireFields(["email"]) , 
     checkUserStatusByEmail() , 
     User.forgotPassword)  //Kiem tra bang email nyhung khi ra production thi phai doi thanh kiem tra bang userID
router.post(
    "/reset-password",

 //   credentials,
    requireFields(["email", "token" , "password"]),
    Validation.email, 
    Validation.password, 
    checkUserStatusByEmail(),
    verifyResetPasswordToken,
    User.changePassword 
);    */

//Private
router.get(
    "/profile",
    credentials, //Authentication
    User.getProfile
);
router.patch(
    "/update-profile",
    credentials,
    requireFields(["name", "phone"]),
    User.updateProfile
);
router.patch(
    "/update-avatar",
    credentials,
    requireFields(["image_id"]),
    User.updateAvatar
); //Ham update avatar bi sai roi
router.post("/change-email", 
  credentials, 
  requireFields(["email", "password"]), 
  Validation.email, 
  Validation.password, 
  User.lostEmail //Ham nay se tien hanh gui mail 
); 
router.post("/reset-email" , 
  credentials, 
  requireFields(["email" , "token"]), 
  verifyResetEmailToken, 
  User.changeEmail 
)
export default router;
