//Routes public cho Product
import { Router } from "express";
import Product from "~/controllers/product.controller";
import Validation from "~/middlewares/validation.middlewares";

const router = Router();

// Public routes - chỉ lấy sản phẩm active
router.get("/", Product.getAllProducts);
router.get("/search", Product.searchProducts);
router.get("/brand/:brandID", Validation.numberIDParam, Product.getProductsByBrand);
router.get("/:id", Validation.numberIDParam, Product.getProductByID);

export default router;
