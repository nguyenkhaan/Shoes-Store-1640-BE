import Router from "express";
import Cart from "~/controllers/cart.controller";
import credentials from "~/middlewares/authentication.middlewares"; //Su dung cai nay thi se co duoc req.user
import Validation from "~/middlewares/validation.middlewares";
import { checkUserStatusByID } from "~/middlewares/active.middlewares"; //Su dung id ben trong req.user thu duoc
import { verifyRole } from "~/middlewares/authorization.middlewares";
import { requireFields } from "~/middlewares/requiredField.middlewares";
const router = Router();
router.post('/add-product' , credentials , verifyRole(["User"]) , requireFields(["productVariantID"]) , Cart.saveProduct)
router.delete('/remove-product/:id' , credentials , verifyRole(["User"]) , Cart.removeProductFromCart)   //drop cart by id 
router.get('/all-products' , credentials , verifyRole(["User"]) , Cart.getProductInCarts)
router.delete(
    "/",
    credentials,
    checkUserStatusByID(),
    verifyRole(["Admin"]), 
    Cart.deleteCart
);
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
    verifyRole(["Admin"]),  
    Cart.createCart
) 

export default router 