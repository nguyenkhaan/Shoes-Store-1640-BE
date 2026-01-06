import { Router } from "express";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import Color from "~/controllers/color.controller";
import Validation from "~/middlewares/validation.middlewares";
const router = Router();

router.post("/", requireFields(["name", "hex"]), Color.createColor);
router.put("/:id", Validation.numberIDParam, requireFields(["name", "hex"]), Color.updateColorByID);
router.delete("/:id", Validation.numberIDParam, Color.deleteColorByID);

export default router;
