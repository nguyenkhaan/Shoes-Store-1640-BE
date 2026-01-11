//Routes admin cho ProductVariant
import { Router } from "express";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import ProductVariant from "~/controllers/variants.controller";
import Validation from "~/middlewares/validation.middlewares";

const router = Router();

router.get("/", ProductVariant.getAllVariants);
router.post("/", requireFields(["productID"]), ProductVariant.createVariant);
router.get("/product/:productID", Validation.numberIDParam, ProductVariant.getVariantsByProduct);
router.get("/:id", Validation.numberIDParam, ProductVariant.getVariantByID);
router.put("/:id", Validation.numberIDParam, ProductVariant.updateVariant);
router.delete("/:id", Validation.numberIDParam, ProductVariant.deleteVariant);

export default router;
