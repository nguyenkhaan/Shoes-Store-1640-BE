//Nhung route nay la route public
import { Router } from "express";
import Validation from "~/middlewares/validation.middlewares";
import Color from "~/controllers/color.controller";

const router = Router();
router.get("/", Color.getAllColors);
router.get("/:id", Validation.numberIDParam, Color.getColorByID);
export default router;
