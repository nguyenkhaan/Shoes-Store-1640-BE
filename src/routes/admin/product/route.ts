//Routes admin cho Product
import { Router } from "express";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import Product from "~/controllers/product.controller";
import Validation from "~/middlewares/validation.middlewares";

const router = Router();

router.get("/", Product.getAllProductsAdmin);
router.post("/", requireFields(["name", "description", "price", "active", "brandID"]), Product.createProduct);
router.put("/:id", Validation.numberIDParam, Product.updateProduct);
router.delete("/:id", Validation.numberIDParam, Product.deleteProduct);

export default router;
