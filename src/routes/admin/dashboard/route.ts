//Tong so tien cua web, tong orders, tong so khach hang 

import { Router } from "express";
import Admin from "~/controllers/admin.controller";

const router = Router();

router.get('/' , Admin.getAdminDashboard)

export default router;
