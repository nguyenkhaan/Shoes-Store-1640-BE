import { Router } from "express";
import PaymentController from "~/controllers/payment.controller";
import credentials from "~/middlewares/authentication.middlewares";
import { requireFields } from "~/middlewares/requiredField.middlewares";

const router = Router();

router.post(
    '/process', 
    credentials, 
    requireFields(["orderID", "paymentMethod"]), 
    PaymentController.processPayment
);

router.delete(
    '/cancel',
    credentials,
    requireFields(["orderID"]),
    PaymentController.cancelPayment
);
export default router;