import { Router } from "express";
import { Auth } from "~/controllers/auth.controller";
const router = Router() 
router.post('/register' , Auth.register)

export default router 


//{name , email , password}