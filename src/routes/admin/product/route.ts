//Routes admin cho Product
import { Router } from "express";
import { requireFields } from "~/middlewares/requiredField.middlewares";
import Product from "~/controllers/product.controller";
import Validation from "~/middlewares/validation.middlewares";
import upload from "~/configs/multer.config";

const router = Router();

router.get("/", Product.getAllProductsAdmin);
router.post(
  "/",
  upload.array("thumbnail"),
  requireFields(["name", "description", "price", "active", "brandID" , "discount" , "category"]),
  Product.createProduct
);
router.put("/:id", upload.array("thumbnail"), Validation.numberIDParam, Product.updateProduct);   ///Chinh sua thanh upload nhieu anh 
router.delete("/:id", Validation.numberIDParam, Product.deleteProduct);

export default router;
