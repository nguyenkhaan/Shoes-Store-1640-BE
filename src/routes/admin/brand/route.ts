import { Router } from "express";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import Brand from "~/controllers/brand.controller";
import Validation from "~/middlewares/validation.middlewares";
const router = Router();

router.post("/", requireFields(["name"]), Brand.createBrand);
router.put("/:id", Validation.numberIDParam, requireFields(["name"]), Brand.updateBrand);
router.delete("/:id", Validation.numberIDParam, Brand.deleteBrand);

export default router;
