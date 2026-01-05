//Nhung route nay la route public 
import { Router } from "express"
import Size from "~/controllers/size.controller";

const router = Router() 
router.get('/' , Size.getAllSizes);  
export default router 