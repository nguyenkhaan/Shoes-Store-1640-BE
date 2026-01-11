//Nhung route nay la route public
import { Router } from "express";
import Size from "~/controllers/size.controller";
import Validation from "~/middlewares/validation.middlewares";

const router = Router();
router.get("/", Size.getAllSizes);
router.get("/:id", Validation.numberIDParam, Size.getSizeByID);
export default router;
