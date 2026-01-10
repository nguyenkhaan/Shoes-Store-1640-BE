import { Router } from "express";
import Order from "~/controllers/order.controller";
import credentials from "~/middlewares/authentication.middlewares";
import { checkUserStatusByID } from "~/middlewares/active.middlewares";
import Validation from "~/middlewares/validation.middlewares";
import { requireFields } from "~/middlewares/requiredField.middlewares";

const router = Router();

// User routes - yêu cầu authentication
router.post(
  "/",
  credentials,
  checkUserStatusByID(),
  requireFields(["shippingAddress", "paymentMethod", "items"]),
  Order.createOrder
);
router.get("/", credentials, checkUserStatusByID(), Order.getMyOrders);
router.get("/:id", credentials, checkUserStatusByID(), Validation.numberIDParam, Order.getOrderByID);
router.put("/:id/cancel", credentials, checkUserStatusByID(), Validation.numberIDParam, Order.cancelOrder);
router.patch(
  "/:id/address",
  credentials,
  checkUserStatusByID(),
  Validation.numberIDParam,
  requireFields(["shippingAddress"]),
  Order.updateShippingAddress
);

export default router;
