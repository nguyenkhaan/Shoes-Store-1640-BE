import { Router } from "express";
import Product from "~/controllers/product.controllers";

const productRouter = Router();

productRouter.get("/", Product.getAllProducts);
productRouter.get("/:id", Product.getProductByID);
productRouter.post("/", Product.createProduct);

export default productRouter;