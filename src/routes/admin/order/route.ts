import { Router } from "express";
import Order from "~/controllers/order.controller";
import Validation from "~/middlewares/validation.middlewares";
import { requireFields } from "~/middlewares/requiredField.middlewares";

const router = Router();

// Admin routes
router.get("/", Order.getAllOrders);
router.get("/:id", Validation.numberIDParam, Order.getOrderByIDAdmin);
router.patch("/:id/status", Validation.numberIDParam, requireFields(["status"]), Order.updateOrderStatus);

export default router;
