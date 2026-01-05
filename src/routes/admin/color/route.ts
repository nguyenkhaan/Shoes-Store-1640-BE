import { Router } from "express";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import Color from "~/controllers/color.controllers";
import Validation from "~/middlewares/validation.middlewares";
const router = Router();

router.post("/colors",  requireFields(["name" , "hex"]) ,  Color.createColor);
router.put('/colors/:id' , Validation.numberIDParam , requireFields(["name" , "hex"])  , Color.updateColorByID) 
router.delete('/colors/:id' , Validation.numberIDParam , Color.deleteColorByID)
export default router;
