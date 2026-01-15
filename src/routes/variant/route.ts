import {Router} from 'express'
import credentials from '~/middlewares/authentication.middlewares'
import { verifyRole } from '~/middlewares/authorization.middlewares'
import ProductVariant from '~/controllers/variants.controller'  

const router = Router() 
router.get('/' , credentials , verifyRole(["User"]) , ProductVariant.getAllVariants) 
router.get('/get-by-product/:id' , credentials , verifyRole(["User"]) , ProductVariant.getVariantsByProduct) 
router.get('/get-by-id' , credentials , verifyRole(["User"]) , ProductVariant.getVariantByID) 

export default router 