//Routes admin cho ProductVariant
import { Router } from "express";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import ProductVariant from "~/controllers/variants.controller";
import Validation from "~/middlewares/validation.middlewares";

const router = Router();

router.post("/", requireFields(["productID"]), ProductVariant.createVariant);  //Chuyen qua ben admin 
router.put("/:id", Validation.numberIDParam, ProductVariant.updateVariant);
router.delete("/:id", Validation.numberIDParam, ProductVariant.deleteVariant);

export default router;
