import { Router } from "express";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import Brand from "~/controllers/brand.controller";
import Validation from "~/middlewares/validation.middlewares";
const router = Router();

router.post("/brands",  requireFields(["name"]) ,  Brand.createBrand);
router.get('/brands' , Brand.getAllBrands);  
router.get('/brands/:id' , Validation.numberIDParam ,  Brand.getBrandByID)
router.put('/brands/:id' , Validation.numberIDParam , requireFields(["name"])  , Brand.updateBrand) 

export default router;
