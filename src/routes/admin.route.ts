import { Router } from "express";
const router = Router() 
import credentials from "~/middlewares/authentication.middlewares";
import { verifyRole } from "~/middlewares/authorization.middlewares";
import BrandRoute from "~/routes/brand.route";
import ColorRoute from "~/routes/color.route";
//Filter Route 
router.use(credentials , verifyRole(["Admin"]) , BrandRoute)
router.use(credentials , verifyRole(["Admin"]) , ColorRoute)
//Logic Work Route 

export default router 