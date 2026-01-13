import { Router } from "express";
const router = Router();
import credentials from "~/middlewares/authentication.middlewares";
import { verifyRole } from "~/middlewares/authorization.middlewares";
import devBypassAuth from "~/middlewares/dev.middlewares";
import BrandRoute from "~/routes/admin/brand/route";
import ColorRoute from "~/routes/admin/color/route";
import SizeRoute from "~/routes/admin/size/route";
import ProductRoute from "~/routes/admin/product/route";
import VariantRoute from "~/routes/admin/variant/route";
import OrderRoute from "~/routes/admin/order/route";
import Admin from "~/controllers/admin.controller";
//Public route
// router.get("/forgot-password", Admin.forgotPassword); //Khi goi cai nay thi no se tien hanh gui mail de reset password. Dang test

// Dev bypass auth
router.use(devBypassAuth, (req, res, next) => {
  if (req.user) return next();
  next();
});

//Private route
router.use("/brands", credentials, verifyRole(["Admin"]), BrandRoute); //import cac route danh rieng cho admin
router.use("/colors", credentials, verifyRole(["Admin"]), ColorRoute);
router.use("/sizes", credentials, verifyRole(["Admin"]), SizeRoute);
router.use("/products", credentials, verifyRole(["Admin"]), ProductRoute);
router.use("/variants", credentials, verifyRole(["Admin"]), VariantRoute);
router.use("/orders", credentials, verifyRole(["Admin"]), OrderRoute);

export default router;
