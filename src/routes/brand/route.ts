import Router from 'express'
import Brand from "~/controllers/brand.controller";
import Validation from '~/middlewares/validation.middlewares';
const router = Router()
router.get('/' , Brand.getAllBrands);  
router.get('/:id' , Validation.numberIDParam ,  Brand.getBrandByID)

export default router 