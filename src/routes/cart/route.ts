import Router from "express";
import Cart from "~/controllers/cart.controller";
import credentials from "~/middlewares/authentication.middlewares"; //Su dung cai nay thi se co duoc req.user
import Validation from "~/middlewares/validation.middlewares";
import { checkUserStatusByID } from "~/middlewares/active.middlewares"; //Su dung id ben trong req.user thu duoc
const router = Router();
router.delete(
    "/:id",
    credentials,
    checkUserStatusByID(),
    Validation.numberIDParam,
    Cart.deleteCart
);
router.delete(
    "/delete-all/:id", 
    credentials, 
    checkUserStatusByID(), 
    Validation.numberIDParam, 
    Cart.deleteAllCarts
) 
router.get(
    '/',  
    credentials, 
    checkUserStatusByID(), 
    Cart.getAllCarts
) 
router.post(
    '/', 
    credentials, 
    checkUserStatusByID(), 
    Cart.createCart
) 
export default router 