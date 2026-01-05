import { Router } from "express";
const router = Router() 
import credentials from "~/middlewares/authentication.middlewares";
import { verifyRole } from "~/middlewares/authorization.middlewares";
import BrandRoute from "~/routes/admin/brand/route";
import ColorRoute from "~/routes/admin/color/route"
import Admin from "~/controllers/admin.controllers"; 
import User from "~/controllers/user.controllers";
//Public route 

//Private route 
router.use(credentials , verifyRole(["Admin"]) , BrandRoute)  //import cac route danh rieng cho admin 
router.use(credentials , verifyRole(["Admin"]) , ColorRoute)


export default router 