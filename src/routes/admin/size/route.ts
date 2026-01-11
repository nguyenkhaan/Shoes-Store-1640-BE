import { Router } from "express";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import Size from "~/controllers/size.controller";
import Validation from "~/middlewares/validation.middlewares";

const router = Router();

router.post("/", requireFields(["value"]), Size.createSize);
router.put("/:id", Validation.numberIDParam, requireFields(["value"]), Size.updateSizeByID);
router.delete("/:id", Validation.numberIDParam, Size.deleteSizeByID);

export default router;
