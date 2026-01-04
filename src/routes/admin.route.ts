import { Router } from "express";
const router = Router() 
import credentials from "~/middlewares/authentication.middlewares";
import { verifyRole } from "~/middlewares/authorization.middlewares";
import BrandRoute from "~/routes/brand.route";
router.use(credentials , verifyRole(["Admin"]) , BrandRoute)

export default router 