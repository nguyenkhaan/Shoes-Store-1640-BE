import { Router } from "express";
import { Auth } from "~/controllers/auth.controller";
const router = Router() 
router.post('/register' , Auth.register)
router.get('/verify' , Auth.verify)
// router.get('/resend-verify' , )
export default router 


//{name , email , password}