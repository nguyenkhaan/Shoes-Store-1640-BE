//Tong so tien cua web, tong orders, tong so khach hang 

import { Router } from "express";
import Admin from "~/controllers/admin.controller";

const router = Router();

router.get('/' , Admin.getAdminDashboard)
router.get('/weekly-revenue' , Admin.getWeeklyRevenue)

export default router;
